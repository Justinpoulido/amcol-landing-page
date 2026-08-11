import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProductById,
  getAdminProducts,
  getCategoryOptions,
  updateAdminProduct,
} from "@/lib/catalog-store";
import {
  removeCatalogImages,
  uploadCatalogImage,
} from "@/lib/catalog-images";

export const runtime = "nodejs";

type ProductFormValues = {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  subcategorySlug: string;
  category: string;
  price: string;
  summary: string;
  description: string;
  brand: string;
  sku: string;
  unit: string;
  stockStatus: string;
  imageAlt: string;
  galleryImages: string[];
  specifications: string[];
  featured: boolean;
};

function parseProductFormData(formData: FormData): ProductFormValues {
  return {
    id: String(formData.get("id") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    categorySlug: String(formData.get("categorySlug") ?? "").trim(),
    subcategorySlug: String(formData.get("subcategorySlug") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    price: String(formData.get("price") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    brand: String(formData.get("brand") ?? "").trim(),
    sku: String(formData.get("sku") ?? "").trim(),
    unit: String(formData.get("unit") ?? "").trim(),
    stockStatus: String(formData.get("stockStatus") ?? "").trim(),
    imageAlt: String(formData.get("imageAlt") ?? "").trim(),
    galleryImages: String(formData.get("galleryImages") ?? "")
      .split(/\r?\n|,/)
      .map((value) => value.trim())
      .filter(Boolean),
    specifications: String(formData.get("specifications") ?? "")
      .split(/\r?\n/)
      .map((value) => value.trim())
      .filter(Boolean),
    featured: String(formData.get("featured") ?? "").trim() === "true",
  };
}

async function uploadGalleryImages(
  formData: FormData,
  name: string,
  uploadedImageUrls: string[],
) {
  const galleryFiles = formData
    .getAll("galleryImageFiles")
    .filter(
      (file): file is File => file instanceof File && file.size > 0,
    );
  const uploads: string[] = [];

  for (const file of galleryFiles) {
    const publicUrl = await uploadCatalogImage(file, "products", `${name}-gallery`);
    uploads.push(publicUrl);
    uploadedImageUrls.push(publicUrl);
  }

  return uploads;
}

function validateRequiredFields(values: ProductFormValues) {
  if (!values.name || !values.slug || !values.categorySlug || !values.price) {
    return "Product name, slug, category, and price are required.";
  }

  return null;
}

function revalidateCatalogPaths(categorySlugs: string[]) {
  revalidatePath("/products");

  for (const categorySlug of new Set(categorySlugs.filter(Boolean))) {
    revalidatePath(`/products/${categorySlug}`);
  }
}

export async function GET() {
  try {
    const [products, categories] = await Promise.all([
      getAdminProducts(),
      getCategoryOptions(),
    ]);

    return NextResponse.json({ products, categories });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load products.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const uploadedImageUrls: string[] = [];

  try {
    const formData = await request.formData();
    const values = parseProductFormData(formData);
    const imageFile = formData.get("image");

    const validationError = validateRequiredFields(values);

    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 },
      );
    }

    if (!(imageFile instanceof File) || imageFile.size === 0) {
      return NextResponse.json(
        { error: "Please upload a product image." },
        { status: 400 },
      );
    }

    const imageUrl = await uploadCatalogImage(imageFile, "products", values.name);
    uploadedImageUrls.push(imageUrl);
    const galleryUploads = await uploadGalleryImages(
      formData,
      values.name,
      uploadedImageUrls,
    );
    const galleryImages = [
      ...values.galleryImages,
      ...galleryUploads,
    ];

    const savedProduct = await createAdminProduct({
      name: values.name,
      slug: values.slug,
      categorySlug: values.categorySlug,
      subcategorySlug: values.subcategorySlug,
      category: values.category,
      price: values.price,
      summary: values.summary,
      description: values.description,
      brand: values.brand,
      sku: values.sku,
      unit: values.unit,
      stockStatus: values.stockStatus,
      image: imageUrl,
      imageAlt: values.imageAlt,
      galleryImages,
      specifications: values.specifications,
      featured: values.featured,
    });
    uploadedImageUrls.length = 0;

    revalidateCatalogPaths([values.categorySlug]);

    return NextResponse.json({ product: savedProduct }, { status: 201 });
  } catch (error) {
    if (uploadedImageUrls.length > 0) {
      await removeCatalogImages(uploadedImageUrls);
    }

    const message =
      error instanceof Error ? error.message : "Unable to save product.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const uploadedImageUrls: string[] = [];

  try {
    const formData = await request.formData();
    const values = parseProductFormData(formData);
    const imageFile = formData.get("image");

    if (!values.id) {
      return NextResponse.json(
        { error: "A product id is required to save edits." },
        { status: 400 },
      );
    }

    const validationError = validateRequiredFields(values);

    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 },
      );
    }

    const existingProduct = await getAdminProductById(values.id);

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Unable to find the selected product." },
        { status: 404 },
      );
    }

    let imageUrl = existingProduct.image;
    let shouldRemovePreviousImage = false;

    if (imageFile instanceof File && imageFile.size > 0) {
      const uploadUrl = await uploadCatalogImage(imageFile, "products", values.name);
      uploadedImageUrls.push(uploadUrl);
      imageUrl = uploadUrl;
      shouldRemovePreviousImage = imageUrl !== existingProduct.image;
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Please keep the current product image or upload a new one." },
        { status: 400 },
      );
    }

    const galleryUploads = await uploadGalleryImages(
      formData,
      values.name,
      uploadedImageUrls,
    );
    const galleryImages = [
      ...values.galleryImages,
      ...galleryUploads,
    ];

    const updatedProduct = await updateAdminProduct({
      id: values.id,
      name: values.name,
      slug: values.slug,
      categorySlug: values.categorySlug,
      subcategorySlug: values.subcategorySlug,
      category: values.category,
      price: values.price,
      summary: values.summary,
      description: values.description,
      brand: values.brand,
      sku: values.sku,
      unit: values.unit,
      stockStatus: values.stockStatus,
      image: imageUrl,
      imageAlt: values.imageAlt,
      galleryImages,
      specifications: values.specifications,
      featured: values.featured,
    });
    uploadedImageUrls.length = 0;

    if (shouldRemovePreviousImage) {
      await removeCatalogImages([existingProduct.image]);
    }

    const removedGalleryImages = (existingProduct.galleryImages ?? []).filter(
      (image) => !galleryImages.includes(image),
    );
    await removeCatalogImages(removedGalleryImages);

    revalidateCatalogPaths([
      existingProduct.categorySlug,
      updatedProduct.categorySlug,
      existingProduct.subcategorySlug ?? "",
      updatedProduct.subcategorySlug ?? "",
    ]);

    return NextResponse.json({ product: updatedProduct });
  } catch (error) {
    if (uploadedImageUrls.length > 0) {
      await removeCatalogImages(uploadedImageUrls);
    }

    const message =
      error instanceof Error ? error.message : "Unable to update product.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = (await request.json()) as { id?: string };

    if (!id) {
      return NextResponse.json(
        { error: "A product id is required to delete a product." },
        { status: 400 },
      );
    }

    const deletedProduct = await deleteAdminProduct(id);
    await removeCatalogImages([
      deletedProduct.image,
      ...(deletedProduct.galleryImages ?? []),
    ]);
    revalidateCatalogPaths([deletedProduct.categorySlug]);

    return NextResponse.json({ product: deletedProduct });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to delete product.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
