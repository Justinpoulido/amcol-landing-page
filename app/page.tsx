"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  landingCategoryRows,
  type ProductCategoryPageData,
} from "@/lib/product-categories";
import { industrialArticles } from "@/lib/articles";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";

const heroImages = [
  "/images/Heritage Industry.webp",
  "/images/TGU.webp",
  "/images/Proman_industrial.webp",
  "/images/Port Authority.webp",
];

const latestArticles = [...industrialArticles]
  .sort((a, b) => new Date(b.completedOn).getTime() - new Date(a.completedOn).getTime())
  .slice(0, 3);

const quickCategoryShortcuts = [
  { name: "Safety", href: "/products/safety" },
  { name: "Abrasives", href: "/products/abrasives" },
  { name: "Lubricants", href: "/products/lubricants" },
  { name: "Sealants", href: "/products/adhesives-sealants-tape" },
  { name: "Fire Protection", href: "/products/fire-protection" },
  { name: "HVAC Chemicals", href: "/products/hvac-chemicals" },
];

const industriesServed = [
  {
    name: "Energy & Petrochemical",
    description: "Shutdown, maintenance, coating, safety, and cleaning supply support for demanding plant environments.",
    image: "/images/Proman_industrial.webp",
    href: "/products",
    categories: "Safety, coatings, cleaners",
  },
  {
    name: "Marine & Port Operations",
    description: "Reliable maintenance, security, and corrosion-control products for yards, ports, vessels, and logistics teams.",
    image: "/images/Port Authority.webp",
    href: "/products/locks-security",
    categories: "Security, lubricants, sealants",
  },
  {
    name: "Construction & Contractors",
    description: "Jobsite essentials for crews that need durable tools, ladders, abrasives, PPE, and consumables.",
    image: "/images/Road-Work.webp",
    href: "/products/abrasives",
    categories: "Abrasives, ladders, PPE",
  },
  {
    name: "Facilities & Maintenance",
    description: "Everyday industrial supply for facility managers handling cleaning, HVAC, repairs, and safety readiness.",
    image: "/images/Heritage Industry.webp",
    href: "/products/cleaners-degreasers",
    categories: "Cleaners, HVAC, fire protection",
  },
];

const featuredIndustrialBrands = [
  {
    name: "RIDGID",
    image: "/images/Ridgid_pipe_dies.webp",
    href: "/products/pipes-valves-fittings",
    description: "Pipe dies and threading accessories for mechanical, fabrication, and maintenance teams.",
  },
  {
    name: "Geko",
    image: "/images/Geko_repair_clamp.webp",
    href: "/products/pipes-valves-fittings",
    description: "Pipe repair clamps for fast, secure repairs across industrial water and utility systems.",
  },
  {
    name: "BAND-IT",
    image: "/images/Band-IT_Band.webp",
    href: "/products/pipes-valves-fittings",
    description: "Stainless steel banding and fastening products for pipework, signage, and industrial installs.",
  },
  {
    name: "DuPont Tyvek",
    image: "/images/Tyvek_Dupont_Disposable_Coveralls.webp",
    href: "/products/safety",
    description: "Disposable protective coveralls for safety, maintenance, and controlled work environments.",
  },
  {
    name: "Loctite",
    image: "/images/Loctite_threading_compound_anti-sieze.webp",
    href: "/products/lubricants",
    description: "Heavy-duty anti-seize and thread compounds for metal parts exposed to demanding conditions.",
  },
  {
    name: "Salisbury ElectriFlex",
    image: "/images/Salisbury ElectriFlex Insulating Rubber Gloves.webp",
    href: "/products/safety",
    description: "Insulating rubber gloves for electrical safety, maintenance crews, and utility work.",
  },
  {
    name: "RIDGID Pipe Wrench",
    image: "/images/Ridgid_Straight_Pipe_Wrenches.webp",
    href: "/products/pipes-valves-fittings",
    description: "Straight pipe wrenches for mechanical crews, pipefitters, maintenance, and repair work.",
  },
];

const fallbackLandingCategories = landingCategoryRows.flat();

function chunkCategories(categories: ProductCategoryPageData[], size: number) {
  const rows: ProductCategoryPageData[][] = [];

  for (let index = 0; index < categories.length; index += size) {
    rows.push(categories.slice(index, index + size));
  }

  return rows;
}

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [landingCategories, setLandingCategories] = useState<ProductCategoryPageData[]>(
    fallbackLandingCategories,
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadLandingCategories = async () => {
      try {
        const response = await fetch("/api/catalog/categories");
        const data = (await response.json()) as {
          categories?: ProductCategoryPageData[];
        };

        if (!response.ok || !Array.isArray(data.categories) || data.categories.length === 0) {
          return;
        }

        if (isMounted) {
          setLandingCategories(data.categories);
        }
      } catch {
        // Keep the seeded fallback cards if dynamic categories cannot be loaded.
      }
    };

    loadLandingCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <div className="relative left-1/2 z-10 w-screen -translate-x-1/2 px-0">
        <div className="overflow-hidden border-y border-cyan-400/30 bg-[linear-gradient(135deg,rgba(13,34,56,0.96)_0%,rgba(15,55,100,0.92)_48%,rgba(6,182,212,0.28)_100%)] shadow-[0_22px_50px_-28px_rgba(6,182,212,0.4)]">
          <div className="relative overflow-hidden px-4 py-3 sm:px-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.13),transparent_28%)]" />
            <div className="relative flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
              <div className="hidden w-[260px] shrink-0 flex-col gap-1 md:flex">
                <p className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-200">
                  Quick Product Shortcuts
                </p>
                <p className="truncate text-xs text-cyan-50/75">
                  Browse categories or send us a supply list.
                </p>
              </div>

              <div className="relative min-w-0 flex-1 overflow-hidden lg:mr-auto">
                <style>{`
                  @keyframes quickCategoryMarquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                  }
                  .quick-category-marquee {
                    animation: quickCategoryMarquee 24s linear infinite;
                  }
                  .quick-category-marquee:hover {
                    animation-play-state: paused;
                  }
                `}</style>
                <div className="quick-category-marquee flex w-max items-center gap-2 pr-2">
                  {[0, 1].map((loop) => (
                    <div key={loop} className="flex shrink-0 items-center gap-2 pr-2">
                      {quickCategoryShortcuts.map((category) => (
                        <Link
                          key={`${loop}-${category.name}`}
                          href={category.href}
                          className="inline-flex min-h-9 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-50 transition hover:border-cyan-200 hover:bg-cyan-300/18 focus-visible:bg-cyan-300/18"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-transparent pt-24 pb-24 sm:pt-28 sm:pb-32 lg:pt-36 lg:pb-40">
        {/* Background Slideshow */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={index !== currentImageIndex}
            >
              <Image
                src={image}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f1b2d]/70 via-[#0f1b2d]/65 to-[#0f1b2d]/85" />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Your Trusted Industrial Supply Partner
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-100 sm:text-xl">
            Reliable products for maintenance, safety, facility operations, and industrial procurement. Serving industries across Trinidad & Tobago with quality brands you know and trust.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/products"
              className="btn-copper inline-flex items-center justify-center rounded-lg px-8 py-3 text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-copper focus:ring-offset-2 focus:ring-offset-black transition-all"
            >
              Browse Catalog
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-3 text-base font-semibold text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-copper focus:ring-offset-2 focus:ring-offset-black transition-all"
            >
              Request a Quote
            </Link>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? "w-8 bg-cyan-400" : "w-2.5 bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Trust Strip */}
      <div className="bg-brand-charcoal py-5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 text-center sm:px-6 lg:px-8">
          {[
            "Industrial, marine, safety & maintenance supply",
            "Direct procurement support for enterprise projects",
            "One supplier for structural, facility & fleet needs",
          ].map((item) => (
            <span
              key={item}
              className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <section className="border-t border-zinc-200 bg-[linear-gradient(180deg,#f8fbff_0%,#eef5fb_48%,#ffffff_100%)] py-16 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-10">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 px-6 py-10 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.35)] backdrop-blur sm:px-8 sm:py-12 lg:px-12">
            <div className="mx-auto max-w-4xl text-center">
              <p className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-800">
                Industrial Categories
              </p>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-[2.7rem]">
                Shop by product category
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Explore our core industrial supply lines in a card layout designed for faster scanning, cleaner comparison, and easier navigation.
              </p>
            </div>

            <div className="mt-14 space-y-8 sm:space-y-10 xl:space-y-12">
            {chunkCategories(landingCategories, 4).map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:gap-6 xl:grid-cols-4 xl:gap-7"
              >
                {row.map((tile) => (
                  <Link
                    key={tile.name}
                    href={tile.href}
                    className="group relative flex min-h-[290px] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-5 text-left shadow-[0_18px_40px_-30px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-[0_24px_50px_-26px_rgba(8,47,73,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 sm:min-h-[320px] sm:p-6"
                  >
                    <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.20),transparent_68%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative flex h-44 w-full items-center justify-center rounded-[1.4rem] border border-slate-100 bg-[linear-gradient(180deg,#f8fbfd_0%,#eef6fb_100%)] px-4 sm:h-48">
                      <Image
                        src={tile.image}
                        alt={tile.name}
                        width={220}
                        height={180}
                        className="h-auto max-h-36 w-auto max-w-[180px] object-contain transition-transform duration-300 group-hover:scale-[1.08] sm:max-h-40 sm:max-w-[190px]"
                      />
                    </div>
                    <div className="relative flex flex-1 flex-col pt-5">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-700">
                        Industrial Supply
                      </span>
                      <span className="mt-3 text-base font-semibold leading-6 text-slate-900 transition-colors duration-300 group-hover:text-[#0f1b2d] sm:text-[17px]">
                        {tile.name}
                      </span>
                      <span className="mt-auto inline-flex items-center gap-3 pt-6 text-sm font-medium text-slate-600 transition-colors duration-300 group-hover:text-slate-900">
                        Browse products
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-base text-slate-700 transition-all duration-300 group-hover:border-brand-copper/60 group-hover:bg-amber-50 group-hover:text-brand-copper">
                          →
                        </span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>
      <section id="industries" className="border-t border-zinc-200 bg-[#f5f8fb] py-20 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-700">
                Industries We Serve
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-[2.7rem]">
                Supply support for Trinidad & Tobago worksites
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                AMCOL helps operations teams source the maintenance, safety, repair, and facility products they need across heavy industry, construction, ports, and commercial facilities.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {["Industrial procurement", "Bulk order support", "Category guidance"].map((item) => (
                <div
                  key={item}
                  className="border border-slate-200 bg-white px-4 py-5 text-center shadow-[0_18px_40px_-32px_rgba(15,23,42,0.45)]"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {industriesServed.map((industry) => (
              <Link
                key={industry.name}
                href={industry.href}
                className="group overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white text-left shadow-[0_22px_50px_-36px_rgba(15,23,42,0.55)] transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-[0_24px_55px_-30px_rgba(8,47,73,0.35)]"
              >
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <Image
                    src={industry.image}
                    alt={industry.name}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/74 via-slate-950/18 to-transparent" />
                  <span className="absolute bottom-4 left-4 rounded-full border border-cyan-300/35 bg-cyan-300/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-50">
                    {industry.categories}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-slate-950">{industry.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{industry.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-800">
                    View relevant products
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-zinc-200 bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-700">
                Featured Industrial Brands
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Trusted names for everyday industrial supply
              </h2>
            </div>
          </div>

          <div className="relative mt-12 overflow-hidden">
            <style>{`
              @keyframes featuredBrandCardsMarquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .featured-brand-cards-marquee {
                animation: featuredBrandCardsMarquee 34s linear infinite;
              }
              .featured-brand-cards-marquee:hover {
                animation-play-state: paused;
              }
            `}</style>
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />
            <div className="featured-brand-cards-marquee flex w-max items-stretch gap-5 pr-5">
              {[0, 1].map((loop) => (
                <div key={loop} className="flex shrink-0 items-stretch gap-5 pr-5">
                  {featuredIndustrialBrands.map((brand) => (
                    <Link
                      key={`${loop}-${brand.name}`}
                      href={brand.href}
                      className="group flex w-[280px] shrink-0 flex-col overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-[0_18px_44px_-34px_rgba(15,23,42,0.55)] transition hover:-translate-y-1 hover:border-cyan-300 sm:w-[320px]"
                    >
                      <div className="relative flex h-56 items-center justify-center overflow-hidden bg-slate-50">
                        <Image
                          src={brand.image}
                          alt={`${brand.name} products`}
                          fill
                          sizes="320px"
                          className="object-contain p-6 transition duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="text-xl font-semibold text-slate-950">{brand.name}</h3>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{brand.description}</p>
                        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-cyan-800">
                          Browse brand category
                          <span aria-hidden="true">→</span>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* News & Events */}
      <section className="border-t border-zinc-200 bg-brand-charcoal py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-copper">
                News & Events
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Recent project highlights
              </h2>
            </div>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-brand-copper transition hover:text-amber-300"
            >
              View all news
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {latestArticles.map((article) => (
              <Link
                key={article.id}
                href="/news"
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-brand-copper/40"
              >
                <div
                  className="h-44 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${article.image}')` }}
                />
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-copper">
                    {article.sector}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-white">{article.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    {article.location} ·{" "}
                    {new Date(article.completedOn).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
