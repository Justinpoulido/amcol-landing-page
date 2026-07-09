"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { industrialArticles } from "@/lib/articles";

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
      <SiteHeader />

      <section className="relative bg-[#1A1A1B] pt-20 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 grayscale mix-blend-overlay"
            style={{ backgroundImage: "url('/images/Heritage Industry.webp')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1B]/80 via-[#1A1A1B]/70 to-[#1A1A1B]" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold tracking-[0.2em] text-red-500">NEWS & ARTICLES</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Industrial Supply Project Highlights in Trinidad & Tobago
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-300 max-w-3xl mx-auto">
            Project stories, delivery milestones, and field support updates from AMCOL Industrial across energy, marine, welding, safety, and maintenance operations in Trinidad & Tobago.
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
                <div className="relative min-h-[280px] overflow-hidden">
                  <Image
                    src={featured.image}
                    alt={`${featured.title} project support in ${featured.location}`}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
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
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={`${article.title} project support in ${article.location}`}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
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
      <SiteFooter />
    </div>
  );
}
