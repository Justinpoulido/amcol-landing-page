"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createCategorySlug, createProductSlug } from "@/lib/catalog-utils";
import { productCategoryData } from "@/lib/product-categories";

type DashboardProduct = {
  id: string;
  slug?: string;
  name: string;
  category: string;
  categorySlug: string;
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

type ProductResponse = { product: DashboardProduct } | { error: string };
type CategoryResponse = { category: CategoryOption } | { error: string };
type CategoriesResponse = { categories: CategoryOption[] };
type AdminSection = "dashboard" | "products" | "categories" | "media";

type GalleryUploadPreview = {
  id: string;
  file: File;
  previewUrl: string;
};

type FormState = {
  name: string;
  slug: string;
  categorySlug: string;
  price: string;
  summary: string;
  description: string;
  brand: string;
  sku: string;
  unit: string;
  stockStatus: string;
  imageAlt: string;
  galleryImages: string;
  specifications: string;
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
  description: category.description,
  source: "seed" as const,
}));

const defaultCategorySlug = fallbackCategories[0]?.slug ?? "";

const initialFormState: FormState = {
  name: "",
  slug: "",
  categorySlug: defaultCategorySlug,
  price: "",
  summary: "",
  description: "",
  brand: "",
  sku: "",
  unit: "",
  stockStatus: "In stock",
  imageAlt: "",
  galleryImages: "",
  specifications: "",
  featured: false,
};

const initialCategoryFormState: CategoryFormState = {
  name: "",
  slug: "",
  description: "",
};

const sections: { id: AdminSection; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "products", label: "Products" },
  { id: "categories", label: "Categories" },
  { id: "media", label: "Media" },
];

function splitGalleryImages(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

async function readJsonResponse<T>(response: Response, fallbackMessage: string) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  const text = await response.text();
  const htmlTitle = text.match(/<title>(.*?)<\/title>/i)?.[1];
  const detail = htmlTitle || text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

  throw new Error(
    detail ? `${fallbackMessage} Server returned: ${detail}` : fallbackMessage,
  );
}

export default function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState<AdminSection>("products");
  const [categories, setCategories] = useState<CategoryOption[]>(fallbackCategories);
  const [products, setProducts] = useState<DashboardProduct[]>([]);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>(
    initialCategoryFormState,
  );
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [currentGalleryImages, setCurrentGalleryImages] = useState<string[]>([]);
  const [selectedGalleryImages, setSelectedGalleryImages] = useState<
    GalleryUploadPreview[]
  >([]);
  const [selectedCategoryImage, setSelectedCategoryImage] = useState<File | null>(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
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

        if (!productsResponse.ok) {
          await readJsonResponse<{ error?: string }>(
            productsResponse,
            "Unable to load products.",
          );
          throw new Error("Unable to load products.");
        }

        if (!categoriesResponse.ok) {
          await readJsonResponse<{ error?: string }>(
            categoriesResponse,
            "Unable to load categories.",
          );
          throw new Error("Unable to load categories.");
        }

        const productData = await readJsonResponse<DashboardResponse>(
          productsResponse,
          "Unable to load products.",
        );
        const categoryData = await readJsonResponse<CategoriesResponse>(
          categoriesResponse,
          "Unable to load categories.",
        );

        if (!isMounted) {
          return;
        }

        setProducts(productData.products ?? []);

        const nextCategories =
          Array.isArray(categoryData.categories) && categoryData.categories.length > 0
            ? categoryData.categories
            : productData.categories;

        if (Array.isArray(nextCategories) && nextCategories.length > 0) {
          setCategories(nextCategories);
          setForm((current) => ({
            ...current,
            categorySlug: nextCategories.some(
              (category) => category.slug === current.categorySlug,
            )
              ? current.categorySlug
              : nextCategories[0].slug,
          }));
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error ? error.message : "Unable to load admin data.",
          );
        }
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

    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedImage]);

  useEffect(() => {
    if (!selectedCategoryImage) {
      setCategoryImagePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(selectedCategoryImage);
    setCategoryImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedCategoryImage]);

  const editingProduct =
    products.find((product) => product.id === editingProductId) ?? null;
  const isEditMode = Boolean(editingProduct);
  const selectedCategoryName =
    categories.find((category) => category.slug === form.categorySlug)?.name ?? "";
  const previewImageSrc = imagePreview || currentImageUrl;
  const galleryImagePreviews = [
    ...currentGalleryImages.map((url) => ({
      id: url,
      src: url,
      label: "Saved gallery image",
      kind: "saved" as const,
    })),
    ...splitGalleryImages(form.galleryImages).map((url) => ({
      id: url,
      src: url,
      label: "Gallery image URL",
      kind: "manual" as const,
    })),
    ...selectedGalleryImages.map((image) => ({
      id: image.id,
      src: image.previewUrl,
      label: image.file.name,
      kind: "upload" as const,
    })),
  ];
  const activeProducts = products.filter(
    (product) => (product.stockStatus || "In stock") === "In stock",
  ).length;
  const missingImageCount = products.filter((product) => !product.image).length;

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) =>
      [
        product.name,
        product.slug,
        product.category,
        product.price,
        product.stockStatus,
        product.brand,
        product.sku,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [products, searchQuery]);

  const handleChange = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => {
      if (field === "name") {
        const nextName = String(value);
        const previousDerivedSlug = createProductSlug(current.name);
        const shouldSyncSlug = !current.slug || current.slug === previousDerivedSlug;

        return {
          ...current,
          name: nextName,
          slug: shouldSyncSlug ? createProductSlug(nextName) : current.slug,
        };
      }

      if (field === "slug") {
        return { ...current, slug: createProductSlug(String(value)) };
      }

      return { ...current, [field]: value };
    });
  };

  const handleCategoryChange = <K extends keyof CategoryFormState>(
    field: K,
    value: CategoryFormState[K],
  ) => {
    setCategoryForm((current) => {
      if (field === "name") {
        const nextName = String(value);
        const previousDerivedSlug = createCategorySlug(current.name);
        const shouldSyncSlug = !current.slug || current.slug === previousDerivedSlug;

        return {
          ...current,
          name: nextName,
          slug: shouldSyncSlug ? createCategorySlug(nextName) : current.slug,
        };
      }

      if (field === "slug") {
        return { ...current, slug: createCategorySlug(String(value)) };
      }

      return { ...current, [field]: value };
    });
  };

  const resetProductForm = () => {
    selectedGalleryImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    setForm((current) => ({
      ...initialFormState,
      categorySlug: current.categorySlug || categories[0]?.slug || defaultCategorySlug,
    }));
    setEditingProductId(null);
    setSelectedImage(null);
    setCurrentImageUrl("");
    setCurrentGalleryImages([]);
    setSelectedGalleryImages([]);
    setErrorMessage("");
  };

  const openAddProduct = () => {
    resetProductForm();
    setIsDrawerOpen(true);
    setActiveSection("products");
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    resetProductForm();
  };

  const startEditingProduct = (product: DashboardProduct) => {
    setErrorMessage("");
    setSuccessMessage("");
    setEditingProductId(product.id);
    setSelectedImage(null);
    setCurrentImageUrl(product.image);
    setForm({
      name: product.name,
      slug: product.slug ?? createProductSlug(product.name),
      categorySlug: product.categorySlug,
      price: product.price,
      summary: product.summary ?? "",
      description: product.description ?? "",
      brand: product.brand ?? "",
      sku: product.sku ?? "",
      unit: product.unit ?? "",
      stockStatus: product.stockStatus ?? "In stock",
      imageAlt: product.imageAlt ?? "",
      galleryImages: "",
      specifications: (product.specifications ?? []).join("\n"),
      featured: Boolean(product.featured),
    });
    selectedGalleryImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    setSelectedGalleryImages([]);
    setCurrentGalleryImages(product.galleryImages ?? []);
    setIsDrawerOpen(true);
    setActiveSection("products");
  };

  const handleImageFiles = (files: FileList | null) => {
    const file = files?.[0] ?? null;

    if (file) {
      setSelectedImage(file);
      setCurrentImageUrl("");
    }
  };

  const handleImageDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    handleImageFiles(event.dataTransfer.files);
  };

  const handleImageInput = (event: ChangeEvent<HTMLInputElement>) => {
    handleImageFiles(event.target.files);
  };

  const removeProductImage = () => {
    setSelectedImage(null);
    setCurrentImageUrl("");
  };

  const addGalleryFiles = (files: FileList | null) => {
    const imageFiles = Array.from(files ?? []).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (imageFiles.length === 0) {
      return;
    }

    setSelectedGalleryImages((current) => [
      ...current,
      ...imageFiles.map((file) => ({
        id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);
  };

  const handleGalleryDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    addGalleryFiles(event.dataTransfer.files);
  };

  const removeSavedGalleryImage = (imageUrl: string) => {
    setCurrentGalleryImages((current) =>
      current.filter((image) => image !== imageUrl),
    );
  };

  const removeManualGalleryImage = (imageUrl: string) => {
    setForm((current) => ({
      ...current,
      galleryImages: splitGalleryImages(current.galleryImages)
        .filter((image) => image !== imageUrl)
        .join("\n"),
    }));
  };

  const removeUploadedGalleryImage = (id: string) => {
    setSelectedGalleryImages((current) => {
      const imageToRemove = current.find((image) => image.id === id);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }

      return current.filter((image) => image.id !== id);
    });
  };

  const validateProductForm = () => {
    if (!form.name.trim()) {
      return "Product name is required.";
    }

    if (!form.slug.trim()) {
      return "Slug is required.";
    }

    if (!form.categorySlug) {
      return "Category is required.";
    }

    if (!form.price.trim()) {
      return "Price is required.";
    }

    if (!selectedImage && !currentImageUrl) {
      return "A main product image is required. Upload or keep an existing image.";
    }

    return "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const validationError = validateProductForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("name", form.name);
      payload.append("slug", form.slug);
      payload.append("categorySlug", form.categorySlug);
      payload.append("category", selectedCategoryName);
      payload.append("price", form.price);
      payload.append("summary", form.summary);
      payload.append("description", form.description);
      payload.append("brand", form.brand);
      payload.append("sku", form.sku);
      payload.append("unit", form.unit);
      payload.append("stockStatus", form.stockStatus);
      payload.append("imageAlt", form.imageAlt);
      payload.append(
        "galleryImages",
        [...currentGalleryImages, ...splitGalleryImages(form.galleryImages)].join("\n"),
      );
      payload.append("specifications", form.specifications);
      payload.append("featured", String(form.featured));

      if (isEditMode && editingProduct) {
        payload.append("id", editingProduct.id);
      }

      if (selectedImage) {
        payload.append("image", selectedImage);
      }

      selectedGalleryImages.forEach((image) => {
        payload.append("galleryImageFiles", image.file);
      });

      const response = await fetch("/api/admin/products", {
        method: isEditMode ? "PUT" : "POST",
        body: payload,
      });

      const data = await readJsonResponse<ProductResponse>(
        response,
        isEditMode ? "Unable to update product." : "Unable to save product.",
      );

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
      setSuccessMessage(
        isEditMode ? "Product updated successfully." : "Product added successfully.",
      );
      closeDrawer();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save product.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (product: DashboardProduct) => {
    const confirmed = window.confirm(`Delete "${product.name}" from the catalog?`);

    if (!confirmed) {
      return;
    }

    setDeletingProductId(product.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id }),
      });

      const data = await readJsonResponse<ProductResponse>(
        response,
        "Unable to delete product.",
      );

      if (!response.ok || !("product" in data)) {
        throw new Error("error" in data ? data.error : "Unable to delete product.");
      }

      setProducts((current) => current.filter((item) => item.id !== product.id));
      setSuccessMessage(`${product.name} was deleted.`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to delete product.",
      );
    } finally {
      setDeletingProductId(null);
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm(initialCategoryFormState);
    setSelectedCategoryImage(null);
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

      const data = await readJsonResponse<CategoryResponse>(
        response,
        "Unable to create category.",
      );

      if (!response.ok || !("category" in data)) {
        throw new Error("error" in data ? data.error : "Unable to create category.");
      }

      setCategories((current) =>
        [...current, data.category].sort((left, right) =>
          left.name.localeCompare(right.name),
        ),
      );
      setForm((current) => ({ ...current, categorySlug: data.category.slug }));
      resetCategoryForm();
      setCategorySuccessMessage(`${data.category.name} was created.`);
    } catch (error) {
      setCategoryErrorMessage(
        error instanceof Error ? error.message : "Unable to create category.",
      );
    } finally {
      setIsCategorySubmitting(false);
    }
  };

  const handleDeleteCategory = async (category: CategoryOption) => {
    if (!category.id) {
      return;
    }

    setDeletingCategoryId(category.id);
    setCategoryErrorMessage("");
    setCategorySuccessMessage("");

    try {
      const response = await fetch("/api/admin/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: category.id }),
      });

      const data = await readJsonResponse<CategoryResponse>(
        response,
        "Unable to delete category.",
      );

      if (!response.ok || !("category" in data)) {
        throw new Error("error" in data ? data.error : "Unable to delete category.");
      }

      setCategories((current) =>
        current.filter((item) => item.id !== category.id),
      );
      setCategorySuccessMessage(`${category.name} was deleted.`);
    } catch (error) {
      setCategoryErrorMessage(
        error instanceof Error ? error.message : "Unable to delete category.",
      );
    } finally {
      setDeletingCategoryId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef4f7_0%,#f8fbfd_34%,#ffffff_100%)] text-slate-950">
      <header className="border-b border-slate-800 bg-[#0b1c2d] px-6 py-7 text-white sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100">
              Product Admin
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Catalog Management
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
              Manage product records, summaries, full descriptions, images, and catalog categories from one focused workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              View products
            </Link>
            <form action="/api/admin/logout" method="post">
              <button
                type="submit"
                className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Sign out
              </button>
            </form>
            <button
              type="button"
              onClick={openAddProduct}
              className="inline-flex items-center rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              Add product
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 sm:px-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-10">
        <aside className="h-fit rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-[0_20px_60px_-46px_rgba(15,23,42,0.55)]">
          <nav className="grid gap-1">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  activeSection === section.id
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0">
          {(errorMessage || successMessage) && !isDrawerOpen ? (
            <div className="mb-5 grid gap-3">
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
            </div>
          ) : null}

          {activeSection === "dashboard" ? (
            <section className="grid gap-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  ["Catalog products", products.length],
                  ["Categories", categories.length],
                  ["In stock", activeProducts],
                  ["Missing images", missingImageCount],
                ].map(([label, value]) => (
                  <article
                    key={label}
                    className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-46px_rgba(15,23,42,0.55)]"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-700">
                      {label}
                    </p>
                    <p className="mt-4 text-3xl font-semibold text-slate-950">
                      {value}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {activeSection === "products" ? (
            <section className="rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_20px_60px_-46px_rgba(15,23,42,0.55)]">
              <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-700">
                    Products
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                    Product list
                  </h2>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:bg-white sm:min-w-80"
                    placeholder="Search by name, category, SKU, status..."
                  />
                  <button
                    type="button"
                    onClick={openAddProduct}
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Add product
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-[900px] w-full border-separate border-spacing-0 text-left text-sm">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Product</th>
                      <th className="px-5 py-4 font-semibold">Category</th>
                      <th className="px-5 py-4 font-semibold">Price</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 font-semibold">Summary</th>
                      <th className="px-5 py-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td className="px-5 py-10 text-center text-slate-500" colSpan={6}>
                          Loading products...
                        </td>
                      </tr>
                    ) : null}

                    {!isLoading && filteredProducts.length === 0 ? (
                      <tr>
                        <td className="px-5 py-10 text-center text-slate-500" colSpan={6}>
                          No products match your search.
                        </td>
                      </tr>
                    ) : null}

                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-slate-200">
                        <td className="border-t border-slate-100 px-5 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                              {product.image ? (
                                <Image
                                  src={product.image}
                                  alt={product.imageAlt || product.name}
                                  fill
                                  sizes="64px"
                                  className="object-cover"
                                />
                              ) : null}
                            </div>
                            <div className="min-w-0">
                              <p className="max-w-xs truncate font-semibold text-slate-950">
                                {product.name}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                /products/{product.slug || createProductSlug(product.name)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="border-t border-slate-100 px-5 py-4 text-slate-600">
                          {product.category}
                        </td>
                        <td className="border-t border-slate-100 px-5 py-4 font-semibold text-red-600">
                          {product.price}
                        </td>
                        <td className="border-t border-slate-100 px-5 py-4">
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                            {product.stockStatus || "Available on request"}
                          </span>
                        </td>
                        <td className="border-t border-slate-100 px-5 py-4">
                          <p className="product-card-summary max-w-sm text-sm leading-6 text-slate-600">
                            {product.summary || product.description || "No summary yet."}
                          </p>
                        </td>
                        <td className="border-t border-slate-100 px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => startEditingProduct(product)}
                              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-800"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              disabled={deletingProductId === product.id}
                              onClick={() => handleDeleteProduct(product)}
                              className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {deletingProductId === product.id ? "Deleting" : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {activeSection === "categories" ? (
            <section className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-46px_rgba(15,23,42,0.55)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-700">
                  Categories
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  Add category
                </h2>
                <form className="mt-6 space-y-5" onSubmit={handleCategorySubmit}>
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-800">Name</span>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={(event) =>
                        handleCategoryChange("name", event.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:bg-white"
                      required
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-800">Slug</span>
                    <input
                      type="text"
                      value={categoryForm.slug}
                      onChange={(event) =>
                        handleCategoryChange("slug", event.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:bg-white"
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-800">
                      Description
                    </span>
                    <textarea
                      value={categoryForm.description}
                      onChange={(event) =>
                        handleCategoryChange("description", event.target.value)
                      }
                      className="min-h-32 w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:bg-white"
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-800">
                      Category image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        setSelectedCategoryImage(event.target.files?.[0] ?? null)
                      }
                      className="block w-full rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                    />
                  </label>
                  {categoryImagePreview ? (
                    <div className="relative h-44 overflow-hidden rounded-[1.25rem] border border-slate-200">
                      <Image
                        src={categoryImagePreview}
                        alt={categoryForm.name || "Category preview"}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  ) : null}
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
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={isCategorySubmitting}
                      className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                      {isCategorySubmitting ? "Creating..." : "Create category"}
                    </button>
                    <button
                      type="button"
                      onClick={resetCategoryForm}
                      className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-46px_rgba(15,23,42,0.55)]">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  Category list
                </h2>
                <div className="mt-5 space-y-3">
                  {categories.map((category) => {
                    const productCount = products.filter(
                      (product) => product.categorySlug === category.slug,
                    ).length;
                    const isSeeded = category.source === "seed";
                    const isDisabled = isSeeded || productCount > 0 || !category.id;

                    return (
                      <article
                        key={category.slug}
                        className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="font-semibold text-slate-950">
                              {category.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {category.slug} · {productCount} products ·{" "}
                              {isSeeded ? "Seeded" : "Admin"}
                            </p>
                            {category.description ? (
                              <p className="mt-2 text-sm leading-6 text-slate-600">
                                {category.description}
                              </p>
                            ) : null}
                          </div>
                          <button
                            type="button"
                            disabled={isDisabled || deletingCategoryId === category.id}
                            onClick={() => handleDeleteCategory(category)}
                            className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                          >
                            {deletingCategoryId === category.id ? "Deleting" : "Delete"}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>
          ) : null}

          {activeSection === "media" ? (
            <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-46px_rgba(15,23,42,0.55)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-700">
                Media
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Product images
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Main product images are uploaded from the product form and stored as URLs on each product record.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {products
                  .filter((product) => product.image)
                  .map((product) => (
                    <article
                      key={product.id}
                      className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-slate-50"
                    >
                      <div className="relative h-40 bg-white">
                        <Image
                          src={product.image}
                          alt={product.imageAlt || product.name}
                          fill
                          sizes="(min-width: 1280px) 18vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                          {product.name}
                        </p>
                      </div>
                    </article>
                  ))}
              </div>
            </section>
          ) : null}
        </main>
      </div>

      {isDrawerOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/45">
          <div className="absolute inset-y-0 right-0 flex w-full max-w-4xl flex-col bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-700">
                  {isEditMode ? "Edit product" : "Add product"}
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  {isEditMode ? form.name : "New catalog product"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
              >
                Close
              </button>
            </div>

            <form className="min-h-0 flex-1 overflow-y-auto px-6 py-6" onSubmit={handleSubmit}>
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
                <div className="space-y-6">
                  <section className="rounded-[1.25rem] border border-slate-200 p-5">
                    <h3 className="text-lg font-semibold text-slate-950">Basic Info</h3>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-800">
                          Product name
                        </span>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(event) => handleChange("name", event.target.value)}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:bg-white"
                          required
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-800">
                          Slug
                        </span>
                        <input
                          type="text"
                          value={form.slug}
                          onChange={(event) => handleChange("slug", event.target.value)}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:bg-white"
                          required
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-800">
                          Category
                        </span>
                        <select
                          value={form.categorySlug}
                          onChange={(event) =>
                            handleChange("categorySlug", event.target.value)
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:bg-white"
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
                        <span className="text-sm font-semibold text-slate-800">
                          Price
                        </span>
                        <input
                          type="text"
                          value={form.price}
                          onChange={(event) => handleChange("price", event.target.value)}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:bg-white"
                          required
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-800">
                          Brand
                        </span>
                        <input
                          type="text"
                          value={form.brand}
                          onChange={(event) => handleChange("brand", event.target.value)}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:bg-white"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-800">
                          Status
                        </span>
                        <select
                          value={form.stockStatus}
                          onChange={(event) =>
                            handleChange("stockStatus", event.target.value)
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:bg-white"
                        >
                          <option>In stock</option>
                          <option>Low stock</option>
                          <option>Available on request</option>
                          <option>Available on request</option>
                        </select>
                      </label>
                    </div>
                  </section>

                  <section className="rounded-[1.25rem] border border-slate-200 p-5">
                    <h3 className="text-lg font-semibold text-slate-950">
                      Descriptions
                    </h3>
                    <div className="mt-5 grid gap-4">
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-800">
                          Short summary
                        </span>
                        <textarea
                          value={form.summary}
                          onChange={(event) =>
                            handleChange("summary", event.target.value)
                          }
                          className="min-h-24 w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:bg-white"
                          placeholder="Concise card copy for listing pages."
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-800">
                          Full description
                        </span>
                        <textarea
                          value={form.description}
                          onChange={(event) =>
                            handleChange("description", event.target.value)
                          }
                          className="min-h-44 w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:bg-white"
                          placeholder="Complete product detail page description."
                        />
                      </label>
                    </div>
                  </section>

                  <section className="rounded-[1.25rem] border border-slate-200 p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-950">Images</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          Manage the main catalog image and attach multiple supporting product images.
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-slate-500">
                        {galleryImagePreviews.length} additional image
                        {galleryImagePreviews.length === 1 ? "" : "s"}
                      </span>
                    </div>
                    <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
                      <label
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={handleImageDrop}
                        className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-cyan-300 bg-cyan-50/50 px-5 py-8 text-center transition hover:bg-cyan-50"
                      >
                        <span className="text-sm font-semibold text-slate-950">
                          Drop product image here
                        </span>
                        <span className="mt-2 text-sm leading-6 text-slate-600">
                          Or select a file to upload, replace, or restore a preview.
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageInput}
                          className="sr-only"
                        />
                      </label>
                      <div className="relative min-h-44 overflow-hidden rounded-[1.25rem] border border-slate-200 bg-slate-50">
                        {previewImageSrc ? (
                          <Image
                            src={previewImageSrc}
                            alt={form.imageAlt || form.name || "Product preview"}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-5 text-center text-sm leading-6 text-slate-500">
                            Image preview appears here.
                          </div>
                        )}
                      </div>
                    </div>
                    <label
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={handleGalleryDrop}
                      className="mt-4 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-cyan-300 bg-white px-5 py-6 text-center transition hover:bg-cyan-50"
                    >
                      <span className="text-sm font-semibold text-slate-950">
                        Add additional product images
                      </span>
                      <span className="mt-2 text-sm leading-6 text-slate-600">
                        Drop multiple images here, or click to select several files.
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(event) => addGalleryFiles(event.target.files)}
                        className="sr-only"
                      />
                    </label>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={removeProductImage}
                        className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                      >
                        Remove image
                      </button>
                    </div>
                    <div className="mt-4 grid gap-4">
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-800">
                          Image alt text
                        </span>
                        <input
                          type="text"
                          value={form.imageAlt}
                          onChange={(event) =>
                            handleChange("imageAlt", event.target.value)
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:bg-white"
                        />
                      </label>
                    </div>
                    <div className="mt-6 rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            Additional product images
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            Upload multiple supporting images, keep current gallery images, or remove them individually.
                          </p>
                        </div>
                        <label
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={handleGalleryDrop}
                          className="inline-flex cursor-pointer items-center justify-center rounded-full border border-cyan-300 bg-white px-4 py-2 text-sm font-semibold text-cyan-800 transition hover:bg-cyan-50"
                        >
                          Upload gallery images
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(event) => addGalleryFiles(event.target.files)}
                            className="sr-only"
                          />
                        </label>
                      </div>

                      <label className="mt-4 block space-y-2">
                        <span className="text-sm font-semibold text-slate-800">
                          Optional gallery image URLs
                        </span>
                        <textarea
                          value={form.galleryImages}
                          onChange={(event) =>
                            handleChange("galleryImages", event.target.value)
                          }
                          className="min-h-20 w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                          placeholder="One URL per line."
                        />
                      </label>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {galleryImagePreviews.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500 sm:col-span-2 xl:col-span-3">
                            Gallery previews appear here.
                          </div>
                        ) : null}

                        {galleryImagePreviews.map((image) => (
                          <article
                            key={`${image.kind}-${image.id}`}
                            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                          >
                            <div className="relative h-32 bg-slate-50">
                              <Image
                                src={image.src}
                                alt={image.label}
                                fill
                                unoptimized
                                sizes="180px"
                                className="object-cover"
                              />
                            </div>
                            <div className="flex items-center justify-between gap-3 p-3">
                              <p className="truncate text-xs font-medium text-slate-600">
                                {image.label}
                              </p>
                              <button
                                type="button"
                                onClick={() => {
                                  if (image.kind === "saved") {
                                    removeSavedGalleryImage(image.src);
                                  } else if (image.kind === "manual") {
                                    removeManualGalleryImage(image.src);
                                  } else {
                                    removeUploadedGalleryImage(image.id);
                                  }
                                }}
                                className="shrink-0 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                              >
                                Remove
                              </button>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  </section>

                  <section className="rounded-[1.25rem] border border-slate-200 p-5">
                    <h3 className="text-lg font-semibold text-slate-950">
                      Specifications
                    </h3>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      {[
                        ["sku", "SKU"],
                        ["unit", "Unit size"],
                      ].map(([field, label]) => (
                        <label key={field} className="space-y-2">
                          <span className="text-sm font-semibold text-slate-800">
                            {label}
                          </span>
                          <input
                            type="text"
                            value={form[field as keyof FormState] as string}
                            onChange={(event) =>
                              handleChange(
                                field as keyof FormState,
                                event.target.value as never,
                              )
                            }
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:bg-white"
                          />
                        </label>
                      ))}
                    </div>
                    <label className="mt-4 block space-y-2">
                      <span className="text-sm font-semibold text-slate-800">
                        Product specifications
                      </span>
                      <textarea
                        value={form.specifications}
                        onChange={(event) =>
                          handleChange("specifications", event.target.value)
                        }
                        className="min-h-28 w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:bg-white"
                        placeholder="One specification per line."
                      />
                    </label>
                  </section>

                  <section className="rounded-[1.25rem] border border-slate-200 p-5">
                    <h3 className="text-lg font-semibold text-slate-950">
                      SEO / Optional Metadata
                    </h3>
                    <label className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(event) =>
                          handleChange("featured", event.target.checked)
                        }
                        className="h-4 w-4 rounded border-slate-300"
                      />
                      <span className="text-sm font-semibold text-slate-800">
                        Mark as featured product
                      </span>
                    </label>
                  </section>
                </div>

                <aside className="h-fit rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-700">
                    Card preview
                  </p>
                  <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white">
                    <div className="relative h-52 bg-[linear-gradient(180deg,#f8fbfd_0%,#eef6fb_100%)]">
                      {previewImageSrc ? (
                        <Image
                          src={previewImageSrc}
                          alt={form.imageAlt || form.name || "Preview"}
                          fill
                          unoptimized
                          className="object-contain p-4"
                        />
                      ) : null}
                    </div>
                    <div className="p-4">
                      <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-800">
                        {selectedCategoryName || "Category"}
                      </span>
                      <h3 className="mt-3 text-lg font-semibold leading-6 text-slate-950">
                        {form.name || "Product name"}
                      </h3>
                      <p className="product-card-summary mt-2 text-sm leading-6 text-slate-600">
                        {form.summary ||
                          "Short summary appears on public listing cards."}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                        <span className="font-semibold text-red-600">
                          {form.price || "Price"}
                        </span>
                        <span>{form.stockStatus}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
                    <p className="font-semibold text-slate-900">Detail copy</p>
                    <p className="mt-2">
                      {form.description ||
                        "Full description appears on the product detail page."}
                    </p>
                    {galleryImagePreviews.length > 0 ? (
                      <p className="mt-3 text-xs text-slate-500">
                        {galleryImagePreviews.length} gallery image
                        {galleryImagePreviews.length === 1 ? "" : "s"} attached
                      </p>
                    ) : null}
                  </div>
                </aside>
              </div>

              {errorMessage ? (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              ) : null}

              <div className="sticky bottom-0 -mx-6 mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isSubmitting
                    ? "Saving..."
                    : isEditMode
                      ? "Save changes"
                      : "Add product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

