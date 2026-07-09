import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { JsonLd } from "@/app/components/JsonLd";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { industrialArticles } from "@/lib/articles";
import { absoluteUrl, createMetaDescription, openGraphImage, siteName } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

type NewsArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getArticle(slug: string) {
  return industrialArticles.find((article) => article.slug === slug);
}

export async function generateMetadata({
  params,
}: NewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    return {
      title: "News Article Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalPath = `/news/${article.slug}`;
  const description = createMetaDescription(article.summary);

  return {
    title: article.title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "article",
      siteName,
      locale: "en_TT",
      title: article.title,
      description,
      url: absoluteUrl(canonicalPath),
      images: openGraphImage(
        article.image,
        `${article.title} project support in ${article.location}`,
      ),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: [article.image],
    },
  };
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "News", href: "/news" },
    { label: article.title },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900">
      <SiteHeader />
      <JsonLd id="news-breadcrumb-schema" data={breadcrumbJsonLd(breadcrumbItems)} />

      <main>
        <section className="border-t border-slate-200 bg-slate-950 px-6 py-16 text-white sm:py-24 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <Breadcrumbs items={breadcrumbItems} />
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">
              {article.sector} | {article.location}
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              {article.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
              {article.summary}
            </p>
          </div>
        </section>

        <section className="bg-white px-6 py-14 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="relative min-h-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm sm:min-h-[420px]">
              <Image
                src={article.image}
                alt={`${article.title} project support in ${article.location}`}
                fill
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="object-cover"
              />
            </div>

            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-800">
                Project Summary
              </p>
              <p className="mt-4 text-base leading-8 text-slate-700">
                AMCOL Industrial supported this work with procurement coordination, relevant product sourcing, and supply guidance for operational teams in Trinidad & Tobago.
              </p>
              <dl className="mt-8 grid gap-4 text-sm text-slate-600">
                <div>
                  <dt className="font-semibold text-slate-950">Location</dt>
                  <dd>{article.location}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-950">Completed</dt>
                  <dd>
                    {new Date(article.completedOn).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-950">Focus</dt>
                  <dd>{article.tags.join(", ")}</dd>
                </div>
              </dl>
              <Link
                href="/contact"
                className="mt-8 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Request supply support
              </Link>
            </article>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
