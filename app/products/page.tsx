"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { featuredProductCategories } from "@/lib/product-categories";

const navLinks = [
  { name: "HOME", href: "https://www.amcolhardwarett.com/index.php" },
  { name: "PRODUCTS", href: "/products" },
  { name: "CONSTRUCTION", href: "https://www.amcolhardwarett.com/construction.php" },
  { name: "INDUSTRIAL", href: "/industrial" },
  { name: "DEPARTMENTS", href: "/departments" },
  { name: "CONTACT US", href: "/contact" },
];

const products = [
  {
    id: 1,
    name: "WD-40 Multi-Use Product",
    category: "Lubricants",
    image: "/images/3 WD-40 Cans Banner.png",
    price: "$12.99",
  },
  {
    id: 2,
    name: "Simple Green All-Purpose Cleaner",
    category: "Cleaning",
    image: "/images/Simple Green Safer Choice Banner.png",
    price: "$15.50",
  },
  {
    id: 3,
    name: "Red Devil Silicone Sealant",
    category: "Adhesives",
    image: "/images/Silicone Tube with Red Devil Background.png",
    price: "$8.75",
  },
  {
    id: 4,
    name: "DeWalt Power Tool Kit",
    category: "Tools",
    image: "/images/Dewalt Kit.jpg",
    price: "$299.00",
  },
  {
    id: 5,
    name: "Solar Panel Module",
    category: "Energy",
    image: "/images/solar_panel.png",
    price: "Inquire",
  },
  {
    id: 6,
    name: "Industrial Safety Gear",
    category: "Safety",
    image: "/images/protective_equipment.png",
    price: "Inquire",
  },
  {
    id: 7,
    name: "Marine Rigging Supplies",
    category: "Marine",
    image: "/images/RIG.jpg",
    price: "Inquire",
  },
  {
    id: 8,
    name: "Heavy Duty Welding Equipment",
    category: "Welding",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800",
    price: "Inquire",
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900">
      {/* Navigation */}
      <header className="hero-mainnav relative z-40">
        <div className="flex w-full flex-col overflow-hidden md:flex-row md:items-stretch">
          <div className="hero-brand-panel flex items-center justify-center px-6 py-5 sm:px-8 md:w-[38%] md:min-w-[380px] md:justify-start lg:px-10">
            <div className="hero-brand-content relative z-10 flex w-full max-w-[520px] items-center gap-4 sm:gap-5">
              <Link className="hero-brand-logo-wrap shrink-0" href="/" aria-label="AMCOL Home">
                <Image
                  src="/images/AMCOL_Logo.png"
                  alt="AMCOL Logo"
                  width={420}
                  height={104}
                  priority
                  className="hero-brand-logo h-20 w-auto max-w-[320px] sm:h-24 md:h-[6.1rem]"
                />
              </Link>

              <div className="hero-brand-copy hidden min-w-0 flex-1 md:block">
                <p className="hero-brand-eyebrow text-[10px] font-semibold uppercase tracking-[0.34em] text-cyan-200/90">
                  Industrial Supply Partner
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200/90">
                  Reliable products for maintenance, safety, facility operations, and industrial procurement.
                </p>
              </div>
            </div>
          </div>

          <div className="hero-links-panel flex flex-1 items-center justify-center px-4 py-4 sm:px-6 lg:px-10">
            <div className="flex w-full flex-col items-center justify-center gap-3 lg:flex-row lg:justify-between">
              <div className="hidden rounded-full border border-slate-200 bg-white/75 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.45)] lg:inline-flex">
                AMCOL Industrial Catalog
              </div>
              <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 text-[11px] font-bold uppercase tracking-[0.2em] sm:gap-x-4">
                {navLinks.map((link) => {
                  const isActive = link.name === "PRODUCTS";

                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      className={`hero-nav-link rounded-sm border px-4 py-3 ${
                        isActive
                          ? "border-[#39d9cd]/70 bg-[#0d2238] text-[#39d9cd]"
                          : "border-slate-200 bg-white text-slate-700 hover:border-[#39d9cd]/45 hover:text-[#0d2238]"
                      }`}
                    >
                      {link.name}
                    </a>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Banner Section */}
      <section className="relative overflow-hidden bg-[#1A1A1B] pt-32 pb-24 sm:pt-40 sm:pb-32">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-50 grayscale mix-blend-overlay"
            style={{ backgroundImage: "url('/images/Heritage Industry.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1B]/80 via-[#1A1A1B]/60 to-[#1A1A1B]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            World-Class <span className="text-red-600">Products</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
            Explore our comprehensive catalog of industrial, construction, and marine supplies designed for performance and durability.
          </p>
        </div>
      </section>

      {/* Summary Text Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Industries We Serve
          </h2>
          <p className="mt-6 text-lg leading-8 text-zinc-600 max-w-3xl mx-auto">
            At AMCOL, we pride ourselves on being the backbone of major industries. From heavy construction and industrial manufacturing to marine logistics and energy production, our diverse product range ensures that you have the right tools and materials for every job. We partner with top global brands to bring you reliability and innovation.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProductCategories.map((category) => (
              <a
                key={category.name}
                href={category.href}
                className="group relative flex h-64 flex-col overflow-hidden rounded-2xl hover:shadow-lg transition-all"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${category.image}')` }}
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative flex flex-1 items-center justify-center">
                  <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="bg-zinc-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="sr-only">Products</h2>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <a key={product.id} href="#" className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md border border-zinc-200">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-zinc-200 lg:aspect-none group-hover:opacity-75 lg:h-64">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-900">
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">{product.category}</p>
                  </div>
                  <p className="mt-2 text-sm font-medium text-red-600">{product.price}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-12 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <span className="text-sm font-medium text-zinc-500">AMCOL</span>
            <div className="flex gap-8">
              <a
                href="#"
                className="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
