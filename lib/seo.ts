const defaultSiteUrl = "https://amcolindustrial.com";

export const siteName = "AMCOL Industrial";
export const defaultOpenGraphImage = {
  url: "/images/AMCOL Banner.webp",
  alt: "AMCOL Industrial supply and procurement support",
};

export function getSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : defaultSiteUrl);

  return configuredUrl.replace(/\/+$/, "");
}

export function absoluteUrl(path = "/") {
  return new URL(path, getSiteUrl()).toString();
}

export function createMetaDescription(value: string, maxLength = 155) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

export function openGraphImage(
  url = defaultOpenGraphImage.url,
  alt = defaultOpenGraphImage.alt,
) {
  return [
    {
      url,
      alt,
    },
  ];
}
