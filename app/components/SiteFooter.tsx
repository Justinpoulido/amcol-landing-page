import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <span className="text-sm font-medium text-zinc-500">
            AMCOL Industrial
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <Link
              href="/privacy"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
