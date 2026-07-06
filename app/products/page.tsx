import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllProducts, getFeaturedCategories } from "@/lib/catalog-store";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Product Catalog",
  description:
    "Browse AMCOL Industrial's catalog of industrial, marine, safety, and maintenance supplies across every product category.",
};

type ProductsPageProps = {
  searchParams?: Promise<{
    search?: string | string[];
  }>;
};

function getSearchValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function productMatchesSearch(
  product: Awaited<ReturnType<typeof getAllProducts>>[number],
  query: string,
) {
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

  return searchableText.includes(query.toLowerCase());
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const query = await searchParams;
  const searchQuery = getSearchValue(query?.search)?.trim() ?? "";
  const [products, featuredProductCategories] = await Promise.all([
    getAllProducts(),
    Promise.resolve(getFeaturedCategories()),
  ]);
  const visibleProducts = searchQuery
    ? products.filter((product) => productMatchesSearch(product, searchQuery))
    : products;

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900">
      <SiteHeader activeLink="PRODUCTS" />

      <section className="relative overflow-hidden bg-brand-charcoal pt-32 pb-24 sm:pt-40 sm:pb-32">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-50 grayscale mix-blend-overlay"
            style={{ backgroundImage: "url('/images/Heritage Industry.webp')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f1b2d]/80 via-[#0f1b2d]/60 to-[#0f1b2d]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            World-Class <span className="text-brand-copper">Products</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg leading-8 text-gray-300">
            Explore our comprehensive catalog of industrial, construction, and marine supplies designed for performance and durability.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Industries We Serve
          </h2>
          <p className="mt-6 mx-auto max-w-3xl text-lg leading-8 text-zinc-600">
            At AMCOL, we pride ourselves on being the backbone of major industries. From heavy construction and industrial manufacturing to marine logistics and energy production, our diverse product range ensures that you have the right tools and materials for every job.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProductCategories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative flex h-64 flex-col overflow-hidden rounded-2xl transition-all hover:shadow-lg"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${category.image}')` }}
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative flex flex-1 items-center justify-center">
                  <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products" }]} />
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-700">
                Product Catalog
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                {searchQuery ? `Search results for "${searchQuery}"` : "Browse all products"}
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              Showing {visibleProducts.length} of {products.length} items across the AMCOL catalog.
            </p>
          </div>

          <form action="/products" className="mt-8 max-w-xl">
            <label htmlFor="product-search" className="sr-only">
              Search products
            </label>
            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 fill-slate-400"
              >
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
              </svg>
              <input
                id="product-search"
                name="search"
                type="search"
                defaultValue={searchQuery}
                placeholder="Search by product, category, brand, or SKU..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"
              />
            </div>
          </form>

          {visibleProducts.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visibleProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group relative flex min-h-[420px] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-[0_24px_50px_-26px_rgba(8,47,73,0.35)] sm:p-6"
              >
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
                    <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-800">
                      {product.category}
                    </span>
                    {product.featured ? (
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700">
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
                    <span className="font-semibold text-red-600">{product.price}</span>
                    {product.brand ? <span>Brand: {product.brand}</span> : null}
                    {product.sku ? <span>SKU: {product.sku}</span> : null}
                    {product.unit ? <span>Unit: {product.unit}</span> : null}
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-6">
                    <span className="text-sm font-medium text-slate-500">
                      {product.stockStatus || "Call for availability"}
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition group-hover:text-cyan-800">
                      View details
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          ) : (
            <div className="mt-12 rounded-[1.5rem] border border-slate-200 bg-white px-6 py-12 text-center shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)]">
              <h3 className="text-xl font-semibold text-slate-950">No products found</h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
                Try a different product name, brand, category, or SKU.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-flex rounded-full border border-slate-200 bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Clear search
              </Link>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
