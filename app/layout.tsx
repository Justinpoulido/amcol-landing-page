import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { absoluteUrl, getSiteUrl, openGraphImage, siteName } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: siteName,
  title: {
    default: "AMCOL Industrial | Industrial, Marine & Safety Supply",
    template: "%s | AMCOL Industrial",
  },
  description:
    "AMCOL Industrial supplies industrial, marine, safety, and maintenance products across Trinidad & Tobago, with dedicated procurement support for facility operators and enterprise projects.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName,
    locale: "en_TT",
    title: "AMCOL Industrial | Industrial, Marine & Safety Supply",
    description:
      "Industrial, marine, safety, and maintenance products for procurement teams across Trinidad & Tobago.",
    url: absoluteUrl("/"),
    images: openGraphImage(),
  },
  twitter: {
    card: "summary_large_image",
    title: "AMCOL Industrial | Industrial, Marine & Safety Supply",
    description:
      "Industrial, marine, safety, and maintenance products for procurement teams across Trinidad & Tobago.",
    images: ["/images/AMCOL Banner.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
