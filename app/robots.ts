import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/api/admin",
        "/api/admin/",
        "/*?brand=",
        "/*?*brand=",
        "/*?pumpType=",
        "/*?*pumpType=",
        "/*?search=",
        "/*?*search=",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: new URL(siteUrl).host,
  };
}
