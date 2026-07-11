import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { JsonLd } from "@/app/components/JsonLd";
import { MobileContactBar } from "@/app/components/MobileContactBar";
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
    default: "Industrial, Marine & Safety Supplies Trinidad | AMCOL Industrial",
    template: "%s | AMCOL Industrial",
  },

  description:
    "AMCOL Industrial supplies safety, MRO, marine, construction, and facility maintenance products across Trinidad & Tobago. Request quotes for industrial supplies today.",

  keywords: [
    "industrial supplies Trinidad",
    "industrial supplies Trinidad and Tobago",
    "marine supplies Trinidad",
    "safety supplies Trinidad",
    "PPE Trinidad",
    "MRO supplies Trinidad",
    "construction supplies Trinidad",
    "facility maintenance supplies",
    "AMCOL Industrial",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    siteName,
    locale: "en_TT",
    title: "Industrial, Marine & Safety Supplies Trinidad | AMCOL Industrial",
    description:
      "AMCOL Industrial supplies safety, MRO, marine, construction, and facility maintenance products across Trinidad & Tobago. Request quotes for industrial supplies today.",
    url: absoluteUrl("/"),
    images: openGraphImage(),
  },

  twitter: {
    card: "summary_large_image",
    title: "Industrial, Marine & Safety Supplies Trinidad | AMCOL Industrial",
    description:
      "AMCOL Industrial supplies safety, MRO, marine, construction, and facility maintenance products across Trinidad & Tobago. Request quotes for industrial supplies today.",
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
        <MobileContactBar />
      </body>
    </html>
  );
}
