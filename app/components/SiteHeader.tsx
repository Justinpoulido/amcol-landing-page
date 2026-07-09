import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

// TODO(brand-unification): HOME and CONSTRUCTION currently point to the separate
// amcolhardwarett.com domain. Decide on one unified domain/visual system (see
// audit Phase 4) and update these once that decision is made.
const navLinks = [
  { name: "HOME", href: "https://www.amcolhardwarett.com/index.php", external: true },
  { name: "PRODUCTS", href: "/products", external: false },
  { name: "KNOWLEDGE", href: "/knowledge", external: false },
  { name: "CONSTRUCTION", href: "https://www.amcolhardwarett.com/construction.php", external: true },
  { name: "CONTACT US", href: "/contact", external: false },
] as const;

const topbarItems = [
  {
    label: "#22 Ramjohn Trace, Penal",
    href: "https://www.google.com/maps/search/?api=1&query=%2322+Ramjohn+Trace,+Penal,+Trinidad+and+Tobago",
    icon: "location",
  },
  {
    label: "Office: +1 (868) 288-5800",
    href: "tel:+18682885800",
    icon: "phone",
  },
  {
    label: "Mon-Fri: 7am - 5pm",
    icon: "clock",
  },
] as const;

type SiteHeaderProps = {
  activeLink?: (typeof navLinks)[number]["name"];
};

type HeaderIconProps = {
  name: "location" | "phone" | "clock" | "external" | "shield" | "search";
  className?: string;
};

function HeaderIcon({ name, className = "h-4 w-4" }: HeaderIconProps) {
  const paths: Record<HeaderIconProps["name"], ReactNode> = {
    location: (
      <>
        <path d="M12 21s7-5.5 7-12a7 7 0 1 0-14 0c0 6.5 7 12 7 12Z" />
        <circle cx="12" cy="9" r="2.4" />
      </>
    ),
    phone: (
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.7 19.7 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6.4 6.4l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" />
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.2 1.9" />
      </>
    ),
    external: (
      <>
        <path d="M7 17 17 7" />
        <path d="M9 7h8v8" />
      </>
    ),
    shield: <path d="M12 22s8-3.8 8-10V5l-8-3-8 3v7c0 6.2 8 10 8 10Z" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.8-3.8" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      {paths[name]}
    </svg>
  );
}

export function SiteHeader({ activeLink }: SiteHeaderProps) {
  return (
    <header className="hero-header relative z-40">
      <div className="hero-topbar">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          {topbarItems.map((item) => {
            const content = (
              <>
                <HeaderIcon name={item.icon} className="h-4 w-4 shrink-0 text-[#39d9cd]" />
                <span>{item.label}</span>
              </>
            );

            return "href" in item ? (
              <a
                key={item.label}
                href={item.href}
                className="hero-topbar-item inline-flex items-center gap-2 transition-colors hover:text-white"
              >
                {content}
              </a>
            ) : (
              <span key={item.label} className="hero-topbar-item inline-flex items-center gap-2">
                {content}
              </span>
            );
          })}
        </div>
      </div>

      <div className="hero-mainnav">
        <div className="mx-auto flex w-full max-w-[1900px] flex-col overflow-hidden md:min-h-[166px] md:flex-row md:items-stretch">
          <div className="hero-brand-panel flex items-center justify-center px-6 py-6 sm:px-8 md:w-[31%] md:min-w-[360px] md:justify-start lg:px-16">
            <Link className="hero-brand-logo-wrap relative z-10 shrink-0" href="/" aria-label="AMCOL Home">
              <Image
                src="/images/AMCOL_Logo.webp"
                alt="AMCOL Logo"
                width={420}
                height={104}
                priority
                className="hero-brand-logo h-20 w-auto max-w-[290px] sm:h-24 md:h-[6.4rem] md:max-w-[360px]"
              />
            </Link>
          </div>

          <div className="hero-links-panel flex flex-1 items-center justify-center px-4 py-5 sm:px-6 lg:px-10">
            <div className="flex w-full flex-col items-center justify-center gap-5 xl:flex-row xl:justify-end xl:gap-8">
              <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <nav className="hero-primary-nav flex flex-wrap items-center justify-center gap-x-5 gap-y-4 text-[11px] font-bold uppercase tracking-[0.26em] sm:gap-x-7 lg:gap-x-9">
                  {navLinks.map((link) => {
                    const isActive = link.name === activeLink;

                    return (
                      <a
                        key={link.name}
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className={`hero-nav-link inline-flex items-center gap-2 px-1 py-3 ${
                          isActive ? "text-[#39d9cd]" : "text-slate-200/90 hover:text-white"
                        }`}
                      >
                        {link.name}
                        {link.external ? <HeaderIcon name="external" className="h-3.5 w-3.5 opacity-55" /> : null}
                      </a>
                    );
                  })}
                </nav>

                <form
                  action="/products"
                  className="hero-nav-search relative w-full max-w-[390px] rounded-sm border border-cyan-300/28 bg-[linear-gradient(135deg,rgba(57,217,205,0.14)_0%,rgba(255,255,255,0.08)_46%,rgba(7,17,31,0.64)_100%)] p-1 shadow-[0_0_0_1px_rgba(57,217,205,0.08),0_12px_28px_-22px_rgba(57,217,205,0.9)]"
                >
                  <label htmlFor="site-header-product-search" className="sr-only">
                    Search products
                  </label>
                  <HeaderIcon
                    name="search"
                    className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#39d9cd]"
                  />
                  <input
                    id="site-header-product-search"
                    name="search"
                    type="search"
                    placeholder="Search products..."
                    className="h-10 w-full rounded-sm border border-cyan-200/34 bg-[#eefcff]/14 pl-10 pr-3 text-sm font-medium text-white outline-none transition placeholder:text-cyan-50/72 hover:border-cyan-200/55 hover:bg-[#eefcff]/18 focus:border-[#39d9cd] focus:bg-[#eefcff]/20 focus:ring-2 focus:ring-[#39d9cd]/28"
                  />
                </form>
              </div>

              <div className="flex w-full max-w-[330px] shrink-0 flex-col gap-2">
                <div className="flex items-center gap-3">
                  <Link
                    href="/contact"
                    className="hero-quote-button inline-flex min-h-12 flex-1 items-center justify-center border border-[#39d9cd] px-5 text-[11px] font-bold uppercase tracking-[0.28em] text-[#39d9cd] transition hover:bg-[#39d9cd] hover:text-[#101722] focus-visible:bg-[#39d9cd] focus-visible:text-[#101722] sm:px-6"
                  >
                    Request Quote
                  </Link>
                  <Link
                    href="/admin"
                    aria-label="Open AMCOL admin portal"
                    className="hero-icon-button inline-flex h-12 w-12 shrink-0 items-center justify-center border border-white/18 text-[#39d9cd] transition hover:border-[#39d9cd] hover:bg-white/5"
                  >
                    <HeaderIcon name="shield" className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
