"use client";

import Image from "next/image";
import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";
import { productCategoryData } from "@/lib/product-categories";

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
  slug: string;
  name: string;
};

type DashboardResponse = {
  products: DashboardProduct[];
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

export default function AdminDashboardPage() {
  const [categories, setCategories] = useState<CategoryOption[]>(fallbackCategories);
  const [products, setProducts] = useState<DashboardProduct[]>([]);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const response = await fetch("/api/admin/products");
        const data = (await response.json()) as DashboardResponse;

        if (!response.ok) {
          throw new Error("Unable to load dashboard data.");
        }

        if (!isMounted) {
          return;
        }

        setProducts(data.products ?? []);

        if (Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories);
          setForm((current) => ({
            ...current,
            categorySlug:
              data.categories.some((category) => category.slug === current.categorySlug)
                ? current.categorySlug
                : data.categories[0].slug,
          }));
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

  const selectedCategoryName =
    categories.find((category) => category.slug === form.categorySlug)?.name ?? "";

  const handleChange = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm((current) => ({
      ...initialFormState,
      categorySlug: current.categorySlug || defaultCategorySlug,
    }));
    setSelectedImage(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!selectedImage) {
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
      payload.append("image", selectedImage);

      const response = await fetch("/api/admin/products", {
        method: "POST",
        body: payload,
      });

      const data = (await response.json()) as
        | { product: DashboardProduct }
        | { error: string };

      if (!response.ok || !("product" in data)) {
        throw new Error("error" in data ? data.error : "Unable to save product.");
      }

      setProducts((current) => [data.product, ...current]);
      resetForm();
      setSuccessMessage("Product saved successfully and added to the catalog.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save product.",
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
                Upload and publish products from the website
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
                This dashboard gives your client a simple way to add product images,
                descriptions, pricing, and key sales details without touching code.
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
                Admin uploads
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
                Upload form
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                Add a new catalog product
              </h2>
              <p className="text-sm leading-6 text-slate-600 sm:text-base">
                Fill out the fields below and upload a product image. New entries are
                saved to Supabase and can be shown immediately on the website catalog.
              </p>
            </div>

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
                    required
                  />
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
                  {isSubmitting ? "Saving product..." : "Save product"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                >
                  Reset form
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-8">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.35)] sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-700">
                Live preview
              </p>
              <div className="mt-5 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fbfd_0%,#eef6fb_100%)]">
                <div className="relative flex h-64 items-center justify-center border-b border-slate-200 bg-white">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
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

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.35)] sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-700">
                    Recent uploads
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                    Admin-added products
                  </h2>
                </div>
                {isLoading ? (
                  <span className="text-sm text-slate-500">Loading...</span>
                ) : null}
              </div>

              <div className="mt-6 space-y-4">
                {products.length === 0 && !isLoading ? (
                  <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm leading-6 text-slate-500">
                    No admin uploads yet. The first product you save will appear here.
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
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-800">
                          {product.category}
                        </span>
                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600">
                          {product.stockStatus || "Status pending"}
                        </span>
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
