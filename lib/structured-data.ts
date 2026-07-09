import { businessInfo, googleBusinessProfileUrl, socialLinks } from "@/lib/business-info";
import { absoluteUrl, siteName } from "@/lib/seo";

const organizationId = absoluteUrl("/#organization");
const websiteId = absoluteUrl("/#website");
const localBusinessId = absoluteUrl("/#localbusiness");

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: businessInfo.name,
    legalName: businessInfo.legalName,
    url: absoluteUrl("/"),
    logo: absoluteUrl(businessInfo.logo),
    email: businessInfo.email,
    telephone: businessInfo.telephone,
    sameAs: socialLinks.length > 0 ? socialLinks : undefined,
  };
}

export function localBusinessJsonLd() {
  const sameAs = [
    ...socialLinks,
    ...(googleBusinessProfileUrl ? [googleBusinessProfileUrl] : []),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": localBusinessId,
    name: businessInfo.name,
    url: absoluteUrl("/"),
    image: absoluteUrl("/images/AMCOL Banner.webp"),
    logo: absoluteUrl(businessInfo.logo),
    email: businessInfo.email,
    telephone: businessInfo.telephone,
    address: {
      "@type": "PostalAddress",
      ...businessInfo.address,
    },
    areaServed: businessInfo.areaServed.map((name) => ({
      "@type": "Place",
      name,
    })),
    openingHours: businessInfo.openingHours,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: siteName,
    url: absoluteUrl("/"),
    publisher: {
      "@id": organizationId,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/products")}?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? absoluteUrl(item.href) : undefined,
    })),
  };
}

export function productJsonLd(product: {
  name: string;
  description?: string;
  summary?: string;
  image: string;
  imageAlt?: string;
  brand?: string;
  sku?: string;
  categoryName: string;
  category: string;
  stockStatus?: string;
  slug?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.summary,
    image: absoluteUrl(product.image),
    category: `${product.categoryName} > ${product.category}`,
    brand: product.brand
      ? {
          "@type": "Brand",
          name: product.brand,
        }
      : undefined,
    sku: product.sku,
    url: product.slug ? absoluteUrl(`/products/${product.slug}`) : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "TTD",
      availability: product.stockStatus?.toLowerCase().includes("limited")
        ? "https://schema.org/LimitedAvailability"
        : undefined,
      seller: {
        "@id": organizationId,
      },
    },
  };
}

export function articleJsonLd(article: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image ? absoluteUrl(article.image) : absoluteUrl(defaultArticleImage),
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      "@type": "Organization",
      "@id": organizationId,
      name: businessInfo.name,
    },
    publisher: {
      "@id": organizationId,
    },
    mainEntityOfPage: article.url,
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

const defaultArticleImage = "/images/AMCOL Banner.webp";
