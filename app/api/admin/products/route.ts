import { Buffer } from "node:buffer";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  createAdminProduct,
  getAdminProducts,
  getCategoryOptions,
} from "@/lib/catalog-store";
import {
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

export async function GET() {
  const [products, categories] = await Promise.all([
    getAdminProducts(),
    Promise.resolve(getCategoryOptions()),
  ]);

  return NextResponse.json({ products, categories });
}

export async function POST(request: Request) {
  let uploadedImagePath: string | null = null;

  try {
    const formData = await request.formData();

    const name = String(formData.get("name") ?? "").trim();
    const categorySlug = String(formData.get("categorySlug") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();
    const price = String(formData.get("price") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const brand = String(formData.get("brand") ?? "").trim();
    const sku = String(formData.get("sku") ?? "").trim();
    const unit = String(formData.get("unit") ?? "").trim();
    const stockStatus = String(formData.get("stockStatus") ?? "").trim();
    const imageAlt = String(formData.get("imageAlt") ?? "").trim();
    const featuredValue = String(formData.get("featured") ?? "").trim();
    const imageFile = formData.get("image");

    if (!name || !categorySlug || !price || !description) {
      return NextResponse.json(
        { error: "Name, category, price, and description are required." },
        { status: 400 },
      );
    }

    if (!(imageFile instanceof File) || imageFile.size === 0) {
      return NextResponse.json(
        { error: "Please upload a product image." },
        { status: 400 },
      );
    }

    if (!hasSupabaseAdminConfig()) {
      return NextResponse.json(
        {
          error:
            "Supabase admin access is not configured. Add SUPABASE_SERVICE_ROLE_KEY before saving products.",
        },
        { status: 500 },
      );
    }

    const supabase = createSupabaseAdminClient();

    const extension = path.extname(imageFile.name) || ".png";
    const fileName = `${Date.now()}-${sanitizeSegment(name)}${extension.toLowerCase()}`;
    uploadedImagePath = `products/${fileName}`;
    const bytes = await imageFile.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(uploadedImagePath, Buffer.from(bytes), {
        contentType: imageFile.type || undefined,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Unable to upload product image: ${uploadError.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(uploadedImagePath);

    const savedProduct = await createAdminProduct({
      name,
      categorySlug,
      category,
      price,
      description,
      brand,
      sku,
      unit,
      stockStatus,
      image: publicUrl,
      imageAlt,
      featured: featuredValue === "true",
    });

    revalidatePath("/products");
    revalidatePath(`/products/${categorySlug}`);

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
