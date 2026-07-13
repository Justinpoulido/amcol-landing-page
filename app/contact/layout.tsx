import type { Metadata } from "next";
import { absoluteUrl, openGraphImage, siteName } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact AMCOL Industrial",
  description:
    "Contact AMCOL Industrial in Penal for industrial supplies, safety products, marine maintenance items, MRO support, and bulk procurement across Trinidad & Tobago.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    type: "website",
    siteName,
    locale: "en_TT",
    title: "Contact AMCOL Industrial",
    description:
      "Request industrial supply pricing, availability, sourcing help, and procurement support from AMCOL Industrial in Penal.",
    url: absoluteUrl("/contact"),
    images: openGraphImage(
      "/images/AMCOL Banner.webp",
      "Contact AMCOL Industrial for procurement support",
    ),
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact AMCOL Industrial",
    description:
      "Request industrial supply pricing, availability, sourcing help, and procurement support from AMCOL Industrial.",
    images: ["/images/AMCOL Banner.webp"],
  },
};

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
