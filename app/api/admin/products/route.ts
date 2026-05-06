import path from "node:path";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { del, put } from "@vercel/blob";
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProductById,
  getAdminProducts,
  getCategoryOptions,
  updateAdminProduct,
} from "@/lib/catalog-store";
import {
  getSupabaseStorageHostname,
  hasSupabaseAdminConfig,
  PRODUCT_IMAGES_BUCKET,
} from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function sanitizeSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

type ProductFormValues = {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
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

async function uploadProductImage(
  imageFile: File,
  name: string,
): Promise<{ publicUrl: string; path: string }> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "Vercel Blob is not configured. Add BLOB_READ_WRITE_TOKEN before saving product images.",
    );
  }

  const extension = path.extname(imageFile.name) || ".png";
  const fileName = `${Date.now()}-${sanitizeSegment(name)}${extension.toLowerCase()}`;
  const uploadedPath = `products/${fileName}`;
  const blob = await put(uploadedPath, imageFile, {
    access: "public",
    contentType: imageFile.type || undefined,
  });

  return {
    publicUrl: blob.url,
    path: blob.url,
  };
}

function getStoragePathFromPublicUrl(publicUrl: string): string | null {
  const expectedHostname = getSupabaseStorageHostname();

  if (!expectedHostname) {
    return null;
  }

  try {
    const url = new URL(publicUrl);

    if (url.hostname !== expectedHostname) {
      return null;
    }

    const marker = `/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/`;
    const markerIndex = url.pathname.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }

    return decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
}

async function removeStoredImage(publicUrl: string) {
  if (publicUrl.includes(".public.blob.vercel-storage.com")) {
    await del(publicUrl);
    return;
  }

  const storagePath = getStoragePathFromPublicUrl(publicUrl);

  if (!storagePath || !hasSupabaseAdminConfig()) {
    return;
  }

  const supabase = createSupabaseAdminClient();
  await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([storagePath]);
}

async function removeStoredImages(publicUrls: string[]) {
  await Promise.all(publicUrls.map((publicUrl) => removeStoredImage(publicUrl)));
}

async function uploadGalleryImages(formData: FormData, name: string) {
  const galleryFiles = formData
    .getAll("galleryImageFiles")
    .filter(
      (file): file is File => file instanceof File && file.size > 0,
    );
  const uploads: { publicUrl: string; path: string }[] = [];

  for (const file of galleryFiles) {
    uploads.push(await uploadProductImage(file, `${name}-gallery`));
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
  const [products, categories] = await Promise.all([
    getAdminProducts(),
    getCategoryOptions(),
  ]);

  return NextResponse.json({ products, categories });
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

    const upload = await uploadProductImage(imageFile, values.name);
    uploadedImageUrls.push(upload.path);
    const galleryUploads = await uploadGalleryImages(formData, values.name);
    uploadedImageUrls.push(...galleryUploads.map((item) => item.path));
    const galleryImages = [
      ...values.galleryImages,
      ...galleryUploads.map((item) => item.publicUrl),
    ];

    const savedProduct = await createAdminProduct({
      name: values.name,
      slug: values.slug,
      categorySlug: values.categorySlug,
      category: values.category,
      price: values.price,
      summary: values.summary,
      description: values.description,
      brand: values.brand,
      sku: values.sku,
      unit: values.unit,
      stockStatus: values.stockStatus,
      image: upload.publicUrl,
      imageAlt: values.imageAlt,
      galleryImages,
      specifications: values.specifications,
      featured: values.featured,
    });

    revalidateCatalogPaths([values.categorySlug]);

    return NextResponse.json({ product: savedProduct }, { status: 201 });
  } catch (error) {
    if (uploadedImageUrls.length > 0) {
      await removeStoredImages(uploadedImageUrls);
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
      const upload = await uploadProductImage(imageFile, values.name);
      uploadedImageUrls.push(upload.path);
      imageUrl = upload.publicUrl;
      shouldRemovePreviousImage = imageUrl !== existingProduct.image;
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Please keep the current product image or upload a new one." },
        { status: 400 },
      );
    }

    const galleryUploads = await uploadGalleryImages(formData, values.name);
    uploadedImageUrls.push(...galleryUploads.map((item) => item.path));
    const galleryImages = [
      ...values.galleryImages,
      ...galleryUploads.map((item) => item.publicUrl),
    ];

    const updatedProduct = await updateAdminProduct({
      id: values.id,
      name: values.name,
      slug: values.slug,
      categorySlug: values.categorySlug,
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

    if (shouldRemovePreviousImage) {
      await removeStoredImage(existingProduct.image);
    }

    const removedGalleryImages = (existingProduct.galleryImages ?? []).filter(
      (image) => !galleryImages.includes(image),
    );
    await removeStoredImages(removedGalleryImages);

    revalidateCatalogPaths([
      existingProduct.categorySlug,
      updatedProduct.categorySlug,
    ]);

    return NextResponse.json({ product: updatedProduct });
  } catch (error) {
    if (uploadedImageUrls.length > 0) {
      await removeStoredImages(uploadedImageUrls);
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
    await removeStoredImage(deletedProduct.image);
    await removeStoredImages(deletedProduct.galleryImages ?? []);
    revalidateCatalogPaths([deletedProduct.categorySlug]);

    return NextResponse.json({ product: deletedProduct });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to delete product.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
