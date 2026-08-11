import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const baseUrl = process.env.ADMIN_CRUD_BASE_URL || "http://127.0.0.1:3105";
const username = process.env.ADMIN_USERNAME;
const password = process.env.ADMIN_PASSWORD;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!username || !password || !supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "ADMIN_USERNAME, ADMIN_PASSWORD, NEXT_PUBLIC_SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY are required.",
  );
}

const supabase = createClient(new URL(supabaseUrl).origin, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const stamp = Date.now().toString(36);
const categorySlug = `codex-crud-${stamp}`;
const subcategorySlug = `codex-crud-sub-${stamp}`;
const productSlug = `codex-crud-product-${stamp}`;
const created = {
  category: null,
  subcategory: null,
  product: null,
  imageUrls: [],
};
const result = {};
let cookie = "";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function parseResponse(response) {
  const text = await response.text();
  let body = {};

  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text.slice(0, 300) };
  }

  return { response, body };
}

async function request(path, options = {}) {
  const value = await parseResponse(
    await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: { ...(options.headers || {}), Cookie: cookie },
    }),
  );

  if (!value.response.ok) {
    throw new Error(
      `${options.method || "GET"} ${path} failed (${value.response.status}): ${
        value.body.error || value.body.raw || "Unknown error"
      }`,
    );
  }

  return value.body;
}

function appendFields(form, values) {
  for (const [key, value] of Object.entries(values)) {
    form.append(key, String(value));
  }
}

function storagePathFromPublicUrl(publicUrl) {
  try {
    const marker = "/storage/v1/object/public/product-images/";
    const pathname = new URL(publicUrl).pathname;
    const markerIndex = pathname.indexOf(marker);

    return markerIndex >= 0
      ? decodeURIComponent(pathname.slice(markerIndex + marker.length))
      : null;
  } catch {
    return null;
  }
}

async function cleanup() {
  if (created.product?.id) {
    await supabase.from("products").delete().eq("id", created.product.id);
  }

  if (created.subcategory?.id) {
    await supabase
      .from("product_categories")
      .delete()
      .eq("id", created.subcategory.id);
  }

  if (created.category?.id) {
    await supabase
      .from("product_categories")
      .delete()
      .eq("id", created.category.id);
  }

  const storagePaths = created.imageUrls
    .filter(Boolean)
    .map(storagePathFromPublicUrl)
    .filter(Boolean);

  if (storagePaths.length > 0) {
    await supabase.storage.from("product-images").remove(storagePaths);
  }
}

try {
  const loginResponse = await fetch(`${baseUrl}/api/admin/login`, {
    method: "POST",
    redirect: "manual",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username, password }),
  });
  assert(loginResponse.status === 303, `Admin login returned ${loginResponse.status}`);
  cookie = (loginResponse.headers.get("set-cookie") || "").split(";")[0];
  assert(cookie.includes("amcol_admin_session="), "Admin session cookie was not issued");
  result.login = true;

  const initialCategories = await request("/api/admin/categories");
  assert(
    Array.isArray(initialCategories.categories) && initialCategories.categories.length >= 75,
    "Live categories did not load",
  );
  result.initialCategoryCount = initialCategories.categories.length;

  const imageBytes = await readFile("public/images/red-devil-logo.png");
  const categoryForm = new FormData();
  appendFields(categoryForm, {
    name: "Codex CRUD Category",
    slug: categorySlug,
    description: "Temporary category used to verify the admin workflow.",
    isFeatured: true,
    parentId: "",
    parentSlug: "",
  });
  categoryForm.append(
    "image",
    new Blob([imageBytes], { type: "image/png" }),
    "crud-category.png",
  );
  created.category = (
    await request("/api/admin/categories", { method: "POST", body: categoryForm })
  ).category;
  created.imageUrls.push(created.category.image);
  assert(
    created.category.slug === categorySlug && created.category.isFeatured === true,
    "Created category mapping is incorrect",
  );

  const editCategoryForm = new FormData();
  appendFields(editCategoryForm, {
    id: created.category.id,
    currentSlug: categorySlug,
    name: "Codex CRUD Category Updated",
    slug: categorySlug,
    description: "Updated temporary category.",
    isFeatured: false,
    parentId: "",
    parentSlug: "",
  });
  created.category = (
    await request("/api/admin/categories", { method: "PUT", body: editCategoryForm })
  ).category;
  assert(
    created.category.name.endsWith("Updated") &&
      created.category.isFeatured === false &&
      Boolean(created.category.image),
    "Category update did not preserve mapped fields",
  );
  result.categoryCreateUpdate = true;

  const subcategoryForm = new FormData();
  appendFields(subcategoryForm, {
    name: "Codex CRUD Subcategory",
    slug: subcategorySlug,
    description: "Temporary subcategory.",
    isFeatured: false,
    parentId: created.category.id,
    parentSlug: categorySlug,
  });
  created.subcategory = (
    await request("/api/admin/categories", {
      method: "POST",
      body: subcategoryForm,
    })
  ).category;
  assert(
    created.subcategory.parentId === created.category.id &&
      created.subcategory.parentSlug === categorySlug,
    "Subcategory hierarchy mapping is incorrect",
  );
  result.subcategoryCreate = true;

  const productForm = new FormData();
  appendFields(productForm, {
    name: "Codex CRUD Product",
    slug: productSlug,
    categorySlug,
    subcategorySlug,
    category: created.category.name,
    price: "TT$ 1.00",
    summary: "Temporary product",
    description: "Temporary product used to verify admin CRUD.",
    brand: "AMCOL Test",
    sku: `TEST-${stamp}`,
    unit: "Each",
    stockStatus: "In stock",
    imageAlt: "Temporary CRUD product",
    galleryImages: "",
    specifications: "Temporary: true",
    featured: true,
  });
  productForm.append(
    "image",
    new Blob([imageBytes], { type: "image/png" }),
    "crud-product.png",
  );
  created.product = (
    await request("/api/admin/products", { method: "POST", body: productForm })
  ).product;
  created.imageUrls.push(created.product.image);
  assert(
    created.product.categorySlug === categorySlug &&
      created.product.subcategorySlug === subcategorySlug &&
      created.product.featured === true,
    "Created product mapping is incorrect",
  );

  const editProductForm = new FormData();
  appendFields(editProductForm, {
    id: created.product.id,
    name: "Codex CRUD Product Updated",
    slug: productSlug,
    categorySlug,
    subcategorySlug,
    category: created.category.name,
    price: "TT$ 2.00",
    summary: "Updated temporary product",
    description: "Updated temporary product.",
    brand: "AMCOL Test",
    sku: `TEST-${stamp}`,
    unit: "Case",
    stockStatus: "Low stock",
    imageAlt: "Updated CRUD product",
    galleryImages: "",
    specifications: "Temporary: true\nUpdated: true",
    featured: false,
  });
  created.product = (
    await request("/api/admin/products", { method: "PUT", body: editProductForm })
  ).product;
  assert(
    created.product.price === "TT$ 2.00" &&
      created.product.stockStatus === "Low stock" &&
      created.product.unit === "Case" &&
      !created.product.featured,
    "Product update mapping is incorrect",
  );
  result.productCreateUpdate = true;

  const productPage = await fetch(`${baseUrl}/products/${productSlug}`);
  const productHtml = await productPage.text();
  assert(
    productPage.ok && productHtml.includes("Codex CRUD Product Updated"),
    `Public product page failed (${productPage.status})`,
  );
  const subcategoryPage = await fetch(
    `${baseUrl}/products/${categorySlug}/${subcategorySlug}`,
  );
  const subcategoryHtml = await subcategoryPage.text();
  assert(
    subcategoryPage.ok && subcategoryHtml.includes("Codex CRUD Product Updated"),
    `Public subcategory page failed (${subcategoryPage.status})`,
  );
  result.publicPages = true;

  const blockedDelete = await parseResponse(
    await fetch(`${baseUrl}/api/admin/categories`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({ id: created.subcategory.id }),
    }),
  );
  assert(
    !blockedDelete.response.ok &&
      String(blockedDelete.body.error || "").includes("product"),
    "Assigned subcategory deletion was not blocked",
  );
  result.dependencyGuard = true;

  await request("/api/admin/products", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: created.product.id }),
  });
  await request("/api/admin/categories", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: created.subcategory.id }),
  });
  await request("/api/admin/categories", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: created.category.id }),
  });

  const finalProducts = await request("/api/admin/products");
  const finalCategories = await request("/api/admin/categories");
  assert(
    !finalProducts.products.some((item) => item.id === created.product.id),
    "Deleted product still appears in admin data",
  );
  assert(
    !finalCategories.categories.some(
      (item) => item.id === created.category.id || item.id === created.subcategory.id,
    ),
    "Deleted categories still appear in admin data",
  );
  result.deleteAndRefresh = true;
  result.success = true;
} finally {
  await cleanup();
}

console.log(JSON.stringify(result));
