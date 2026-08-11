import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { unstable_noStore as noStore } from "next/cache";
import {
  landingCategoryRows,
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
  slug: string;
  name: string;
  parentSlug?: string;
  parentName?: string;
};

export type AdminCategoryRecord = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image?: string;
  isFeatured: boolean;
  parentId?: string | null;
  parentSlug?: string;
  parentName?: string;
  createdAt: string;
  source: "seed" | "admin";
};

export type AdminCategoryInput = {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  isFeatured?: boolean;
  parentId?: string | null;
  parentSlug?: string;
};

export type AdminCategoryUpdateInput = AdminCategoryInput & {
  id?: string;
  currentSlug?: string;
};

export type AdminCategoryFeaturedInput = {
  id?: string;
  currentSlug?: string;
  isFeatured: boolean;
};

export type DeleteAdminCategoryResult = {
  category: AdminCategoryRecord;
};

export type AdminProductRecord = ProductItem & {
  id: string;
  categorySlug: string;
  subcategorySlug?: string;
  subcategoryName?: string;
  description: string;
  createdAt: string;
  source: "admin";
};

export type AdminProductInput = {
  name: string;
  slug?: string;
  categorySlug: string;
  category: string;
  subcategorySlug?: string;
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

export type ProductCatalogFilters = {
  search?: string;
  category?: string;
  brand?: string;
  availability?: string;
  type?: string;
  subcategory?: string;
};

export type PaginatedProductsResult = {
  products: Array<AdminProductRecord & { categoryName: string }>;
  totalCount: number;
};

export type ProductFilterOptions = {
  categories: string[];
  brands: string[];
  availability: string[];
  productTypes: string[];
};

type ProductCategoryRow = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  is_featured?: boolean | null;
  parent_id?: string | null;
  parent?: ProductCategoryRow | ProductCategoryRow[] | null;
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
  category: ProductCategoryRow | ProductCategoryRow[] | null;
  subcategory: ProductCategoryRow | ProductCategoryRow[] | null;
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
  category:product_categories!products_category_id_fkey (
    id,
    slug,
    name,
    parent_id
  ),
  subcategory:product_categories!products_subcategory_id_fkey (
    id,
    slug,
    name,
    parent_id
  )
`;

const categorySelectQuery = `
  id,
  slug,
  name,
  description,
  image_url,
  is_featured,
  parent_id,
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
const initialFeaturedCategorySlugs = new Set(
  landingCategoryRows.flat().map((category) => category.slug),
);
const initialFeaturedCategoryOrder = new Map(
  landingCategoryRows
    .flat()
    .map((category, index) => [category.slug, index] as const),
);
const categoryImageOverrides: Record<string, string> = {
  "pipe-valves-and-fittings": "/images/pipes-valves-fittings.webp",
};

const seededSubcategorySlugOverrides = new Map<string, string>([
  ["sprayers-pumps::Pressure Sprayer", "pressure-sprayer"],
  ["sprayers-pumps::Transfer Pump", "transfer-pump"],
  ["sprayers-pumps::Chemical Handling", "chemical-handling"],
]);

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

function getSeededSubcategorySlug(parentSlug: string, name: string) {
  const override = seededSubcategorySlugOverrides.get(`${parentSlug}::${name}`);

  if (override) {
    return override;
  }

  const baseSlug = createCategorySlug(name);
  const isDuplicate = Object.values(productCategoryData).some(
    (category) =>
      category.slug !== parentSlug &&
      category.products.some((product) => product.category === name),
  );

  return isDuplicate ? `${parentSlug}-${baseSlug}` : baseSlug;
}

function getSeededSubcategoryRecords(): AdminCategoryRecord[] {
  const records: AdminCategoryRecord[] = [];

  for (const category of Object.values(productCategoryData)) {
    const seenNames = new Set<string>();

    for (const product of category.products) {
      if (!product.category || seenNames.has(product.category)) {
        continue;
      }

      seenNames.add(product.category);
      records.push({
        id: `seed-subcategory-${category.slug}-${getSeededSubcategorySlug(
          category.slug,
          product.category,
        )}`,
        slug: getSeededSubcategorySlug(category.slug, product.category),
        name: product.category,
        description: `Browse ${product.category} products within ${category.name}.`,
        image: product.image || category.image,
        isFeatured: false,
        parentId: `seed-${category.slug}`,
        parentSlug: category.slug,
        parentName: category.name,
        createdAt: new Date().toISOString(),
        source: "seed",
      });
    }
  }

  return records;
}

function getSeededSubcategoryForProduct(
  parentSlug: string,
  product: Pick<ProductItem, "category">,
) {
  if (!product.category) {
    return undefined;
  }

  return {
    slug: getSeededSubcategorySlug(parentSlug, product.category),
    name: product.category,
  };
}

async function resolveFileCategoryParent(input: AdminCategoryInput) {
  const parentSlug = input.parentSlug?.trim();
  const parentId = input.parentId?.trim();

  if (!parentSlug && !parentId) {
    return null;
  }

  const categories = await getAdminCategories();
  const parent = categories.find(
    (category) =>
      (parentId && category.id === parentId) ||
      (parentSlug && category.slug === parentSlug),
  );

  if (!parent) {
    throw new Error("Please select a valid parent category.");
  }

  if (parent.parentId || parent.parentSlug) {
    throw new Error("A subcategory cannot be used as a parent category.");
  }

  return parent;
}

async function resolveSupabaseCategoryParent(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  input: AdminCategoryInput,
) {
  const parentId = input.parentId?.trim();
  const parentSlug = input.parentSlug?.trim();

  if (!parentId && !parentSlug) {
    return null;
  }

  const parent = parentId
    ? await getSupabaseCategoryById(supabase, parentId)
    : await getSupabaseCategoryBySlug(supabase, parentSlug ?? "");

  if (!parent) {
    throw new Error("Please select a valid parent category.");
  }

  if (parent.parent_id) {
    throw new Error("A subcategory cannot be used as a parent category.");
  }

  return parent;
}

export async function getCategoryOptions(): Promise<CategoryOption[]> {
  const categories = await getAdminCategories();

  return categories
    .map((category) => ({
      slug: category.slug,
      name: category.name,
      parentSlug: category.parentSlug,
      parentName: category.parentName,
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

export async function getFeaturedCategories() {
  const categories = await getBaseCategoryData();

  return Object.values(categories)
    .filter((category) => category.isFeatured && !category.parentSlug)
    .sort((left, right) => {
      const leftOrder = initialFeaturedCategoryOrder.get(left.slug);
      const rightOrder = initialFeaturedCategoryOrder.get(right.slug);

      if (leftOrder !== undefined && rightOrder !== undefined) {
        return leftOrder - rightOrder;
      }

      if (leftOrder !== undefined) {
        return -1;
      }

      if (rightOrder !== undefined) {
        return 1;
      }

      return left.name.localeCompare(right.name);
    });
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

  return [...seededCategories, ...adminCategories];
}

export async function getAdminProducts(): Promise<AdminProductRecord[]> {
  noStore();

  if (hasSupabaseAdminConfig()) {
    return getSupabaseAdminProducts(true);
  }

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

  if (hasSupabaseAdminConfig()) {
    return getSupabaseAdminCategories(true);
  }

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

export async function updateAdminCategory(
  input: AdminCategoryUpdateInput,
): Promise<AdminCategoryRecord> {
  if (hasSupabaseAdminConfig()) {
    return updateSupabaseAdminCategory(input);
  }

  return updateFileAdminCategory(input);
}

export async function updateAdminCategoryFeatured(
  input: AdminCategoryFeaturedInput,
): Promise<AdminCategoryRecord> {
  if (hasSupabaseAdminConfig()) {
    return updateSupabaseAdminCategoryFeatured(input);
  }

  return updateFileAdminCategoryFeatured(input);
}

export async function getAdminProductById(
  id: string,
): Promise<AdminProductRecord | null> {
  noStore();

  if (hasSupabaseAdminConfig()) {
    return getSupabaseAdminProductById(id, true);
  }

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
    const storedCategories = Array.isArray(parsed)
      ? (parsed as AdminCategoryRecord[]).map((category) => ({
          ...category,
          parentId: category.parentId ?? null,
          isFeatured:
            category.parentSlug || category.parentId
              ? false
              : category.isFeatured ?? initialFeaturedCategorySlugs.has(category.slug),
        }))
      : [];
    const storedSlugs = new Set(storedCategories.map((category) => category.slug));
    const seededTopLevelCategories = Object.values(productCategoryData)
      .filter((category) => !storedSlugs.has(category.slug))
      .map(
        (category): AdminCategoryRecord => ({
          id: `seed-${category.slug}`,
          slug: category.slug,
          name: category.name,
          description: category.description,
          image: category.image,
          isFeatured: category.isFeatured ?? initialFeaturedCategorySlugs.has(category.slug),
          parentId: null,
          createdAt: new Date().toISOString(),
          source: "seed",
        }),
      );
    const seededSubcategories = getSeededSubcategoryRecords().filter(
      (category) => !storedSlugs.has(category.slug),
    );

    return [...storedCategories, ...seededTopLevelCategories, ...seededSubcategories];
  } catch {
    return [
      ...Object.values(productCategoryData).map(
        (category): AdminCategoryRecord => ({
          id: `seed-${category.slug}`,
          slug: category.slug,
          name: category.name,
          description: category.description,
          image: category.image,
          isFeatured: category.isFeatured ?? initialFeaturedCategorySlugs.has(category.slug),
          parentId: null,
          createdAt: new Date().toISOString(),
          source: "seed",
        }),
      ),
      ...getSeededSubcategoryRecords(),
    ];
  }
}

async function getSupabaseAdminProducts(useAdminClient = false): Promise<AdminProductRecord[]> {
  const supabase = useAdminClient
    ? createSupabaseAdminClient()
    : createSupabaseReadClient();
  const { data, error } = await supabase
    .from("products")
    .select(productSelectQuery)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(formatCatalogSchemaError("Unable to load Supabase products", error));
  }

  return (data ?? []).map(mapSupabaseProduct);
}

async function getSupabaseAdminCategories(
  useAdminClient = false,
): Promise<AdminCategoryRecord[]> {
  const supabase = useAdminClient
    ? createSupabaseAdminClient()
    : createSupabaseReadClient();
  const categories = await listSupabaseCategories(supabase);

  return categories.map((category) => mapSupabaseCategory(category, categories));
}

async function getFileAdminProductById(
  id: string,
): Promise<AdminProductRecord | null> {
  const products = await getFileAdminProducts();
  return products.find((product) => product.id === id) ?? null;
}

async function getSupabaseAdminProductById(
  id: string,
  useAdminClient = false,
): Promise<AdminProductRecord | null> {
  const supabase = useAdminClient
    ? createSupabaseAdminClient()
    : createSupabaseReadClient();
  const { data, error } = await supabase
    .from("products")
    .select(productSelectQuery)
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  const product = data as ProductRow | null;

  if (error) {
    throw new Error(formatCatalogSchemaError("Unable to load product", error));
  }

  return product ? mapSupabaseProduct(product) : null;
}

function mapSupabaseProduct(row: ProductRow): AdminProductRecord {
  const categoryRecord = Array.isArray(row.category) ? row.category[0] : row.category;
  const subcategoryRecord = Array.isArray(row.subcategory)
    ? row.subcategory[0]
    : row.subcategory;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug ?? undefined,
    categorySlug: categoryRecord?.slug ?? "",
    category: subcategoryRecord?.name ?? categoryRecord?.name ?? "Uncategorized",
    categoryName: categoryRecord?.name ?? "Uncategorized",
    subcategorySlug: subcategoryRecord?.slug ?? undefined,
    subcategoryName: subcategoryRecord?.name ?? undefined,
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
  const embeddedParent = Array.isArray(row.parent) ? row.parent[0] : row.parent;
  const parentRecord =
    embeddedParent ?? categories.find((category) => category.id === row.parent_id);

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: normalizeCategoryDescription(row.description, row.name),
    image: row.image_url ?? undefined,
    isFeatured: row.parent_id ? false : Boolean(row.is_featured),
    parentId: row.parent_id ?? null,
    parentSlug: parentRecord?.slug,
    parentName: parentRecord?.name,
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
  const childCategories = existingCategories.filter(
    (item) => item.parentId === category.id || item.parentSlug === category.slug,
  );

  if (childCategories.length > 0) {
    throw new Error(
      `Cannot delete this category because ${childCategories.length} subcategor${
        childCategories.length === 1 ? "y is" : "ies are"
      } assigned to it.`,
    );
  }

  const assignedProducts = await getAdminProducts();
  const productCount = assignedProducts.filter(
    (product) =>
      product.categorySlug === category.slug ||
      product.subcategorySlug === category.slug,
  ).length;

  if (productCount > 0) {
    throw new Error(
      `Cannot delete this category because ${productCount} product${
        productCount === 1 ? " is" : "s are"
      } assigned to it.`,
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

  const { count: childCount, error: childCountError } = await supabase
    .from("product_categories")
    .select("id", { count: "exact", head: true })
    .eq("parent_id", id)
    .eq("is_active", true);

  if (childCountError) {
    throw new Error(`Unable to check subcategory usage: ${childCountError.message}`);
  }

  if ((childCount ?? 0) > 0) {
    throw new Error(
      `Cannot delete this category because ${childCount} subcategor${
        childCount === 1 ? "y is" : "ies are"
      } assigned to it.`,
    );
  }

  let productQuery = supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true);
  productQuery = category.parent_id
    ? productQuery.eq("subcategory_id", id)
    : productQuery.eq("category_id", id);
  const { count, error: countError } = await productQuery;

  if (countError) {
    throw new Error(`Unable to check category usage: ${countError.message}`);
  }

  if ((count ?? 0) > 0) {
    throw new Error(
      `Cannot delete this category because ${count} product${
        count === 1 ? " is" : "s are"
      } assigned to it.`,
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
    category: mapSupabaseCategory(
      category,
      await listSupabaseCategories(supabase),
    ),
  };
}

async function resolveFileProductCategorySelection(input: {
  categorySlug: string;
  subcategorySlug?: string;
}) {
  const categories = await getAdminCategories();
  const category = categories.find(
    (item) => item.slug === input.categorySlug && !item.parentSlug && !item.parentId,
  );

  if (!category) {
    throw new Error("Please select a valid general product category.");
  }

  const subcategorySlug = input.subcategorySlug?.trim();
  const subcategory = subcategorySlug
    ? categories.find((item) => item.slug === subcategorySlug)
    : undefined;

  if (subcategorySlug && !subcategory) {
    throw new Error("Please select a valid product subcategory.");
  }

  if (
    subcategory &&
    subcategory.parentSlug !== category.slug &&
    subcategory.parentId !== category.id
  ) {
    throw new Error("The selected subcategory does not belong to the selected category.");
  }

  return { category, subcategory };
}

async function resolveSupabaseProductCategorySelection(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  input: {
    categorySlug: string;
    subcategorySlug?: string;
  },
) {
  const category = await getSupabaseCategoryBySlug(supabase, input.categorySlug);

  if (!category || category.parent_id) {
    throw new Error("Please select a valid general product category.");
  }

  const subcategorySlug = input.subcategorySlug?.trim();
  const subcategory = subcategorySlug
    ? await getSupabaseCategoryBySlug(supabase, subcategorySlug)
    : null;

  if (subcategorySlug && !subcategory) {
    throw new Error("Please select a valid product subcategory.");
  }

  if (subcategory && subcategory.parent_id !== category.id) {
    throw new Error("The selected subcategory does not belong to the selected category.");
  }

  return { category, subcategory };
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
  const { category, subcategory } = await resolveFileProductCategorySelection(input);

  const nextProduct: AdminProductRecord = {
    id: `admin-${Date.now()}`,
    name: input.name.trim(),
    slug: createProductSlug(input.slug?.trim() || input.name),
    categorySlug: category.slug,
    category: subcategory?.name ?? (input.category.trim() || category.name),
    categoryName: category.name,
    subcategorySlug: subcategory?.slug,
    subcategoryName: subcategory?.name,
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
  const { category, subcategory } = await resolveSupabaseProductCategorySelection(
    supabase,
    input,
  );

  const { data: productData, error } = await supabase
    .from("products")
    .insert({
      category_id: category.id,
      subcategory_id: subcategory?.id ?? null,
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
  const parent = await resolveFileCategoryParent(input);

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
    isFeatured: parent ? false : Boolean(input.isFeatured),
    parentId: parent?.id ?? null,
    parentSlug: parent?.slug,
    parentName: parent?.name,
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
  const parent = await resolveSupabaseCategoryParent(supabase, input);

  if (!slug) {
    throw new Error("Please provide a category name or slug.");
  }

  const baseCategoryInput = {
    slug,
    name: input.name.trim(),
    description: normalizeCategoryDescription(input.description, input.name),
    is_featured: parent ? false : Boolean(input.isFeatured),
    parent_id: parent?.id ?? null,
  };
  const legacyBaseCategoryInput = {
    slug: baseCategoryInput.slug,
    name: baseCategoryInput.name,
    description: baseCategoryInput.description,
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

  if (error && isMissingCategoryImageColumnError(error)) {
    const fallbackResult = await supabase
      .from("product_categories")
      .insert(legacyBaseCategoryInput)
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

  return mapSupabaseCategory(
    category,
    await listSupabaseCategories(supabase),
  );
}

async function updateFileAdminCategory(
  input: AdminCategoryUpdateInput,
): Promise<AdminCategoryRecord> {
  const name = input.name.trim();
  const currentSlug = createCategorySlug(input.currentSlug || input.slug || name);

  if (!name || !currentSlug) {
    throw new Error("Category name and current slug are required.");
  }

  const existingAdminCategories = await getFileAdminCategories();
  const parent = await resolveFileCategoryParent(input);
  const categoryIndex = existingAdminCategories.findIndex(
    (category) =>
      (input.id && category.id === input.id) || category.slug === currentSlug,
  );
  const existingSeedCategory = productCategoryData[currentSlug];

  if (categoryIndex === -1 && !existingSeedCategory) {
    throw new Error("Unable to find the selected category.");
  }

  const seedCategory = existingSeedCategory;
  const currentCategory =
    categoryIndex >= 0
      ? existingAdminCategories[categoryIndex]
      : {
          id: input.id || `category-${Date.now()}`,
          slug: currentSlug,
          name: seedCategory!.name,
          description: seedCategory!.description,
          image: seedCategory!.image,
          isFeatured: seedCategory!.isFeatured ?? false,
          createdAt: new Date().toISOString(),
          source: "admin" as const,
        };

  if (parent && parent.slug === currentCategory.slug) {
    throw new Error("A category cannot be its own parent.");
  }

  const childCategories = existingAdminCategories.filter(
    (category) =>
      category.slug !== currentCategory.slug &&
      (category.parentSlug === currentCategory.slug ||
        category.parentId === currentCategory.id),
  );

  if (parent && childCategories.length > 0) {
    throw new Error(
      `Cannot convert this category to a subcategory because ${childCategories.length} subcategor${
        childCategories.length === 1 ? "y is" : "ies are"
      } assigned to it.`,
    );
  }

  const updatedCategory: AdminCategoryRecord = {
    ...currentCategory,
    slug: currentCategory.slug,
    name,
    description: normalizeCategoryDescription(input.description, name),
    image: input.image?.trim() || currentCategory.image,
    isFeatured: parent ? false : Boolean(input.isFeatured),
    parentId: parent?.id ?? null,
    parentSlug: parent?.slug,
    parentName: parent?.name,
    source: currentCategory.source === "seed" ? "seed" : "admin",
  };

  if (categoryIndex >= 0) {
    existingAdminCategories[categoryIndex] = updatedCategory;
  } else {
    existingAdminCategories.unshift(updatedCategory);
  }

  await writeFile(
    adminCategoriesFile,
    JSON.stringify(existingAdminCategories, null, 2),
    "utf8",
  );

  return updatedCategory;
}

async function updateSupabaseAdminCategory(
  input: AdminCategoryUpdateInput,
): Promise<AdminCategoryRecord> {
  if (!input.id) {
    throw new Error("A category id is required to save edits.");
  }

  const name = input.name.trim();

  if (!name) {
    throw new Error("A category name is required.");
  }

  const supabase = createSupabaseAdminClient();
  const existingCategory = await getSupabaseCategoryById(supabase, input.id);
  const parent = await resolveSupabaseCategoryParent(supabase, input);

  if (!existingCategory) {
    throw new Error("Unable to find the selected category.");
  }

  if (parent && parent.id === existingCategory.id) {
    throw new Error("A category cannot be its own parent.");
  }

  if (parent) {
    const { count, error: childCountError } = await supabase
      .from("product_categories")
      .select("id", { count: "exact", head: true })
      .eq("parent_id", existingCategory.id)
      .eq("is_active", true);

    if (childCountError) {
      throw new Error(`Unable to check subcategories: ${childCountError.message}`);
    }

    if ((count ?? 0) > 0) {
      throw new Error(
        `Cannot convert this category to a subcategory because ${count} subcategor${
          count === 1 ? "y is" : "ies are"
        } assigned to it.`,
      );
    }
  }

  const baseCategoryInput = {
    name,
    description: normalizeCategoryDescription(input.description, name),
    is_featured: parent ? false : Boolean(input.isFeatured),
    parent_id: parent?.id ?? null,
  };
  const legacyBaseCategoryInput = {
    name: baseCategoryInput.name,
    description: baseCategoryInput.description,
  };

  const updatePayload = input.image?.trim()
    ? { ...baseCategoryInput, image_url: input.image.trim() }
    : baseCategoryInput;

  const categoryUpdateResult = await supabase
    .from("product_categories")
    .update(updatePayload)
    .eq("id", input.id)
    .eq("is_active", true)
    .select(categorySelectQuery)
    .maybeSingle();

  let data = categoryUpdateResult.data as ProductCategoryRow | null;
  let error = categoryUpdateResult.error;

  if (error && isMissingCategoryImageColumnError(error)) {
    const fallbackResult = await supabase
      .from("product_categories")
      .update(legacyBaseCategoryInput)
      .eq("id", input.id)
      .eq("is_active", true)
      .select(legacyCategorySelectQuery)
      .maybeSingle();

    data = fallbackResult.data as ProductCategoryRow | null;
    error = fallbackResult.error;
  }

  if (error) {
    throw new Error(`Unable to update category: ${error.message}`);
  }

  if (!data) {
    throw new Error("Unable to find the selected category.");
  }

  return mapSupabaseCategory(
    data,
    await listSupabaseCategories(supabase),
  );
}

async function updateFileAdminCategoryFeatured(
  input: AdminCategoryFeaturedInput,
): Promise<AdminCategoryRecord> {
  const currentSlug = createCategorySlug(input.currentSlug ?? "");

  if (!input.id && !currentSlug) {
    throw new Error("A category id or current slug is required.");
  }

  const existingAdminCategories = await getFileAdminCategories();
  const categoryIndex = existingAdminCategories.findIndex(
    (category) =>
      (input.id && category.id === input.id) ||
      (currentSlug && category.slug === currentSlug),
  );
  const existingSeedCategory = currentSlug ? productCategoryData[currentSlug] : null;

  if (categoryIndex === -1 && !existingSeedCategory) {
    throw new Error("Unable to find the selected category.");
  }

  const seedCategory = existingSeedCategory;
  const currentCategory =
    categoryIndex >= 0
      ? existingAdminCategories[categoryIndex]
      : {
          id: input.id || `category-${Date.now()}`,
          slug: currentSlug,
          name: seedCategory!.name,
          description: seedCategory!.description,
          image: seedCategory!.image,
          isFeatured: seedCategory!.isFeatured ?? false,
          createdAt: new Date().toISOString(),
          source: "admin" as const,
        };

  const updatedCategory = {
    ...currentCategory,
    isFeatured:
      currentCategory.parentId || currentCategory.parentSlug ? false : input.isFeatured,
  };

  if (categoryIndex >= 0) {
    existingAdminCategories[categoryIndex] = updatedCategory;
  } else {
    existingAdminCategories.unshift(updatedCategory);
  }

  await writeFile(
    adminCategoriesFile,
    JSON.stringify(existingAdminCategories, null, 2),
    "utf8",
  );

  return updatedCategory;
}

async function updateSupabaseAdminCategoryFeatured(
  input: AdminCategoryFeaturedInput,
): Promise<AdminCategoryRecord> {
  const supabase = createSupabaseAdminClient();
  const existingCategory = input.id
    ? await getSupabaseCategoryById(supabase, input.id)
    : input.currentSlug
      ? await getSupabaseCategoryBySlug(supabase, input.currentSlug)
      : null;
  const query = supabase
    .from("product_categories")
    .update({ is_featured: existingCategory?.parent_id ? false : input.isFeatured })
    .eq("is_active", true);
  const scopedQuery = input.id
    ? query.eq("id", input.id)
    : query.eq("slug", createCategorySlug(input.currentSlug ?? ""));
  const { data, error } = await scopedQuery
    .select(categorySelectQuery)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to update featured status: ${error.message}`);
  }

  if (!data) {
    throw new Error("Unable to find the selected category.");
  }

  return mapSupabaseCategory(
    data as ProductCategoryRow,
    await listSupabaseCategories(supabase),
  );
}

async function updateFileAdminProduct(
  input: AdminProductUpdateInput,
): Promise<AdminProductRecord> {
  const { category, subcategory } = await resolveFileProductCategorySelection(input);

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
    category: subcategory?.name ?? (input.category.trim() || category.name),
    categoryName: category.name,
    subcategorySlug: subcategory?.slug,
    subcategoryName: subcategory?.name,
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
  const { category, subcategory } = await resolveSupabaseProductCategorySelection(
    supabase,
    input,
  );

  const { data: productData, error } = await supabase
    .from("products")
    .update({
      category_id: category.id,
      subcategory_id: subcategory?.id ?? null,
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
    .select("id, slug, name, parent_id")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  const category = data as ProductCategoryRow | null;

  if (error) {
    throw new Error(formatCatalogSchemaError("Unable to load product category", error));
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
    throw new Error(formatCatalogSchemaError("Unable to load product categories", error));
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
    throw new Error(formatCatalogSchemaError("Unable to load category", error));
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
    (error.code === "42703" || error.code === "PGRST204") &&
    combinedMessage.includes("image_url")
  );
}

function formatCatalogSchemaError(
  prefix: string,
  error: {
    code?: string;
    details?: string | null;
    hint?: string | null;
    message?: string;
  },
) {
  const combinedMessage = [error.message, error.details, error.hint]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    (error.code === "42703" || error.code === "PGRST204") &&
    (combinedMessage.includes("parent_id") ||
      combinedMessage.includes("subcategory_id"))
  ) {
    return `${prefix}: the Supabase catalog hierarchy migration has not been applied.`;
  }

  return `${prefix}: ${error.message ?? "Unknown Supabase error."}`;
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
    | "slug"
    | "name"
    | "description"
    | "image"
    | "isFeatured"
    | "parentSlug"
    | "parentName"
  >,
): ProductCategoryPageData {
  return {
    slug: category.slug,
    name: category.name,
    href: category.parentSlug
      ? `/products/${category.parentSlug}/${category.slug}`
      : `/products/${category.slug}`,
    image: categoryImageOverrides[category.slug] || category.image || defaultCategoryImage,
    banner: defaultCategoryBanner,
    title: category.name,
    subtitle: buildCategorySubtitle(category.name),
    description: category.description,
    isFeatured: category.isFeatured,
    parentSlug: category.parentSlug,
    parentName: category.parentName,
    products: [],
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
      {
        ...category,
        isFeatured: category.isFeatured ?? initialFeaturedCategorySlugs.has(slug),
      },
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
        isFeatured: category.parentSlug ? false : category.isFeatured,
        parentSlug: category.parentSlug,
        parentName: category.parentName,
      };
      continue;
    }

    baseCategories[category.slug] = buildDynamicCategoryPageData(category);
  }

  for (const category of Object.values(baseCategories)) {
    category.subcategories = [];
  }

  for (const category of Object.values(baseCategories)) {
    if (!category.parentSlug) {
      continue;
    }

    const parent = baseCategories[category.parentSlug];

    if (parent) {
      parent.subcategories = [...(parent.subcategories ?? []), category].sort(
        (left, right) => left.name.localeCompare(right.name),
      );
    }
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
          ...category.products.map((product) => {
            const seededSubcategory = getSeededSubcategoryForProduct(slug, product);

            return {
              ...product,
              categorySlug: slug,
              categoryName: category.name,
              subcategorySlug: seededSubcategory?.slug,
              subcategoryName: seededSubcategory?.name,
            };
          }),
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
        subcategorySlug: product.subcategorySlug,
        subcategoryName: product.subcategoryName,
      })),
    ),
  );

  for (const category of Object.values(mergedCategories)) {
    category.products = productsWithSlugs.filter(
      (product) => product.categorySlug === category.slug,
    );
  }

  return mergedCategories;
}

export async function getCategoryBySlug(slug: string) {
  const categories = await getMergedCategoryData();
  return categories[slug];
}

export async function getSubcategoryBySlugs(categorySlug: string, subcategorySlug: string) {
  const categories = await getMergedCategoryData();
  const category = categories[categorySlug];
  const subcategory = categories[subcategorySlug];

  if (!category || !subcategory || subcategory.parentSlug !== category.slug) {
    return null;
  }

  return {
    category,
    subcategory: {
      ...subcategory,
      products: category.products.filter(
        (product) => product.subcategorySlug === subcategory.slug,
      ),
    },
  };
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

function productMatchesCatalogFilters<
  TProduct extends ProductItem & { categorySlug: string; categoryName: string },
>(product: TProduct, filters: ProductCatalogFilters) {
  const search = filters.search?.trim().toLowerCase() ?? "";

  if (search) {
    const searchableText = [
      product.name,
      product.category,
      product.categoryName,
      product.brand,
      product.sku,
      product.summary,
      product.description,
      product.price,
      product.stockStatus,
      ...(product.specifications ?? []),
      ...(product.useCases ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (!searchableText.includes(search)) {
      return false;
    }
  }

  if (
    filters.category &&
    product.categorySlug !== filters.category &&
    (product.categoryName || product.category).toLowerCase() !==
      filters.category.toLowerCase()
  ) {
    return false;
  }

  if (
    filters.subcategory &&
    product.subcategorySlug !== filters.subcategory &&
    product.subcategoryName?.toLowerCase() !== filters.subcategory.toLowerCase()
  ) {
    return false;
  }

  if (filters.brand && product.brand?.toLowerCase() !== filters.brand.toLowerCase()) {
    return false;
  }

  if (
    filters.availability &&
    product.stockStatus?.toLowerCase() !== filters.availability.toLowerCase()
  ) {
    return false;
  }

  if (filters.type && product.category.toLowerCase() !== filters.type.toLowerCase()) {
    return false;
  }

  return true;
}

async function getFilePaginatedProducts(
  filters: ProductCatalogFilters,
  page: number,
  pageSize: number,
): Promise<PaginatedProductsResult> {
  const products = await getAllProducts();
  const matchingProducts = products.filter((product) =>
    productMatchesCatalogFilters(product, filters),
  );
  const start = (page - 1) * pageSize;

  return {
    products: matchingProducts.slice(start, start + pageSize) as Array<
      AdminProductRecord & { categoryName: string }
    >,
    totalCount: matchingProducts.length,
  };
}

async function getSupabasePaginatedProducts(
  filters: ProductCatalogFilters,
  page: number,
  pageSize: number,
): Promise<PaginatedProductsResult> {
  const supabase = createSupabaseReadClient();
  let query = supabase
    .from("products")
    .select(productSelectQuery, { count: "exact" })
    .eq("is_active", true);

  if (filters.search) {
    const search = filters.search.trim().replace(/[%_]/g, "\\$&");
    query = query.or(
      [
        `name.ilike.%${search}%`,
        `slug.ilike.%${search}%`,
        `price.ilike.%${search}%`,
        `summary.ilike.%${search}%`,
        `description.ilike.%${search}%`,
        `brand.ilike.%${search}%`,
        `sku.ilike.%${search}%`,
        `stock_status.ilike.%${search}%`,
      ].join(","),
    );
  }

  if (filters.category) {
    const categoryValue = filters.category.trim();
    const categoryField =
      createCategorySlug(categoryValue) === categoryValue
        ? "category.slug"
        : "category.name";
    query = query.eq(categoryField, categoryValue);
  }

  if (filters.subcategory) {
    const subcategoryValue = filters.subcategory.trim();
    const subcategoryField =
      createCategorySlug(subcategoryValue) === subcategoryValue
        ? "subcategory.slug"
        : "subcategory.name";
    query = query.eq(subcategoryField, subcategoryValue);
  }

  if (filters.brand) {
    query = query.eq("brand", filters.brand);
  }

  if (filters.availability) {
    query = query.eq("stock_status", filters.availability);
  }

  if (filters.type) {
    query = query.eq("subcategory.name", filters.type);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Unable to load Supabase products: ${error.message}`);
  }

  return {
    products: ((data ?? []) as ProductRow[]).map((product) => {
      const mappedProduct = mapSupabaseProduct(product);

      return {
        ...mappedProduct,
        categoryName: mappedProduct.category,
      };
    }),
    totalCount: count ?? 0,
  };
}

export async function getPaginatedProducts(
  filters: ProductCatalogFilters,
  page: number,
  pageSize: number,
): Promise<PaginatedProductsResult> {
  noStore();

  if (hasSupabaseReadConfig()) {
    try {
      return await getSupabasePaginatedProducts(filters, page, pageSize);
    } catch (error) {
      console.warn(
        "Falling back to local paginated products because Supabase read failed.",
        error,
      );
    }
  }

  return getFilePaginatedProducts(filters, page, pageSize);
}

function uniqueSorted(values: Array<string | undefined>) {
  return Array.from(
    new Set(
      values
        .map((value) => value?.trim())
        .filter((value): value is string => Boolean(value)),
    ),
  ).sort((left, right) => left.localeCompare(right));
}

export async function getProductFilterOptions(): Promise<ProductFilterOptions> {
  noStore();

  if (hasSupabaseReadConfig()) {
    try {
      const supabase = createSupabaseReadClient();
      const { data, error } = await supabase
        .from("products")
        .select(
          `
            brand,
            stock_status,
            category:product_categories!products_category_id_fkey (
              name
            ),
            subcategory:product_categories!products_subcategory_id_fkey (
              name
            )
          `,
        )
        .eq("is_active", true);

      if (error) {
        throw new Error(error.message);
      }

      const rows = (data ?? []) as Array<{
        brand?: string | null;
        stock_status?: string | null;
        category?: ProductCategoryRow | ProductCategoryRow[] | null;
        subcategory?: ProductCategoryRow | ProductCategoryRow[] | null;
      }>;
      const categoryNames = rows.map((row) => {
        const category = Array.isArray(row.category) ? row.category[0] : row.category;

        return category?.name;
      });
      const productTypeNames = rows.map((row) => {
        const subcategory = Array.isArray(row.subcategory)
          ? row.subcategory[0]
          : row.subcategory;

        return subcategory?.name;
      });

      return {
        categories: uniqueSorted(categoryNames),
        brands: uniqueSorted(rows.map((row) => row.brand ?? undefined)),
        availability: uniqueSorted(
          rows.map((row) => row.stock_status ?? undefined),
        ),
        productTypes: uniqueSorted(productTypeNames),
      };
    } catch (error) {
      console.warn(
        "Falling back to local product filter options because Supabase read failed.",
        error,
      );
    }
  }

  const products = await getAllProducts();

  return {
    categories: uniqueSorted(
      products.map((product) => product.categoryName || product.category),
    ),
    brands: uniqueSorted(products.map((product) => product.brand)),
    availability: uniqueSorted(products.map((product) => product.stockStatus)),
    productTypes: uniqueSorted(
      products.map((product) => product.subcategoryName || product.category),
    ),
  };
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
