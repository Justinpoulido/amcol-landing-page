import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import {
  createAdminProduct,
  getAdminProducts,
  getCategoryOptions,
} from "@/lib/catalog-store";

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

    const uploadsDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "products",
    );
    await mkdir(uploadsDirectory, { recursive: true });

    const extension = path.extname(imageFile.name) || ".png";
    const fileName = `${Date.now()}-${sanitizeSegment(name)}${extension}`;
    const filePath = path.join(uploadsDirectory, fileName);
    const bytes = await imageFile.arrayBuffer();

    await writeFile(filePath, Buffer.from(bytes));

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
      image: `/uploads/products/${fileName}`,
      imageAlt,
      featured: featuredValue === "true",
    });

    return NextResponse.json({ product: savedProduct }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to save product.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
