import type { MetadataRoute } from "next";
import { getAllProducts, getLandingCategories } from "@/lib/catalog-store";
import { industrialArticles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/seo";
import {
  getKnowledgeArticlePath,
  knowledgeArticles,
  knowledgeCategories,
} from "@/lib/knowledge-base";

const siteContentLastModified = "2026-07-09";

function getLastModified(value?: string) {
  if (!value) {
    return siteContentLastModified;
  }

  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp)
    ? siteContentLastModified
    : new Date(timestamp).toISOString();
}

function toSitemapEntry(
  path: string,
  options: Pick<MetadataRoute.Sitemap[number], "changeFrequency" | "priority"> & {
    lastModified?: string;
  },
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    lastModified: getLastModified(options.lastModified),
    changeFrequency: options.changeFrequency,
    priority: options.priority,
  };
}

function uniqueEntries(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const seenUrls = new Set<string>();

  return entries.filter((entry) => {
    if (seenUrls.has(entry.url)) {
      return false;
    }

    seenUrls.add(entry.url);
    return true;
  });
}

function getNewestDate(values: Array<string | undefined>) {
  return values
    .map((value) => getLastModified(value))
    .sort()
    .at(-1);
}

function getKnowledgeCategoryLastModified(categorySlug: string) {
  return getNewestDate(
    knowledgeArticles
      .filter((article) => article.categorySlug === categorySlug)
      .map((article) => article.lastUpdated),
  );
}

function getProductCategoryLastModified(
  categorySlug: string,
  products: Awaited<ReturnType<typeof getAllProducts>>,
) {
  return getNewestDate(
    products
      .filter((product) => product.categorySlug === categorySlug)
      .map((product) => product.createdAt),
  );
}

function getStaticEntries(): MetadataRoute.Sitemap {
  return [
    toSitemapEntry("/", { changeFrequency: "weekly", priority: 1 }),
    toSitemapEntry("/products", { changeFrequency: "daily", priority: 0.95 }),
    toSitemapEntry("/knowledge", { changeFrequency: "weekly", priority: 0.9 }),
    toSitemapEntry("/contact", { changeFrequency: "monthly", priority: 0.8 }),
    toSitemapEntry("/news", {
      changeFrequency: "monthly",
      priority: 0.6,
      lastModified: getNewestDate(
        industrialArticles.map((article) => article.completedOn),
      ),
    }),
    toSitemapEntry("/privacy", { changeFrequency: "yearly", priority: 0.2 }),
    toSitemapEntry("/terms", { changeFrequency: "yearly", priority: 0.2 }),
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    getLandingCategories(),
    getAllProducts(),
  ]);

  const staticEntries = getStaticEntries();

  const categoryEntries = categories.map((category) =>
    toSitemapEntry(`/products/${category.slug}`, {
      changeFrequency: "weekly",
      priority: 0.85,
      lastModified: getProductCategoryLastModified(category.slug, products),
    }),
  );

  const articleEntries = industrialArticles.map((article) =>
    toSitemapEntry(`/news/${article.slug}`, {
      changeFrequency: "monthly",
      priority: 0.55,
      lastModified: article.completedOn,
    }),
  );

  const knowledgeCategoryEntries = knowledgeCategories.map((category) =>
    toSitemapEntry(`/knowledge/${category.slug}`, {
      changeFrequency: "monthly",
      priority: 0.75,
      lastModified: getKnowledgeCategoryLastModified(category.slug),
    }),
  );

  const knowledgeArticleEntries = knowledgeArticles.map((article) =>
    toSitemapEntry(getKnowledgeArticlePath(article), {
      changeFrequency: "monthly",
      priority: 0.72,
      lastModified: article.lastUpdated,
    }),
  );

  const seenProductSlugs = new Set<string>();
  const productEntries = products
    .filter((product) => {
      if (!product.slug || seenProductSlugs.has(product.slug)) {
        return false;
      }

      seenProductSlugs.add(product.slug);
      return true;
    })
    .map((product) =>
      toSitemapEntry(`/products/${product.slug}`, {
        changeFrequency: "weekly",
        priority: product.featured ? 0.8 : 0.7,
        lastModified: product.createdAt,
      }),
    );

  return uniqueEntries([
    ...staticEntries,
    ...categoryEntries,
    ...productEntries,
    ...articleEntries,
    ...knowledgeCategoryEntries,
    ...knowledgeArticleEntries,
  ]);
}
