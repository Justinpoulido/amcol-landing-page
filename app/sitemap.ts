import type { MetadataRoute } from "next";
import { getAllProducts, getLandingCategories } from "@/lib/catalog-store";
import { industrialArticles } from "@/lib/articles";

const defaultSiteUrl = "https://amcolindustrial.com";

function getSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : defaultSiteUrl);

  return configuredUrl.replace(/\/+$/, "");
}

function toSitemapEntry(
  path: string,
  options: Pick<MetadataRoute.Sitemap[number], "changeFrequency" | "priority">,
): MetadataRoute.Sitemap[number] {
  return {
    url: new URL(path, getSiteUrl()).toString(),
    lastModified: new Date(),
    ...options,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    getLandingCategories(),
    getAllProducts(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = [
    toSitemapEntry("/", { changeFrequency: "weekly", priority: 1 }),
    toSitemapEntry("/products", { changeFrequency: "daily", priority: 0.95 }),
    toSitemapEntry("/contact", { changeFrequency: "monthly", priority: 0.8 }),
    toSitemapEntry("/news", { changeFrequency: "monthly", priority: 0.6 }),
    toSitemapEntry("/privacy", { changeFrequency: "yearly", priority: 0.2 }),
    toSitemapEntry("/terms", { changeFrequency: "yearly", priority: 0.2 }),
  ];

  const categoryEntries = categories.map((category) =>
    toSitemapEntry(`/products/${category.slug}`, {
      changeFrequency: "weekly",
      priority: 0.85,
    }),
  );

  const articleEntries = industrialArticles.map((article) =>
    toSitemapEntry(`/news/${article.slug}`, {
      changeFrequency: "monthly",
      priority: 0.55,
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
      }),
    );

  return [...staticEntries, ...categoryEntries, ...productEntries, ...articleEntries];
}
