import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { JsonLd } from "@/app/components/JsonLd";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import {
  getKnowledgeArticle,
  getKnowledgeArticlePath,
  getKnowledgeCategory,
  getRelatedKnowledgeArticles,
  knowledgeArticles,
} from "@/lib/knowledge-base";
import { absoluteUrl, openGraphImage, siteName } from "@/lib/seo";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/structured-data";

type KnowledgeArticlePageProps = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
};

export function generateStaticParams() {
  return knowledgeArticles.map((article) => ({
    category: article.categorySlug,
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: KnowledgeArticlePageProps): Promise<Metadata> {
  const { category: categorySlug, slug } = await params;
  const article = getKnowledgeArticle(categorySlug, slug);

  if (!article) {
    return {
      title: "Knowledge Article Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const path = getKnowledgeArticlePath(article);
  const title = article.metaTitle.split(" | ")[0];

  return {
    title,
    description: article.metaDescription,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "article",
      siteName,
      locale: "en_TT",
      title: article.metaTitle,
      description: article.metaDescription,
      url: absoluteUrl(path),
      publishedTime: article.lastUpdated,
      modifiedTime: article.lastUpdated,
      images: openGraphImage(
        "/images/AMCOL Banner.webp",
        `${article.title} from AMCOL Industrial`,
      ),
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle,
      description: article.metaDescription,
      images: ["/images/AMCOL Banner.webp"],
    },
  };
}

export default async function KnowledgeArticlePage({ params }: KnowledgeArticlePageProps) {
  const { category: categorySlug, slug } = await params;
  const article = getKnowledgeArticle(categorySlug, slug);

  if (!article) {
    notFound();
  }

  const category = getKnowledgeCategory(article.categorySlug);

  if (!category) {
    notFound();
  }

  const relatedArticles = getRelatedKnowledgeArticles(article);
  const articlePath = getKnowledgeArticlePath(article);
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Knowledge", href: "/knowledge" },
    { label: category.name, href: `/knowledge/${category.slug}` },
    { label: article.title, href: articlePath },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900">
      <SiteHeader activeLink="KNOWLEDGE" />

      <main>
        <article>
          <section className="bg-brand-charcoal py-16 sm:py-20">
            <div className="mx-auto max-w-4xl px-6 lg:px-8">
              <Breadcrumbs items={breadcrumbItems} />
              <p className="mt-8 text-sm font-semibold uppercase tracking-[0.22em] text-[#39d9cd]">
                {category.name} Guide
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {article.title}
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-200">{article.excerpt}</p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm font-medium text-slate-300">
                <span>{article.readingMinutes} min read</span>
                <span>Last updated {article.lastUpdated}</span>
              </div>
            </div>
          </section>

          <section className="bg-white py-14">
            <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
              <div className="max-w-3xl">
                <div className="rounded-sm border border-cyan-200 bg-cyan-50 p-5">
                  <h2 className="text-lg font-bold text-zinc-900">Quick Answer</h2>
                  <p className="mt-2 leading-7 text-zinc-700">{article.aiSummary}</p>
                </div>

                <div className="mt-10 space-y-10">
                  {article.sections.map((section) => (
                    <section key={section.heading}>
                      <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                        {section.heading}
                      </h2>
                      <p className="mt-4 leading-8 text-zinc-700">{section.body}</p>
                      {section.bullets ? (
                        <ul className="mt-5 space-y-3 text-zinc-700">
                          {section.bullets.map((bullet) => (
                            <li key={bullet} className="flex gap-3">
                              <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </section>
                  ))}
                </div>

                <section className="mt-12 rounded-sm border border-zinc-200 bg-zinc-50 p-6">
                  <h2 className="text-2xl font-bold text-zinc-900">Frequently Asked Questions</h2>
                  <div className="mt-6 space-y-6">
                    {article.faqs.map((faq) => (
                      <div key={faq.question}>
                        <h3 className="font-bold text-zinc-900">{faq.question}</h3>
                        <p className="mt-2 leading-7 text-zinc-700">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {relatedArticles.length > 0 ? (
                  <section className="mt-12">
                    <h2 className="text-2xl font-bold text-zinc-900">Related Articles</h2>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      {relatedArticles.map((relatedArticle) => (
                        <Link
                          key={relatedArticle.slug}
                          href={getKnowledgeArticlePath(relatedArticle)}
                          className="rounded-sm border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-sm"
                        >
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-600">
                            {getKnowledgeCategory(relatedArticle.categorySlug)?.name}
                          </p>
                          <h3 className="mt-2 font-bold leading-snug text-zinc-900">
                            {relatedArticle.title}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-zinc-600">
                            {relatedArticle.excerpt}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>

              <aside className="space-y-6">
                <div className="rounded-sm border border-zinc-200 bg-zinc-50 p-6">
                  <h2 className="text-lg font-bold text-zinc-900">Related AMCOL Categories</h2>
                  <div className="mt-4 space-y-3">
                    {article.relatedProductCategories.map((productCategory) => (
                      <Link
                        key={productCategory.href}
                        href={productCategory.href}
                        className="block rounded-sm border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-800 transition hover:border-[#39d9cd] hover:text-red-700"
                      >
                        {productCategory.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="rounded-sm bg-zinc-900 p-6 text-white">
                  <h2 className="text-xl font-bold">Need pricing or availability?</h2>
                  <p className="mt-3 text-sm leading-6 text-zinc-300">
                    Send your item list, quantities, preferred brands, and required timing.
                    AMCOL can help source industrial supplies for Trinidad worksites.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-5 inline-flex rounded-sm bg-[#39d9cd] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#101722] transition hover:bg-white"
                  >
                    Request Quote/Service
                  </Link>
                </div>
              </aside>
            </div>
          </section>
        </article>
      </main>

      <SiteFooter />
      <JsonLd id="knowledge-article-breadcrumb-schema" data={breadcrumbJsonLd(breadcrumbItems)} />
      <JsonLd
        id="knowledge-article-schema"
        data={articleJsonLd({
          title: article.title,
          description: article.excerpt,
          url: absoluteUrl(articlePath),
          image: "/images/AMCOL Banner.webp",
          datePublished: article.lastUpdated,
          dateModified: article.lastUpdated,
        })}
      />
      <JsonLd id="knowledge-article-faq-schema" data={faqJsonLd(article.faqs)} />
    </div>
  );
}

