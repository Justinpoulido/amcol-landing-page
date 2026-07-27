import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const navLinks = [
  { name: "HOME", href: "/", external: false },
  { name: "PRODUCTS", href: "/products", external: false },
  { name: "KNOWLEDGE", href: "/knowledge", external: false },
  { name: "CONSTRUCTION", href: "/knowledge/construction", external: false },
  { name: "CONTACT US", href: "/contact", external: false },
] as const;

const topbarItems = [
  {
    label: "#22 Ramjohn Trace, Penal",
    href: "https://www.google.com/maps/search/?api=1&query=%2322+Ramjohn+Trace,+Penal,+Trinidad+and+Tobago",
    icon: "location",
    mobileHidden: true,
  },
  {
    label: "Office: +1 (868) 288-5800",
    href: "tel:+18682885800",
    icon: "phone",
    mobileHidden: false,
  },
  {
    label: "Mon-Fri: 7am - 5pm",
    icon: "clock",
    mobileHidden: true,
  },
] as const;

type SiteHeaderProps = {
  activeLink?: (typeof navLinks)[number]["name"];
};

type HeaderIconProps = {
  name: "location" | "phone" | "clock" | "external" | "search" | "menu";
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
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.8-3.8" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
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

function ProductSearchForm({ id, className }: { id: string; className?: string }) {
  return (
    <form action="/products" className={`relative ${className ?? ""}`}>
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <HeaderIcon
        name="search"
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#39d9cd]"
      />
      <input
        id={id}
        name="search"
        type="search"
        placeholder="Search products..."
        className="h-10 w-full rounded-lg border border-white/15 bg-white/8 pl-10 pr-3 text-sm font-medium text-white outline-none transition placeholder:text-slate-400 hover:border-white/30 focus:border-[#39d9cd] focus:bg-white/12"
      />
    </form>
  );
}

export function SiteHeader({ activeLink }: SiteHeaderProps) {
  return (
    <header className="hero-header sticky top-0 z-50">
      <div className="hero-topbar">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/90 sm:px-6 lg:px-8">
          {topbarItems.map((item) => {
            const visibility = item.mobileHidden ? "hidden sm:inline-flex" : "inline-flex";
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
                className={`hero-topbar-item ${visibility} items-center gap-2 transition-colors hover:text-white`}
              >
                {content}
              </a>
            ) : (
              <span
                key={item.label}
                className={`hero-topbar-item ${visibility} items-center gap-2`}
              >
                {content}
              </span>
            );
          })}
        </div>
      </div>

      <div className="hero-mainnav">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-0 px-4 py-3 sm:px-6 lg:px-8">
          <Link className="relative z-10 shrink-0" href="/" aria-label="AMCOL Home">
            <Image
              src="/images/AMCOL_Logo.webp"
              alt="AMCOL Logo"
              width={420}
              height={104}
              priority
              className="hero-brand-logo h-10 w-auto sm:h-12"
            />
          </Link>

          <input type="checkbox" id="site-nav-toggle" className="peer sr-only" />

          <label
            htmlFor="site-nav-toggle"
            aria-label="Toggle navigation"
            className="ml-auto inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-white/15 text-slate-200 transition hover:border-[#39d9cd] hover:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-[#39d9cd] md:hidden"
          >
            <HeaderIcon name="menu" className="h-5 w-5" />
          </label>

          <div className="hidden w-full flex-col gap-1 pt-3 peer-checked:flex md:ml-auto md:flex md:w-auto md:flex-row md:items-center md:gap-6 md:pt-0">
            <nav
              aria-label="Main navigation"
              className="flex flex-col md:flex-row md:items-center md:gap-6"
            >
              {navLinks.map((link) => {
                const isActive = link.name === activeLink;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`hero-nav-link min-h-[52px] border-b border-white/8 px-1 text-[13px] font-semibold uppercase md:min-h-[44px] md:border-0 ${
                      isActive ? "text-[#39d9cd]" : "text-[#cbd5e1] hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <ProductSearchForm
              id="site-header-product-search"
              className="mt-3 w-full md:mt-0 md:w-[240px]"
            />

            <Link
              href="/contact"
              className="btn btn-primary btn-sm mt-3 w-full md:mt-0 md:w-auto"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
