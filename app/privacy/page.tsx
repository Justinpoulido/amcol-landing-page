import type { Metadata } from "next";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How AMCOL Industrial collects, uses, and protects customer information.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy",
    description:
      "How AMCOL Industrial collects, uses, and protects customer information.",
    url: absoluteUrl("/privacy"),
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
          Privacy Policy
        </h1>
        <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-800">
          TODO: Replace with AMCOL Industrial&apos;s reviewed privacy policy
          (data collected via the contact/quote form, how it is stored and
          used, and contact details for privacy inquiries).
        </p>
      </section>
      <SiteFooter />
    </div>
  );
}
