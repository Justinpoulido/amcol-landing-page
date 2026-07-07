import type { Metadata } from "next";
import { absoluteUrl, openGraphImage, siteName } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Industrial News & Project Articles",
  description:
    "Read AMCOL Industrial project highlights, delivery milestones, and field support stories across energy, marine, welding, and safety operations.",
  alternates: {
    canonical: "/news",
  },
  openGraph: {
    type: "website",
    siteName,
    locale: "en_TT",
    title: "Industrial News & Project Articles",
    description:
      "AMCOL Industrial project stories and field support updates from Trinidad & Tobago industrial sectors.",
    url: absoluteUrl("/news"),
    images: openGraphImage(
      "/images/Heritage Industry.webp",
      "Industrial project site in Trinidad and Tobago",
    ),
  },
  twitter: {
    card: "summary_large_image",
    title: "Industrial News & Project Articles",
    description:
      "Project stories and field support updates from AMCOL Industrial.",
    images: ["/images/Heritage Industry.webp"],
  },
};

export default function NewsAndArticlesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
