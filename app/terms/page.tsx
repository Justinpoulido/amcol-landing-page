import type { Metadata } from "next";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing the use of the AMCOL Industrial website and quote requests.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
          Terms of Service
        </h1>
        <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-800">
          TODO: Replace with AMCOL Industrial&apos;s reviewed terms of service
          (site usage, quote/pricing disclaimers, and order terms).
        </p>
      </section>
      <SiteFooter />
    </div>
  );
}
