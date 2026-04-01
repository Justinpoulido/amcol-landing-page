"use client";

import Image from "next/image";
import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";
import { productCategoryData } from "@/lib/product-categories";
import { createCategorySlug } from "@/lib/catalog-utils";

type DashboardProduct = {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  price: string;
  description: string;
  brand?: string;
  sku?: string;
  unit?: string;
  stockStatus?: string;
  image: string;
  imageAlt?: string;
  featured?: boolean;
  createdAt: string;
};

type CategoryOption = {
  id?: string;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  source?: "seed" | "admin";
};

type DashboardResponse = {
  products: DashboardProduct[];
  categories: CategoryOption[];
};

type CategoryResponse = {
  category: CategoryOption;
};

type CategoriesResponse = {
  categories: CategoryOption[];
};

type FormState = {
  name: string;
  categorySlug: string;
  price: string;
  description: string;
  brand: string;
  sku: string;
  unit: string;
  stockStatus: string;
  imageAlt: string;
  featured: boolean;
};

type CategoryFormState = {
  name: string;
  slug: string;
  description: string;
};

const fallbackCategories = Object.values(productCategoryData).map((category) => ({
  slug: category.slug,
  name: category.name,
}));

const defaultCategorySlug = fallbackCategories[0]?.slug ?? "";

const initialFormState: FormState = {
  name: "",
  categorySlug: defaultCategorySlug,
  price: "",
  description: "",
  brand: "",
  sku: "",
  unit: "",
  stockStatus: "In stock",
  imageAlt: "",
  featured: false,
};

const initialCategoryFormState: CategoryFormState = {
  name: "",
  slug: "",
  description: "",
};

export default function AdminDashboardPage() {
  const [categories, setCategories] = useState<CategoryOption[]>(fallbackCategories);
  const [products, setProducts] = useState<DashboardProduct[]>([]);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>(
    initialCategoryFormState,
  );
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedCategoryImage, setSelectedCategoryImage] = useState<File | null>(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [isCategoryListOpen, setIsCategoryListOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [categoryErrorMessage, setCategoryErrorMessage] = useState("");
  const [categorySuccessMessage, setCategorySuccessMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/admin/categories"),
        ]);
        const data = (await productsResponse.json()) as DashboardResponse;
        const categoryData = (await categoriesResponse.json()) as CategoriesResponse;

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error("Unable to load dashboard data.");
        }

        if (!isMounted) {
          return;
        }

        setProducts(data.products ?? []);

        if (Array.isArray(categoryData.categories) && categoryData.categories.length > 0) {
          setCategories(categoryData.categories);
          setForm((current) => ({
            ...current,
            categorySlug:
              categoryData.categories.some(
                (category) => category.slug === current.categorySlug,
              )
                ? current.categorySlug
                : categoryData.categories[0].slug,
          }));
        } else if (Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error instanceof Error ? error.message : "Unable to load dashboard data.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedImage) {
      setImagePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(selectedImage);
    setImagePreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [selectedImage]);

  useEffect(() => {
    if (!selectedCategoryImage) {
      setCategoryImagePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(selectedCategoryImage);
    setCategoryImagePreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [selectedCategoryImage]);

  const selectedCategoryName =
    categories.find((category) => category.slug === form.categorySlug)?.name ?? "";
  const editingProduct =
    products.find((product) => product.id === editingProductId) ?? null;
  const isEditMode = Boolean(editingProduct);
  const previewImageSrc = imagePreview || editingProduct?.image || "";

  const handleChange = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleCategoryChange = <K extends keyof CategoryFormState>(
    field: K,
    value: CategoryFormState[K],
  ) => {
    setCategoryForm((current) => {
      if (field === "name") {
        const nextName = String(value);
        const previousDerivedSlug = createCategorySlug(current.name);
        const nextDerivedSlug = createCategorySlug(nextName);
        const shouldSyncSlug = !current.slug || current.slug === previousDerivedSlug;

        return {
          ...current,
          name: nextName,
          slug: shouldSyncSlug ? nextDerivedSlug : current.slug,
        };
      }

      return { ...current, [field]: value };
    });
  };

  const resetForm = () => {
    setForm((current) => ({
      ...initialFormState,
      categorySlug: current.categorySlug || defaultCategorySlug,
    }));
    setSelectedImage(null);
    setEditingProductId(null);
  };

  const startEditingProduct = (product: DashboardProduct) => {
    setErrorMessage("");
    setSuccessMessage("");
    setEditingProductId(product.id);
    setSelectedImage(null);
    setForm({
      name: product.name,
      categorySlug: product.categorySlug,
      price: product.price,
      description: product.description,
      brand: product.brand ?? "",
      sku: product.sku ?? "",
      unit: product.unit ?? "",
      stockStatus: product.stockStatus ?? "In stock",
      imageAlt: product.imageAlt ?? "",
      featured: Boolean(product.featured),
    });
  };

  const resetCategoryForm = () => {
    setCategoryForm(initialCategoryFormState);
    setSelectedCategoryImage(null);
  };

  const handleDeleteCategory = async (category: CategoryOption) => {
    if (!category.id) {
      return;
    }

    setCategoryErrorMessage("");
    setCategorySuccessMessage("");
    setDeletingCategoryId(category.id);

    try {
      const response = await fetch("/api/admin/categories", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: category.id }),
      });

      const data = (await response.json()) as CategoryResponse | { error: string };

      if (!response.ok || !("category" in data)) {
        throw new Error(
          "error" in data ? data.error : "Unable to delete category.",
        );
      }

      const remainingCategories = categories.filter(
        (current) => current.id !== category.id,
      );

      setCategories(remainingCategories);
      setForm((current) => ({
        ...current,
        categorySlug:
          current.categorySlug === category.slug
            ? remainingCategories[0]?.slug ?? defaultCategorySlug
            : current.categorySlug,
      }));
      setCategorySuccessMessage(`${category.name} was deleted successfully.`);
    } catch (error) {
      setCategoryErrorMessage(
        error instanceof Error ? error.message : "Unable to delete category.",
      );
    } finally {
      setDeletingCategoryId(null);
    }
  };

  const handleCategorySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCategoryErrorMessage("");
    setCategorySuccessMessage("");
    setIsCategorySubmitting(true);

    try {
      const payload = new FormData();
      payload.append("name", categoryForm.name);
      payload.append("slug", categoryForm.slug);
      payload.append("description", categoryForm.description);
      if (selectedCategoryImage) {
        payload.append("image", selectedCategoryImage);
      }

      const response = await fetch("/api/admin/categories", {
        method: "POST",
        body: payload,
      });

      const data = (await response.json()) as CategoryResponse | { error: string };

      if (!response.ok || !("category" in data)) {
        throw new Error(
          "error" in data ? data.error : "Unable to create category.",
        );
      }

      setCategories((current) =>
        [...current, data.category].sort((left, right) =>
          left.name.localeCompare(right.name),
        ),
      );
      setForm((current) => ({
        ...current,
        categorySlug: data.category.slug,
      }));
      resetCategoryForm();
      setCategorySuccessMessage(
        `${data.category.name} was created and is ready for new products.`,
      );
    } catch (error) {
      setCategoryErrorMessage(
        error instanceof Error ? error.message : "Unable to create category.",
      );
    } finally {
      setIsCategorySubmitting(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!isEditMode && !selectedImage) {
      setErrorMessage("Please select a product image before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("name", form.name);
      payload.append("categorySlug", form.categorySlug);
      payload.append("category", selectedCategoryName);
      payload.append("price", form.price);
      payload.append("description", form.description);
      payload.append("brand", form.brand);
      payload.append("sku", form.sku);
      payload.append("unit", form.unit);
      payload.append("stockStatus", form.stockStatus);
      payload.append("imageAlt", form.imageAlt);
      payload.append("featured", String(form.featured));
      if (isEditMode && editingProduct) {
        payload.append("id", editingProduct.id);
      }
      if (selectedImage) {
        payload.append("image", selectedImage);
      }

      const response = await fetch("/api/admin/products", {
        method: isEditMode ? "PUT" : "POST",
        body: payload,
      });

      const data = (await response.json()) as
        | { product: DashboardProduct }
        | { error: string };

      if (!response.ok || !("product" in data)) {
        throw new Error(
          "error" in data
            ? data.error
            : isEditMode
              ? "Unable to update product."
              : "Unable to save product.",
        );
      }

      setProducts((current) =>
        isEditMode
          ? current.map((product) =>
              product.id === data.product.id ? data.product : product,
            )
          : [data.product, ...current],
      );
      resetForm();
      setSuccessMessage(
        isEditMode
          ? "Product details updated successfully."
          : "Product saved successfully and added to the catalog.",
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : isEditMode
            ? "Unable to update product."
            : "Unable to save product.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef4f7_0%,#f8fbfd_26%,#ffffff_100%)] text-slate-950">
      <section className="relative overflow-hidden bg-[#0b1c2d] px-6 py-16 sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(248,113,113,0.22),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100">
                Product Admin
              </p>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Create and edit catalog products from the website
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
                This dashboard gives your client a simple way to add products, revise
                existing details, replace images, and keep the public catalog current
                without touching code.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/16"
              >
                View products page
              </Link>
              <Link
                href="/"
                className="inline-flex items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/16"
              >
                Back to homepage
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 px-5 py-5 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
                Categories
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">{categories.length}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 px-5 py-5 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
                Catalog entries
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">{products.length}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 px-5 py-5 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
                Storage target
              </p>
              <p className="mt-3 text-sm font-medium text-cyan-100">
                `Supabase Storage / product-images`
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10 lg:py-14">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.35)] sm:p-8">
            <div className="flex flex-col gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-700">
                Product form
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                {isEditMode ? "Edit product details" : "Add a new catalog product"}
              </h2>
              <p className="text-sm leading-6 text-slate-600 sm:text-base">
                {isEditMode
                  ? "Update the fields below to revise pricing, copy, category placement, or imagery for the selected product."
                  : "Fill out the fields below and upload a product image. New entries are saved to Supabase and can be shown immediately on the website catalog."}
              </p>
            </div>

            {isEditMode && editingProduct ? (
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-cyan-200 bg-cyan-50 px-5 py-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-700">
                    Editing now
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {editingProduct.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center rounded-full border border-cyan-300 bg-white px-4 py-2 text-sm font-semibold text-cyan-800 transition hover:border-cyan-400 hover:text-cyan-900"
                >
                  Cancel editing
                </button>
              </div>
            ) : null}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-800">Product name</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) => handleChange("name", event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                    placeholder="WD-40 Specialist Contact Cleaner"
                    required
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-800">Category</span>
                  <select
                    value={form.categorySlug}
                    onChange={(event) => handleChange("categorySlug", event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category.slug} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-800">Price</span>
                  <input
                    type="text"
                    value={form.price}
                    onChange={(event) => handleChange("price", event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                    placeholder="$125.00 or Call for quote"
                    required
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-800">Stock status</span>
                  <select
                    value={form.stockStatus}
                    onChange={(event) => handleChange("stockStatus", event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                  >
                    <option>In stock</option>
                    <option>Low stock</option>
                    <option>Available on request</option>
                    <option>Call for availability</option>
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-800">Brand</span>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(event) => handleChange("brand", event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                    placeholder="WD-40"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-800">SKU</span>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(event) => handleChange("sku", event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                    placeholder="AMCOL-00124"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-800">Unit</span>
                  <input
                    type="text"
                    value={form.unit}
                    onChange={(event) => handleChange("unit", event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                    placeholder="Each, case, gallon, kit"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-800">Image alt text</span>
                  <input
                    type="text"
                    value={form.imageAlt}
                    onChange={(event) => handleChange("imageAlt", event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                    placeholder="Product photo alt text"
                  />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-800">Description</span>
                <textarea
                  value={form.description}
                  onChange={(event) => handleChange("description", event.target.value)}
                  className="min-h-36 w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                  placeholder="Add a short sales description, product usage notes, or key specs."
                  required
                />
              </label>

              <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-800">Product image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      setSelectedImage(event.target.files?.[0] ?? null)
                    }
                    className="block w-full rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                    required={!isEditMode}
                  />
                  <p className="text-xs leading-5 text-slate-500">
                    {isEditMode
                      ? "Leave this empty to keep the current image, or choose a new file to replace it."
                      : "Upload a product image for the catalog card and product listings."}
                  </p>
                </label>

                <label className="flex items-center gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) => handleChange("featured", event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                  />
                  Mark as featured
                </label>
              </div>

              {errorMessage ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              ) : null}

              {successMessage ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {successMessage}
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isSubmitting
                    ? isEditMode
                      ? "Saving changes..."
                      : "Saving product..."
                    : isEditMode
                      ? "Save changes"
                      : "Save product"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                >
                  {isEditMode ? "Clear edit mode" : "Reset form"}
                </button>
              </div>
            </form>
          </div>

          <div className="flex flex-col gap-8">
            <div className="order-3 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.35)] sm:p-8">
              <div className="flex flex-col gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-700">
                  Category form
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  Add a new category
                </h2>
                <p className="text-sm leading-6 text-slate-600">
                  Create a category first, then assign products to it from the product form.
                  New categories are available immediately in the admin dropdown and on the
                  public catalog route.
                </p>
              </div>

              <form className="mt-6 space-y-5" onSubmit={handleCategorySubmit}>
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-800">Category name</span>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(event) => handleCategoryChange("name", event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                    placeholder="Fasteners"
                    required
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-800">Slug</span>
                  <input
                    type="text"
                    value={categoryForm.slug}
                    onChange={(event) => handleCategoryChange("slug", event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                    placeholder="fasteners"
                  />
                  <p className="text-xs leading-5 text-slate-500">
                    Lowercase letters, numbers, and hyphens work best. It auto-fills from the name.
                  </p>
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-800">Description</span>
                  <textarea
                    value={categoryForm.description}
                    onChange={(event) =>
                      handleCategoryChange("description", event.target.value)
                    }
                    className="min-h-28 w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                    placeholder="Describe the products or industrial use cases this category will cover."
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-800">Category image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      setSelectedCategoryImage(event.target.files?.[0] ?? null)
                    }
                    className="block w-full rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                  />
                  <p className="text-xs leading-5 text-slate-500">
                    Optional. This image will be used on the category card and category page.
                  </p>
                </label>

                <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fbfd_0%,#eef6fb_100%)]">
                  <div className="relative flex h-52 items-center justify-center border-b border-slate-200 bg-white">
                    {categoryImagePreview ? (
                      <Image
                        src={categoryImagePreview}
                        alt={categoryForm.name || "Category image preview"}
                        fill
                        unoptimized
                        sizes="(min-width: 1280px) 30vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="px-8 text-center text-sm leading-6 text-slate-500">
                        Upload a category image to preview how this category card will appear.
                      </div>
                    )}
                  </div>
                  <div className="space-y-3 p-5">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-700">
                      Category preview
                    </span>
                    <p className="text-lg font-semibold text-slate-950">
                      {categoryForm.name || "Category title"}
                    </p>
                    <p className="text-sm leading-6 text-slate-600">
                      {categoryForm.description ||
                        "Your category description will appear on the category page once it is created."}
                    </p>
                  </div>
                </div>

                {categoryErrorMessage ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {categoryErrorMessage}
                  </div>
                ) : null}

                {categorySuccessMessage ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {categorySuccessMessage}
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={isCategorySubmitting}
                    className="inline-flex items-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {isCategorySubmitting ? "Creating category..." : "Create category"}
                  </button>
                  <button
                    type="button"
                    onClick={resetCategoryForm}
                    className="inline-flex items-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                  >
                    Reset category form
                  </button>
                </div>
              </form>
            </div>

            <div className="order-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.35)] sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-700">
                    Category list
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                    Manage categories
                  </h2>
                </div>
                {isLoading ? <span className="text-sm text-slate-500">Loading...</span> : null}
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setIsCategoryListOpen((current) => !current)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {categories.length} categor{categories.length === 1 ? "y" : "ies"}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Expand to review, manage, and delete admin-created categories.
                    </p>
                  </div>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-700">
                    {isCategoryListOpen ? "−" : "+"}
                  </span>
                </button>

                {isCategoryListOpen ? (
                  <div className="border-t border-slate-200 px-4 py-4">
                    <div className="max-h-[28rem] space-y-4 overflow-y-auto pr-1">
                      {categories.map((category) => {
                        const productCount = products.filter(
                          (product) => product.categorySlug === category.slug,
                        ).length;
                        const isSeededCategory = category.source === "seed";
                        const isDeleteDisabled =
                          isSeededCategory || productCount > 0 || !category.id;

                        return (
                          <article
                            key={category.slug}
                            className="rounded-[1.5rem] border border-slate-200 bg-white p-4"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-800">
                                    {category.name}
                                  </span>
                                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600">
                                    {category.source === "seed" ? "Seeded" : "Admin"}
                                  </span>
                                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600">
                                    {productCount} product{productCount === 1 ? "" : "s"}
                                  </span>
                                </div>
                                <p className="mt-3 text-sm font-medium text-slate-800">
                                  Slug: {category.slug}
                                </p>
                                {category.description ? (
                                  <p className="mt-2 text-sm leading-6 text-slate-600">
                                    {category.description}
                                  </p>
                                ) : null}
                              </div>

                              <button
                                type="button"
                                disabled={isDeleteDisabled || deletingCategoryId === category.id}
                                onClick={() => handleDeleteCategory(category)}
                                className="inline-flex items-center rounded-full border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:border-red-400 hover:text-red-800 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                              >
                                {deletingCategoryId === category.id
                                  ? "Deleting..."
                                  : "Delete category"}
                              </button>
                            </div>

                            {isSeededCategory ? (
                              <p className="mt-3 text-xs leading-5 text-slate-500">
                                Seeded categories are part of the base catalog and can’t be deleted from the portal.
                              </p>
                            ) : null}

                            {!isSeededCategory && productCount > 0 ? (
                              <p className="mt-3 text-xs leading-5 text-slate-500">
                                Move or delete the products in this category before deleting it.
                              </p>
                            ) : null}
                          </article>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="order-1 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.35)] sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-700">
                Live preview
              </p>
              <div className="mt-5 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fbfd_0%,#eef6fb_100%)]">
                <div className="relative flex h-64 items-center justify-center border-b border-slate-200 bg-white">
                  {previewImageSrc ? (
                    <Image
                      src={previewImageSrc}
                      alt={form.imageAlt || form.name || "Selected product preview"}
                      fill
                      unoptimized
                      sizes="(min-width: 1280px) 30vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="px-8 text-center text-sm leading-6 text-slate-500">
                      Upload a product image to preview how the card will feel in the
                      catalog.
                    </div>
                  )}
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-800">
                      {selectedCategoryName || "Category"}
                    </span>
                    {form.featured ? (
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700">
                        Featured
                      </span>
                    ) : null}
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-950">
                      {form.name || "Product title preview"}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {form.description ||
                        "Your product description will appear here so the client can review tone and length before publishing."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="rounded-full bg-slate-900 px-3 py-1.5 font-semibold text-white">
                      {form.price || "Price"}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-700">
                      {form.stockStatus}
                    </span>
                  </div>

                  <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                    <p>Brand: {form.brand || "Not set"}</p>
                    <p>SKU: {form.sku || "Not set"}</p>
                    <p>Unit: {form.unit || "Not set"}</p>
                    <p>Alt text: {form.imageAlt || "Uses product name by default"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-2 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.35)] sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-700">
                    Product list
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                    Catalog products
                  </h2>
                </div>
                {isLoading ? (
                  <span className="text-sm text-slate-500">Loading...</span>
                ) : null}
              </div>

              <div className="mt-6 space-y-4">
                {products.length === 0 && !isLoading ? (
                  <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm leading-6 text-slate-500">
                    No products available yet. The first product you save will appear here.
                  </div>
                ) : null}

                {products.map((product) => (
                  <article
                    key={product.id}
                    className="flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 sm:flex-row"
                  >
                    <div className="relative h-28 w-full overflow-hidden rounded-[1.25rem] bg-white sm:w-32">
                      <Image
                        src={product.image}
                        alt={product.imageAlt || product.name}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-800">
                            {product.category}
                          </span>
                          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600">
                            {product.stockStatus || "Status pending"}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => startEditingProduct(product)}
                          className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
                        >
                          Edit details
                        </button>
                      </div>

                      <h3 className="mt-3 text-lg font-semibold text-slate-950">
                        {product.name}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {product.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
                        <span className="font-semibold text-slate-900">{product.price}</span>
                        {product.brand ? <span>Brand: {product.brand}</span> : null}
                        {product.sku ? <span>SKU: {product.sku}</span> : null}
                        {product.unit ? <span>Unit: {product.unit}</span> : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
