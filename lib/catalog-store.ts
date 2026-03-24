import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  featuredProductCategories,
  productCategoryData,
  type ProductCategoryPageData,
  type ProductItem,
} from "@/lib/product-categories";

export type CategoryOption = {
  slug: string;
  name: string;
};

export type AdminProductRecord = ProductItem & {
  id: string;
  categorySlug: string;
  description: string;
  createdAt: string;
  source: "admin";
};

export type AdminProductInput = {
  name: string;
  categorySlug: string;
  category: string;
  price: string;
  description: string;
  brand?: string;
  sku?: string;
  unit?: string;
  stockStatus?: string;
  image: string;
  imageAlt?: string;
  featured?: boolean;
};

const dataDirectory = path.join(process.cwd(), "data");
const adminProductsFile = path.join(dataDirectory, "admin-products.json");

async function ensureDataFile() {
  await mkdir(dataDirectory, { recursive: true });

  try {
    await readFile(adminProductsFile, "utf8");
  } catch {
    await writeFile(adminProductsFile, "[]", "utf8");
  }
}

export function getCategoryOptions(): CategoryOption[] {
  return Object.values(productCategoryData).map((category) => ({
    slug: category.slug,
    name: category.name,
  }));
}

export function getFeaturedCategories() {
  return featuredProductCategories;
}

export async function getAdminProducts(): Promise<AdminProductRecord[]> {
  await ensureDataFile();

  try {
    const fileContents = await readFile(adminProductsFile, "utf8");
    const parsed = JSON.parse(fileContents);
    return Array.isArray(parsed) ? (parsed as AdminProductRecord[]) : [];
  } catch {
    return [];
  }
}

export async function createAdminProduct(
  input: AdminProductInput,
): Promise<AdminProductRecord> {
  const category = productCategoryData[input.categorySlug];

  if (!category) {
    throw new Error("Please select a valid product category.");
  }

  const nextProduct: AdminProductRecord = {
    id: `admin-${Date.now()}`,
    name: input.name.trim(),
    categorySlug: category.slug,
    category: input.category.trim() || category.name,
    price: input.price.trim(),
    description: input.description.trim(),
    brand: input.brand?.trim() || undefined,
    sku: input.sku?.trim() || undefined,
    unit: input.unit?.trim() || undefined,
    stockStatus: input.stockStatus?.trim() || "In stock",
    image: input.image,
    imageAlt: input.imageAlt?.trim() || input.name.trim(),
    featured: Boolean(input.featured),
    createdAt: new Date().toISOString(),
    source: "admin",
  };

  const existingProducts = await getAdminProducts();

  await writeFile(
    adminProductsFile,
    JSON.stringify([nextProduct, ...existingProducts], null, 2),
    "utf8",
  );

  return nextProduct;
}

export async function getMergedCategoryData(): Promise<
  Record<string, ProductCategoryPageData>
> {
  const adminProducts = await getAdminProducts();
  const mergedCategories = Object.fromEntries(
    Object.entries(productCategoryData).map(([slug, category]) => [
      slug,
      {
        ...category,
        products: [
          ...adminProducts.filter((product) => product.categorySlug === slug),
          ...category.products,
        ],
      },
    ]),
  ) as Record<string, ProductCategoryPageData>;

  return mergedCategories;
}

export async function getCategoryBySlug(slug: string) {
  const categories = await getMergedCategoryData();
  return categories[slug];
}

export async function getAllProducts() {
  const categories = await getMergedCategoryData();

  return Object.values(categories).flatMap((category) =>
    category.products.map((product) => ({
      ...product,
      categorySlug:
        "categorySlug" in product && typeof product.categorySlug === "string"
          ? product.categorySlug
          : category.slug,
      categoryName: category.name,
    })),
  );
}
