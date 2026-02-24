"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type IndustrialArticle = {
  id: number;
  title: string;
  slug: string;
  sector: "Energy" | "Welding" | "Marine" | "Safety";
  location: string;
  completedOn: string;
  summary: string;
  image: string;
  tags: string[];
};

const navLinks = [
  { name: "HOME", href: "https://www.amcolhardwarett.com/index.php" },
  { name: "PRODUCTS", href: "/products" },
  { name: "CONSTRUCTION", href: "https://www.amcolhardwarett.com/construction.php" },
  { name: "INDUSTRIAL", href: "/industrial" },
  { name: "DEPARTMENTS", href: "/departments" },
  { name: "CONTACT US", href: "/contact" },
];

const industrialArticles: IndustrialArticle[] = [
  {
    id: 1,
    title: "Offshore Platform Retrofit Support Program",
    slug: "offshore-platform-retrofit-support-program",
    sector: "Marine",
    location: "Galeota Point",
    completedOn: "2025-11-18",
    summary:
      "AMCOL supplied corrosion-resistant fasteners, marine-grade sealants, and maintenance chemicals for a multi-stage retrofit initiative.",
    image: "/images/RIG.jpg",
    tags: ["retrofit", "offshore", "marine maintenance"],
  },
  {
    id: 2,
    title: "Utility-Scale Solar Mounting Hardware Delivery",
    slug: "utility-scale-solar-mounting-hardware-delivery",
    sector: "Energy",
    location: "Central Trinidad",
    completedOn: "2025-09-30",
    summary:
      "Delivered anchors, panel mounting supports, and consumables for a grid-tied solar installation with phased procurement support.",
    image: "/images/Solar  light.png",
    tags: ["solar", "procurement", "bulk supply"],
  },
  {
    id: 3,
    title: "Fabrication Yard Welding Consumables Rollout",
    slug: "fabrication-yard-welding-consumables-rollout",
    sector: "Welding",
    location: "La Brea",
    completedOn: "2025-07-14",
    summary:
      "Coordinated recurring supply for welding electrodes, abrasives, and PPE across fabrication crews working on structural assemblies.",
    image: "/images/Heritage-tank with crane.png",
    tags: ["fabrication", "consumables", "site support"],
  },
  {
    id: 4,
    title: "Plant-Wide Safety Compliance Restocking",
    slug: "plant-wide-safety-compliance-restocking",
    sector: "Safety",
    location: "Point Lisas",
    completedOn: "2025-04-22",
    summary:
      "Implemented staged delivery of PPE kits, signage, and inspection-ready safety inventory for operations and maintenance teams.",
    image: "/images/Road-Work.png",
    tags: ["ppe", "compliance", "industrial plant"],
  },
  {
    id: 5,
    title: "Turnaround Lubrication and MRO Supply Support",
    slug: "turnaround-lubrication-mro-supply-support",
    sector: "Energy",
    location: "South Oropouche",
    completedOn: "2024-12-05",
    summary:
      "Supplied maintenance, repair, and operations inventory including specialty lubricants and cleaners for turnaround execution.",
    image: "/images/3 WD-40 Cans Banner.png",
    tags: ["mro", "turnaround", "maintenance"],
  },
  {
    id: 6,
    title: "Workshop Tooling and Preventive Maintenance Upgrade",
    slug: "workshop-tooling-and-preventive-maintenance-upgrade",
    sector: "Welding",
    location: "San Fernando",
    completedOn: "2024-08-16",
    summary:
      "Delivered portable power tools, grinder kits, and service accessories to modernize workshop readiness and uptime.",
    image: "/images/Dewalt Kit.jpg",
    tags: ["tooling", "maintenance", "workshop"],
  },
];

const sectorFilters = ["All", "Energy", "Welding", "Marine", "Safety"] as const;

export default function NewsAndArticlesPage() {
  const [query, setQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<(typeof sectorFilters)[number]>("All");
  const [showNewestFirst, setShowNewestFirst] = useState(true);

  const filteredArticles = useMemo(() => {
    const loweredQuery = query.trim().toLowerCase();

    const result = industrialArticles.filter((article) => {
      const matchesSector = selectedSector === "All" || article.sector === selectedSector;
      const searchable = `${article.title} ${article.summary} ${article.location} ${article.tags.join(" ")}`.toLowerCase();
      const matchesQuery = loweredQuery.length === 0 || searchable.includes(loweredQuery);
      return matchesSector && matchesQuery;
    });

    return result.sort((a, b) => {
      const first = new Date(a.completedOn).getTime();
      const second = new Date(b.completedOn).getTime();
      return showNewestFirst ? second - first : first - second;
    });
  }, [query, selectedSector, showNewestFirst]);

  const featured = filteredArticles[0];

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
        <nav className="w-full border-t-2 border-red-600 bg-white shadow-sm flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <ul className="flex flex-1 flex-wrap items-center justify-center overflow-x-auto">
            {navLinks.map((link) => (
              <li key={link.name} className="border-l border-zinc-200 last:border-r">
                <a
                  href={link.href}
                  className={`inline-block px-6 py-4 text-sm font-bold tracking-tight transition-colors hover:bg-zinc-50 ${
                    link.name === "INDUSTRIAL" ? "text-red-600" : "text-zinc-700 hover:text-red-600"
                  }`}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <div className="px-6">
            <Link href="/" aria-label="Go to homepage">
              <img
                src="/images/AMCOL_Logo.png"
                alt="AMCOL Logo"
                className="h-24 w-auto transition-transform duration-300 hover:scale-105 drop-shadow-md"
              />
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative bg-[#1A1A1B] pt-48 pb-20 sm:pt-56 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 grayscale mix-blend-overlay"
            style={{ backgroundImage: "url('/images/Heritage Industry.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1B]/80 via-[#1A1A1B]/70 to-[#1A1A1B]" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold tracking-[0.2em] text-red-500">NEWS & ARTICLES</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Industrial Work Highlights
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-300 max-w-3xl mx-auto">
            Explore AMCOL project stories, delivery milestones, and field support activities across energy, marine,
            welding, and safety operations.
          </p>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label htmlFor="article-search" className="mb-2 block text-sm font-semibold text-zinc-700">
                Search Articles
              </label>
              <input
                id="article-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by project, location, or keyword..."
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>
            <div>
              <label htmlFor="sort-order" className="mb-2 block text-sm font-semibold text-zinc-700">
                Sort Order
              </label>
              <select
                id="sort-order"
                value={showNewestFirst ? "newest" : "oldest"}
                onChange={(event) => setShowNewestFirst(event.target.value === "newest")}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {sectorFilters.map((sector) => {
              const isActive = selectedSector === sector;
              return (
                <button
                  key={sector}
                  type="button"
                  onClick={() => setSelectedSector(sector)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-red-600 text-white shadow-sm"
                      : "border border-zinc-300 bg-white text-zinc-700 hover:border-red-300 hover:text-red-600"
                  }`}
                >
                  {sector}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {featured ? (
            <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div
                  className="min-h-[280px] bg-cover bg-center"
                  style={{ backgroundImage: `url('${featured.image}')` }}
                />
                <div className="p-8 lg:p-10">
                  <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-600">
                    Featured Project
                  </span>
                  <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900">{featured.title}</h2>
                  <p className="mt-3 text-sm font-medium text-zinc-500">
                    {featured.sector} | {featured.location} | Completed{" "}
                    {new Date(featured.completedOn).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="mt-5 text-zinc-600">{featured.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {featured.tags.map((tag) => (
                      <span key={tag} className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={`/news/${featured.slug}`}
                    className="mt-8 inline-block rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700"
                  >
                    Read Article
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center">
              <h2 className="text-2xl font-bold text-zinc-900">No articles found</h2>
              <p className="mt-2 text-zinc-600">Try changing the filter or search keywords.</p>
            </div>
          )}

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredArticles.slice(1).map((article) => (
              <article
                key={article.id}
                className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div
                  className="h-44 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${article.image}')` }}
                />
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-600">{article.sector}</p>
                  <h3 className="mt-2 text-xl font-bold text-zinc-900">{article.title}</h3>
                  <p className="mt-2 text-sm text-zinc-500">
                    {article.location} |{" "}
                    {new Date(article.completedOn).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="mt-4 text-sm text-zinc-600">{article.summary}</p>
                  <a
                    href={`/news/${article.slug}`}
                    className="mt-5 inline-flex items-center text-sm font-semibold text-zinc-900 transition group-hover:text-red-600"
                  >
                    View details
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
