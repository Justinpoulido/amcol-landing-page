"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  type MouseEvent,
  useEffect,
  useMemo,
  useRef,
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
  categoryName?: string;
  subcategorySlug?: string;
  subcategoryName?: string;
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
  isFeatured?: boolean;
  parentId?: string | null;
  parentSlug?: string;
  parentName?: string;
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
type SortOption = "recent" | "name-asc" | "name-desc" | "category";
type MediaFilter = "all" | "with-images" | "missing-images";

type GalleryUploadPreview = {
  id: string;
  file: File;
  previewUrl: string;
};

type FormState = {
  name: string;
  slug: string;
  categorySlug: string;
  subcategorySlug: string;
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
  isFeatured: boolean;
  parentSlug: string;
};

const fallbackCategories = Object.values(productCategoryData).map((category) => ({
  slug: category.slug,
  name: category.name,
  description: category.description,
  isFeatured: category.isFeatured ?? false,
  source: "seed" as const,
}));

const defaultCategorySlug = fallbackCategories[0]?.slug ?? "";

const initialFormState: FormState = {
  name: "",
  slug: "",
  categorySlug: defaultCategorySlug,
  subcategorySlug: "",
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
  isFeatured: false,
  parentSlug: "",
};

const sections: { id: AdminSection; label: string; icon: string }[] = [
  { id: "dashboard", label: "View Dashboard", icon: "D" },
  { id: "products", label: "Edit Products", icon: "P" },
  { id: "categories", label: "Edit Categories", icon: "C" },
  { id: "media", label: "View Media", icon: "M" },
];

const pageSizeOptions = [25, 50, 100];

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
  const categoryEditFormRef = useRef<HTMLDivElement>(null);
  const categoryNameInputRef = useRef<HTMLInputElement>(null);
  const shouldScrollToCategoryFormRef = useRef(false);
  const [activeSection, setActiveSection] = useState<AdminSection>("products");
  const [categories, setCategories] = useState<CategoryOption[]>(fallbackCategories);
  const [products, setProducts] = useState<DashboardProduct[]>([]);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>(
    initialCategoryFormState,
  );
  const [editingCategorySlug, setEditingCategorySlug] = useState<string | null>(null);
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
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categoryListFilter, setCategoryListFilter] = useState<
    "all" | "general" | "subcategories"
  >("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("recent");
  const [pageSize, setPageSize] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [openCategoryActionMenuSlug, setOpenCategoryActionMenuSlug] = useState<
    string | null
  >(null);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>("all");
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
          const nextTopLevelCategories = nextCategories.filter(
            (category) => !category.parentSlug && !category.parentId,
          );
          setCategories(nextCategories);
          setForm((current) => ({
            ...current,
            categorySlug: nextTopLevelCategories.some(
              (category) => category.slug === current.categorySlug,
            )
              ? current.categorySlug
              : nextTopLevelCategories[0]?.slug ?? nextCategories[0].slug,
            subcategorySlug: current.subcategorySlug,
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
  const topLevelCategories = useMemo(
    () =>
      categories
        .filter((category) => !category.parentSlug && !category.parentId)
        .sort((left, right) => left.name.localeCompare(right.name)),
    [categories],
  );
  const subcategoriesByParentSlug = useMemo(() => {
    const grouped = new Map<string, CategoryOption[]>();

    for (const category of categories) {
      const parentSlug = category.parentSlug;

      if (!parentSlug) {
        continue;
      }

      grouped.set(parentSlug, [
        ...(grouped.get(parentSlug) ?? []),
        category,
      ].sort((left, right) => left.name.localeCompare(right.name)));
    }

    return grouped;
  }, [categories]);
  const availableSubcategories =
    subcategoriesByParentSlug.get(form.categorySlug) ?? [];
  const visibleCategories = useMemo(
    () =>
      categories.filter((category) => {
        const isSubcategory = Boolean(category.parentSlug || category.parentId);

        if (categoryListFilter === "general") {
          return !isSubcategory;
        }

        if (categoryListFilter === "subcategories") {
          return isSubcategory;
        }

        return true;
      }),
    [categories, categoryListFilter],
  );
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

  const statusOptions = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map((product) => getStatusLabel(product.stockStatus))
            .filter(Boolean),
        ),
      ).sort((left, right) => left.localeCompare(right)),
    [products],
  );
  const hasProductFormChanges = useMemo(() => {
    if (!isDrawerOpen) {
      return false;
    }

    if (selectedImage || selectedGalleryImages.length > 0) {
      return true;
    }

    if (isEditMode && editingProduct) {
      return (
        form.name !== editingProduct.name ||
        form.slug !== (editingProduct.slug ?? createProductSlug(editingProduct.name)) ||
        form.categorySlug !== editingProduct.categorySlug ||
        form.price !== editingProduct.price ||
        form.summary !== (editingProduct.summary ?? "") ||
        form.description !== (editingProduct.description ?? "") ||
        form.brand !== (editingProduct.brand ?? "") ||
        form.sku !== (editingProduct.sku ?? "") ||
        form.unit !== (editingProduct.unit ?? "") ||
        form.stockStatus !== (editingProduct.stockStatus ?? "In stock") ||
        form.imageAlt !== (editingProduct.imageAlt ?? "") ||
        form.galleryImages !== "" ||
        form.specifications !== (editingProduct.specifications ?? []).join("\n") ||
        form.featured !== Boolean(editingProduct.featured) ||
        currentImageUrl !== editingProduct.image ||
        currentGalleryImages.join("\n") !== (editingProduct.galleryImages ?? []).join("\n")
      );
    }

    return (
      form.name !== initialFormState.name ||
      form.slug !== initialFormState.slug ||
      form.categorySlug !== (categories[0]?.slug || defaultCategorySlug) ||
      form.price !== initialFormState.price ||
      form.summary !== initialFormState.summary ||
      form.description !== initialFormState.description ||
      form.brand !== initialFormState.brand ||
      form.sku !== initialFormState.sku ||
      form.unit !== initialFormState.unit ||
      form.stockStatus !== initialFormState.stockStatus ||
      form.imageAlt !== initialFormState.imageAlt ||
      form.galleryImages !== initialFormState.galleryImages ||
      form.specifications !== initialFormState.specifications ||
      form.featured !== initialFormState.featured ||
      Boolean(currentImageUrl)
    );
  }, [
    categories,
    currentGalleryImages,
    currentImageUrl,
    editingProduct,
    form,
    isDrawerOpen,
    isEditMode,
    selectedGalleryImages.length,
    selectedImage,
  ]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const matchingProducts = products.filter((product) => {
      const matchesQuery =
        !query ||
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
          .some((value) => String(value).toLowerCase().includes(query));
      const matchesCategory =
        categoryFilter === "all" || product.categorySlug === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || getStatusLabel(product.stockStatus) === statusFilter;

      return matchesQuery && matchesCategory && matchesStatus;
    });

    return [...matchingProducts].sort((left, right) => {
      if (sortOption === "name-asc") {
        return left.name.localeCompare(right.name);
      }

      if (sortOption === "name-desc") {
        return right.name.localeCompare(left.name);
      }

      if (sortOption === "category") {
        return (
          left.category.localeCompare(right.category) ||
          left.name.localeCompare(right.name)
        );
      }

      return (
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      );
    });
  }, [categoryFilter, products, searchQuery, sortOption, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const visibleProductIds = paginatedProducts.map((product) => product.id);
  const selectedVisibleCount = visibleProductIds.filter((id) =>
    selectedProductIds.includes(id),
  ).length;
  const isAllVisibleSelected =
    visibleProductIds.length > 0 && selectedVisibleCount === visibleProductIds.length;
  const isSomeVisibleSelected =
    selectedVisibleCount > 0 && selectedVisibleCount < visibleProductIds.length;
  const firstVisibleProduct = filteredProducts.length
    ? (currentPage - 1) * pageSize + 1
    : 0;
  const lastVisibleProduct = Math.min(currentPage * pageSize, filteredProducts.length);
  const productCountLabel =
    filteredProducts.length === products.length
      ? `${formatProductCount(products.length)} products`
      : `${formatProductCount(filteredProducts.length)} of ${formatProductCount(
          products.length,
        )} products`;
  const mediaProducts = useMemo(() => {
    if (mediaFilter === "with-images") {
      return products.filter((product) => product.image);
    }

    if (mediaFilter === "missing-images") {
      return products.filter((product) => !product.image);
    }

    return products;
  }, [mediaFilter, products]);
  const paginationPages = useMemo(() => {
    const pages = new Set([1, totalPages, currentPage]);

    for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
      if (page > 1 && page < totalPages) {
        pages.add(page);
      }
    }

    if (currentPage <= 3) {
      pages.add(2);
      pages.add(3);
      pages.add(4);
    }

    if (currentPage >= totalPages - 2) {
      pages.add(totalPages - 1);
      pages.add(totalPages - 2);
      pages.add(totalPages - 3);
    }

    return Array.from(pages)
      .filter((page) => page >= 1 && page <= totalPages)
      .sort((left, right) => left - right);
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, pageSize, searchQuery, sortOption, statusFilter]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  useEffect(() => {
    setSelectedProductIds((current) =>
      current.filter((id) => products.some((product) => product.id === id)),
    );
  }, [products]);

  useEffect(() => {
    if (!successMessage && !categorySuccessMessage) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setSuccessMessage("");
      setCategorySuccessMessage("");
    }, 4200);

    return () => window.clearTimeout(timeout);
  }, [categorySuccessMessage, successMessage]);

  useEffect(() => {
    if (!hasProductFormChanges) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasProductFormChanges]);

  useEffect(() => {
    if (!editingCategorySlug || !shouldScrollToCategoryFormRef.current) {
      return;
    }

    shouldScrollToCategoryFormRef.current = false;
    const animationFrame = window.requestAnimationFrame(() => {
      categoryEditFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      categoryNameInputRef.current?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [editingCategorySlug, categoryForm.name]);

  useEffect(() => {
    if (!openCategoryActionMenuSlug) {
      return;
    }

    const closeCategoryActionMenu = (event: PointerEvent) => {
      const target = event.target;

      if (
        target instanceof Element &&
        target.closest("[data-category-action-menu]")
      ) {
        return;
      }

      setOpenCategoryActionMenuSlug(null);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenCategoryActionMenuSlug(null);
      }
    };

    document.addEventListener("pointerdown", closeCategoryActionMenu);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", closeCategoryActionMenu);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openCategoryActionMenuSlug]);

  const confirmDiscardProductChanges = () =>
    !hasProductFormChanges ||
    window.confirm("You have unsaved changes. Leave without saving?");

  const goToSection = (section: AdminSection) => {
    if (isDrawerOpen && !confirmDiscardProductChanges()) {
      return;
    }

    setIsDrawerOpen(false);
    resetProductForm();
    setActiveSection(section);
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  };

  const toggleVisibleSelection = () => {
    setSelectedProductIds((current) => {
      if (isAllVisibleSelected) {
        return current.filter((id) => !visibleProductIds.includes(id));
      }

      return Array.from(new Set([...current, ...visibleProductIds]));
    });
  };

  const viewProduct = (product: DashboardProduct) => {
    window.open(`/products/${product.slug || createProductSlug(product.name)}`, "_blank");
  };

  const handleActionMenuClick = (event: MouseEvent<HTMLButtonElement>, id: string) => {
    event.stopPropagation();
    setOpenActionMenuId((current) => (current === id ? null : id));
  };

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

      if (field === "categorySlug") {
        return { ...current, categorySlug: String(value), subcategorySlug: "" };
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

      if (field === "parentSlug" && String(value)) {
        return { ...current, parentSlug: String(value), isFeatured: false };
      }

      return { ...current, [field]: value };
    });
  };

  const resetProductForm = () => {
    selectedGalleryImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    setForm((current) => ({
      ...initialFormState,
      categorySlug:
        current.categorySlug || topLevelCategories[0]?.slug || defaultCategorySlug,
      subcategorySlug: "",
    }));
    setEditingProductId(null);
    setSelectedImage(null);
    setCurrentImageUrl("");
    setCurrentGalleryImages([]);
    setSelectedGalleryImages([]);
    setErrorMessage("");
  };

  const openAddProduct = () => {
    if (isDrawerOpen && !confirmDiscardProductChanges()) {
      return;
    }

    resetProductForm();
    setIsDrawerOpen(true);
    setActiveSection("products");
  };

  const closeDrawer = (options?: { skipUnsavedCheck?: boolean }) => {
    if (!options?.skipUnsavedCheck && !confirmDiscardProductChanges()) {
      return;
    }

    setIsDrawerOpen(false);
    resetProductForm();
  };

  const startEditingProduct = (product: DashboardProduct) => {
    if (isDrawerOpen && !confirmDiscardProductChanges()) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setEditingProductId(product.id);
    setSelectedImage(null);
    setCurrentImageUrl(product.image);
    setForm({
      name: product.name,
      slug: product.slug ?? createProductSlug(product.name),
      categorySlug: product.categorySlug,
      subcategorySlug: product.subcategorySlug ?? "",
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
      payload.append("subcategorySlug", form.subcategorySlug);
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
      closeDrawer({ skipUnsavedCheck: true });
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
    setCategoryImagePreview("");
    setEditingCategorySlug(null);
  };

  const startEditingCategory = (category: CategoryOption) => {
    shouldScrollToCategoryFormRef.current = true;
    setCategoryErrorMessage("");
    setCategorySuccessMessage("");
    setEditingCategorySlug(category.slug);
    setSelectedCategoryImage(null);
    setCategoryImagePreview("");
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      isFeatured: Boolean(category.isFeatured),
      parentSlug: category.parentSlug ?? "",
    });
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
      payload.append("currentSlug", editingCategorySlug ?? categoryForm.slug);
      payload.append("description", categoryForm.description);
      payload.append("isFeatured", String(categoryForm.isFeatured));
      payload.append("parentSlug", categoryForm.parentSlug);

      const parentCategory = categories.find(
        (category) => category.slug === categoryForm.parentSlug,
      );

      if (parentCategory?.id) {
        payload.append("parentId", parentCategory.id);
      }

      const editingCategory = categories.find(
        (category) => category.slug === editingCategorySlug,
      );

      if (editingCategory?.id) {
        payload.append("id", editingCategory.id);
      }

      if (selectedCategoryImage) {
        payload.append("image", selectedCategoryImage);
      }

      const response = await fetch("/api/admin/categories", {
        method: editingCategorySlug ? "PUT" : "POST",
        body: payload,
      });

      const data = await readJsonResponse<CategoryResponse>(
        response,
        editingCategorySlug ? "Unable to update category." : "Unable to create category.",
      );

      if (!response.ok || !("category" in data)) {
        throw new Error(
          "error" in data
            ? data.error
            : editingCategorySlug
              ? "Unable to update category."
              : "Unable to create category.",
        );
      }

      setCategories((current) =>
        (editingCategorySlug
          ? current.map((category) =>
              category.slug === editingCategorySlug ? data.category : category,
            )
          : [...current, data.category]
        ).sort((left, right) => left.name.localeCompare(right.name)),
      );
      setForm((current) => ({ ...current, categorySlug: data.category.slug }));
      resetCategoryForm();
      setCategorySuccessMessage(
        editingCategorySlug
          ? `${data.category.name} was updated.`
          : `${data.category.name} was created.`,
      );
    } catch (error) {
      setCategoryErrorMessage(
        error instanceof Error
          ? error.message
          : editingCategorySlug
            ? "Unable to update category."
            : "Unable to create category.",
      );
    } finally {
      setIsCategorySubmitting(false);
    }
  };

  const handleDeleteCategory = async (category: CategoryOption) => {
    const childCategories = categories.filter(
      (item) => item.parentSlug === category.slug || item.parentId === category.id,
    );

    if (childCategories.length > 0) {
      setCategoryErrorMessage(
        `Cannot delete this category because ${childCategories.length} subcategor${
          childCategories.length === 1 ? "y is" : "ies are"
        } assigned to it.`,
      );
      return;
    }

    const productCount = products.filter(
      (product) =>
        product.categorySlug === category.slug ||
        product.subcategorySlug === category.slug,
    ).length;

    if (productCount > 0) {
      setCategoryErrorMessage(
        `Cannot delete this category because ${productCount} product${
          productCount === 1 ? " is" : "s are"
        } assigned to it.`,
      );
      return;
    }

    if (!category.id) {
      setCategoryErrorMessage("Cannot delete this category because its live category id is unavailable.");
      return;
    }

    const confirmed = window.confirm(
      `Delete "${category.name}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) {
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

  const handleToggleCategoryFeatured = async (category: CategoryOption) => {
    const nextFeatured = !category.isFeatured;
    setCategoryErrorMessage("");
    setCategorySuccessMessage("");

    try {
      const response = await fetch("/api/admin/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: category.id,
          currentSlug: category.slug,
          isFeatured: nextFeatured,
        }),
      });

      const data = await readJsonResponse<CategoryResponse>(
        response,
        "Unable to update featured status.",
      );

      if (!response.ok || !("category" in data)) {
        throw new Error(
          "error" in data ? data.error : "Unable to update featured status.",
        );
      }

      setCategories((current) =>
        current.map((item) =>
          item.slug === category.slug ? data.category : item,
        ),
      );
      setCategoryForm((current) =>
        editingCategorySlug === category.slug
          ? { ...current, isFeatured: Boolean(data.category.isFeatured) }
          : current,
      );
      setCategorySuccessMessage(
        data.category.isFeatured
          ? `${data.category.name} added to Featured Categories.`
          : `${data.category.name} removed from Featured Categories.`,
      );
    } catch (error) {
      setCategoryErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update featured status.",
      );
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f4f7fa] text-slate-950">
      <header className="border-b border-slate-800 bg-[#0b1c2d] px-4 py-4 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[88px] w-full max-w-[1600px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
              AMCOL Product Admin
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Catalog Management
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-300">
              Manage records, categories, imagery, and catalog publishing.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/products"
              className="inline-flex min-h-10 items-center rounded-lg border border-white/15 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              View Site
            </Link>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen((current) => !current)}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/15"
                aria-expanded={isAccountMenuOpen}
              >
                Admin User
                <span className="text-cyan-200">v</span>
              </button>
              {isAccountMenuOpen ? (
                <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 text-slate-950 shadow-[0_18px_44px_-24px_rgba(15,23,42,0.65)]">
                  <form action="/api/admin/logout" method="post">
                    <button
                      type="submit"
                      className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Sign out
                    </button>
                  </form>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1600px] gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:px-8">
        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-2 shadow-[0_14px_42px_-34px_rgba(15,23,42,0.55)] lg:sticky lg:top-5">
          <nav className="grid gap-1">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => goToSection(section.id)}
                className={`inline-flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition ${
                  activeSection === section.id
                    ? "bg-slate-950 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <span className="grid h-7 w-7 place-items-center rounded-md bg-white/10 text-sm">
                  {section.icon}
                </span>
                {section.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0">
          {(errorMessage || successMessage || categorySuccessMessage) && !isDrawerOpen ? (
            <div className="fixed right-4 top-4 z-50 grid max-w-sm gap-3">
              {errorMessage ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-lg">
                  {errorMessage}
                </div>
              ) : null}
              {successMessage ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg">
                  {successMessage}
                </div>
              ) : null}
              {categorySuccessMessage ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg">
                  {categorySuccessMessage}
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
            <section className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_14px_42px_-34px_rgba(15,23,42,0.55)]">
              <div className="border-b border-slate-200 p-4 lg:p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-700">
                      Products
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                      Products
                    </h2>
                  </div>
                  <p className="text-sm font-semibold text-slate-500">
                    {productCountLabel}
                  </p>
                </div>
                <div className="mt-4 grid gap-3 xl:grid-cols-[minmax(220px,1fr)_180px_170px_170px_auto]">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="min-h-11 min-w-0 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-cyan-400 focus:bg-white"
                    placeholder="Search products..."
                  />
                  <select
                    value={categoryFilter}
                    onChange={(event) => setCategoryFilter(event.target.value)}
                    className="min-h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white"
                  >
                    <option value="all">All categories</option>
                    {categories.map((category) => (
                      <option key={category.slug} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="min-h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white"
                  >
                    <option value="all">All statuses</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sortOption}
                    onChange={(event) => setSortOption(event.target.value as SortOption)}
                    className="min-h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white"
                  >
                    <option value="recent">Newest first</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="category">Category</option>
                  </select>
                  <button
                    type="button"
                    onClick={openAddProduct}
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    + Add Product
                  </button>
                </div>
              </div>

              {selectedProductIds.length > 0 ? (
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-100 bg-cyan-50 px-4 py-3 text-sm">
                  <p className="font-semibold text-cyan-900">
                    {selectedProductIds.length} selected
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedProductIds([])}
                    className="rounded-lg border border-cyan-200 bg-white px-3 py-2 text-sm font-semibold text-cyan-800 transition hover:bg-cyan-50"
                  >
                    Clear selection
                  </button>
                </div>
              ) : null}

              <div className="max-h-[68vh] overflow-auto">
                <table className="w-full min-w-[980px] table-fixed border-separate border-spacing-0 text-left text-sm">
                  <colgroup>
                    <col className="w-[4%]" />
                    <col className="w-[27%]" />
                    <col className="w-[14%]" />
                    <col className="w-[12%]" />
                    <col className="w-[11%]" />
                    <col className="w-[22%]" />
                    <col className="w-[10%]" />
                  </colgroup>
                  <thead className="sticky top-0 z-10 bg-slate-50 text-[11px] uppercase tracking-[0.16em] text-slate-500 shadow-[inset_0_-1px_0_#e2e8f0]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">
                        <input
                          type="checkbox"
                          checked={isAllVisibleSelected}
                          aria-checked={isSomeVisibleSelected ? "mixed" : isAllVisibleSelected}
                          onChange={toggleVisibleSelection}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                      </th>
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
                        <td className="px-5 py-10 text-center text-slate-500" colSpan={7}>
                          Loading products...
                        </td>
                      </tr>
                    ) : null}

                    {!isLoading && filteredProducts.length === 0 ? (
                      <tr>
                        <td className="px-5 py-10 text-center text-slate-500" colSpan={7}>
                          No products match the current view.
                        </td>
                      </tr>
                    ) : null}

                    {paginatedProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="group border-b border-slate-200 transition hover:bg-slate-50/80"
                      >
                        <td className="border-t border-slate-100 px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedProductIds.includes(product.id)}
                            onChange={() => toggleProductSelection(product.id)}
                            className="h-4 w-4 rounded border-slate-300"
                          />
                        </td>
                        <td className="min-w-0 border-t border-slate-100 px-5 py-4">
                          <div className="flex min-w-0 items-center gap-4">
                            <button
                              type="button"
                              onClick={() => startEditingProduct(product)}
                              className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 transition hover:border-cyan-300"
                              aria-label={`Edit ${product.name}`}
                            >
                              {product.image ? (
                                <Image
                                  src={product.image}
                                  alt={product.imageAlt || product.name}
                                  fill
                                  sizes="56px"
                                  className="object-contain p-1"
                                />
                              ) : null}
                            </button>
                            <div className="min-w-0">
                              <button
                                type="button"
                                onClick={() => startEditingProduct(product)}
                                className="block max-w-full truncate text-left font-semibold text-slate-950 transition hover:text-cyan-800"
                              >
                                {product.name}
                              </button>
                              <p className="mt-1 truncate text-xs text-slate-500">
                                {getProductIdentifier(product)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="min-w-0 border-t border-slate-100 px-5 py-4 text-slate-600">
                          <span className="block truncate font-medium text-slate-700">
                            {product.categoryName || product.category}
                          </span>
                          {product.subcategoryName ? (
                            <span className="mt-1 block truncate text-xs text-slate-500">
                              / {product.subcategoryName}
                            </span>
                          ) : null}
                        </td>
                        <td className="border-t border-slate-100 px-5 py-4">
                          <span className="inline-flex whitespace-nowrap rounded-md border border-red-100 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                            {normalizePriceLabel(product.price)}
                          </span>
                        </td>
                        <td className="min-w-0 border-t border-slate-100 px-5 py-4">
                          <span
                            className={`inline-flex max-w-full rounded-md border px-2.5 py-1 text-xs font-semibold ${getStatusTone(
                              product.stockStatus,
                            )}`}
                          >
                            <span className="truncate">{getStatusLabel(product.stockStatus)}</span>
                          </span>
                        </td>
                        <td className="min-w-0 border-t border-slate-100 px-5 py-4">
                          <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                            {product.summary || product.description || "No summary yet."}
                          </p>
                        </td>
                        <td className="border-t border-slate-100 px-5 py-4">
                          <div className="relative flex min-w-max justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => startEditingProduct(product)}
                              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-800"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={(event) => handleActionMenuClick(event, product.id)}
                              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-800"
                              aria-label={`Open actions for ${product.name}`}
                            >
                              ...
                            </button>
                            {openActionMenuId === product.id ? (
                              <div className="absolute right-0 top-10 z-20 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-[0_18px_44px_-24px_rgba(15,23,42,0.65)]">
                                <button
                                  type="button"
                                  onClick={() => {
                                    viewProduct(product);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                                >
                                  View product
                                </button>
                                <button
                                  type="button"
                                  disabled={deletingProductId === product.id}
                                  onClick={() => {
                                    setOpenActionMenuId(null);
                                    handleDeleteProduct(product);
                                  }}
                                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:text-slate-400"
                                >
                                  {deletingProductId === product.id ? "Deleting" : "Delete"}
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <span>
                    Showing {formatProductCount(firstVisibleProduct)}-
                    {formatProductCount(lastVisibleProduct)} of{" "}
                    {formatProductCount(filteredProducts.length)}
                  </span>
                  <select
                    value={pageSize}
                    onChange={(event) => setPageSize(Number(event.target.value))}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm font-medium text-slate-700"
                    aria-label="Products per page"
                  >
                    {pageSizeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                  >
                    Previous
                  </button>
                  {paginationPages.map((page, index) => (
                    <div key={page} className="flex items-center gap-2">
                      {index > 0 && page - paginationPages[index - 1] > 1 ? (
                        <span className="text-slate-400">...</span>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-9 rounded-lg border px-3 py-2 font-semibold transition ${
                          page === currentPage
                            ? "border-slate-950 bg-slate-950 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                        aria-current={page === currentPage ? "page" : undefined}
                      >
                        {page}
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>
          ) : null}

          {activeSection === "categories" ? (
            <section className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div
                ref={categoryEditFormRef}
                className="scroll-mt-28 rounded-xl border border-slate-200 bg-white p-6 shadow-[0_14px_42px_-34px_rgba(15,23,42,0.55)]"
              >
                <p className="text-xs font-semibold text-slate-500">
                  Admin / Categories / {editingCategorySlug ? "Edit Category" : "Add Category"}
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  {editingCategorySlug ? "Edit category" : "Add category"}
                </h2>
                <form className="mt-6 space-y-5" onSubmit={handleCategorySubmit}>
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-800">Name</span>
                    <input
                      ref={categoryNameInputRef}
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
                      disabled={Boolean(editingCategorySlug)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:bg-white disabled:cursor-not-allowed disabled:text-slate-500"
                    />
                    {editingCategorySlug ? (
                      <span className="block text-xs leading-5 text-slate-500">
                        Slug is preserved while editing to avoid changing public category URLs.
                      </span>
                    ) : null}
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
                  <fieldset className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <legend className="text-sm font-semibold text-slate-800">
                      Category type
                    </legend>
                    <div className="flex flex-wrap gap-3">
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <input
                          type="radio"
                          name="categoryType"
                          checked={!categoryForm.parentSlug}
                          onChange={() => handleCategoryChange("parentSlug", "")}
                          className="h-4 w-4 border-slate-300"
                        />
                        General Category
                      </label>
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <input
                          type="radio"
                          name="categoryType"
                          checked={Boolean(categoryForm.parentSlug)}
                          onChange={() =>
                            handleCategoryChange(
                              "parentSlug",
                              topLevelCategories.find(
                                (category) => category.slug !== editingCategorySlug,
                              )?.slug ?? "",
                            )
                          }
                          className="h-4 w-4 border-slate-300"
                        />
                        Subcategory
                      </label>
                    </div>
                    {categoryForm.parentSlug ? (
                      <label className="block space-y-2">
                        <span className="text-sm font-semibold text-slate-800">
                          Parent category
                        </span>
                        <select
                          value={categoryForm.parentSlug}
                          onChange={(event) =>
                            handleCategoryChange("parentSlug", event.target.value)
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                          required
                        >
                          {topLevelCategories
                            .filter((category) => category.slug !== editingCategorySlug)
                            .map((category) => (
                              <option key={category.slug} value={category.slug}>
                                {category.name}
                              </option>
                            ))}
                        </select>
                      </label>
                    ) : null}
                  </fieldset>
                  <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={categoryForm.isFeatured}
                      onChange={(event) =>
                        handleCategoryChange("isFeatured", event.target.checked)
                      }
                      disabled={Boolean(categoryForm.parentSlug)}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    <span className="text-sm font-semibold text-slate-800">
                      Feature this general category on the Products page
                    </span>
                  </label>
                  {categoryForm.parentSlug ? (
                    <p className="-mt-3 text-xs leading-5 text-slate-500">
                      Featured Categories only show general categories.
                    </p>
                  ) : null}
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
                      className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                      {isCategorySubmitting
                        ? editingCategorySlug
                          ? "Saving..."
                          : "Creating..."
                        : editingCategorySlug
                          ? "Save category"
                          : "Create category"}
                    </button>
                    <button
                      type="button"
                      onClick={resetCategoryForm}
                      className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_14px_42px_-34px_rgba(15,23,42,0.55)]">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  Category list
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    ["all", "All"],
                    ["general", "General Categories"],
                    ["subcategories", "Subcategories"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setCategoryListFilter(
                          value as "all" | "general" | "subcategories",
                        )
                      }
                      className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                        categoryListFilter === value
                          ? "border-cyan-300 bg-cyan-50 text-cyan-800"
                          : "border-slate-200 bg-white text-slate-600 hover:border-cyan-200"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="mt-5 space-y-3">
                  {visibleCategories.map((category) => {
                    const productCount = products.filter(
                      (product) =>
                        product.categorySlug === category.slug ||
                        product.subcategorySlug === category.slug,
                    ).length;
                    const childCount = categories.filter(
                      (item) =>
                        item.parentSlug === category.slug ||
                        item.parentId === category.id,
                    ).length;
                    const isSubcategory = Boolean(
                      category.parentSlug || category.parentId,
                    );
                    const isSeeded = category.source === "seed";
                    const deleteDisabledReason =
                      childCount > 0
                        ? `${childCount} subcategor${
                            childCount === 1 ? "y" : "ies"
                          } assigned`
                        : productCount > 0
                        ? `${productCount} product${
                            productCount === 1 ? "" : "s"
                          } assigned`
                        : !category.id
                          ? "Live category id unavailable"
                          : "";
                    const isDeleteDisabled = Boolean(deleteDisabledReason);

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
                              {category.slug} / {productCount} products /{" "}
                              {isSeeded ? "Seeded" : "Admin"}
                            </p>
                            <p className="mt-1 text-xs font-semibold text-slate-600">
                              {isSubcategory
                                ? `Subcategory of: ${
                                    category.parentName || category.parentSlug
                                  }`
                                : `General Category${
                                    childCount > 0
                                      ? ` / ${childCount} subcategor${
                                          childCount === 1 ? "y" : "ies"
                                        }`
                                      : ""
                                  }`}
                            </p>
                            <div className="mt-2">
                              <span
                                className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold ${
                                  category.isFeatured
                                    ? "border-cyan-200 bg-cyan-50 text-cyan-800"
                                    : "border-slate-200 bg-white text-slate-500"
                                }`}
                              >
                                Featured: {category.isFeatured ? "Yes" : "No"}
                              </span>
                            </div>
                            {category.description ? (
                              <p className="mt-2 text-sm leading-6 text-slate-600">
                                {category.description}
                              </p>
                            ) : null}
                          </div>
                          <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleCategoryFeatured(category)}
                                disabled={isSubcategory}
                                className="rounded-lg border border-cyan-200 bg-white px-4 py-2 text-sm font-semibold text-cyan-800 transition hover:bg-cyan-50"
                              >
                                {category.isFeatured
                                  ? "Remove Featured"
                                  : "Add Featured"}
                              </button>
                              <button
                                type="button"
                                onClick={() => startEditingCategory(category)}
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-800"
                              >
                                Edit
                              </button>
                              <div
                                className="relative"
                                data-category-action-menu
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    setOpenCategoryActionMenuSlug((current) =>
                                      current === category.slug
                                        ? null
                                        : category.slug,
                                    )
                                  }
                                  aria-label={`More actions for ${category.name}`}
                                  aria-expanded={
                                    openCategoryActionMenuSlug === category.slug
                                  }
                                  aria-haspopup="menu"
                                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-800"
                                >
                                  ...
                                </button>
                                {openCategoryActionMenuSlug === category.slug ? (
                                  <div
                                    role="menu"
                                    className="absolute right-0 top-10 z-30 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 text-sm shadow-[0_18px_44px_-24px_rgba(15,23,42,0.65)]"
                                  >
                                    <Link
                                      href={
                                        category.parentSlug
                                          ? `/products/${category.parentSlug}/${category.slug}`
                                          : `/products/${category.slug}`
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      role="menuitem"
                                      onClick={() =>
                                        setOpenCategoryActionMenuSlug(null)
                                      }
                                      className="block rounded-lg px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-100"
                                    >
                                      View Category
                                    </Link>
                                    <button
                                      type="button"
                                      role="menuitem"
                                      disabled={
                                        isDeleteDisabled ||
                                        deletingCategoryId === category.id
                                      }
                                      onClick={() => {
                                        setOpenCategoryActionMenuSlug(null);
                                        handleDeleteCategory(category);
                                      }}
                                      title={
                                        deleteDisabledReason ||
                                        `Delete ${category.name}`
                                      }
                                      className="w-full rounded-lg px-3 py-2 text-left font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent"
                                    >
                                      {deletingCategoryId === category.id
                                        ? "Deleting"
                                        : "Delete"}
                                    </button>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                            {deleteDisabledReason ? (
                              <p className="text-xs font-medium text-slate-500">
                                {deleteDisabledReason}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>
          ) : null}

          {activeSection === "media" ? (
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_14px_42px_-34px_rgba(15,23,42,0.55)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Admin / Media
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                    Product images
                  </h2>
                </div>
                <select
                  value={mediaFilter}
                  onChange={(event) => setMediaFilter(event.target.value as MediaFilter)}
                  className="min-h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white"
                >
                  <option value="all">All products</option>
                  <option value="with-images">Products with images</option>
                  <option value="missing-images">Missing images</option>
                </select>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    With images
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {formatProductCount(products.filter((product) => product.image).length)}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Missing images
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {formatProductCount(missingImageCount)}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Vercel Blob
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {formatProductCount(
                      products.filter((product) => isVercelBlobUrl(product.image)).length,
                    )}
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {mediaProducts.map((product) => (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                  >
                    <div className="relative h-40 bg-white">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.imageAlt || product.name}
                          fill
                          sizes="(min-width: 1280px) 18vw, 50vw"
                          className="object-contain p-3"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-4 text-center text-sm font-medium text-slate-400">
                          No image assigned
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                          {product.name}
                        </p>
                        {isVercelBlobUrl(product.image) ? (
                          <span className="shrink-0 rounded-md border border-cyan-200 bg-cyan-50 px-2 py-1 text-[11px] font-semibold text-cyan-800">
                            Vercel Blob
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 truncate text-xs text-slate-500">
                        {product.image || "Image URL missing"}
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
                <p className="text-xs font-semibold text-slate-500">
                  Admin / Products / {isEditMode ? "Edit Product" : "Add Product"}
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  {isEditMode ? form.name : "New catalog product"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => closeDrawer()}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
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
                          General Category
                        </span>
                        <select
                          value={form.categorySlug}
                          onChange={(event) =>
                            handleChange("categorySlug", event.target.value)
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:bg-white"
                          required
                        >
                          {topLevelCategories.map((category) => (
                            <option key={category.slug} value={category.slug}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-800">
                          Subcategory
                        </span>
                        <select
                          value={form.subcategorySlug}
                          onChange={(event) =>
                            handleChange("subcategorySlug", event.target.value)
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:bg-white disabled:cursor-not-allowed disabled:text-slate-400"
                          disabled={availableSubcategories.length === 0}
                        >
                          <option value="">None</option>
                          {availableSubcategories.map((category) => (
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
                  onClick={() => closeDrawer()}
                  className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
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

function formatProductCount(count: number) {
  return new Intl.NumberFormat("en-US").format(count);
}

function getProductIdentifier(product: DashboardProduct) {
  if (product.sku?.trim()) {
    return `SKU: ${product.sku.trim()}`;
  }

  if (product.id?.trim()) {
    return `ID: ${product.id.trim()}`;
  }

  return product.slug ? `Slug: ${product.slug}` : createProductSlug(product.name);
}

function normalizePriceLabel(price: string) {
  const normalized = price.trim();

  if (/call\s*for/i.test(normalized) || /request/i.test(normalized)) {
    return "Call for Price";
  }

  return normalized || "Call for Price";
}

function getStatusTone(status: string | undefined) {
  const normalized = (status || "Available on request").toLowerCase();

  if (normalized.includes("low")) {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }

  if (normalized.includes("out") || normalized.includes("hidden") || normalized.includes("draft")) {
    return "border-slate-200 bg-slate-100 text-slate-600";
  }

  if (normalized.includes("request")) {
    return "border-cyan-200 bg-cyan-50 text-cyan-800";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-800";
}

function getStatusLabel(status: string | undefined) {
  return status?.trim() || "Available on request";
}

function isVercelBlobUrl(url: string | undefined) {
  return Boolean(url?.includes(".public.blob.vercel-storage.com"));
}
