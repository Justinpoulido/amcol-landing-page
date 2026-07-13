"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
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

const knowledgeGuideShortcuts = [
  {
    label: "Safety Planning",
    title: "Choose worksite safety supplies",
    href: "/knowledge/safety/how-to-choose-industrial-safety-supplies",
  },
  {
    label: "PPE Guide",
    title: "Match PPE to industrial hazards",
    href: "/knowledge/ppe/what-ppe-do-industrial-workers-need",
  },
  {
    label: "Maintenance",
    title: "Select lubricants for uptime",
    href: "/knowledge/lubricants/which-industrial-lubricant-should-you-use",
  },
];

const featuredIndustrialBrands = [
  {
    name: "RIDGID",
    image: "/images/Ridgid_pipe_dies.webp",
    href: "/products?search=pipe%20dies",
    description: "Pipe dies and threading accessories for mechanical, fabrication, and maintenance teams.",
  },
  {
    name: "Geko",
    image: "/images/Geko_repair_clamp.webp",
    href: "/products?search=pipe%20repair",
    description: "Pipe repair clamps for fast, secure repairs across industrial water and utility systems.",
  },
  {
    name: "BAND-IT",
    image: "/images/Band-IT_Band.webp",
    href: "/products?search=banding",
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
    href: "/products?search=pipe%20wrench",
    description: "Straight pipe wrenches for mechanical crews, pipefitters, maintenance, and repair work.",
  },
];

const procurementTrustCards = [
  {
    title: "Bulk & Repeat Orders",
    description:
      "Support for recurring supply needs, maintenance schedules, and project stock-up.",
  },
  {
    title: "Product Sourcing Support",
    description:
      "Help finding the correct product, brand, size, or suitable alternative.",
  },
  {
    title: "Site & Project Supply",
    description:
      "Supply support for construction, marine, plant maintenance, shutdowns, and facility work.",
  },
  {
    title: "Delivery & Collection Support",
    description:
      "Coordinate pickup, delivery, or affiliated transport support where available.",
  },
];

function NewsEventsSection() {
  return (
    <section className="border-t border-zinc-200 bg-[linear-gradient(180deg,#f8fbff_0%,#eef5fb_100%)] py-18 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-700">
              News & Events
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Recent project highlights
            </h2>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-cyan-800 transition hover:text-slate-950"
          >
            View all news
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {latestArticles.map((article) => (
            <article
              key={article.id}
              className="group overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white text-left shadow-[0_22px_50px_-36px_rgba(15,23,42,0.55)] transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-[0_24px_55px_-30px_rgba(8,47,73,0.35)]"
            >
              <Link href={`/news/${article.slug}`} className="block">
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={`${article.title} project support in ${article.location}`}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                  {article.sector}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">
                  <Link href={`/news/${article.slug}`} className="transition hover:text-cyan-800">
                    {article.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  {article.location} ·{" "}
                  {new Date(article.completedOn).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold">
                  <Link
                    href={`/news/${article.slug}`}
                    className="text-slate-950 transition hover:text-cyan-800"
                  >
                    Read update
                  </Link>
                  {article.eventUrl ? (
                    <a
                      href={article.eventUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-800 transition hover:text-slate-950"
                    >
                      {article.eventLabel ?? "Visit event"}
                      <span aria-hidden="true"> →</span>
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function IndustryCardsSection() {
  return (
    <section className="border-t border-zinc-200 bg-[#f5f8fb] py-16 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-700">
              Industries We Serve
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Browse products by worksite need
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-800 transition hover:text-slate-950"
          >
            View product catalog
            <span aria-hidden="true">→</span>
          </Link>
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
  );
}

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeBrandIndex, setActiveBrandIndex] = useState(0);
  const activeBrand = featuredIndustrialBrands[activeBrandIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBrandIndex(
        (prevIndex) => (prevIndex + 1) % featuredIndustrialBrands.length,
      );
    }, 6500);

    return () => clearInterval(interval);
  }, []);

  const showPreviousBrand = () => {
    setActiveBrandIndex(
      (prevIndex) =>
        (prevIndex - 1 + featuredIndustrialBrands.length) %
        featuredIndustrialBrands.length,
    );
  };

  const showNextBrand = () => {
    setActiveBrandIndex(
      (prevIndex) => (prevIndex + 1) % featuredIndustrialBrands.length,
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main>
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
                <div className="flex flex-wrap items-center gap-2">
                  {quickCategoryShortcuts.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      className="inline-flex min-h-9 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-50 transition hover:border-cyan-200 hover:bg-cyan-300/18 focus-visible:bg-cyan-300/18"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section
        className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-transparent pt-24 pb-24 sm:pt-28 sm:pb-32 lg:pt-36 lg:pb-40"
        aria-label="AMCOL Industrial homepage banner"
      >
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
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/products"
              className="btn-copper inline-flex items-center justify-center rounded-lg px-8 py-3 text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-copper focus:ring-offset-2 focus:ring-offset-black transition-all"
            >
              View Product Lines
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-3 text-base font-semibold text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-copper focus:ring-offset-2 focus:ring-offset-black transition-all"
            >
              Request Quote
            </Link>
            <Link
              href="/knowledge"
              className="inline-flex items-center justify-center rounded-lg border border-cyan-300/60 px-8 py-3 text-base font-semibold text-cyan-100 transition-all hover:bg-cyan-300/10 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-black"
            >
              Read Buying Guides
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

      <NewsEventsSection />

      <section id="industries" className="border-t border-zinc-200 bg-[#f5f8fb] py-20 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-700">
                Industries We Serve
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-[2.7rem]">
                Industrial Supply Partner in Penal, Trinidad & Tobago
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                AMCOL Industrial supplies safety, MRO, marine, construction, and facility maintenance products from Penal to worksites across Trinidad & Tobago.
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-[0_18px_44px_-34px_rgba(15,23,42,0.55)] sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-700">
                    Knowledge Base
                  </p>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
                    Buying guidance before you request a quote
                  </h3>
                </div>
                <Link
                  href="/knowledge"
                  className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-cyan-800 transition hover:text-slate-950"
                >
                  View guides
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {knowledgeGuideShortcuts.map((guide) => (
                  <Link
                    key={guide.href}
                    href={guide.href}
                    className="group border border-slate-200 bg-slate-50 px-4 py-4 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-white hover:shadow-[0_16px_34px_-28px_rgba(8,47,73,0.5)]"
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-700">
                      {guide.label}
                    </span>
                    <span className="mt-2 block text-sm font-semibold leading-5 text-slate-900 transition group-hover:text-cyan-900">
                      {guide.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-700">
                Procurement Support
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Built for Industrial Procurement
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                Practical supply support for teams managing maintenance, contractor work, plant operations, marine jobs, and facility replenishment across Trinidad & Tobago.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {procurementTrustCards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-6 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.45)]"
                >
                  <h3 className="text-lg font-semibold text-slate-950">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {card.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-10">
          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,#0f1b2d_0%,#16273e_58%,#0f766e_100%)] shadow-[0_24px_70px_-42px_rgba(15,23,42,0.55)]">
            <div className="grid gap-8 px-6 py-10 sm:px-8 sm:py-12 lg:grid-cols-[1fr_auto] lg:items-center lg:px-12">
              <div className="max-w-3xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-copper">
                  Affiliated Transportation Support
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Haulage & Transportation Services
                </h2>
                <p className="mt-5 text-base leading-7 text-slate-200 sm:text-lg">
                  Need reliable transportation for heavy equipment, industrial materials or oversized cargo? Our affiliated company, Amcol Haulage, provides professional haulage and cargo transportation services across Trinidad and Tobago.
                </p>
              </div>
              <div className="flex lg:justify-end">
                <a
                  href="https://www.caribbeantransportservices.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-copper inline-flex w-full items-center justify-center rounded-lg px-7 py-3 text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-copper focus:ring-offset-2 focus:ring-offset-[#0f1b2d] sm:w-auto"
                >
                  Visit Amcol Haulage
                  <span className="ml-2" aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            </div>
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
            <div className="flex justify-center gap-2 sm:justify-end">
              <button
                type="button"
                onClick={showPreviousBrand}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-700 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.55)] transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-900"
                aria-label="Show previous featured brand"
              >
                ←
              </button>
              <button
                type="button"
                onClick={showNextBrand}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-700 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.55)] transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-900"
                aria-label="Show next featured brand"
              >
                →
              </button>
            </div>
          </div>

          <div className="mt-12 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,#f8fbff_0%,#eef6fb_48%,#ffffff_100%)] shadow-[0_24px_70px_-46px_rgba(15,23,42,0.45)]">
            <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
              <Link
                href={activeBrand.href}
                className="group relative flex min-h-[440px] flex-col overflow-hidden bg-slate-950 p-6 text-white sm:p-8 lg:min-h-[520px]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_35%),linear-gradient(135deg,#0f1b2d_0%,#172b45_62%,#0e7490_100%)]" />
                <div className="relative z-10 flex flex-1 flex-col">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200">
                    Featured Brand
                  </p>
                  <h3 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                    {activeBrand.name}
                  </h3>
                  <p className="mt-5 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">
                    {activeBrand.description}
                  </p>
                  <span className="mt-8 inline-flex w-fit items-center gap-3 rounded-full border border-cyan-200/30 bg-cyan-200/10 px-5 py-3 text-sm font-semibold text-cyan-50 transition group-hover:border-cyan-100 group-hover:bg-cyan-100/15">
                    Browse brand category
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
                <div className="relative z-10 mt-10 flex min-h-56 items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/95 p-8 shadow-[0_24px_60px_-36px_rgba(0,0,0,0.65)]">
                  <Image
                    key={activeBrand.image}
                    src={activeBrand.image}
                    alt={`${activeBrand.name} products`}
                    width={420}
                    height={320}
                    className="h-auto max-h-72 w-auto max-w-full object-contain transition duration-500 group-hover:scale-[1.04]"
                  />
                </div>
              </Link>

              <div className="flex flex-col justify-between p-5 sm:p-6 lg:p-8">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-700">
                    Brand Selector
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                    Choose a trusted supply line
                  </h3>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {featuredIndustrialBrands.map((brand, index) => {
                    const isActive = index === activeBrandIndex;

                    return (
                      <button
                        key={brand.name}
                        type="button"
                        onClick={() => setActiveBrandIndex(index)}
                        className={`group flex min-h-24 items-center gap-4 rounded-[1rem] border p-3 text-left transition ${
                          isActive
                            ? "border-cyan-300 bg-white shadow-[0_18px_36px_-30px_rgba(8,47,73,0.65)]"
                            : "border-slate-200 bg-white/65 hover:border-cyan-200 hover:bg-white"
                        }`}
                        aria-pressed={isActive}
                      >
                        <span className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                          <Image
                            src={brand.image}
                            alt=""
                            fill
                            sizes="64px"
                            className="object-contain p-2 transition duration-300 group-hover:scale-105"
                          />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-slate-950">
                            {brand.name}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-slate-500">
                            {isActive ? "Currently featured" : "View spotlight"}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5">
                  <div className="flex gap-2">
                    {featuredIndustrialBrands.map((brand, index) => (
                      <button
                        key={`${brand.name}-indicator`}
                        type="button"
                        onClick={() => setActiveBrandIndex(index)}
                        className={`h-2.5 rounded-full transition-all ${
                          index === activeBrandIndex
                            ? "w-8 bg-cyan-600"
                            : "w-2.5 bg-slate-300 hover:bg-cyan-300"
                        }`}
                        aria-label={`Show ${brand.name}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {activeBrandIndex + 1} / {featuredIndustrialBrands.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <IndustryCardsSection />

      </main>
      <SiteFooter />
    </div>
  );
}
