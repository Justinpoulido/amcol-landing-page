import { Buffer } from "node:buffer";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
  updateAdminCategoryFeatured,
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

async function removeStoredImage(publicUrl: string | undefined) {
  if (!publicUrl || !hasSupabaseAdminConfig()) {
    return;
  }

  const storagePath = getStoragePathFromPublicUrl(publicUrl);

  if (!storagePath) {
    return;
  }

  const supabase = createSupabaseAdminClient();
  await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([storagePath]);
}

export async function GET() {
  const categories = await getAdminCategories();
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  let uploadedImagePath: string | null = null;

  try {
    const formData = await request.formData();
    const name = String(formData.get("name") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const isFeatured = String(formData.get("isFeatured") ?? "") === "true";
    const parentId = String(formData.get("parentId") ?? "").trim();
    const parentSlug = String(formData.get("parentSlug") ?? "").trim();
    const imageFile = formData.get("image");

    if (!name) {
      return NextResponse.json(
        { error: "A category name is required." },
        { status: 400 },
      );
    }

    let image: string | undefined;

    if (imageFile instanceof File && imageFile.size > 0) {
      if (!hasSupabaseAdminConfig()) {
        return NextResponse.json(
          {
            error:
              "Supabase admin access is not configured. Add SUPABASE_SERVICE_ROLE_KEY before uploading category images.",
          },
          { status: 500 },
        );
      }

      const supabase = createSupabaseAdminClient();
      const extension = path.extname(imageFile.name) || ".png";
      const fileName = `${Date.now()}-${sanitizeSegment(slug || name)}${extension.toLowerCase()}`;
      uploadedImagePath = `categories/${fileName}`;
      const bytes = await imageFile.arrayBuffer();
      const { error: uploadError } = await supabase.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .upload(uploadedImagePath, Buffer.from(bytes), {
          contentType: imageFile.type || undefined,
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Unable to upload category image: ${uploadError.message}`);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(uploadedImagePath);

      image = publicUrl;
    }

    const category = await createAdminCategory({
      name,
      slug,
      description,
      image,
      isFeatured,
      parentId: parentId || null,
      parentSlug,
    });

    if (uploadedImagePath && image && !category.image && hasSupabaseAdminConfig()) {
      const supabase = createSupabaseAdminClient();
      await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([uploadedImagePath]);
      uploadedImagePath = null;
    }

    revalidatePath("/products");
    revalidatePath("/");
    revalidatePath(`/products/${category.slug}`);
    if (category.parentSlug) {
      revalidatePath(`/products/${category.parentSlug}`);
      revalidatePath(`/products/${category.parentSlug}/${category.slug}`);
    }

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    if (uploadedImagePath && hasSupabaseAdminConfig()) {
      const supabase = createSupabaseAdminClient();
      await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([uploadedImagePath]);
    }

    const message =
      error instanceof Error ? error.message : "Unable to create category.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  let uploadedImagePath: string | null = null;

  try {
    const formData = await request.formData();
    const id = String(formData.get("id") ?? "").trim();
    const currentSlug = String(formData.get("currentSlug") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const isFeatured = String(formData.get("isFeatured") ?? "") === "true";
    const parentId = String(formData.get("parentId") ?? "").trim();
    const parentSlug = String(formData.get("parentSlug") ?? "").trim();
    const imageFile = formData.get("image");

    if (!id && !currentSlug) {
      return NextResponse.json(
        { error: "A category id or current slug is required." },
        { status: 400 },
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "A category name is required." },
        { status: 400 },
      );
    }

    let image: string | undefined;

    if (imageFile instanceof File && imageFile.size > 0) {
      if (!hasSupabaseAdminConfig()) {
        return NextResponse.json(
          {
            error:
              "Supabase admin access is not configured. Add SUPABASE_SERVICE_ROLE_KEY before uploading category images.",
          },
          { status: 500 },
        );
      }

      const supabase = createSupabaseAdminClient();
      const extension = path.extname(imageFile.name) || ".png";
      const fileName = `${Date.now()}-${sanitizeSegment(currentSlug || name)}${extension.toLowerCase()}`;
      uploadedImagePath = `categories/${fileName}`;
      const bytes = await imageFile.arrayBuffer();
      const { error: uploadError } = await supabase.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .upload(uploadedImagePath, Buffer.from(bytes), {
          contentType: imageFile.type || undefined,
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Unable to upload category image: ${uploadError.message}`);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(uploadedImagePath);

      image = publicUrl;
    }

    const category = await updateAdminCategory({
      id,
      currentSlug,
      name,
      description,
      image,
      isFeatured,
      parentId: parentId || null,
      parentSlug,
    });

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${category.slug}`);
    if (category.parentSlug) {
      revalidatePath(`/products/${category.parentSlug}`);
      revalidatePath(`/products/${category.parentSlug}/${category.slug}`);
    }

    return NextResponse.json({ category });
  } catch (error) {
    if (uploadedImagePath && hasSupabaseAdminConfig()) {
      const supabase = createSupabaseAdminClient();
      await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([uploadedImagePath]);
    }

    const message =
      error instanceof Error ? error.message : "Unable to update category.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as {
      id?: string;
      currentSlug?: string;
      isFeatured?: boolean;
    };
    const id = body.id?.trim() ?? "";
    const currentSlug = body.currentSlug?.trim() ?? "";

    if (!id && !currentSlug) {
      return NextResponse.json(
        { error: "A category id or current slug is required." },
        { status: 400 },
      );
    }

    if (typeof body.isFeatured !== "boolean") {
      return NextResponse.json(
        { error: "A featured status is required." },
        { status: 400 },
      );
    }

    const category = await updateAdminCategoryFeatured({
      id,
      currentSlug,
      isFeatured: body.isFeatured,
    });

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${category.slug}`);
    if (category.parentSlug) {
      revalidatePath(`/products/${category.parentSlug}`);
    }

    return NextResponse.json({ category });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to update featured status.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = (await request.json()) as { id?: string };
    const id = body.id?.trim() ?? "";

    if (!id) {
      return NextResponse.json(
        { error: "A category id is required." },
        { status: 400 },
      );
    }

    const { category } = await deleteAdminCategory(id);

    await removeStoredImage(category.image);

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${category.slug}`);
    if (category.parentSlug) {
      revalidatePath(`/products/${category.parentSlug}`);
    }

    return NextResponse.json({ category });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to delete category.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
