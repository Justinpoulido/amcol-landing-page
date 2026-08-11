import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { JsonLd } from "@/app/components/JsonLd";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { getSubcategoryBySlugs } from "@/lib/catalog-store";
import { absoluteUrl, createMetaDescription, openGraphImage, siteName } from "@/lib/seo";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/structured-data";

type SubcategoryPageProps = {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
  searchParams?: Promise<{
    page?: string | string[];
  }>;
};

const productsPerPage = 24;

function getSearchValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getPageValue(value: string | string[] | undefined) {
  const parsedPage = Number.parseInt(getSearchValue(value) ?? "1", 10);

  return Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
}

function buildSubcategoryHref(categorySlug: string, subcategorySlug: string, page: number) {
  return page > 1
    ? `/products/${categorySlug}/${subcategorySlug}?page=${page}#product-results`
    : `/products/${categorySlug}/${subcategorySlug}#product-results`;
}

export async function generateMetadata({
  params,
}: Pick<SubcategoryPageProps, "params">): Promise<Metadata> {
  const { category, subcategory } = await params;
  const data = await getSubcategoryBySlugs(category.toLowerCase(), subcategory.toLowerCase());

  if (!data) {
    return {
      title: "Subcategory Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title = `${data.subcategory.name} | ${data.category.name} Supplies`;
  const canonicalPath = `/products/${data.category.slug}/${data.subcategory.slug}`;
  const description = createMetaDescription(data.subcategory.description);

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "website",
      siteName,
      locale: "en_TT",
      title,
      description,
      url: absoluteUrl(canonicalPath),
      images: openGraphImage(
        data.subcategory.image || data.category.image,
        `${data.subcategory.name} products from AMCOL Industrial`,
      ),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [data.subcategory.image || data.category.image],
    },
  };
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: SubcategoryPageProps) {
  const emptySearchParams: { page?: string | string[] } = {};
  const [{ category, subcategory }, query] = await Promise.all([
    params,
    searchParams ?? Promise.resolve(emptySearchParams),
  ]);
  const data = await getSubcategoryBySlugs(category.toLowerCase(), subcategory.toLowerCase());

  if (!data) {
    notFound();
  }

  const requestedPage = getPageValue(query.page);
  const totalProducts = data.subcategory.products.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / productsPerPage));
  const currentPage = Math.min(requestedPage, totalPages);

  if (requestedPage !== currentPage) {
    redirect(buildSubcategoryHref(data.category.slug, data.subcategory.slug, currentPage));
  }

  const visibleProducts = data.subcategory.products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  );
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: data.category.name, href: `/products/${data.category.slug}` },
    { label: data.subcategory.name },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900">
      <SiteHeader activeLink="PRODUCTS" />
      <JsonLd id="subcategory-breadcrumb-schema" data={breadcrumbJsonLd(breadcrumbItems)} />
      <JsonLd
        id="subcategory-item-list-schema"
        data={itemListJsonLd(
          visibleProducts.map((product) => ({
            name: product.name,
            url: `/products/${product.slug || product.id}`,
          })),
          `${data.category.name} / ${data.subcategory.name} products from AMCOL Industrial`,
        )}
      />

      <main>
        <section className="bg-[#091624] px-6 py-16 text-white sm:px-8 sm:py-24 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <Breadcrumbs items={breadcrumbItems} />
            <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100">
              {data.category.name} / {data.subcategory.name}
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              {data.subcategory.name}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">
              {data.subcategory.description}
            </p>
          </div>
        </section>

        <section id="product-results" className="scroll-mt-24 bg-zinc-50 px-6 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-800">
                  Products
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                  Products in {data.subcategory.name}
                </h2>
              </div>
              <p className="text-sm text-slate-600">
                Showing {totalProducts === 0 ? 0 : (currentPage - 1) * productsPerPage + 1}-
                {Math.min(currentPage * productsPerPage, totalProducts)} of {totalProducts} products.
              </p>
            </div>

            {visibleProducts.length > 0 ? (
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {visibleProducts.map((product) => (
                  <Link
                    key={`${data.subcategory.slug}-${product.slug || product.id}`}
                    href={`/products/${product.slug || product.id}`}
                    className="group relative flex min-h-[390px] flex-col overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.55)] transition-all duration-300 hover:border-cyan-300"
                  >
                    <div className="relative flex h-72 w-full items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-[linear-gradient(180deg,#f8fbfd_0%,#eef6fb_100%)] sm:h-80">
                      <Image
                        src={product.image}
                        alt={product.imageAlt || product.name}
                        fill
                        sizes="(min-width: 1280px) 24vw, (min-width: 640px) 50vw, 100vw"
                        className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.05]"
                      />
                    </div>
                    <div className="flex flex-1 flex-col pt-5">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-700">
                        {data.subcategory.name}
                      </span>
                      <h3 className="mt-3 text-xl font-semibold leading-7 text-slate-900">
                        {product.name}
                      </h3>
                      <p className="product-card-summary mt-3 text-sm leading-6 text-slate-600">
                        {product.summary}
                      </p>
                      <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                        <span className="font-semibold uppercase tracking-[0.16em] text-slate-800">
                          {product.price}
                        </span>
                        <span className="text-sm font-semibold text-slate-900">
                          View details -&gt;
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-10 rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
                <h2 className="text-xl font-semibold text-slate-950">No products found</h2>
                <p className="mt-3 text-sm text-slate-600">
                  Products can still be browsed from the parent category.
                </p>
              </div>
            )}

            {totalPages > 1 ? (
              <nav className="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-600">
                <p>
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  {currentPage > 1 ? (
                    <Link
                      href={buildSubcategoryHref(
                        data.category.slug,
                        data.subcategory.slug,
                        currentPage - 1,
                      )}
                      className="rounded-lg border border-slate-200 px-3 py-2 font-semibold text-slate-700"
                    >
                      Previous
                    </Link>
                  ) : null}
                  {currentPage < totalPages ? (
                    <Link
                      href={buildSubcategoryHref(
                        data.category.slug,
                        data.subcategory.slug,
                        currentPage + 1,
                      )}
                      className="rounded-lg border border-slate-200 px-3 py-2 font-semibold text-slate-700"
                    >
                      Next
                    </Link>
                  ) : null}
                </div>
              </nav>
            ) : null}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
