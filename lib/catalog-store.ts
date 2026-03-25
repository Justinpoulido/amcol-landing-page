import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { unstable_noStore as noStore } from "next/cache";
import {
  featuredProductCategories,
  productCategoryData,
  type ProductCategoryPageData,
  type ProductItem,
} from "@/lib/product-categories";
import { hasSupabaseAdminConfig, hasSupabaseReadConfig } from "@/lib/supabase/config";
import {
  createSupabaseAdminClient,
  createSupabaseReadClient,
} from "@/lib/supabase/server";

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
  createdBy?: string | null;
};

type ProductCategoryRow = {
  id: string;
  slug: string;
  name: string;
};

type ProductRow = {
  id: string;
  name: string;
  price: string;
  description: string;
  brand: string | null;
  sku: string | null;
  unit: string | null;
  stock_status: string;
  image_url: string;
  image_alt: string | null;
  featured: boolean;
  created_at: string;
  product_categories: ProductCategoryRow | ProductCategoryRow[] | null;
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
  noStore();

  if (hasSupabaseReadConfig()) {
    return getSupabaseAdminProducts();
  }

  return getFileAdminProducts();
}

async function getFileAdminProducts(): Promise<AdminProductRecord[]> {
  await ensureDataFile();

  try {
    const fileContents = await readFile(adminProductsFile, "utf8");
    const parsed = JSON.parse(fileContents);
    return Array.isArray(parsed) ? (parsed as AdminProductRecord[]) : [];
  } catch {
    return [];
  }
}

async function getSupabaseAdminProducts(): Promise<AdminProductRecord[]> {
  const supabase = createSupabaseReadClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
        id,
        name,
        price,
        description,
        brand,
        sku,
        unit,
        stock_status,
        image_url,
        image_alt,
        featured,
        created_at,
        product_categories!inner (
          id,
          slug,
          name
        )
      `,
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load Supabase products: ${error.message}`);
  }

  return (data ?? []).map(mapSupabaseProduct);
}

function mapSupabaseProduct(row: ProductRow): AdminProductRecord {
  const categoryRecord = Array.isArray(row.product_categories)
    ? row.product_categories[0]
    : row.product_categories;

  return {
    id: row.id,
    name: row.name,
    categorySlug: categoryRecord?.slug ?? "",
    category: categoryRecord?.name ?? "Uncategorized",
    price: row.price,
    description: row.description,
    brand: row.brand ?? undefined,
    sku: row.sku ?? undefined,
    unit: row.unit ?? undefined,
    stockStatus: row.stock_status,
    image: row.image_url,
    imageAlt: row.image_alt ?? row.name,
    featured: row.featured,
    createdAt: row.created_at,
    source: "admin",
  };
}

export async function createAdminProduct(
  input: AdminProductInput,
): Promise<AdminProductRecord> {
  if (hasSupabaseAdminConfig()) {
    return createSupabaseAdminProduct(input);
  }

  return createFileAdminProduct(input);
}

async function createFileAdminProduct(
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

async function createSupabaseAdminProduct(
  input: AdminProductInput,
): Promise<AdminProductRecord> {
  const supabase = createSupabaseAdminClient();
  const { data: categoryData, error: categoryError } = await supabase
    .from("product_categories")
    .select("id, slug, name")
    .eq("slug", input.categorySlug)
    .eq("is_active", true)
    .maybeSingle();

  const category = categoryData as ProductCategoryRow | null;

  if (categoryError) {
    throw new Error(`Unable to load product category: ${categoryError.message}`);
  }

  if (!category) {
    throw new Error("Please select a valid product category.");
  }

  const { data: productData, error } = await supabase
    .from("products")
    .insert({
      category_id: category.id,
      name: input.name.trim(),
      price: input.price.trim(),
      description: input.description.trim(),
      brand: input.brand?.trim() || null,
      sku: input.sku?.trim() || null,
      unit: input.unit?.trim() || null,
      stock_status: input.stockStatus?.trim() || "In stock",
      image_url: input.image,
      image_alt: input.imageAlt?.trim() || input.name.trim(),
      featured: Boolean(input.featured),
      created_by: input.createdBy ?? null,
    })
    .select(
      `
        id,
        name,
        price,
        description,
        brand,
        sku,
        unit,
        stock_status,
        image_url,
        image_alt,
        featured,
        created_at,
        product_categories!inner (
          id,
          slug,
          name
        )
      `,
    )
    .single();

  const data = productData as ProductRow | null;

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to save product to Supabase.");
  }

  return mapSupabaseProduct(data);
}

export async function getMergedCategoryData(): Promise<
  Record<string, ProductCategoryPageData>
> {
  noStore();

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
