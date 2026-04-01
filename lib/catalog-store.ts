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
import { createCategorySlug } from "@/lib/catalog-utils";

export type CategoryOption = {
  slug: string;
  name: string;
};

export type AdminCategoryRecord = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image?: string;
  createdAt: string;
  source: "seed" | "admin";
};

export type AdminCategoryInput = {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
};

export type DeleteAdminCategoryResult = {
  category: AdminCategoryRecord;
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

export type AdminProductUpdateInput = AdminProductInput & {
  id: string;
};

type ProductCategoryRow = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  created_at?: string;
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

const productSelectQuery = `
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
`;

const categorySelectQuery = `
  id,
  slug,
  name,
  description,
  image_url,
  created_at
`;

const legacyCategorySelectQuery = `
  id,
  slug,
  name,
  description,
  created_at
`;

const defaultCategoryImage = "/images/Heritage Industry.jpg";
const defaultCategoryBanner = "/images/Proman_industrial.png";

const dataDirectory = path.join(process.cwd(), "data");
const adminProductsFile = path.join(dataDirectory, "admin-products.json");
const adminCategoriesFile = path.join(dataDirectory, "admin-categories.json");

async function ensureDataFile() {
  await mkdir(dataDirectory, { recursive: true });

  try {
    await readFile(adminProductsFile, "utf8");
  } catch {
    await writeFile(adminProductsFile, "[]", "utf8");
  }

  try {
    await readFile(adminCategoriesFile, "utf8");
  } catch {
    await writeFile(adminCategoriesFile, "[]", "utf8");
  }
}

export async function getCategoryOptions(): Promise<CategoryOption[]> {
  const categories = await getBaseCategoryData();

  return Object.values(categories)
    .map((category) => ({
      slug: category.slug,
      name: category.name,
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

export function getFeaturedCategories() {
  return featuredProductCategories;
}

export async function getLandingCategories(): Promise<ProductCategoryPageData[]> {
  const categories = await getBaseCategoryData();
  const seededOrder = Object.keys(productCategoryData);

  const seededCategories = seededOrder
    .map((slug) => categories[slug])
    .filter((category): category is ProductCategoryPageData => Boolean(category));

  const adminCategories = Object.values(categories)
    .filter((category) => !productCategoryData[category.slug])
    .sort((left, right) => left.name.localeCompare(right.name));

  return [...seededCategories, ...adminCategories];
}

export async function getAdminProducts(): Promise<AdminProductRecord[]> {
  noStore();

  if (hasSupabaseReadConfig()) {
    return getSupabaseAdminProducts();
  }

  return getFileAdminProducts();
}

export async function getAdminCategories(): Promise<AdminCategoryRecord[]> {
  noStore();

  if (hasSupabaseReadConfig()) {
    return getSupabaseAdminCategories();
  }

  return getFileAdminCategories();
}

export async function deleteAdminCategory(
  id: string,
): Promise<DeleteAdminCategoryResult> {
  if (hasSupabaseAdminConfig()) {
    return deleteSupabaseAdminCategory(id);
  }

  return deleteFileAdminCategory(id);
}

export async function getAdminProductById(
  id: string,
): Promise<AdminProductRecord | null> {
  noStore();

  if (hasSupabaseReadConfig()) {
    return getSupabaseAdminProductById(id);
  }

  return getFileAdminProductById(id);
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

async function getFileAdminCategories(): Promise<AdminCategoryRecord[]> {
  await ensureDataFile();

  try {
    const fileContents = await readFile(adminCategoriesFile, "utf8");
    const parsed = JSON.parse(fileContents);
    return Array.isArray(parsed) ? (parsed as AdminCategoryRecord[]) : [];
  } catch {
    return [];
  }
}

async function getSupabaseAdminProducts(): Promise<AdminProductRecord[]> {
  const supabase = createSupabaseReadClient();
  const { data, error } = await supabase
    .from("products")
    .select(productSelectQuery)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load Supabase products: ${error.message}`);
  }

  return (data ?? []).map(mapSupabaseProduct);
}

async function getSupabaseAdminCategories(): Promise<AdminCategoryRecord[]> {
  const supabase = createSupabaseReadClient();
  const categories = await listSupabaseCategories(supabase);

  return categories.map(mapSupabaseCategory);
}

async function getFileAdminProductById(
  id: string,
): Promise<AdminProductRecord | null> {
  const products = await getFileAdminProducts();
  return products.find((product) => product.id === id) ?? null;
}

async function getSupabaseAdminProductById(
  id: string,
): Promise<AdminProductRecord | null> {
  const supabase = createSupabaseReadClient();
  const { data, error } = await supabase
    .from("products")
    .select(productSelectQuery)
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  const product = data as ProductRow | null;

  if (error) {
    throw new Error(`Unable to load product: ${error.message}`);
  }

  return product ? mapSupabaseProduct(product) : null;
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

function mapSupabaseCategory(row: ProductCategoryRow): AdminCategoryRecord {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: normalizeCategoryDescription(row.description, row.name),
    image: row.image_url ?? undefined,
    createdAt: row.created_at ?? new Date().toISOString(),
    source: productCategoryData[row.slug] ? "seed" : "admin",
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

export async function createAdminCategory(
  input: AdminCategoryInput,
): Promise<AdminCategoryRecord> {
  if (hasSupabaseAdminConfig()) {
    return createSupabaseAdminCategory(input);
  }

  return createFileAdminCategory(input);
}

async function deleteFileAdminCategory(
  id: string,
): Promise<DeleteAdminCategoryResult> {
  const existingCategories = await getFileAdminCategories();
  const categoryIndex = existingCategories.findIndex((category) => category.id === id);

  if (categoryIndex === -1) {
    throw new Error("Unable to find the selected category.");
  }

  const category = existingCategories[categoryIndex];

  if (category.source !== "admin") {
    throw new Error("Only admin-created categories can be deleted here.");
  }

  const assignedProducts = await getAdminProducts();
  const hasProducts = assignedProducts.some(
    (product) => product.categorySlug === category.slug,
  );

  if (hasProducts) {
    throw new Error(
      "Remove or move the products in this category before deleting it.",
    );
  }

  existingCategories.splice(categoryIndex, 1);

  await writeFile(
    adminCategoriesFile,
    JSON.stringify(existingCategories, null, 2),
    "utf8",
  );

  return { category };
}

async function deleteSupabaseAdminCategory(
  id: string,
): Promise<DeleteAdminCategoryResult> {
  const supabase = createSupabaseAdminClient();
  const category = await getSupabaseCategoryById(supabase, id);

  if (!category) {
    throw new Error("Unable to find the selected category.");
  }

  if (productCategoryData[category.slug]) {
    throw new Error("Only admin-created categories can be deleted here.");
  }

  const { count, error: countError } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id)
    .eq("is_active", true);

  if (countError) {
    throw new Error(`Unable to check category usage: ${countError.message}`);
  }

  if ((count ?? 0) > 0) {
    throw new Error(
      "Remove or move the products in this category before deleting it.",
    );
  }

  const { error: deleteError } = await supabase
    .from("product_categories")
    .update({ is_active: false })
    .eq("id", id);

  if (deleteError) {
    throw new Error(`Unable to delete category: ${deleteError.message}`);
  }

  return {
    category: mapSupabaseCategory(category),
  };
}

export async function updateAdminProduct(
  input: AdminProductUpdateInput,
): Promise<AdminProductRecord> {
  if (hasSupabaseAdminConfig()) {
    return updateSupabaseAdminProduct(input);
  }

  return updateFileAdminProduct(input);
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
  const category = await getSupabaseCategoryBySlug(supabase, input.categorySlug);

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
    .select(productSelectQuery)
    .single();

  const data = productData as ProductRow | null;

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to save product to Supabase.");
  }

  return mapSupabaseProduct(data);
}

async function createFileAdminCategory(
  input: AdminCategoryInput,
): Promise<AdminCategoryRecord> {
  const existingCategories = await getBaseCategoryData();
  const slug = createCategorySlug(input.slug?.trim() || input.name);

  if (!slug) {
    throw new Error("Please provide a category name or slug.");
  }

  if (existingCategories[slug]) {
    throw new Error("A category with that slug already exists.");
  }

  const nextCategory: AdminCategoryRecord = {
    id: `category-${Date.now()}`,
    slug,
    name: input.name.trim(),
    description: normalizeCategoryDescription(input.description, input.name),
    image: input.image?.trim() || undefined,
    createdAt: new Date().toISOString(),
    source: "admin",
  };

  const existingAdminCategories = await getFileAdminCategories();

  await writeFile(
    adminCategoriesFile,
    JSON.stringify([nextCategory, ...existingAdminCategories], null, 2),
    "utf8",
  );

  return nextCategory;
}

async function createSupabaseAdminCategory(
  input: AdminCategoryInput,
): Promise<AdminCategoryRecord> {
  const supabase = createSupabaseAdminClient();
  const slug = createCategorySlug(input.slug?.trim() || input.name);

  if (!slug) {
    throw new Error("Please provide a category name or slug.");
  }

  const baseCategoryInput = {
    slug,
    name: input.name.trim(),
    description: normalizeCategoryDescription(input.description, input.name),
  };

  let { data, error } = await supabase
    .from("product_categories")
    .insert({
      ...baseCategoryInput,
      image_url: input.image?.trim() || null,
    })
    .select(categorySelectQuery)
    .single();

  if (error && isMissingCategoryImageColumnError(error)) {
    const fallbackResult = await supabase
      .from("product_categories")
      .insert(baseCategoryInput)
      .select(legacyCategorySelectQuery)
      .single();

    data = fallbackResult.data;
    error = fallbackResult.error;
  }

  const category = data as ProductCategoryRow | null;

  if (error || !category) {
    const message =
      error?.code === "23505"
        ? "A category with that slug already exists."
        : error?.message ?? "Unable to save category.";

    throw new Error(message);
  }

  return mapSupabaseCategory(category);
}

async function updateFileAdminProduct(
  input: AdminProductUpdateInput,
): Promise<AdminProductRecord> {
  const category = productCategoryData[input.categorySlug];

  if (!category) {
    throw new Error("Please select a valid product category.");
  }

  const existingProducts = await getFileAdminProducts();
  const productIndex = existingProducts.findIndex(
    (product) => product.id === input.id,
  );

  if (productIndex === -1) {
    throw new Error("Unable to find the selected product.");
  }

  const currentProduct = existingProducts[productIndex];
  const updatedProduct: AdminProductRecord = {
    ...currentProduct,
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
  };

  existingProducts[productIndex] = updatedProduct;

  await writeFile(
    adminProductsFile,
    JSON.stringify(existingProducts, null, 2),
    "utf8",
  );

  return updatedProduct;
}

async function updateSupabaseAdminProduct(
  input: AdminProductUpdateInput,
): Promise<AdminProductRecord> {
  const supabase = createSupabaseAdminClient();
  const category = await getSupabaseCategoryBySlug(supabase, input.categorySlug);

  if (!category) {
    throw new Error("Please select a valid product category.");
  }

  const { data: productData, error } = await supabase
    .from("products")
    .update({
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
    })
    .eq("id", input.id)
    .eq("is_active", true)
    .select(productSelectQuery)
    .maybeSingle();

  const data = productData as ProductRow | null;

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Unable to find the selected product.");
  }

  return mapSupabaseProduct(data);
}

async function getSupabaseCategoryBySlug(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  slug: string,
): Promise<ProductCategoryRow | null> {
  const { data, error } = await supabase
    .from("product_categories")
    .select("id, slug, name")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  const category = data as ProductCategoryRow | null;

  if (error) {
    throw new Error(`Unable to load product category: ${error.message}`);
  }

  return category;
}

async function listSupabaseCategories(
  supabase:
    | ReturnType<typeof createSupabaseReadClient>
    | ReturnType<typeof createSupabaseAdminClient>,
): Promise<ProductCategoryRow[]> {
  const { data, error } = await supabase
    .from("product_categories")
    .select(categorySelectQuery)
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (!error) {
    return (data as ProductCategoryRow[] | null) ?? [];
  }

  if (!isMissingCategoryImageColumnError(error)) {
    throw new Error(`Unable to load product categories: ${error.message}`);
  }

  const fallbackResult = await supabase
    .from("product_categories")
    .select(legacyCategorySelectQuery)
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (fallbackResult.error) {
    throw new Error(
      `Unable to load product categories: ${fallbackResult.error.message}`,
    );
  }

  return (fallbackResult.data as ProductCategoryRow[] | null) ?? [];
}

async function getSupabaseCategoryById(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  id: string,
): Promise<ProductCategoryRow | null> {
  const { data, error } = await supabase
    .from("product_categories")
    .select(categorySelectQuery)
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  if (!error) {
    return (data as ProductCategoryRow | null) ?? null;
  }

  if (!isMissingCategoryImageColumnError(error)) {
    throw new Error(`Unable to load category: ${error.message}`);
  }

  const fallbackResult = await supabase
    .from("product_categories")
    .select(legacyCategorySelectQuery)
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  if (fallbackResult.error) {
    throw new Error(`Unable to load category: ${fallbackResult.error.message}`);
  }

  return (fallbackResult.data as ProductCategoryRow | null) ?? null;
}

function isMissingCategoryImageColumnError(
  error:
    | {
        code?: string;
        details?: string | null;
        hint?: string | null;
        message?: string;
      }
    | null
    | undefined,
) {
  if (!error) {
    return false;
  }

  const combinedMessage = [error.message, error.details, error.hint]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    error.code === "42703" ||
    error.code === "PGRST204" ||
    combinedMessage.includes("image_url")
  );
}

function normalizeCategoryDescription(description: string | null | undefined, name: string) {
  const trimmed = description?.trim();

  if (trimmed) {
    return trimmed;
  }

  return `Browse ${name.trim()} products curated for industrial, commercial, and facility operations.`;
}

function buildCategorySubtitle(name: string) {
  return `${name.trim()} solutions for industrial operations`;
}

function buildDynamicCategoryPageData(
  category: Pick<AdminCategoryRecord, "slug" | "name" | "description" | "image">,
): ProductCategoryPageData {
  return {
    slug: category.slug,
    name: category.name,
    href: `/products/${category.slug}`,
    image: category.image || defaultCategoryImage,
    banner: defaultCategoryBanner,
    title: category.name,
    subtitle: buildCategorySubtitle(category.name),
    description: category.description,
    products: [],
  };
}

async function getBaseCategoryData(): Promise<Record<string, ProductCategoryPageData>> {
  const baseCategories = Object.fromEntries(
    Object.entries(productCategoryData).map(([slug, category]) => [
      slug,
      { ...category },
    ]),
  ) as Record<string, ProductCategoryPageData>;

  const adminCategories = await getAdminCategories();

  for (const category of adminCategories) {
    const seededCategory = baseCategories[category.slug];

    if (seededCategory) {
      baseCategories[category.slug] = {
        ...seededCategory,
        name: category.name,
        image: category.image || seededCategory.image,
        title: category.name,
        description: category.description || seededCategory.description,
      };
      continue;
    }

    baseCategories[category.slug] = buildDynamicCategoryPageData(category);
  }

  return baseCategories;
}

export async function getMergedCategoryData(): Promise<
  Record<string, ProductCategoryPageData>
> {
  noStore();

  const categories = await getBaseCategoryData();
  const adminProducts = await getAdminProducts();

  const mergedCategories = Object.fromEntries(
    Object.entries(categories).map(([slug, category]) => [
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
