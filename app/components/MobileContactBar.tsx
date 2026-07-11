import Link from "next/link";
import { businessInfo } from "@/lib/business-info";

const whatsappMessage = encodeURIComponent(
  "Hi AMCOL Industrial, I would like to request a quote.",
);
const whatsappPhone = businessInfo.telephone.replace(/\D/g, "");

export function MobileContactBar() {
  return (
    <nav
      aria-label="Mobile contact actions"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-3 py-2 shadow-[0_-12px_34px_-24px_rgba(15,23,42,0.65)] backdrop-blur md:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
        <a
          href={`tel:${businessInfo.telephone}`}
          aria-label={`Call AMCOL Industrial at ${businessInfo.telephone}`}
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 transition hover:border-cyan-300 hover:bg-cyan-50 focus-visible:bg-cyan-50"
        >
          Call
        </a>
        <a
          href={`https://wa.me/${whatsappPhone}?text=${whatsappMessage}`}
          aria-label="Message AMCOL Industrial on WhatsApp"
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 px-3 text-sm font-semibold text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-100 focus-visible:bg-emerald-100"
          rel="noopener noreferrer"
          target="_blank"
        >
          WhatsApp
        </a>
        <Link
          href="/contact"
          aria-label="Request a quote from AMCOL Industrial"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-slate-950 px-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:bg-slate-800"
        >
          Request Quote
        </Link>
      </div>
    </nav>
  );
}
