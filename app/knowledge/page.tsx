import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { JsonLd } from "@/app/components/JsonLd";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import {
  getKnowledgeArticlePath,
  getKnowledgeCategory,
  knowledgeCategories,
  searchKnowledgeArticles,
} from "@/lib/knowledge-base";
import { absoluteUrl, openGraphImage, siteName } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Industrial Knowledge Center",
  description:
    "Industrial supply guides for safety, marine, PPE, lubricants, pumps, valves, welding, chemicals, and construction teams in Trinidad & Tobago.",
  alternates: {
    canonical: "/knowledge",
  },
  openGraph: {
    type: "website",
    siteName,
    locale: "en_TT",
    title: "AMCOL Industrial Knowledge Center",
    description:
      "Search practical industrial supply guides for safety, marine, PPE, lubricants, pumps, valves, welding, chemicals, and construction.",
    url: absoluteUrl("/knowledge"),
    images: openGraphImage(
      "/images/AMCOL Banner.webp",
      "AMCOL Industrial Knowledge Center",
    ),
  },
  twitter: {
    card: "summary_large_image",
    title: "AMCOL Industrial Knowledge Center",
    description:
      "Industrial supply guides for Trinidad worksites, procurement teams, contractors, and maintenance buyers.",
    images: ["/images/AMCOL Banner.webp"],
  },
};

type KnowledgePageProps = {
  searchParams?: Promise<{
    search?: string | string[];
  }>;
};

function getSearchValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function KnowledgePage({ searchParams }: KnowledgePageProps) {
  const query = await searchParams;
  const searchQuery = getSearchValue(query?.search)?.trim() ?? "";
  const visibleArticles = searchKnowledgeArticles(searchQuery);

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900">
      <SiteHeader activeLink="KNOWLEDGE" />

      <main>
        <section className="relative overflow-hidden bg-brand-charcoal pt-28 pb-20 sm:pt-36 sm:pb-28">
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-45 grayscale mix-blend-overlay"
              style={{ backgroundImage: "url('/images/Heritage Industry.webp')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f1b2d]/80 via-[#0f1b2d]/66 to-[#0f1b2d]" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Knowledge" }]} />
            <div className="mt-8 max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#39d9cd]">
                Industrial Knowledge Center
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Practical Industrial Supply Answers for Trinidad Worksites
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
                Search AMCOL guides for safety, marine, PPE, lubricants, bearings,
                pumps, valves, welding, fire protection, chemicals, construction, and
                material handling procurement decisions.
              </p>
            </div>

            <form
              action="/knowledge"
              className="mt-10 grid max-w-3xl gap-3 rounded-sm border border-cyan-200/20 bg-white/10 p-3 backdrop-blur sm:grid-cols-[1fr_auto]"
            >
              <label htmlFor="knowledge-search" className="sr-only">
                Search the Knowledge Center
              </label>
              <input
                id="knowledge-search"
                name="search"
                type="search"
                defaultValue={searchQuery}
                placeholder="Search safety, pumps, welding, chemicals..."
                className="h-12 rounded-sm border border-white/20 bg-white px-4 text-sm font-medium text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[#39d9cd] focus:ring-2 focus:ring-[#39d9cd]/30"
              />
              <button
                type="submit"
                className="h-12 rounded-sm bg-[#39d9cd] px-6 text-sm font-bold uppercase tracking-[0.18em] text-[#101722] transition hover:bg-white"
              >
                Search
              </button>
            </form>
          </div>
        </section>

        <section className="border-b border-zinc-200 bg-white py-10">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-zinc-900">Browse by Topic</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {knowledgeCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/knowledge/${category.slug}`}
                  className="rounded-sm border border-zinc-200 bg-zinc-50 p-5 transition hover:-translate-y-0.5 hover:border-[#39d9cd] hover:bg-white hover:shadow-sm"
                >
                  <h3 className="text-lg font-bold text-zinc-900">{category.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{category.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-zinc-50 py-14">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
                  {searchQuery ? `Search Results for "${searchQuery}"` : "Latest Industrial Guides"}
                </h2>
                <p className="mt-2 text-zinc-600">
                  {visibleArticles.length} guide{visibleArticles.length === 1 ? "" : "s"} available.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex w-fit items-center justify-center rounded-sm bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Request Quote
              </Link>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {visibleArticles.map((article) => {
                const category = getKnowledgeCategory(article.categorySlug);

                return (
                  <article
                    key={article.slug}
                    className="rounded-sm border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">
                      {category?.name}
                    </p>
                    <h3 className="mt-3 text-2xl font-bold leading-tight text-zinc-900">
                      <Link href={getKnowledgeArticlePath(article)} className="hover:text-red-700">
                        {article.title}
                      </Link>
                    </h3>
                    <p className="mt-3 text-zinc-600">{article.excerpt}</p>
                    <div className="mt-5 flex flex-wrap gap-3 text-sm text-zinc-500">
                      <span>{article.readingMinutes} min read</span>
                      <span>Last updated {article.lastUpdated}</span>
                    </div>
                    <Link
                      href={getKnowledgeArticlePath(article)}
                      className="mt-5 inline-flex text-sm font-bold text-zinc-900 transition hover:text-red-700"
                    >
                      Read guide
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <JsonLd
        id="knowledge-breadcrumb-schema"
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Knowledge", href: "/knowledge" },
        ])}
      />
    </div>
  );
}

