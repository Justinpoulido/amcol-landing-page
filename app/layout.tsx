import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { JsonLd } from "@/app/components/JsonLd";
import { TrackingScripts } from "@/app/components/TrackingScripts";
import { absoluteUrl, getSiteUrl, openGraphImage, siteName } from "@/lib/seo";
import {
  localBusinessJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/structured-data";
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
    "Industrial, safety, marine, MRO and maintenance supplies from AMCOL Industrial in Penal, serving worksites across Trinidad & Tobago.",
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
        <JsonLd id="organization-schema" data={organizationJsonLd()} />
        <JsonLd id="local-business-schema" data={localBusinessJsonLd()} />
        <JsonLd id="website-schema" data={websiteJsonLd()} />
        <TrackingScripts />
        {children}
      </body>
    </html>
  );
}
