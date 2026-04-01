import { Buffer } from "node:buffer";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  createAdminProduct,
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
  categorySlug: string;
  category: string;
  price: string;
  description: string;
  brand: string;
  sku: string;
  unit: string;
  stockStatus: string;
  imageAlt: string;
  featured: boolean;
};

function parseProductFormData(formData: FormData): ProductFormValues {
  return {
    id: String(formData.get("id") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    categorySlug: String(formData.get("categorySlug") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    price: String(formData.get("price") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    brand: String(formData.get("brand") ?? "").trim(),
    sku: String(formData.get("sku") ?? "").trim(),
    unit: String(formData.get("unit") ?? "").trim(),
    stockStatus: String(formData.get("stockStatus") ?? "").trim(),
    imageAlt: String(formData.get("imageAlt") ?? "").trim(),
    featured: String(formData.get("featured") ?? "").trim() === "true",
  };
}

async function uploadProductImage(
  imageFile: File,
  name: string,
): Promise<{ publicUrl: string; path: string }> {
  if (!hasSupabaseAdminConfig()) {
    throw new Error(
      "Supabase admin access is not configured. Add SUPABASE_SERVICE_ROLE_KEY before saving products.",
    );
  }

  const supabase = createSupabaseAdminClient();
  const extension = path.extname(imageFile.name) || ".png";
  const fileName = `${Date.now()}-${sanitizeSegment(name)}${extension.toLowerCase()}`;
  const uploadedPath = `products/${fileName}`;
  const bytes = await imageFile.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(uploadedPath, Buffer.from(bytes), {
      contentType: imageFile.type || undefined,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Unable to upload product image: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(uploadedPath);

  return {
    publicUrl,
    path: uploadedPath,
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
  const storagePath = getStoragePathFromPublicUrl(publicUrl);

  if (!storagePath || !hasSupabaseAdminConfig()) {
    return;
  }

  const supabase = createSupabaseAdminClient();
  await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([storagePath]);
}

function validateRequiredFields(values: ProductFormValues) {
  if (!values.name || !values.categorySlug || !values.price || !values.description) {
    return "Name, category, price, and description are required.";
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
  let uploadedImagePath: string | null = null;

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
    uploadedImagePath = upload.path;

    const savedProduct = await createAdminProduct({
      name: values.name,
      categorySlug: values.categorySlug,
      category: values.category,
      price: values.price,
      description: values.description,
      brand: values.brand,
      sku: values.sku,
      unit: values.unit,
      stockStatus: values.stockStatus,
      image: upload.publicUrl,
      imageAlt: values.imageAlt,
      featured: values.featured,
    });

    revalidateCatalogPaths([values.categorySlug]);

    return NextResponse.json({ product: savedProduct }, { status: 201 });
  } catch (error) {
    if (uploadedImagePath && hasSupabaseAdminConfig()) {
      const supabase = createSupabaseAdminClient();
      await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([uploadedImagePath]);
    }

    const message =
      error instanceof Error ? error.message : "Unable to save product.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  let uploadedImagePath: string | null = null;

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
      uploadedImagePath = upload.path;
      imageUrl = upload.publicUrl;
      shouldRemovePreviousImage = imageUrl !== existingProduct.image;
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Please keep the current product image or upload a new one." },
        { status: 400 },
      );
    }

    const updatedProduct = await updateAdminProduct({
      id: values.id,
      name: values.name,
      categorySlug: values.categorySlug,
      category: values.category,
      price: values.price,
      description: values.description,
      brand: values.brand,
      sku: values.sku,
      unit: values.unit,
      stockStatus: values.stockStatus,
      image: imageUrl,
      imageAlt: values.imageAlt,
      featured: values.featured,
    });

    if (shouldRemovePreviousImage) {
      await removeStoredImage(existingProduct.image);
    }

    revalidateCatalogPaths([
      existingProduct.categorySlug,
      updatedProduct.categorySlug,
    ]);

    return NextResponse.json({ product: updatedProduct });
  } catch (error) {
    if (uploadedImagePath && hasSupabaseAdminConfig()) {
      const supabase = createSupabaseAdminClient();
      await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([uploadedImagePath]);
    }

    const message =
      error instanceof Error ? error.message : "Unable to update product.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
