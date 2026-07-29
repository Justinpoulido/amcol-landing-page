"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { industrialArticles } from "@/lib/articles";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";

const heroImages = [
  "/images/Shore_base.png",
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
    image: "/images/Shore_base.png",
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
    image: "/images/Ridgid_pipe_dies_no_bg.png",
    logo: "/images/brands/ridgid.png",
    href: "/products?search=pipe%20dies",
    description: "Pipe dies and threading accessories for mechanical, fabrication, and maintenance teams.",
  },
  {
    name: "Geko",
    image: "/images/Geko_repair_clamp.webp",
    logo: "/images/brands/geko.png",
    href: "/products?search=pipe%20repair",
    description: "Pipe repair clamps for fast, secure repairs across industrial water and utility systems.",
  },
  {
    name: "BAND-IT",
    image: "/images/Band-IT_Band.webp",
    logo: "/images/brands/band-it.png",
    href: "/products?search=banding",
    description: "Stainless steel banding and fastening products for pipework, signage, and industrial installs.",
  },
  {
    name: "DuPont Tyvek",
    image: "/images/Tyvek_Dupont_Disposable_Coveralls.webp",
    logo: "/images/brands/tyvek.png",
    href: "/products/safety",
    description: "Disposable protective coveralls for safety, maintenance, and controlled work environments.",
  },
  {
    name: "Loctite",
    image: "/images/Loctite_Anti-Seize_no_bg.png",
    logo: "/images/brands/loctite.png",
    href: "/products/lubricants",
    description: "Heavy-duty anti-seize and thread compounds for metal parts exposed to demanding conditions.",
  },
  {
    name: "Salisbury ElectriFlex",
    image: "/images/Salisbury ElectriFlex Insulating Rubber Gloves.png",
    logo: "/images/brands/salisbury.png",
    href: "/products/safety",
    description: "Insulating rubber gloves for electrical safety, maintenance crews, and utility work.",
  },
  {
    name: "RIDGID Pipe Wrench",
    image: "/images/Ridgid_Straight_Pipe_Wrenches.webp",
    logo: "/images/brands/ridgid.png",
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

type HeroIconName = "box" | "quote" | "book" | "quality" | "expertise" | "delivery" | "award" | "clients" | "range" | "shield";

const heroTrustHighlights: {
  title: string;
  description: string;
  icon: HeroIconName;
}[] = [
  {
    title: "Trusted Quality",
    description: "World-class brands selected for demanding industrial work.",
    icon: "quality",
  },
  {
    title: "Technical Expertise",
    description: "Decades of experience matching crews with the right products.",
    icon: "expertise",
  },
  {
    title: "Reliable Delivery",
    description: "Coordinated support across Trinidad and the Caribbean.",
    icon: "delivery",
  },
];

const heroStats: {
  value: string;
  label: string;
  icon: HeroIconName;
}[] = [
  { value: "25+", label: "Years of excellence", icon: "award" },
  { value: "Thousands", label: "Satisfied clients", icon: "clients" },
  { value: "Wide range", label: "Ready to deliver", icon: "range" },
  { value: "Quality", label: "Built on trust", icon: "shield" },
];

const haulageHighlights: {
  label: string;
  icon: HeroIconName;
}[] = [
  { label: "Safe & Reliable", icon: "shield" },
  { label: "On-Time Delivery", icon: "delivery" },
  { label: "Nationwide Coverage", icon: "quality" },
  { label: "Experienced Professionals", icon: "expertise" },
];

function HeroLineIcon({ name, className = "h-6 w-6" }: { name: HeroIconName; className?: string }) {
  const paths: Record<HeroIconName, React.ReactNode> = {
    box: (
      <>
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
        <path d="m4 7.5 8 4.5 8-4.5" />
        <path d="M12 12v9" />
      </>
    ),
    quote: (
      <>
        <path d="M7 7h8l3 3v7H7V7Z" />
        <path d="M15 7v4h4" />
        <path d="M9.5 14.5h5" />
      </>
    ),
    book: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20" />
        <path d="M8 7h8" />
        <path d="M8 11h8" />
      </>
    ),
    quality: (
      <>
        <path d="M8 12.5 11 15l5-6" />
        <path d="M4 12a8 8 0 0 1 15.5-2.8" />
        <path d="M20 12a8 8 0 0 1-15.5 2.8" />
      </>
    ),
    expertise: (
      <>
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M4 21a8 8 0 0 1 16 0" />
        <path d="M17.5 6.5 20 4" />
      </>
    ),
    delivery: (
      <>
        <path d="M3 7h11v8H3V7Z" />
        <path d="M14 10h4l3 3v2h-7v-5Z" />
        <path d="M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        <path d="M18 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      </>
    ),
    award: (
      <>
        <path d="M12 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
        <path d="m9 13-2 8 5-3 5 3-2-8" />
      </>
    ),
    clients: (
      <>
        <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M17 11a3 3 0 1 0 0-6" />
        <path d="M3 21a6 6 0 0 1 12 0" />
        <path d="M15 16a5 5 0 0 1 6 5" />
      </>
    ),
    range: (
      <>
        <path d="M3 7h11v9H3V7Z" />
        <path d="M14 10h4l3 3v3h-7v-6Z" />
        <path d="M6.5 19a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z" />
        <path d="M17.5 19a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 20 6v6c0 5-3.4 7.8-8 9-4.6-1.2-8-4-8-9V6l8-3Z" />
        <path d="m8.5 12 2.3 2.3 4.7-5" />
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
      strokeWidth={1.9}
      viewBox="0 0 24 24"
    >
      {paths[name]}
    </svg>
  );
}

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
  const [activeBrandIndex, setActiveBrandIndex] = useState(6);
  const industriesMapRef = useRef<HTMLDivElement>(null);
  const activeBrand = featuredIndustrialBrands[activeBrandIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const mapLayer = industriesMapRef.current;
    const section = mapLayer?.parentElement;

    if (!mapLayer || !section) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;

    const updateMapPosition = () => {
      animationFrame = 0;

      if (reducedMotion.matches) {
        mapLayer.style.backgroundPosition = "50% 50%";
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const sectionCenter = rect.top + rect.height / 2;
      const scrollProgress = (viewportCenter - sectionCenter) / (window.innerHeight + rect.height);
      const clampedProgress = Math.max(-1, Math.min(1, scrollProgress));
      const verticalPan = clampedProgress * 46;
      const horizontalPan = clampedProgress * 18;

      mapLayer.style.backgroundPosition = `calc(50% + ${horizontalPan}px) calc(50% + ${verticalPan}px)`;
    };

    const requestMapPositionUpdate = () => {
      if (animationFrame) {
        return;
      }

      animationFrame = window.requestAnimationFrame(updateMapPosition);
    };

    updateMapPosition();
    window.addEventListener("scroll", requestMapPositionUpdate, { passive: true });
    window.addEventListener("resize", requestMapPositionUpdate);

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }

      window.removeEventListener("scroll", requestMapPositionUpdate);
      window.removeEventListener("resize", requestMapPositionUpdate);
    };
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

      <section
        className="relative isolate overflow-hidden bg-[#07121f] text-white"
        aria-label="AMCOL Industrial homepage banner"
      >
        <div className="relative flex min-h-[670px] items-center overflow-hidden py-20 sm:py-24 lg:min-h-[610px] lg:py-28">
          <div className="absolute inset-0 -z-20">
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
          </div>

          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(45,8,15,0.62)_0%,rgba(7,18,31,0.68)_34%,rgba(7,18,31,0.42)_60%,rgba(6,22,42,0.7)_100%)]" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_0%_18%,rgba(220,38,38,0.18),transparent_35%),radial-gradient(circle_at_100%_26%,rgba(37,99,235,0.18),transparent_34%),linear-gradient(180deg,rgba(3,7,18,0.14)_0%,rgba(3,7,18,0.66)_100%)]" />
          <div aria-hidden="true" className="absolute inset-y-0 left-0 -z-10 w-[28%] bg-[linear-gradient(135deg,rgba(220,38,38,0.1)_0%,transparent_70%)]" />
          <div aria-hidden="true" className="absolute right-0 top-0 -z-10 h-full w-[34%] bg-[linear-gradient(135deg,transparent_0%,rgba(59,130,246,0.08)_48%,rgba(14,165,233,0.1)_100%)]" />

          <div className="z-10 mx-auto grid w-full max-w-[1440px] gap-10 px-6 sm:px-8 lg:grid-cols-[1fr_360px] lg:items-center lg:px-10 xl:grid-cols-[1fr_410px]">
            <div className="max-w-4xl">
              <p className="text-[11px] font-black uppercase tracking-[0.34em] text-red-100/85">
                Industrial Supply Partner Across the Caribbean
              </p>
              <h1 className="mt-5 max-w-3xl text-5xl font-black uppercase leading-[0.95] tracking-normal text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.62)] sm:text-6xl lg:text-7xl xl:text-[5.4rem]">
                Industrial Solutions.
                <span className="mt-1 block text-red-400">Delivered.</span>
              </h1>
              <div className="mt-5 h-1 w-24 bg-red-400/85" />
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-100 sm:text-lg">
                Supplying the Caribbean&apos;s construction, energy, marine, and industrial sectors with quality products and technical expertise you can rely on.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <Link
                  href="/products"
                  className="group flex min-h-[84px] items-center gap-4 rounded-sm border border-red-200/30 bg-[linear-gradient(135deg,rgba(185,28,28,0.76)_0%,rgba(88,28,36,0.72)_100%)] px-4 py-4 text-left shadow-[0_18px_35px_-28px_rgba(127,29,29,0.75)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-red-100/80 hover:bg-red-700/72 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2 focus:ring-offset-[#07121f]"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-white/25 bg-white/10 text-white">
                    <HeroLineIcon name="box" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] font-black uppercase tracking-[0.08em] text-white">
                      View Product Lines
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-red-50">
                      Explore our full range
                    </span>
                  </span>
                  <span className="text-2xl leading-none transition group-hover:translate-x-1" aria-hidden="true">-&gt;</span>
                </Link>
                <Link
                  href="/contact"
                  className="group flex min-h-[84px] items-center gap-4 rounded-sm border border-blue-200/25 bg-[linear-gradient(135deg,rgba(30,64,120,0.68)_0%,rgba(15,39,78,0.7)_100%)] px-4 py-4 text-left shadow-[0_18px_35px_-28px_rgba(30,64,175,0.65)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-blue-100/75 hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 focus:ring-offset-[#07121f]"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-white/25 bg-white/10 text-blue-100">
                    <HeroLineIcon name="quote" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] font-black uppercase tracking-[0.08em] text-white">
                      Request Quote/Service
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-blue-50">
                      Get a fast response
                    </span>
                  </span>
                  <span className="text-2xl leading-none transition group-hover:translate-x-1" aria-hidden="true">-&gt;</span>
                </Link>
                <Link
                  href="/knowledge"
                  className="group flex min-h-[84px] items-center gap-4 rounded-sm border border-cyan-200/25 bg-[linear-gradient(135deg,rgba(15,78,118,0.62)_0%,rgba(13,50,86,0.68)_100%)] px-4 py-4 text-left shadow-[0_18px_35px_-28px_rgba(8,145,178,0.58)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-cyan-100/75 hover:bg-cyan-950/58 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-[#07121f]"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-white/25 bg-white/10 text-cyan-100">
                    <HeroLineIcon name="book" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] font-black uppercase tracking-[0.08em] text-white">
                      Read Buying Guides
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-cyan-50">
                      Expert advice and resources
                    </span>
                  </span>
                  <span className="text-2xl leading-none transition group-hover:translate-x-1" aria-hidden="true">-&gt;</span>
                </Link>
              </div>
            </div>

            <aside className="rounded-md border border-white/14 bg-[#08182b]/72 p-5 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.82)] backdrop-blur-md lg:absolute lg:right-10 lg:top-8 lg:w-[360px] xl:right-16 xl:top-10 xl:w-[410px]">
              <div className="space-y-5">
                {heroTrustHighlights.map((item, index) => (
                  <div
                    key={item.title}
                    className={index === 0 ? "flex gap-4" : "flex gap-4 border-t border-white/12 pt-5"}
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-red-300/45 bg-red-500/10 text-white shadow-[0_0_26px_-18px_rgba(239,30,48,0.82)]">
                      <HeroLineIcon name={item.icon} />
                    </span>
                    <span>
                      <span className="block text-sm font-black uppercase tracking-[0.08em] text-white">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-300">
                        {item.description}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </aside>
          </div>

          <div className="absolute bottom-5 left-0 right-0 z-20 flex justify-center gap-3 lg:bottom-6">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? "w-9 bg-red-400/90" : "w-2.5 bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 border-t border-slate-200 bg-white text-slate-950 shadow-[0_-10px_35px_-28px_rgba(15,23,42,0.7)]">
          <div className="mx-auto grid max-w-[1120px] grid-cols-2 divide-y divide-slate-200 px-6 sm:px-8 md:grid-cols-4 md:divide-x md:divide-y-0">
            {heroStats.map((stat) => (
              <div key={stat.label} className="flex min-h-[76px] items-center justify-center gap-4 py-4 text-left">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center text-slate-900">
                  <HeroLineIcon name={stat.icon} className="h-8 w-8" />
                </span>
                <span>
                  <span className="block text-sm font-black uppercase tracking-[0.12em] text-red-600">
                    {stat.value}
                  </span>
                  <span className="block text-[11px] font-black uppercase tracking-[0.14em] text-slate-700">
                    {stat.label}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NewsEventsSection />

      <section
        id="industries"
        className="relative isolate overflow-hidden border-y border-cyan-900/15 bg-[#e8f6f9] py-20 sm:py-28"
      >
        <div
          ref={industriesMapRef}
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[url('/images/Background_map_AMCOL.webp')] bg-[length:124%_auto] bg-center bg-no-repeat opacity-100 mix-blend-multiply will-change-[background-position]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_67%_45%,rgba(0,137,168,0.18),transparent_42%),linear-gradient(90deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.64)_35%,rgba(232,246,249,0.12)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 -z-10 h-full w-[48%] bg-white/45 shadow-[42px_0_70px_rgba(255,255,255,0.5)]"
        />
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-700">
                Industries We Serve
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-[2.7rem]">
                Industrial Supply Partner Across the Caribbean
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                AMCOL Industrial supplies safety, MRO, marine, construction, and facility maintenance products for worksites across Trinidad & Tobago and the wider Caribbean.
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
        <div className="mx-auto max-w-[1380px] px-6 sm:px-8 lg:px-10">
          <div className="relative overflow-hidden rounded-[1rem] border border-slate-900/10 bg-[#07111f] text-white shadow-[0_26px_70px_-38px_rgba(15,23,42,0.78)]">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-cover bg-[position:68%_45%] opacity-95 sm:bg-[position:70%_45%] lg:bg-[position:72%_46%]"
              style={{
                backgroundImage:
                  "url('/images/Nighttime truck with office building.png'), url('/images/Cargo ship.webp')",
              }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,8,20,0.98)_0%,rgba(5,12,25,0.94)_33%,rgba(34,8,16,0.56)_45%,rgba(3,7,18,0.12)_64%,rgba(3,7,18,0.34)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_17%_28%,rgba(220,38,38,0.2),transparent_34%),linear-gradient(180deg,rgba(3,7,18,0.08)_0%,rgba(3,7,18,0.5)_100%)]" />
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-[43%] top-0 hidden w-3 -skew-x-[20deg] bg-red-600/90 shadow-[0_0_34px_rgba(220,38,38,0.34)] lg:block"
            />

            <div className="relative grid min-h-[390px] lg:grid-rows-[1fr_auto]">
              <div className="grid gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[0.58fr_0.42fr] lg:px-10 xl:px-12">
                <div className="max-w-[700px] self-center">
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-red-400">
                    Affiliated Transportation Support
                  </p>
                  <div className="mt-3 h-px w-full max-w-[240px] bg-red-500/85" />
                  <h2 className="mt-4 max-w-3xl text-4xl font-black leading-[1.02] tracking-normal text-white sm:text-5xl lg:text-[3.35rem]">
                    Haulage &amp;
                    <span className="block text-red-500">Transportation Services</span>
                  </h2>
                  <p className="mt-5 max-w-[640px] text-sm leading-7 text-slate-100 sm:text-base">
                    Need reliable transportation for heavy equipment, industrial materials or oversized cargo?
                  </p>
                  <p className="mt-3 max-w-[660px] text-sm leading-7 text-slate-100 sm:text-base">
                    Our affiliated company, Amcol Haulage, provides professional haulage and cargo transportation services across <span className="font-black text-red-400">Trinidad and Tobago.</span>
                  </p>
                </div>
              </div>

              <div className="relative border-t border-white/14 bg-[#07111f]/82 px-6 py-5 backdrop-blur-[2px] sm:px-8 lg:px-10 xl:px-12">
                <div className="grid gap-5 lg:grid-cols-[1fr_340px] lg:items-center xl:grid-cols-[1fr_380px]">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {haulageHighlights.map((item, index) => (
                      <div
                        key={item.label}
                        className={`flex min-h-12 items-center gap-3 ${index === 0 ? "" : "sm:border-l sm:border-white/18 sm:pl-5"}`}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center text-red-500">
                          <HeroLineIcon name={item.icon} className="h-7 w-7" />
                        </span>
                        <span className="text-xs font-black uppercase leading-5 text-white">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <a
                    href="https://www.caribbeantransportservices.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-16 w-full items-center justify-center gap-4 rounded-md bg-[linear-gradient(135deg,#ef1f30_0%,#c91520_100%)] px-7 py-4 text-lg font-black text-white shadow-[0_20px_45px_-28px_rgba(239,31,48,0.9)] transition hover:-translate-y-0.5 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2 focus:ring-offset-[#07111f]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-600">
                      <HeroLineIcon name="delivery" />
                    </span>
                    Visit Amcol Haulage
                    <span aria-hidden="true">-&gt;</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <IndustryCardsSection />

      <section id="features" className="border-t border-slate-800 bg-[#07111a] py-20 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-400">
                Featured Industrial Brands
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Trusted by industry. Delivered by Amcol.
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                We partner with world-class brands to bring reliable solutions to every job, every day.
              </p>
            </div>
            <div className="flex justify-center gap-2 sm:justify-end">
              <button
                type="button"
                onClick={showPreviousBrand}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-lg text-sky-100 transition hover:border-sky-400 hover:bg-slate-900"
                aria-label="Show previous featured brand"
              >
                ←
              </button>
              <button
                type="button"
                onClick={showNextBrand}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-lg text-sky-100 transition hover:border-sky-400 hover:bg-slate-900"
                aria-label="Show next featured brand"
              >
                →
              </button>
            </div>
          </div>

          <div className="mt-12 overflow-hidden rounded-[1.25rem] border border-slate-700 bg-[#101b25] shadow-[0_28px_80px_-48px_rgba(0,0,0,0.95)]">
            <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
              <Link
                href={activeBrand.href}
                className="group relative flex min-h-[560px] flex-col overflow-hidden bg-[#07111a] p-7 text-white sm:p-9 lg:min-h-[620px] lg:p-10"
              >
                <div className="absolute inset-y-0 right-0 w-[46%] bg-[#101b25]" />
                <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(180deg,transparent_0%,rgba(3,9,14,0.88)_100%)]" />
                <div className="relative z-10 flex max-w-[58%] flex-1 flex-col sm:max-w-[50%]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-400">
                    Featured Brand
                  </p>
                  <h3 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                    {activeBrand.name}
                  </h3>
                  <span className="mt-5 h-px w-9 bg-sky-400" />
                  <p className="mt-5 text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
                    {activeBrand.description}
                  </p>
                  <div className="mt-7 space-y-3 text-sm text-slate-300">
                    <p>Heavy-duty products built for demanding work.</p>
                    <p>Trusted by maintenance and field crews.</p>
                    <p>Reliable performance when it matters.</p>
                  </div>
                  <span className="mt-8 inline-flex w-fit items-center gap-3 rounded-md bg-[#2879ce] px-5 py-3 text-sm font-semibold text-white transition group-hover:bg-[#3a8fe3]">
                    View products <span aria-hidden="true">→</span>
                  </span>
                </div>
                <div className="absolute inset-y-[18%] right-[3%] z-10 flex w-[36%] items-center justify-center sm:inset-y-[12%] sm:right-[7%] sm:w-[46%]">
                  <Image
                    key={activeBrand.image}
                    src={activeBrand.image}
                    alt={`${activeBrand.name} products`}
                    width={700}
                    height={700}
                    className="h-auto max-h-[460px] w-full object-contain transition duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="relative z-10 mt-auto rounded-lg border border-slate-700/80 bg-slate-900/80 px-4 py-4 backdrop-blur-sm">
                  <span className="text-sm font-semibold text-sky-400">Applications:</span>
                  <span className="ml-3 text-sm text-slate-300">Mechanical crews&nbsp; • &nbsp;Pipefitters&nbsp; • &nbsp;Maintenance&nbsp; • &nbsp;Repair work</span>
                </div>
              </Link>

              <div className="flex flex-col justify-between bg-[#101b25] p-6 sm:p-8 lg:p-9">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-sky-400">
                    Browse Brands
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                    Choose a trusted supply line
                  </h3>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {featuredIndustrialBrands.map((brand, index) => {
                    const isActive = index === activeBrandIndex;

                    return (
                      <button
                        key={brand.name}
                        type="button"
                        onClick={() => setActiveBrandIndex(index)}
                        className={`group flex min-h-[88px] items-center gap-3 rounded-lg border p-3 text-left transition ${
                          isActive
                            ? "border-sky-400 bg-slate-900 shadow-[0_0_24px_-10px_rgba(56,189,248,0.9)]"
                            : "border-slate-700 bg-slate-900/30 hover:border-slate-500 hover:bg-slate-900/70"
                        }`}
                        aria-pressed={isActive}
                      >
                        <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white p-1.5">
                          <Image
                            src={brand.logo ?? brand.image}
                            alt=""
                            fill
                            sizes="56px"
                            className="object-contain p-1.5 transition duration-300 group-hover:scale-105"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-white">
                            {brand.name}
                          </span>
                          <span className={`mt-1 block text-xs leading-5 ${isActive ? "text-sky-400" : "text-slate-400"}`}>
                            {isActive ? "Currently featured" : "View spotlight"}
                          </span>
                        </span>
                        <span className="text-base text-slate-300" aria-hidden="true">→</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-7 flex items-center justify-between border-t border-slate-700 pt-5">
                  <div className="flex gap-2">
                    {featuredIndustrialBrands.map((brand, index) => (
                      <button
                        key={`${brand.name}-indicator`}
                        type="button"
                        onClick={() => setActiveBrandIndex(index)}
                        className={`h-2.5 rounded-full transition-all ${
                          index === activeBrandIndex
                            ? "w-8 bg-sky-500"
                            : "w-2.5 bg-slate-600 hover:bg-sky-400"
                        }`}
                        aria-label={`Show ${brand.name}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {activeBrandIndex + 1} / {featuredIndustrialBrands.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      </main>
      <SiteFooter />
    </div>
  );
}
