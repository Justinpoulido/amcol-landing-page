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

const HERO_SLIDE_DURATION_MS = 6000;
const BRAND_SLIDE_DURATION_MS = 7000;

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

const featuredIndustrialBrands: {
  name: string;
  shortName?: string;
  product: string;
  category: string;
  image: string;
  logo: string;
  href: string;
  description: string;
  highlights: string[];
  applications: string[];
}[] = [
  {
    name: "RIDGID",
    product: "Pipe Threading Dies",
    category: "Pipe Threading",
    image: "/images/Ridgid_pipe_dies_no_bg.png",
    logo: "/images/brands/ridgid.png",
    href: "/products?search=pipe%20dies",
    description: "Pipe dies and threading accessories for mechanical, fabrication, and maintenance teams.",
    highlights: [
      "Clean, accurate threads on steel pipe",
      "Made for RIDGID die heads and threaders",
      "Built for repeat jobsite use",
    ],
    applications: ["Pipefitting", "Fabrication", "Plumbing", "Maintenance"],
  },
  {
    name: "Geko",
    product: "Pipe Repair Clamps",
    category: "Pipe Repair",
    image: "/images/Geko_repair_clamp.webp",
    logo: "/images/brands/geko.png",
    href: "/products?search=pipe%20repair",
    description: "Pipe repair clamps for fast, secure repairs across industrial water and utility systems.",
    highlights: [
      "Fast, secure repair of leaking or damaged pipe",
      "Stainless steel for corrosion resistance",
      "Installs with standard hand tools",
    ],
    applications: ["Water utilities", "Irrigation", "Plant maintenance", "Emergency repair"],
  },
  {
    name: "BAND-IT",
    product: "Stainless Steel Banding",
    category: "Banding & Clamps",
    image: "/images/Band-IT_Band.webp",
    logo: "/images/brands/band-it.png",
    href: "/products?search=banding",
    description: "Stainless steel banding and fastening products for pipework, signage, and industrial installs.",
    highlights: [
      "High-strength stainless band, buckles, and clamps",
      "Permanent, vibration-resistant fastening",
      "Holds up in corrosive and outdoor environments",
    ],
    applications: ["Pipe & hose clamping", "Signage", "Cable bundling", "Oil & gas"],
  },
  {
    name: "DuPont Tyvek",
    product: "Disposable Coveralls",
    category: "Protective Wear",
    image: "/images/Tyvek_Dupont_Disposable_Coveralls.webp",
    logo: "/images/brands/tyvek.png",
    href: "/products/safety",
    description: "Disposable protective coveralls for safety, maintenance, and controlled work environments.",
    highlights: [
      "Lightweight, breathable full-body protection",
      "Barrier against fine particles and light splashes",
      "Comfortable fit for long shifts",
    ],
    applications: ["Industrial cleaning", "Painting & coating", "Plant maintenance", "Particulate work"],
  },
  {
    name: "Loctite",
    product: "LB 8009 Heavy Duty Anti-Seize",
    category: "Lubricants",
    image: "/images/Loctite_Anti-Seize_no_bg.png",
    logo: "/images/brands/loctite.png",
    href: "/products/lubricants",
    description: "Heavy-duty anti-seize and thread compounds for metal parts exposed to demanding conditions.",
    highlights: [
      "Prevents seizing, galling, and corrosion on threads",
      "Easier disassembly after long service",
      "Performs under high heat and heavy loads",
    ],
    applications: ["Flange bolts", "Pumps & valves", "Marine hardware", "Heavy equipment"],
  },
  {
    name: "Salisbury ElectriFlex",
    shortName: "Salisbury",
    product: "Insulating Rubber Gloves",
    category: "Electrical Safety",
    image: "/images/Salisbury ElectriFlex Insulating Rubber Gloves.png",
    logo: "/images/brands/salisbury.png",
    href: "/products/safety",
    description: "Insulating rubber gloves for electrical safety, maintenance crews, and utility work.",
    highlights: [
      "Rated by voltage class for live electrical work",
      "Flexible rubber for better dexterity",
      "Worn with leather protectors on the job",
    ],
    applications: ["Utility linework", "Electrical maintenance", "Substations", "Switchgear"],
  },
  {
    name: "RIDGID",
    product: "Straight Pipe Wrenches",
    category: "Hand Tools",
    image: "/images/Ridgid_Straight_Pipe_Wrenches.webp",
    logo: "/images/brands/ridgid.png",
    href: "/products?search=pipe%20wrench",
    description: "Straight pipe wrenches for mechanical crews, pipefitters, maintenance, and repair work.",
    highlights: [
      "Heavy-duty I-beam handle",
      "Replaceable hook and heel jaws",
      "Self-cleaning threads for easy adjustment",
    ],
    applications: ["Pipefitting", "Plumbing", "Mechanical repair", "Maintenance"],
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

type HeroIconName =
  | "box"
  | "quote"
  | "book"
  | "quality"
  | "expertise"
  | "delivery"
  | "award"
  | "clients"
  | "range"
  | "shield"
  | "arrowRight"
  | "chevronLeft"
  | "chevronRight";

const heroTrustHighlights: {
  title: string;
  description: string;
  icon: HeroIconName;
}[] = [
  {
    title: "Trusted Quality",
    description: "World-class brands for demanding work.",
    icon: "quality",
  },
  {
    title: "Technical Expertise",
    description: "Decades matching crews with the right gear.",
    icon: "expertise",
  },
  {
    title: "Reliable Delivery",
    description: "Across Trinidad & the wider Caribbean.",
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
        <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    expertise: (
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" />
    ),
    delivery: (
      <>
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9" />
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
        <circle cx="17" cy="18" r="2" />
        <circle cx="7" cy="18" r="2" />
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
    arrowRight: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    chevronLeft: <path d="m15 6-6 6 6 6" />,
    chevronRight: <path d="m9 6 6 6-6 6" />,
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
  const [activeBrandIndex, setActiveBrandIndex] = useState(0);
  const [isBrandHovered, setIsBrandHovered] = useState(false);
  const [isBrandInView, setIsBrandInView] = useState(false);
  const brandsSectionRef = useRef<HTMLElement>(null);
  const brandRailRef = useRef<HTMLDivElement>(null);
  const isBrandRotationPaused = isBrandHovered || !isBrandInView;
  const industriesMapRef = useRef<HTMLDivElement>(null);
  const activeBrand = featuredIndustrialBrands[activeBrandIndex];

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, HERO_SLIDE_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [currentImageIndex]);

  const showPreviousSlide = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + heroImages.length) % heroImages.length);
  };

  const showNextSlide = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
  };

  const showNextBrand = () => {
    setActiveBrandIndex((prevIndex) => (prevIndex + 1) % featuredIndustrialBrands.length);
  };

  // Only rotate featured brands while the section is on screen.
  useEffect(() => {
    const section = brandsSectionRef.current;

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => setIsBrandInView(entry.isIntersecting), {
      threshold: 0.25,
    });
    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  // On narrow screens the brand rail scrolls sideways; keep the active tab visible without moving the page.
  useEffect(() => {
    const rail = brandRailRef.current;
    const activeTab = rail?.children[activeBrandIndex] as HTMLElement | undefined;

    if (!rail || !activeTab || rail.scrollWidth <= rail.clientWidth) {
      return;
    }

    rail.scrollTo({
      left: activeTab.offsetLeft - (rail.clientWidth - activeTab.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [activeBrandIndex]);

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

    // Content is only hidden for the reveal once JS is running, so it can never get stuck invisible.
    // If the section is already on screen at mount, show it in the same frame to avoid a flash.
    const sectionRect = section.getBoundingClientRect();
    if (sectionRect.top < window.innerHeight && sectionRect.bottom > 0) {
      section.classList.add("is-visible");
    }
    section.classList.add("reveal-ready");

    const revealObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("is-visible");
          revealObserver.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    revealObserver.observe(section);

    // Pause the looping map animations while the section is off screen.
    const inViewObserver = new IntersectionObserver(([entry]) => {
      section.classList.toggle("is-in-view", entry.isIntersecting);
    });
    inViewObserver.observe(section);

    updateMapPosition();
    window.addEventListener("scroll", requestMapPositionUpdate, { passive: true });
    window.addEventListener("resize", requestMapPositionUpdate);

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }

      revealObserver.disconnect();
      inViewObserver.disconnect();
      window.removeEventListener("scroll", requestMapPositionUpdate);
      window.removeEventListener("resize", requestMapPositionUpdate);
    };
  }, []);


  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main>
      <section
        className="relative isolate overflow-hidden bg-[#07111a] text-white"
        aria-label="AMCOL Industrial homepage banner"
      >
        <div className="relative flex min-h-[640px] flex-col lg:min-h-[700px]">
          <div className="absolute inset-0 -z-20">
            {heroImages.map((image, index) => {
              const isActive = index === currentImageIndex;

              return (
                <div
                  key={image}
                  className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                  aria-hidden="true"
                >
                  <Image
                    key={isActive ? `${image}-active` : image}
                    src={image}
                    alt=""
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className={`object-cover object-center ${isActive ? "hero-slide-zoom" : ""}`}
                  />
                </div>
              );
            })}
          </div>

          {/* One navy tone, deepest behind the copy and fading out to let the photo breathe on the right. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,17,26,0.94)_0%,rgba(7,17,26,0.82)_38%,rgba(7,17,26,0.45)_68%,rgba(7,17,26,0.2)_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(7,17,26,0.95)_0%,rgba(7,17,26,0)_38%),linear-gradient(180deg,rgba(7,17,26,0.45)_0%,rgba(7,17,26,0)_22%)]"
          />

          <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 pb-14 pt-16 sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
            <div className="max-w-3xl">
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                <span aria-hidden="true" className="h-px w-10 bg-[#e5394d]" />
                Industrial supply partner across the Caribbean
              </p>

              <h1 className="mt-6 max-w-2xl text-[2.75rem] font-bold leading-[1.02] tracking-[-0.03em] text-white sm:text-6xl lg:text-[4.5rem]">
                Industrial solutions.
                <span className="block text-[#ef4a5c]">Delivered.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                Supplying the Caribbean&apos;s construction, energy, marine, and industrial sectors with quality products and technical expertise you can rely on.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/products"
                  className="btn btn-primary group h-[52px] px-7 text-[15px]"
                >
                  Browse Products
                  <HeroLineIcon name="arrowRight" className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/contact"
                  className="btn btn-secondary-dark h-[52px] px-7 text-[15px]"
                >
                  Request a Quote
                </Link>
                <Link
                  href="/knowledge"
                  className="group inline-flex items-center gap-2 px-1 py-2 text-sm font-semibold text-slate-200 transition hover:text-white sm:ml-3"
                >
                  Read buying guides
                  <HeroLineIcon name="arrowRight" className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-2.5">
                <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Popular
                </span>
                {quickCategoryShortcuts.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="inline-flex h-8 items-center rounded-full border border-white/15 bg-white/[0.04] px-3.5 text-xs font-medium text-slate-200 transition hover:border-white/40 hover:bg-white/10 hover:text-white"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="relative border-t border-white/10 bg-[#07111a]/55 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center gap-8 px-4 py-5 sm:px-6 lg:px-8">
              <ul className="hidden flex-1 grid-cols-3 divide-x divide-white/10 xl:grid">
                {heroTrustHighlights.map((item) => (
                  <li key={item.title} className="flex items-center gap-4 px-7 first:pl-0">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ef4a5c]/10 text-[#ff7584] ring-1 ring-inset ring-[#ef4a5c]/30">
                      <HeroLineIcon name={item.icon} className="h-[22px] w-[22px]" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[15px] font-semibold tracking-[-0.01em] text-white">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-[13px] leading-5 text-slate-400">
                        {item.description}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex w-full items-center justify-between gap-5 xl:w-auto xl:justify-end xl:border-l xl:border-white/10 xl:pl-8">
                <p className="text-xs font-semibold tabular-nums tracking-[0.18em] text-slate-300">
                  <span className="text-white">{String(currentImageIndex + 1).padStart(2, "0")}</span>
                  <span className="mx-1.5 text-slate-500">/</span>
                  {String(heroImages.length).padStart(2, "0")}
                </p>

                <div className="flex items-center gap-1.5" role="group" aria-label="Choose banner slide">
                  {heroImages.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`Go to slide ${index + 1}`}
                      aria-current={index === currentImageIndex ? "true" : undefined}
                      className="group flex h-6 items-center"
                    >
                      <span className="relative block h-[3px] w-8 overflow-hidden rounded-full bg-white/20 transition group-hover:bg-white/35 sm:w-10">
                        {index === currentImageIndex && (
                          <span
                            key={currentImageIndex}
                            className="hero-progress-fill absolute inset-0 rounded-full bg-[#ef4a5c]"
                            style={{ "--hero-slide-duration": `${HERO_SLIDE_DURATION_MS}ms` } as React.CSSProperties}
                          />
                        )}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={showPreviousSlide}
                    aria-label="Previous slide"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-white/50 hover:bg-white/10"
                  >
                    <HeroLineIcon name="chevronLeft" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={showNextSlide}
                    aria-label="Next slide"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-white/50 hover:bg-white/10"
                  >
                    <HeroLineIcon name="chevronRight" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 border-b border-slate-200 bg-white text-slate-950">
          <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
            {heroStats.map((stat, index) => (
              <div
                key={stat.label}
                className={`flex min-h-[88px] items-center gap-4 py-5 md:justify-center ${
                  index % 2 === 1 ? "pl-4 md:pl-0" : ""
                } ${index > 1 ? "border-t border-slate-200 md:border-t-0" : ""} ${
                  index > 0 ? "md:border-l md:border-slate-200" : ""
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center text-[#0f1b2d]">
                  <HeroLineIcon name={stat.icon} className="h-7 w-7" />
                </span>
                <span>
                  <span className="block text-base font-bold tracking-[-0.01em] text-[#c81f34]">
                    {stat.value}
                  </span>
                  <span className="block text-xs font-medium uppercase tracking-[0.12em] text-slate-600">
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
          className="industries-map absolute inset-0 -z-10 bg-[url('/images/Background_map_AMCOL.webp')] bg-[length:124%_auto] bg-center bg-no-repeat opacity-100 mix-blend-multiply will-change-[background-position]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_67%_45%,rgba(0,137,168,0.18),transparent_42%),linear-gradient(90deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.64)_35%,rgba(232,246,249,0.12)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 -z-10 h-full w-[48%] bg-white/45 shadow-[42px_0_70px_rgba(255,255,255,0.5)]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="industries-map-sheen absolute inset-y-0 left-0 w-1/3 bg-[linear-gradient(100deg,transparent_0%,rgba(0,137,168,0.10)_45%,rgba(255,255,255,0.35)_50%,rgba(0,137,168,0.10)_55%,transparent_100%)]" />
        </div>
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="industries-reveal text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-700">
                Industries We Serve
              </p>
              <h1
                className="industries-reveal mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-[2.7rem]"
                style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
              >
                Industrial Supply Partner Across the Caribbean
              </h1>
              <p
                className="industries-reveal mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg"
                style={{ "--reveal-delay": "240ms" } as React.CSSProperties}
              >
                AMCOL Industrial supplies safety, MRO, marine, construction, and facility maintenance products for worksites across Trinidad & Tobago and the wider Caribbean.
              </p>
            </div>
            <div
              className="industries-reveal rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-[0_18px_44px_-34px_rgba(15,23,42,0.55)] sm:p-6"
              style={{ "--reveal-delay": "360ms" } as React.CSSProperties}
            >
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

      <section
        id="features"
        ref={brandsSectionRef}
        className="relative isolate overflow-hidden border-t border-white/5 bg-[#0b1733] py-20 sm:py-28"
      >
        {/* AMCOL navy field with a faint red glow, echoing the logo colours. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_10%,rgba(46,72,140,0.45),transparent_45%),radial-gradient(circle_at_5%_95%,rgba(229,57,77,0.12),transparent_40%)]"
        />
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                <span aria-hidden="true" className="h-px w-10 bg-[#e5394d]" />
                Featured industrial brands
              </p>
              <h2 className="mt-5 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl lg:text-[2.75rem]">
                Trusted by industry.{" "}
                <span className="text-[#ef4a5c]">Delivered by AMCOL.</span>
              </h2>
              <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-slate-300 sm:text-lg">
                We partner with world-class brands to bring reliable solutions to every job, every day.
              </p>
            </div>
            <Link
              href="/products"
              className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-slate-200 transition hover:text-white"
            >
              Browse all products
              <HeroLineIcon name="arrowRight" className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Auto-rotation pauses while the card is hovered or focused. */}
          <div
            onMouseEnter={() => setIsBrandHovered(true)}
            onMouseLeave={() => setIsBrandHovered(false)}
            onFocus={() => setIsBrandHovered(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setIsBrandHovered(false);
              }
            }}
            className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-[#0f1d3d] shadow-[0_32px_90px_-50px_rgba(0,0,0,0.95)]"
          >
            <div aria-hidden="true" className="h-1 bg-[#e5394d]" />

            <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
              {/* Product stage */}
              <div className="relative min-h-[340px] overflow-hidden bg-[radial-gradient(circle_at_50%_55%,#263b73_0%,#16264f_42%,#0c1733_100%)] sm:min-h-[440px] lg:min-h-[580px]">
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 top-[55%] h-[78%] w-auto aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]"
                />
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 top-[55%] h-[52%] w-auto aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.08]"
                />
                <div
                  aria-hidden="true"
                  className="absolute bottom-[9%] left-1/2 h-6 w-[45%] -translate-x-1/2 rounded-[50%] bg-black/45 blur-xl"
                />

                <div className="absolute left-5 top-5 z-10 flex items-center gap-3 sm:left-7 sm:top-7">
                  <span className="relative flex h-11 w-20 items-center justify-center overflow-hidden rounded-md bg-white shadow-[0_8px_20px_-10px_rgba(0,0,0,0.6)]">
                    <Image
                      src={activeBrand.logo}
                      alt={`${activeBrand.name} logo`}
                      fill
                      sizes="80px"
                      className="object-contain p-1.5"
                    />
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200 backdrop-blur-sm">
                    {activeBrand.category}
                  </span>
                </div>

                <div key={activeBrand.image} className="brand-swap-image absolute inset-x-8 bottom-[8%] top-[26%] sm:inset-x-14 sm:top-[18%] sm:bottom-[10%]">
                  <Image
                    src={activeBrand.image}
                    alt={`${activeBrand.name} ${activeBrand.product}`}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.45)]"
                  />
                </div>
              </div>

              {/* Product information */}
              <div
                key={activeBrandIndex}
                className="brand-swap flex flex-col border-t border-white/10 p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-12"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#ff6b7d]">
                  Featured brand
                </p>
                <h3 className="mt-3 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
                  {activeBrand.name}
                </h3>
                <p className="mt-1.5 text-lg font-medium text-slate-300">{activeBrand.product}</p>
                <span aria-hidden="true" className="mt-6 h-0.5 w-10 bg-[#e5394d]" />
                <p className="mt-6 text-base leading-7 text-slate-300">{activeBrand.description}</p>

                <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Key features
                </p>
                <ul className="mt-4 space-y-3">
                  {activeBrand.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3 text-sm leading-6 text-slate-200">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e5394d]/15 text-[#ff6b7d] ring-1 ring-inset ring-[#e5394d]/35">
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                          <path d="m5 12.5 4.5 4.5L19 7.5" />
                        </svg>
                      </span>
                      {highlight}
                    </li>
                  ))}
                </ul>

                <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Applications
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {activeBrand.applications.map((application) => (
                    <li
                      key={application}
                      className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-200"
                    >
                      {application}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-col gap-3 pt-10 sm:flex-row">
                  <Link href={activeBrand.href} className="btn btn-primary group h-12 px-6 text-sm">
                    View products
                    <HeroLineIcon name="arrowRight" className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </Link>
                  <Link href="/contact" className="btn btn-secondary-dark h-12 px-6 text-sm">
                    Request a quote
                  </Link>
                </div>
              </div>
            </div>

            {/* Brand selector: the single way to switch the featured brand. */}
            <div
              ref={brandRailRef}
              role="group"
              aria-label="Choose a featured brand"
              className="grid snap-x auto-cols-[minmax(176px,1fr)] grid-flow-col divide-x divide-white/10 overflow-x-auto border-t border-white/10 bg-[#0b1630]"
            >
              {featuredIndustrialBrands.map((brand, index) => {
                const isActive = index === activeBrandIndex;

                return (
                  <button
                    key={`${brand.name}-${brand.product}`}
                    type="button"
                    onClick={() => setActiveBrandIndex(index)}
                    aria-pressed={isActive}
                    className={`group relative flex snap-start items-center gap-2.5 px-3.5 py-4 text-left transition ${
                      isActive ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 top-0 h-0.5 overflow-hidden transition ${
                        isActive ? "bg-white/15" : "bg-transparent group-hover:bg-white/20"
                      }`}
                    >
                      {isActive && (
                        <span
                          key={activeBrandIndex}
                          onAnimationEnd={showNextBrand}
                          className="brand-progress-fill absolute inset-0 bg-[#e5394d]"
                          style={
                            {
                              "--brand-slide-duration": `${BRAND_SLIDE_DURATION_MS}ms`,
                              animationPlayState: isBrandRotationPaused ? "paused" : "running",
                            } as React.CSSProperties
                          }
                        />
                      )}
                    </span>
                    <span
                      className={`relative flex h-10 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white transition ${
                        isActive ? "opacity-100" : "opacity-75 group-hover:opacity-100"
                      }`}
                    >
                      <Image src={brand.logo} alt="" fill sizes="48px" className="object-contain p-1" />
                    </span>
                    <span className="min-w-0">
                      <span className={`block truncate text-sm font-semibold ${isActive ? "text-white" : "text-slate-300"}`}>
                        {brand.shortName ?? brand.name}
                      </span>
                      <span className="block truncate text-xs text-slate-400">{brand.category}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      </main>
      <SiteFooter />
    </div>
  );
}
