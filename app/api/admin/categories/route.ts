import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  removeCatalogImages,
  uploadCatalogImage,
} from "@/lib/catalog-images";
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
  updateAdminCategoryFeatured,
} from "@/lib/catalog-store";

export const runtime = "nodejs";

export async function GET() {
  try {
    const categories = await getAdminCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load categories.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

export async function POST(request: Request) {
  let uploadedImageUrl: string | undefined;

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

    if (imageFile instanceof File && imageFile.size > 0) {
      uploadedImageUrl = await uploadCatalogImage(
        imageFile,
        "categories",
        slug || name,
      );
    }

    const category = await createAdminCategory({
      name,
      slug,
      description,
      image: uploadedImageUrl,
      isFeatured,
      parentId: parentId || null,
      parentSlug,
    });

    if (uploadedImageUrl && !category.image) {
      await removeCatalogImages([uploadedImageUrl]);
    }
    uploadedImageUrl = undefined;

    revalidatePath("/products");
    revalidatePath("/");
    revalidatePath(`/products/${category.slug}`);
    if (category.parentSlug) {
      revalidatePath(`/products/${category.parentSlug}`);
      revalidatePath(`/products/${category.parentSlug}/${category.slug}`);
    }

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    if (uploadedImageUrl) {
      await removeCatalogImages([uploadedImageUrl]);
    }

    const message =
      error instanceof Error ? error.message : "Unable to create category.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  let uploadedImageUrl: string | undefined;

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

    const existingCategory = (await getAdminCategories()).find(
      (category) =>
        (id && category.id === id) ||
        (currentSlug && category.slug === currentSlug),
    );

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Unable to find the selected category." },
        { status: 404 },
      );
    }

    if (imageFile instanceof File && imageFile.size > 0) {
      uploadedImageUrl = await uploadCatalogImage(
        imageFile,
        "categories",
        currentSlug || name,
      );
    }

    const category = await updateAdminCategory({
      id,
      currentSlug,
      name,
      description,
      image: uploadedImageUrl,
      isFeatured,
      parentId: parentId || null,
      parentSlug,
    });

    if (uploadedImageUrl && existingCategory.image !== uploadedImageUrl) {
      await removeCatalogImages([existingCategory.image]);
    }
    uploadedImageUrl = undefined;

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${category.slug}`);
    if (category.parentSlug) {
      revalidatePath(`/products/${category.parentSlug}`);
      revalidatePath(`/products/${category.parentSlug}/${category.slug}`);
    }

    return NextResponse.json({ category });
  } catch (error) {
    if (uploadedImageUrl) {
      await removeCatalogImages([uploadedImageUrl]);
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

    await removeCatalogImages([category.image]);

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
