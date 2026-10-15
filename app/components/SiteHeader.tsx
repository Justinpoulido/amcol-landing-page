import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { businessInfo } from "@/lib/business-info";

const navLinks = [
  { name: "HOME", href: "/", external: false },
  { name: "PRODUCTS", href: "/products", external: false },
  { name: "KNOWLEDGE", href: "/knowledge", external: false },
  { name: "CONSTRUCTION", href: "/knowledge/construction", external: false },
  { name: "CONTACT US", href: "/contact", external: false },
] as const;

const topbarInfoItems = [
  {
    label: "#22 Ramjohn Trace, Penal",
    href: "https://www.google.com/maps/search/?api=1&query=%2322+Ramjohn+Trace,+Penal,+Trinidad+and+Tobago",
    icon: "location",
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
  name: "location" | "phone" | "clock" | "mail" | "search" | "menu";
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
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3.5 6.5 8.5 6 8.5-6" />
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
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
      />
      <input
        id={id}
        name="search"
        type="search"
        placeholder="Search products..."
        className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#0f1b2d] focus:bg-white"
      />
    </form>
  );
}

export function SiteHeader({ activeLink }: SiteHeaderProps) {
  return (
    <header className="hero-header sticky top-0 z-50">
      <div className="hero-topbar hidden sm:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-6 px-4 text-xs text-slate-300 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-6">
            {topbarInfoItems.map((item) => {
              const content = (
                <>
                  <HeaderIcon name={item.icon} className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{item.label}</span>
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
                <span key={item.label} className="hero-topbar-item hidden items-center gap-2 md:inline-flex">
                  {content}
                </span>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-6">
            <a
              href={`mailto:${businessInfo.email}`}
              className="hero-topbar-item hidden items-center gap-2 transition-colors hover:text-white lg:inline-flex"
            >
              <HeaderIcon name="mail" className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>{businessInfo.email}</span>
            </a>
            <a
              href="tel:+18682885800"
              className="hero-topbar-item inline-flex items-center gap-2 font-semibold text-white transition-colors hover:text-[#ff8a97]"
            >
              <HeaderIcon name="phone" className="h-3.5 w-3.5 shrink-0 text-[#ff6b7d]" />
              <span>+1 (868) 288-5800</span>
            </a>
          </div>
        </div>
      </div>

      <div className="hero-mainnav">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 px-4 sm:px-6 lg:flex-nowrap lg:px-8">
          <Link className="relative z-10 shrink-0 py-3" href="/" aria-label="AMCOL Home">
            <Image
              src="/images/AMCOL_Logo.webp"
              alt="AMCOL Logo"
              width={420}
              height={104}
              priority
              className="h-11 w-auto sm:h-[52px]"
            />
          </Link>

          <input type="checkbox" id="site-nav-toggle" className="peer sr-only" />

          <label
            htmlFor="site-nav-toggle"
            aria-label="Toggle navigation"
            className="ml-auto inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-md border border-slate-200 text-slate-700 transition hover:border-slate-400 hover:text-slate-950 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-[#0f1b2d] lg:hidden"
          >
            <HeaderIcon name="menu" className="h-5 w-5" />
          </label>

          <div className="hidden w-full flex-col pb-4 peer-checked:flex lg:flex lg:w-auto lg:flex-1 lg:flex-row lg:items-center lg:gap-6 lg:pb-0">
            <nav
              aria-label="Main navigation"
              className="flex flex-col border-t border-slate-100 lg:mx-auto lg:flex-row lg:items-stretch lg:gap-7 lg:border-0"
            >
              {navLinks.map((link) => {
                const isActive = link.name === activeLink;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`hero-nav-link border-b border-slate-100 text-[13px] font-semibold uppercase lg:border-0 ${
                      isActive ? "text-[#0f1b2d]" : "text-slate-600 hover:text-[#0f1b2d]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <ProductSearchForm
              id="site-header-product-search"
              className="mt-4 w-full lg:mt-0 lg:hidden xl:block xl:w-[220px]"
            />

            <Link
              href="/contact"
              className="btn btn-primary btn-sm mt-3 w-full lg:mt-0 lg:w-auto"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
