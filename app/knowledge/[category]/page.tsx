import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { JsonLd } from "@/app/components/JsonLd";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import {
  getKnowledgeArticlePath,
  getKnowledgeArticlesByCategory,
  getKnowledgeCategory,
  knowledgeCategories,
} from "@/lib/knowledge-base";
import { absoluteUrl, openGraphImage, siteName } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

type KnowledgeCategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export function generateStaticParams() {
  return knowledgeCategories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: KnowledgeCategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getKnowledgeCategory(categorySlug);

  if (!category) {
    return {
      title: "Knowledge Category Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const url = `/knowledge/${category.slug}`;
  const title = category.metaTitle.split(" | ")[0];

  return {
    title,
    description: category.metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      siteName,
      locale: "en_TT",
      title: category.metaTitle,
      description: category.metaDescription,
      url: absoluteUrl(url),
      images: openGraphImage(
        "/images/AMCOL Banner.webp",
        `${category.name} industrial knowledge from AMCOL Industrial`,
      ),
    },
    twitter: {
      card: "summary_large_image",
      title: category.metaTitle,
      description: category.metaDescription,
      images: ["/images/AMCOL Banner.webp"],
    },
  };
}

export default async function KnowledgeCategoryPage({ params }: KnowledgeCategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = getKnowledgeCategory(categorySlug);

  if (!category) {
    notFound();
  }

  const articles = getKnowledgeArticlesByCategory(category.slug);

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900">
      <SiteHeader activeLink="KNOWLEDGE" />

      <main>
        <section className="bg-brand-charcoal py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Knowledge", href: "/knowledge" },
                { label: category.name },
              ]}
            />
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.22em] text-[#39d9cd]">
              Knowledge Category
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {category.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200">
              {category.description}
            </p>
          </div>
        </section>

        <section className="bg-zinc-50 py-14">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-2">
              {articles.map((article) => (
                <article
                  key={article.slug}
                  className="rounded-sm border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">
                    {article.intent}
                  </p>
                  <h2 className="mt-3 text-2xl font-bold leading-tight text-zinc-900">
                    <Link href={getKnowledgeArticlePath(article)} className="hover:text-red-700">
                      {article.title}
                    </Link>
                  </h2>
                  <p className="mt-3 text-zinc-600">{article.excerpt}</p>
                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-zinc-500">
                    <span>{article.readingMinutes} min read</span>
                    <span>Last updated {article.lastUpdated}</span>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 rounded-sm border border-zinc-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-zinc-900">Need help sourcing products?</h2>
              <p className="mt-2 max-w-3xl text-zinc-600">
                Send AMCOL your supply list, preferred brands, quantities, and delivery timing.
                Our team can help match the right industrial products for the job.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex rounded-sm bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <JsonLd
        id="knowledge-category-breadcrumb-schema"
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Knowledge", href: "/knowledge" },
          { label: category.name, href: `/knowledge/${category.slug}` },
        ])}
      />
    </div>
  );
}
