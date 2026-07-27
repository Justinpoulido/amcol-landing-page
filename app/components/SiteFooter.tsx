import Image from "next/image";
import Link from "next/link";
import {
  businessInfo,
  googleBusinessProfileUrl,
  socialLinks,
} from "@/lib/business-info";

const productLinks = [
  { name: "Safety", href: "/products/safety" },
  { name: "Abrasives", href: "/products/abrasives" },
  { name: "Lubricants", href: "/products/lubricants" },
  { name: "Sealants", href: "/products/adhesives-sealants-tape" },
  { name: "Fire Protection", href: "/products/fire-protection" },
  { name: "HVAC Chemicals", href: "/products/hvac-chemicals" },
  { name: "All Products", href: "/products" },
];

const companyLinks = [
  { name: "Knowledge", href: "/knowledge" },
  { name: "News", href: "/news" },
  { name: "Contact", href: "/contact" },
];

export function SiteFooter() {
  return (
    <footer className="bg-brand-charcoal py-14 text-[#94a7bd]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="space-y-4">
            <Link href="/" aria-label="AMCOL Home" className="inline-flex">
              <Image
                src="/images/AMCOL_Logo.webp"
                alt="AMCOL Logo"
                width={420}
                height={104}
                className="h-9 w-auto"
              />
            </Link>
            <p className="max-w-xs text-sm leading-6">
              Industrial, marine, safety and MRO supply for Trinidad &amp; Tobago
              and the Caribbean.
            </p>
            <address className="not-italic text-sm leading-6">
              {businessInfo.address.streetAddress},{" "}
              {businessInfo.address.addressLocality}, Trinidad &amp; Tobago
              <br />
              <a href={`tel:${businessInfo.telephone}`} className="transition-colors hover:text-white">
                {businessInfo.telephone}
              </a>
              <br />
              <a href={`mailto:${businessInfo.email}`} className="transition-colors hover:text-white">
                {businessInfo.email}
              </a>
              <br />
              Mon&ndash;Fri 7am&ndash;5pm &middot; Sat 7am&ndash;4pm
            </address>
          </div>

          <nav aria-label="Footer products">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#39d9cd]">
              Products
            </p>
            <ul className="mt-4 space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer company">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#39d9cd]">
              Company
            </p>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://www.caribbeantransportservices.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors hover:text-white"
                >
                  Amcol Haulage
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#39d9cd]">
              Get a Quote
            </p>
            <p className="mt-4 max-w-xs text-sm leading-6">
              Send us your supply list — our team responds with pricing and
              availability.
            </p>
            <Link href="/contact" className="btn btn-primary btn-sm mt-5">
              Request a Quote
            </Link>
            {socialLinks.length > 0 || googleBusinessProfileUrl ? (
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {socialLinks.map((url) => (
                  <a
                    key={url}
                    href={url}
                    className="transition-colors hover:text-white"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Social profile
                  </a>
                ))}
                {googleBusinessProfileUrl ? (
                  <a
                    href={googleBusinessProfileUrl}
                    className="transition-colors hover:text-white"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Google Business Profile
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {businessInfo.name}.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms
            </Link>
            <Link href="/admin" className="transition-colors hover:text-white">
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
