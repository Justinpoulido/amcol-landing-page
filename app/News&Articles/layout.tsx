import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Industrial News & Project Articles",
  description:
    "Read AMCOL Industrial project highlights, delivery milestones, and field support stories across energy, marine, welding, and safety operations.",
  alternates: {
    canonical: "/News&Articles",
  },
  openGraph: {
    title: "Industrial News & Project Articles",
    description:
      "AMCOL Industrial project stories and field support updates from Trinidad & Tobago industrial sectors.",
    url: absoluteUrl("/News&Articles"),
    images: [
      {
        url: "/images/Heritage Industry.webp",
        alt: "Industrial project site in Trinidad and Tobago",
      },
    ],
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
