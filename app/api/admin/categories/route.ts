import { Buffer } from "node:buffer";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
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

async function uploadCategoryImage(imageFile: File, slugOrName: string) {
  if (!hasSupabaseAdminConfig()) {
    throw new Error(
      "Supabase admin access is not configured. Add SUPABASE_SERVICE_ROLE_KEY before uploading category images.",
    );
  }

  const supabase = createSupabaseAdminClient();
  const extension = path.extname(imageFile.name) || ".png";
  const fileName = `${Date.now()}-${sanitizeSegment(slugOrName)}${extension.toLowerCase()}`;
  const uploadedImagePath = `categories/${fileName}`;
  const bytes = await imageFile.arrayBuffer();
  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(uploadedImagePath, Buffer.from(bytes), {
      contentType: imageFile.type || undefined,
      upsert: false,
    });

  if (error) {
    throw new Error(`Unable to upload category image: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(uploadedImagePath);

  return { publicUrl, uploadedImagePath };
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
    const parentId = String(formData.get("parentId") ?? "").trim();
    const displayOrder = Number.parseInt(
      String(formData.get("displayOrder") ?? "0"),
      10,
    );
    const imageFile = formData.get("image");

    if (!name) {
      return NextResponse.json(
        { error: "A category name is required." },
        { status: 400 },
      );
    }

    let image: string | undefined;

    if (imageFile instanceof File && imageFile.size > 0) {
      const upload = await uploadCategoryImage(imageFile, slug || name);
      uploadedImagePath = upload.uploadedImagePath;
      image = upload.publicUrl;
    }

    const category = await createAdminCategory({
      name,
      slug,
      description,
      image,
      parentId: parentId || null,
      displayOrder: Number.isFinite(displayOrder) ? displayOrder : 0,
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
    const name = String(formData.get("name") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const parentId = String(formData.get("parentId") ?? "").trim();
    const displayOrder = Number.parseInt(
      String(formData.get("displayOrder") ?? "0"),
      10,
    );
    const removeImage = String(formData.get("removeImage") ?? "") === "true";
    const imageFile = formData.get("image");

    if (!id || !name) {
      return NextResponse.json(
        { error: "A category id and name are required." },
        { status: 400 },
      );
    }

    const existing = (await getAdminCategories()).find(
      (category) => category.id === id,
    );

    if (!existing) {
      return NextResponse.json(
        { error: "Unable to find the selected category." },
        { status: 404 },
      );
    }

    let image = removeImage ? undefined : existing.image;

    if (imageFile instanceof File && imageFile.size > 0) {
      const upload = await uploadCategoryImage(imageFile, slug || name);
      uploadedImagePath = upload.uploadedImagePath;
      image = upload.publicUrl;
    }

    const category = await updateAdminCategory({
      id,
      name,
      slug,
      description,
      image,
      parentId: parentId || null,
      displayOrder: Number.isFinite(displayOrder) ? displayOrder : 0,
    });

    if (existing.image && existing.image !== category.image) {
      await removeStoredImage(existing.image);
    }

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${existing.slug}`);
    revalidatePath(`/products/${category.slug}`);
    if (existing.parentSlug) {
      revalidatePath(`/products/${existing.parentSlug}`);
    }
    if (category.parentSlug) {
      revalidatePath(`/products/${category.parentSlug}`);
    }

    return NextResponse.json({ category });
  } catch (error) {
    if (uploadedImagePath && hasSupabaseAdminConfig()) {
      const supabase = createSupabaseAdminClient();
      await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([uploadedImagePath]);
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update category." },
      { status: 500 },
    );
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
