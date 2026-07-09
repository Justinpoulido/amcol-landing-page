import Link from "next/link";
import {
  businessInfo,
  googleBusinessProfileUrl,
  socialLinks,
} from "@/lib/business-info";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-start">
          <div className="space-y-3 text-center md:text-left">
            <p className="text-sm font-semibold text-zinc-900">
              {businessInfo.name}
            </p>
            <address className="not-italic text-sm leading-6 text-zinc-500">
              {businessInfo.address.streetAddress},{" "}
              {businessInfo.address.addressLocality}, Trinidad & Tobago
              <br />
              <a href={`tel:${businessInfo.telephone}`} className="hover:text-zinc-900">
                {businessInfo.telephone}
              </a>{" "}
              |{" "}
              <a href={`mailto:${businessInfo.email}`} className="hover:text-zinc-900">
                {businessInfo.email}
              </a>
            </address>
          </div>

          <div className="flex flex-col items-center gap-4 md:items-end">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 md:justify-end">
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

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-zinc-500 md:justify-end">
              {socialLinks.length > 0 ? (
                socialLinks.map((url) => (
                  <a
                    key={url}
                    href={url}
                    className="transition-colors hover:text-zinc-900"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Social profile
                  </a>
                ))
              ) : (
                <span>Social profiles pending</span>
              )}
              {googleBusinessProfileUrl ? (
                <a
                  href={googleBusinessProfileUrl}
                  className="transition-colors hover:text-zinc-900"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Google Business Profile
                </a>
              ) : (
                <span>Google Business Profile link pending</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
