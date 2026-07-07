import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact AMCOL Industrial",
  description:
    "Request quotes, product availability, and procurement support from AMCOL Industrial in Penal, Trinidad & Tobago.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact AMCOL Industrial",
    description:
      "Reach AMCOL Industrial for industrial supplies, safety products, marine support, and maintenance procurement in Trinidad & Tobago.",
    url: absoluteUrl("/contact"),
    images: [
      {
        url: "/images/Heritage Industry.webp",
        alt: "Industrial facility supplied by AMCOL Industrial",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact AMCOL Industrial",
    description:
      "Request quotes and industrial procurement support from AMCOL Industrial.",
    images: ["/images/Heritage Industry.webp"],
  },
};

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
