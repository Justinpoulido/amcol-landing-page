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
import { createCategorySlug, createProductSlug } from "@/lib/catalog-utils";

export type CategoryOption = {
  id?: string;
  slug: string;
  name: string;
  parentId?: string;
  parentSlug?: string;
  parentName?: string;
  displayOrder?: number;
};

export type AdminCategoryRecord = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image?: string;
  parentId?: string;
  parentSlug?: string;
  parentName?: string;
  displayOrder: number;
  createdAt: string;
  source: "seed" | "admin";
};

export type AdminCategoryInput = {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  parentId?: string | null;
  displayOrder?: number;
};

export type AdminCategoryUpdateInput = AdminCategoryInput & {
  id: string;
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
  slug?: string;
  categorySlug: string;
  category: string;
  price: string;
  summary?: string;
  description: string;
  brand?: string;
  sku?: string;
  unit?: string;
  stockStatus?: string;
  image: string;
  imageAlt?: string;
  galleryImages?: string[];
  specifications?: string[];
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
  parent_id?: string | null;
  display_order?: number | null;
  created_at?: string;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string | null;
  price: string;
  summary: string | null;
  description: string;
  brand: string | null;
  sku: string | null;
  unit: string | null;
  stock_status: string;
  image_url: string;
  image_alt: string | null;
  gallery_images: string[] | string | null;
  specifications: string[] | string | null;
  featured: boolean;
  created_at: string;
  product_categories: ProductCategoryRow | ProductCategoryRow[] | null;
};

function normalizeStringList(value: string[] | string | null | undefined) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return [];
    }

    try {
      const parsed = JSON.parse(trimmed);

      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      // Fall back to splitting legacy comma/newline data.
    }

    return trimmed
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

const productSelectQuery = `
  id,
  name,
  slug,
  price,
  summary,
  description,
  brand,
  sku,
  unit,
  stock_status,
  image_url,
  image_alt,
  gallery_images,
  specifications,
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
  parent_id,
  display_order,
  created_at
`;

const categorySelectWithoutHierarchyQuery = `
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

const defaultCategoryImage = "/images/Shore_base.png";
const defaultCategoryBanner = "/images/Proman_industrial.webp";
const defaultProductSummary =
  "Product details are available through our sales team for this category.";
const categoryImageOverrides: Record<string, string> = {
  "pipe-valves-and-fittings": "/images/pipes-valves-fittings.webp",
};

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
      parentSlug: category.parentSlug,
      parentName: category.parentName,
    }))
    .sort(compareCategoryHierarchy);
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
    .filter((category) => !productCategoryData[category.slug] && !category.parentSlug)
    .sort((left, right) => left.name.localeCompare(right.name));

  return [...seededCategories, ...adminCategories].filter(
    (category) => !category.parentSlug,
  );
}

export async function getAdminProducts(): Promise<AdminProductRecord[]> {
  noStore();

  if (hasSupabaseReadConfig()) {
    try {
      return await getSupabaseAdminProducts();
    } catch (error) {
      console.warn(
        "Falling back to local admin products because Supabase read failed.",
        error,
      );
    }
  }

  return getFileAdminProducts();
}

export async function getAdminCategories(): Promise<AdminCategoryRecord[]> {
  noStore();

  if (hasSupabaseReadConfig()) {
    try {
      return await getSupabaseAdminCategories();
    } catch (error) {
      console.warn(
        "Falling back to local admin categories because Supabase read failed.",
        error,
      );
    }
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
    try {
      return await getSupabaseAdminProductById(id);
    } catch (error) {
      console.warn(
        "Falling back to local admin product lookup because Supabase read failed.",
        error,
      );
    }
  }

  return getFileAdminProductById(id);
}

export async function deleteAdminProduct(id: string): Promise<AdminProductRecord> {
  if (hasSupabaseAdminConfig()) {
    return deleteSupabaseAdminProduct(id);
  }

  return deleteFileAdminProduct(id);
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

  return categories
    .map((category) => mapSupabaseCategory(category, categories))
    .sort(compareCategoryHierarchy);
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
    slug: row.slug ?? undefined,
    categorySlug: categoryRecord?.slug ?? "",
    category: categoryRecord?.name ?? "Uncategorized",
    price: row.price,
    summary: row.summary ?? undefined,
    description: row.description,
    brand: row.brand ?? undefined,
    sku: row.sku ?? undefined,
    unit: row.unit ?? undefined,
    stockStatus: row.stock_status,
    image: row.image_url,
    imageAlt: row.image_alt ?? row.name,
    galleryImages: normalizeStringList(row.gallery_images),
    specifications: normalizeStringList(row.specifications),
    featured: row.featured,
    createdAt: row.created_at,
    source: "admin",
  };
}

function mapSupabaseCategory(
  row: ProductCategoryRow,
  categories: ProductCategoryRow[] = [],
): AdminCategoryRecord {
  const parent = row.parent_id
    ? categories.find((category) => category.id === row.parent_id)
    : undefined;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: normalizeCategoryDescription(row.description, row.name),
    image: row.image_url ?? undefined,
    parentId: row.parent_id ?? undefined,
    parentSlug: parent?.slug,
    parentName: parent?.name,
    displayOrder: row.display_order ?? 0,
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

export async function updateAdminCategory(
  input: AdminCategoryUpdateInput,
): Promise<AdminCategoryRecord> {
  if (hasSupabaseAdminConfig()) {
    return updateSupabaseAdminCategory(input);
  }

  return updateFileAdminCategory(input);
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
  const hasChildren = existingCategories.some(
    (candidate) => candidate.parentId === category.id,
  );

  if (hasChildren) {
    throw new Error(
      "Move or remove this category's subcategories before deleting it.",
    );
  }

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

async function deleteFileAdminProduct(id: string): Promise<AdminProductRecord> {
  const existingProducts = await getFileAdminProducts();
  const productIndex = existingProducts.findIndex((product) => product.id === id);

  if (productIndex === -1) {
    throw new Error("Unable to find the selected product.");
  }

  const [deletedProduct] = existingProducts.splice(productIndex, 1);

  await writeFile(
    adminProductsFile,
    JSON.stringify(existingProducts, null, 2),
    "utf8",
  );

  return deletedProduct;
}

async function deleteSupabaseAdminProduct(id: string): Promise<AdminProductRecord> {
  const existingProduct = await getSupabaseAdminProductById(id);

  if (!existingProduct) {
    throw new Error("Unable to find the selected product.");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("products")
    .update({ is_active: false })
    .eq("id", id);

  if (error) {
    throw new Error(`Unable to delete product: ${error.message}`);
  }

  return existingProduct;
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

  const { count: childCount, error: childCountError } = await supabase
    .from("product_categories")
    .select("id", { count: "exact", head: true })
    .eq("parent_id", id)
    .eq("is_active", true);

  if (childCountError && !isMissingCategoryHierarchyColumnError(childCountError)) {
    throw new Error(`Unable to check subcategory usage: ${childCountError.message}`);
  }

  if ((childCount ?? 0) > 0) {
    throw new Error(
      "Move or remove this category's subcategories before deleting it.",
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
  const categories = await getBaseCategoryData();
  const category = categories[input.categorySlug];

  if (!category) {
    throw new Error("Please select a valid product category.");
  }

  const nextProduct: AdminProductRecord = {
    id: `admin-${Date.now()}`,
    name: input.name.trim(),
    slug: createProductSlug(input.slug?.trim() || input.name),
    categorySlug: category.slug,
    category: input.category.trim() || category.name,
    price: input.price.trim(),
    summary: input.summary?.trim() || undefined,
    description: input.description.trim(),
    brand: input.brand?.trim() || undefined,
    sku: input.sku?.trim() || undefined,
    unit: input.unit?.trim() || undefined,
    stockStatus: input.stockStatus?.trim() || "In stock",
    image: input.image,
    imageAlt: input.imageAlt?.trim() || input.name.trim(),
    galleryImages: input.galleryImages?.filter(Boolean),
    specifications: input.specifications?.filter(Boolean),
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
      slug: createProductSlug(input.slug?.trim() || input.name),
      price: input.price.trim(),
      summary: input.summary?.trim() || null,
      description: input.description.trim(),
      brand: input.brand?.trim() || null,
      sku: input.sku?.trim() || null,
      unit: input.unit?.trim() || null,
      stock_status: input.stockStatus?.trim() || "In stock",
      image_url: input.image,
      image_alt: input.imageAlt?.trim() || input.name.trim(),
      gallery_images: input.galleryImages?.filter(Boolean) ?? [],
      specifications: input.specifications?.filter(Boolean) ?? [],
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
    parentId: input.parentId || undefined,
    displayOrder: input.displayOrder ?? 0,
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

  await validateSupabaseCategoryParent(supabase, input.parentId);

  const baseCategoryInput = {
    slug,
    name: input.name.trim(),
    description: normalizeCategoryDescription(input.description, input.name),
    parent_id: input.parentId || null,
    display_order: input.displayOrder ?? 0,
  };

  const categoryInsertResult = await supabase
    .from("product_categories")
    .insert({
      ...baseCategoryInput,
      image_url: input.image?.trim() || null,
    })
    .select(categorySelectQuery)
    .single();

  let data = categoryInsertResult.data as ProductCategoryRow | null;
  let error = categoryInsertResult.error;

  if (error && isMissingCategoryHierarchyColumnError(error)) {
    throw new Error(
      "Subcategory support is ready in the app, but the catalog hierarchy migration has not been applied to Supabase yet.",
    );
  }

  if (error && isMissingCategoryImageColumnError(error)) {
    const fallbackResult = await supabase
      .from("product_categories")
      .insert({
        slug: baseCategoryInput.slug,
        name: baseCategoryInput.name,
        description: baseCategoryInput.description,
      })
      .select(legacyCategorySelectQuery)
      .single();

    data = fallbackResult.data as ProductCategoryRow | null;
    error = fallbackResult.error;
  }

  const category = data;

  if (error || !category) {
    const message =
      error?.code === "23505"
        ? "A category with that slug already exists."
        : error?.message ?? "Unable to save category.";

    throw new Error(message);
  }

  const categories = await listSupabaseCategories(supabase);
  return mapSupabaseCategory(category, categories);
}

async function updateFileAdminCategory(
  input: AdminCategoryUpdateInput,
): Promise<AdminCategoryRecord> {
  const categories = await getFileAdminCategories();
  const index = categories.findIndex((category) => category.id === input.id);

  if (index === -1) {
    throw new Error("Unable to find the selected category.");
  }

  const slug = createCategorySlug(input.slug?.trim() || input.name);
  const duplicate = categories.some(
    (category) => category.id !== input.id && category.slug === slug,
  );

  if (duplicate || (productCategoryData[slug] && categories[index].slug !== slug)) {
    throw new Error("A category with that slug already exists.");
  }

  const updatedCategory: AdminCategoryRecord = {
    ...categories[index],
    slug,
    name: input.name.trim(),
    description: normalizeCategoryDescription(input.description, input.name),
    image: input.image?.trim() || undefined,
    parentId: input.parentId || undefined,
    displayOrder: input.displayOrder ?? 0,
  };

  categories[index] = updatedCategory;
  await writeFile(adminCategoriesFile, JSON.stringify(categories, null, 2), "utf8");
  return updatedCategory;
}

async function updateSupabaseAdminCategory(
  input: AdminCategoryUpdateInput,
): Promise<AdminCategoryRecord> {
  const supabase = createSupabaseAdminClient();
  const existing = await getSupabaseCategoryById(supabase, input.id);

  if (!existing) {
    throw new Error("Unable to find the selected category.");
  }

  if (input.parentId === input.id) {
    throw new Error("A category cannot be its own parent.");
  }

  await validateSupabaseCategoryParent(supabase, input.parentId);

  const { data, error } = await supabase
    .from("product_categories")
    .update({
      slug: createCategorySlug(input.slug?.trim() || input.name),
      name: input.name.trim(),
      description: normalizeCategoryDescription(input.description, input.name),
      image_url: input.image?.trim() || null,
      parent_id: input.parentId || null,
      display_order: input.displayOrder ?? 0,
    })
    .eq("id", input.id)
    .eq("is_active", true)
    .select(categorySelectQuery)
    .maybeSingle();

  if (error || !data) {
    if (isMissingCategoryHierarchyColumnError(error)) {
      throw new Error(
        "Subcategory support is ready in the app, but the catalog hierarchy migration has not been applied to Supabase yet.",
      );
    }

    throw new Error(
      error?.code === "23505"
        ? "A category with that slug already exists."
        : error?.message ?? "Unable to update category.",
    );
  }

  const categories = await listSupabaseCategories(supabase);
  return mapSupabaseCategory(data as ProductCategoryRow, categories);
}

async function updateFileAdminProduct(
  input: AdminProductUpdateInput,
): Promise<AdminProductRecord> {
  const categories = await getBaseCategoryData();
  const category = categories[input.categorySlug];

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
    slug: createProductSlug(input.slug?.trim() || input.name),
    categorySlug: category.slug,
    category: input.category.trim() || category.name,
    price: input.price.trim(),
    summary: input.summary?.trim() || undefined,
    description: input.description.trim(),
    brand: input.brand?.trim() || undefined,
    sku: input.sku?.trim() || undefined,
    unit: input.unit?.trim() || undefined,
    stockStatus: input.stockStatus?.trim() || "In stock",
    image: input.image,
    imageAlt: input.imageAlt?.trim() || input.name.trim(),
    galleryImages: input.galleryImages?.filter(Boolean),
    specifications: input.specifications?.filter(Boolean),
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
      slug: createProductSlug(input.slug?.trim() || input.name),
      price: input.price.trim(),
      summary: input.summary?.trim() || null,
      description: input.description.trim(),
      brand: input.brand?.trim() || null,
      sku: input.sku?.trim() || null,
      unit: input.unit?.trim() || null,
      stock_status: input.stockStatus?.trim() || "In stock",
      image_url: input.image,
      image_alt: input.imageAlt?.trim() || input.name.trim(),
      gallery_images: input.galleryImages?.filter(Boolean) ?? [],
      specifications: input.specifications?.filter(Boolean) ?? [],
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

  if (isMissingCategoryHierarchyColumnError(error)) {
    const hierarchyFallback = await supabase
      .from("product_categories")
      .select(categorySelectWithoutHierarchyQuery)
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (!hierarchyFallback.error) {
      return (hierarchyFallback.data as ProductCategoryRow[] | null) ?? [];
    }

    if (!isMissingCategoryImageColumnError(hierarchyFallback.error)) {
      throw new Error(
        `Unable to load product categories: ${hierarchyFallback.error.message}`,
      );
    }
  } else if (!isMissingCategoryImageColumnError(error)) {
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

  if (isMissingCategoryHierarchyColumnError(error)) {
    const hierarchyFallback = await supabase
      .from("product_categories")
      .select(categorySelectWithoutHierarchyQuery)
      .eq("id", id)
      .eq("is_active", true)
      .maybeSingle();

    if (!hierarchyFallback.error) {
      return (hierarchyFallback.data as ProductCategoryRow | null) ?? null;
    }

    if (!isMissingCategoryImageColumnError(hierarchyFallback.error)) {
      throw new Error(`Unable to load category: ${hierarchyFallback.error.message}`);
    }
  } else if (!isMissingCategoryImageColumnError(error)) {
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

async function validateSupabaseCategoryParent(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  parentId: string | null | undefined,
) {
  if (!parentId) {
    return;
  }

  const { data, error } = await supabase
    .from("product_categories")
    .select("id, parent_id")
    .eq("id", parentId)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    if (isMissingCategoryHierarchyColumnError(error)) {
      throw new Error(
        "Subcategory support is ready in the app, but the catalog hierarchy migration has not been applied to Supabase yet.",
      );
    }

    throw new Error(`Unable to validate the parent category: ${error.message}`);
  }

  const parent = data as Pick<ProductCategoryRow, "id" | "parent_id"> | null;

  if (!parent) {
    throw new Error("Please select a valid parent category.");
  }

  if (parent.parent_id) {
    throw new Error("Subcategories can only be placed under a top-level category.");
  }
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

function isMissingCategoryHierarchyColumnError(
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
    combinedMessage.includes("parent_id") ||
    combinedMessage.includes("display_order")
  );
}

function compareCategoryHierarchy<
  TCategory extends {
    name: string;
    parentName?: string;
    displayOrder?: number;
  },
>(left: TCategory, right: TCategory) {
  const leftGroup = left.parentName || left.name;
  const rightGroup = right.parentName || right.name;
  const groupComparison = leftGroup.localeCompare(rightGroup);

  if (groupComparison !== 0) {
    return groupComparison;
  }

  if (Boolean(left.parentName) !== Boolean(right.parentName)) {
    return left.parentName ? 1 : -1;
  }

  const orderComparison = (left.displayOrder ?? 0) - (right.displayOrder ?? 0);
  return orderComparison || left.name.localeCompare(right.name);
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
  category: Pick<
    AdminCategoryRecord,
    "slug" | "name" | "description" | "image" | "parentSlug" | "parentName"
  >,
): ProductCategoryPageData {
  return {
    slug: category.slug,
    name: category.name,
    href: `/products/${category.slug}`,
    image: categoryImageOverrides[category.slug] || category.image || defaultCategoryImage,
    banner: defaultCategoryBanner,
    title: category.name,
    subtitle: buildCategorySubtitle(category.name),
    description: category.description,
    products: [],
    parentSlug: category.parentSlug,
    parentName: category.parentName,
  };
}

function summarizeText(value: string) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return "";
  }

  const sentenceMatch = normalized.match(/^.+?[.!?](?=\s|$)/);
  const firstSentence = sentenceMatch?.[0] ?? normalized;

  if (firstSentence.length <= 180) {
    return firstSentence;
  }

  const truncated = firstSentence.slice(0, 177);
  const lastSpace = truncated.lastIndexOf(" ");

  return `${truncated.slice(0, lastSpace > 120 ? lastSpace : 177).trim()}...`;
}

function getProductSummary(product: ProductItem) {
  const providedSummary = product.summary?.trim();

  if (providedSummary) {
    return providedSummary;
  }

  const descriptionSummary = product.description
    ? summarizeText(product.description)
    : "";

  if (descriptionSummary) {
    return descriptionSummary;
  }

  return defaultProductSummary;
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
        image:
          categoryImageOverrides[category.slug] ||
          category.image ||
          seededCategory.image,
        title: category.name,
        description: category.description || seededCategory.description,
        parentSlug: category.parentSlug,
        parentName: category.parentName,
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

  const productsWithSlugs = addProductSlugs(
    Object.values(mergedCategories).flatMap((category) =>
      category.products.map((product) => ({
        ...product,
        categorySlug:
          "categorySlug" in product && typeof product.categorySlug === "string"
            ? product.categorySlug
            : category.slug,
        categoryName: category.name,
      })),
    ),
  );

  for (const category of Object.values(mergedCategories)) {
    category.products = productsWithSlugs.filter(
      (product) => product.categorySlug === category.slug,
    );
    category.subcategories = Object.values(mergedCategories)
      .filter((candidate) => candidate.parentSlug === category.slug)
      .sort((left, right) => left.name.localeCompare(right.name))
      .map((subcategory) => ({
        slug: subcategory.slug,
        name: subcategory.name,
        href: subcategory.href,
        image: subcategory.image,
        description: subcategory.description,
        productCount: productsWithSlugs.filter(
          (product) => product.categorySlug === subcategory.slug,
        ).length,
      }));
  }

  return mergedCategories;
}

export async function getCategoryBySlug(slug: string) {
  const categories = await getMergedCategoryData();
  return categories[slug];
}

export async function getAllProducts() {
  const categories = await getMergedCategoryData();

  const products = Object.values(categories).flatMap((category) =>
    category.products.map((product) => ({
      ...product,
      categorySlug:
        "categorySlug" in product && typeof product.categorySlug === "string"
          ? product.categorySlug
          : category.slug,
      categoryName: category.name,
    })),
  );

  return addProductSlugs(products);
}

export async function getProductBySlug(slug: string) {
  const products = await getAllProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

function addProductSlugs<
  TProduct extends ProductItem & { categorySlug: string; categoryName: string },
>(products: TProduct[]) {
  const slugCounts = new Map<string, number>();

  for (const product of products) {
    const baseSlug = product.slug?.trim() || createProductSlug(product.name);
    slugCounts.set(baseSlug, (slugCounts.get(baseSlug) ?? 0) + 1);
  }

  return products.map((product) => {
    const baseSlug = product.slug?.trim() || createProductSlug(product.name);
    const slug =
      (slugCounts.get(baseSlug) ?? 0) > 1
        ? `${baseSlug}-${product.categorySlug}`
        : baseSlug;

    return {
      ...product,
      slug,
      summary: getProductSummary(product),
    };
  });
}
