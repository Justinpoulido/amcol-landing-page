import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getCategoryBySlug, getProductBySlug } from "@/lib/catalog-store";
import { ProductImageCarousel } from "./ProductImageCarousel";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { absoluteUrl, createMetaDescription, openGraphImage, siteName } from "@/lib/seo";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
  searchParams?: Promise<CategorySearchParams>;
};

type CategorySearchParams = {
  brand?: string | string[];
  pumpType?: string | string[];
};

const pipeValveFittingBrands = ["Valve", "Flange", "Pipe", "Fittings"] as const;
const sprayersPumpsSlug = "sprayers-pumps";
const pipeValveFittingBrandImages: Partial<
  Record<(typeof pipeValveFittingBrands)[number], string>
> = {
  Pipe: "/images/IPVF-PIPE.webp",
  Fittings: "/images/carbon-steel-industrial-pipe-fittings-thumbnail.webp",
};

function getSelectedBrand(value: string | string[] | undefined) {
  const selectedValue = Array.isArray(value) ? value[0] : value;

  return pipeValveFittingBrands.find(
    (brand) => brand.toLowerCase() === selectedValue?.toLowerCase(),
  );
}

function matchesBrand(productBrand: string | undefined, brand: string) {
  return productBrand?.toLowerCase() === brand.toLowerCase();
}

function getQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getProductTypes(products: { category: string }[]) {
  return Array.from(
    new Set(products.map((product) => product.category).filter(Boolean)),
  );
}

function getSelectedProductType(
  value: string | string[] | undefined,
  productTypes: string[],
) {
  const selectedValue = getQueryValue(value);

  return productTypes.find(
    (productType) => productType.toLowerCase() === selectedValue?.toLowerCase(),
  );
}

function matchesProductType(productType: string, selectedType: string) {
  return productType.toLowerCase() === selectedType.toLowerCase();
}

function getProductMetaDescription(
  product: NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>,
) {
  const genericDescription =
    "Product details are available through our sales team for this category.";
  const description =
    product.description && product.description !== genericDescription
      ? product.description
      : product.summary && product.summary !== genericDescription
      ? product.summary
      : undefined;

  return createMetaDescription(
    description ||
      `Request pricing and availability for ${product.name} and related ${product.category.toLowerCase()} from AMCOL Industrial in Trinidad & Tobago.`,
  );
}

export async function generateMetadata({
  params,
}: Pick<CategoryPageProps, "params">): Promise<Metadata> {
  const { category } = await params;
  const slug = category.toLowerCase();
  const data = await getCategoryBySlug(slug);
  const product = data ? null : await getProductBySlug(slug);

  if (product) {
    const title = `${product.name} | ${product.categoryName} Supplies`;
    const description = getProductMetaDescription(product);
    const canonicalPath = `/products/${product.slug || slug}`;

    return {
      title,
      description,
      alternates: {
        canonical: canonicalPath,
      },
      openGraph: {
        type: "website",
        siteName,
        locale: "en_TT",
        title,
        description,
        url: absoluteUrl(canonicalPath),
        images: openGraphImage(product.image, product.imageAlt || product.name),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [product.image],
      },
    };
  }

  if (data) {
    const title = `${data.title} | Industrial Supplies Trinidad & Tobago`;
    const description = createMetaDescription(data.description);
    const canonicalPath = `/products/${data.slug}`;

    return {
      title,
      description,
      alternates: {
        canonical: canonicalPath,
      },
      openGraph: {
        type: "website",
        siteName,
        locale: "en_TT",
        title,
        description,
        url: absoluteUrl(canonicalPath),
        images: openGraphImage(
          data.banner || data.image,
          `${data.name} supplies from AMCOL Industrial`,
        ),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [data.banner || data.image],
      },
    };
  }

  return {
    title: "Product Not Found",
    description:
      "The requested AMCOL Industrial product or category could not be found.",
    alternates: {
      canonical: "/products",
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const emptySearchParams: CategorySearchParams = {};
  const [{ category }, query] = await Promise.all([
    params,
    searchParams ?? Promise.resolve(emptySearchParams),
  ]);
  const slug = category.toLowerCase();
  const data = await getCategoryBySlug(slug);
  const product = data ? null : await getProductBySlug(slug);

  if (product) {
    const specifications = [
      ...(product.specifications ?? []),
      product.brand ? `Brand: ${product.brand}` : null,
      product.sku ? `SKU: ${product.sku}` : null,
      product.unit ? `Unit: ${product.unit}` : null,
      product.stockStatus ? `Availability: ${product.stockStatus}` : null,
    ].filter((item): item is string => Boolean(item));
    const galleryImages = Array.isArray(product.galleryImages)
      ? product.galleryImages.filter(Boolean)
      : [];

    const useCases =
      product.useCases && product.useCases.length > 0
        ? product.useCases
        : [
            `Industrial ${product.category.toLowerCase()} applications`,
            "Maintenance, facility operations, and procurement support",
            `Related ${product.categoryName} workflows`,
          ];

    return (
      <div className="min-h-screen bg-white font-sans text-zinc-900">
        <SiteHeader activeLink="PRODUCTS" />

        <main className="bg-[linear-gradient(180deg,#f8fbff_0%,#eef5fb_48%,#ffffff_100%)]">
          <section className="border-t border-slate-200 px-6 py-16 sm:px-8 sm:py-24 lg:px-10">
            <div className="mx-auto max-w-7xl">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Products", href: "/products" },
                  { label: product.categoryName, href: `/products/${product.categorySlug}` },
                  { label: product.name },
                ]}
              />
            </div>
            <div className="mx-auto mt-8 grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
              <ProductImageCarousel
                productName={product.name}
                mainImage={product.image}
                imageAlt={product.imageAlt}
                galleryImages={galleryImages}
              />

              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/products/${product.categorySlug}`}
                    className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-800 transition hover:border-cyan-300 hover:bg-cyan-100"
                  >
                    {product.categoryName}
                  </Link>
                  <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    {product.category}
                  </span>
                </div>

                <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  {product.name}
                </h1>

                <p className="mt-5 text-2xl font-semibold text-red-600">
                  {product.price}
                </p>

                <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
                  {product.description ||
                    "Contact our sales team for full specifications, compatible use cases, and ordering support."}
                </p>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <section className="rounded-[1.4rem] border border-slate-200 bg-white p-6">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-900">
                      Specifications
                    </h2>
                    {specifications.length > 0 ? (
                      <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
                        {specifications.map((specification) => (
                          <li key={specification}>{specification}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-5 text-sm leading-6 text-slate-600">
                        Detailed specifications are available through our sales team.
                      </p>
                    )}
                  </section>

                  <section className="rounded-[1.4rem] border border-slate-200 bg-white p-6">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-900">
                      Compatible Use Cases
                    </h2>
                    <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
                      {useCases.map((useCase) => (
                        <li key={useCase}>{useCase}</li>
                      ))}
                    </ul>
                  </section>
                </div>

                <div className="mt-8 rounded-[1.4rem] border border-cyan-200 bg-cyan-50 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-900">
                    Contact Sales / Order Support
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    Need pricing confirmation, bulk quantities, or compatibility guidance? AMCOL can help confirm fit and availability before you order.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-5 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-slate-800"
                  >
                    Contact sales
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-white font-sans text-zinc-900">
        <SiteHeader />

        <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
          <p className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-700">
            Product Not Found
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            We couldn&apos;t find that product.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            The link may be outdated, or the product may have moved. You can head back to the main products page and continue browsing from there.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex items-center rounded-full border border-slate-300 bg-slate-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-slate-800"
          >
            Return to Products
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const isPipeValveFittingCategory =
    data.name.toLowerCase().includes("pipe") &&
    data.name.toLowerCase().includes("valve") &&
    data.name.toLowerCase().includes("fitting");
  const selectedBrand = isPipeValveFittingCategory
    ? getSelectedBrand(query.brand)
    : undefined;
  const isSprayersPumpsCategory = data.slug === sprayersPumpsSlug;
  const productTypes = isSprayersPumpsCategory ? getProductTypes(data.products) : [];
  const selectedProductType = isSprayersPumpsCategory
    ? getSelectedProductType(query.pumpType, productTypes)
    : undefined;
  const hasProductFilterCards = isPipeValveFittingCategory || isSprayersPumpsCategory;
  const hasSelectedProductFilter = Boolean(selectedBrand || selectedProductType);
  const visibleProducts = selectedBrand
    ? data.products.filter((product) => matchesBrand(product.brand, selectedBrand))
    : selectedProductType
    ? data.products.filter((product) =>
        matchesProductType(product.category, selectedProductType),
      )
    : hasProductFilterCards
    ? []
    : data.products;

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900">
      <SiteHeader activeLink="PRODUCTS" />

      <div className="mx-auto max-w-7xl px-6 pt-6 lg:px-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            { label: data.name },
          ]}
        />
      </div>

      <section className="relative overflow-hidden bg-[#091624] px-6 py-20 sm:px-8 sm:py-24 lg:px-10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url('${data.banner}')` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(6,17,30,0.96)_0%,rgba(8,24,41,0.84)_55%,rgba(21,91,120,0.52)_100%)]" />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100">
              Category Spotlight
            </p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {data.title}
            </h1>
            <p className="mt-4 text-lg font-medium text-cyan-200 sm:text-xl">
              {data.subtitle}
            </p>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
              {data.description}
            </p>
          </div>

          <div className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-100/80">
              Product Focus
            </p>
            <p className="mt-4 text-2xl font-semibold text-white">
              {data.products.length} featured items in this category
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-200/85">
              Browse a tailored selection built around this category so visitors land on relevant items instead of a generic product listing.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.16em] text-cyan-100 transition hover:text-white"
            >
              View all categories
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#eef5fb_52%,#ffffff_100%)] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-800">
              Available Products
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Related items in {data.name}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Each category includes the seeded product lineup plus any additional items uploaded through the admin dashboard.
            </p>
          </div>

          {isPipeValveFittingCategory ? (
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {pipeValveFittingBrands.map((brand) => {
                const brandProducts = data.products.filter((product) =>
                  matchesBrand(product.brand, brand),
                );
                const previewProduct = brandProducts[0];
                const previewImage =
                  pipeValveFittingBrandImages[brand] || previewProduct?.image || data.image;
                const isActive = selectedBrand === brand;

                return (
                  <Link
                    key={brand}
                    href={
                      isActive
                        ? `/products/${data.slug}`
                        : `/products/${data.slug}?brand=${encodeURIComponent(brand)}`
                    }
                    className={`group relative flex min-h-[320px] flex-col overflow-hidden rounded-[1.6rem] border bg-white p-7 text-left shadow-[0_18px_42px_-28px_rgba(15,23,42,0.58)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-[0_28px_56px_-30px_rgba(8,47,73,0.36)] ${
                      isActive
                        ? "border-cyan-400 ring-2 ring-cyan-200"
                        : "border-slate-200"
                    }`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-700">
                          Select Category
                        </p>
                        <h3 className="mt-4 break-words text-3xl font-semibold tracking-tight text-slate-950">
                          {brand}
                        </h3>
                      </div>
                    </div>

                    <div className="relative mt-7 h-44 w-full shrink-0 overflow-hidden rounded-[1.25rem] border border-slate-100 bg-[linear-gradient(180deg,#f8fbfd_0%,#eef6fb_100%)]">
                      <Image
                        src={previewImage}
                        alt={previewProduct?.imageAlt || `${brand} products`}
                        fill
                        sizes="(min-width: 640px) 28vw, 100vw"
                        className="object-contain p-5 transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <p className="mt-5 text-base font-semibold text-slate-600">
                      {brandProducts.length} {brandProducts.length === 1 ? "item" : "items"}
                    </p>
                  </Link>
                );
              })}
            </div>
          ) : null}

          {isSprayersPumpsCategory ? (
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {productTypes.map((productType) => {
                const typeProducts = data.products.filter((product) =>
                  matchesProductType(product.category, productType),
                );
                const previewProduct = typeProducts[0];
                const isActive = selectedProductType === productType;

                return (
                  <Link
                    key={productType}
                    href={
                      isActive
                        ? `/products/${data.slug}`
                        : `/products/${data.slug}?pumpType=${encodeURIComponent(productType)}`
                    }
                    className={`group relative flex min-h-[320px] flex-col overflow-hidden rounded-[1.6rem] border bg-white p-7 text-left shadow-[0_18px_42px_-28px_rgba(15,23,42,0.58)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-[0_28px_56px_-30px_rgba(8,47,73,0.36)] ${
                      isActive
                        ? "border-cyan-400 ring-2 ring-cyan-200"
                        : "border-slate-200"
                    }`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-700">
                          Select Category
                        </p>
                        <h3 className="mt-4 break-words text-3xl font-semibold tracking-tight text-slate-950">
                          {productType}
                        </h3>
                      </div>
                    </div>

                    <div className="relative mt-7 h-44 w-full shrink-0 overflow-hidden rounded-[1.25rem] border border-slate-100 bg-[linear-gradient(180deg,#f8fbfd_0%,#eef6fb_100%)]">
                      <Image
                        src={previewProduct?.image || data.image}
                        alt={previewProduct?.imageAlt || `${productType} products`}
                        fill
                        sizes="(min-width: 640px) 28vw, 100vw"
                        className="object-contain p-5 transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <p className="mt-5 text-base font-semibold text-slate-600">
                      {typeProducts.length} {typeProducts.length === 1 ? "item" : "items"}
                    </p>
                  </Link>
                );
              })}
            </div>
          ) : null}

          {hasSelectedProductFilter ? (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600">
              {selectedBrand ? (
                <p>
                  Showing {visibleProducts.length} {selectedBrand.toLowerCase()}{" "}
                  {visibleProducts.length === 1 ? "product" : "products"}.
                </p>
              ) : null}
              {selectedProductType ? (
                <p>
                  Showing {visibleProducts.length} {selectedProductType.toLowerCase()}{" "}
                  {visibleProducts.length === 1 ? "product" : "products"}.
                </p>
              ) : null}
              <Link
                href={`/products/${data.slug}`}
                className="font-semibold uppercase tracking-[0.16em] text-cyan-800 transition hover:text-cyan-950"
              >
                Clear filter
              </Link>
            </div>
          ) : null}

          {visibleProducts.length > 0 ? (
            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug || product.id}`}
                  className="group relative flex min-h-[390px] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-[0_24px_50px_-26px_rgba(8,47,73,0.35)] sm:p-6"
                >
                  <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.20),transparent_68%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative flex h-72 w-full items-center justify-center overflow-hidden rounded-[1.4rem] border border-slate-100 bg-[linear-gradient(180deg,#f8fbfd_0%,#eef6fb_100%)] sm:h-80">
                    <Image
                      src={product.image}
                      alt={product.imageAlt || product.name}
                      fill
                      sizes="(min-width: 1280px) 24vw, (min-width: 640px) 50vw, 100vw"
                      className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.05]"
                    />
                  </div>

                  <div className="relative flex flex-1 flex-col pt-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-700">
                        {product.category}
                      </span>
                      {product.featured ? (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-700">
                          Featured
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-3 text-xl font-semibold leading-7 text-slate-900">
                      {product.name}
                    </h3>
                    <p className="product-card-summary mt-3 text-sm leading-6 text-slate-600">
                      {product.summary}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
                      <span className="font-semibold uppercase tracking-[0.16em] text-slate-800">
                        {product.price}
                      </span>
                      {product.brand ? <span>Brand: {product.brand}</span> : null}
                      {product.sku ? <span>SKU: {product.sku}</span> : null}
                      {product.unit ? <span>Unit: {product.unit}</span> : null}
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                      <p className="text-sm font-semibold text-slate-600">
                        {product.stockStatus || "Call for availability"}
                      </p>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition group-hover:text-cyan-800">
                        View details
                        <span aria-hidden="true">-&gt;</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
