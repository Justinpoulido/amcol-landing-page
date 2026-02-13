"use client";

import React from "react";

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

const categories = [
  {
    name: "Energy Sector",
    href: "/products/energy",
    image: "/images/solar_panel.png",
  },
  {
    name: "Occupational Safety",
    href: "/products/safety",
    image: "/images/protective_equipment.png",
  },
  {
    name: "Marine & Offshore",
    href: "/products/marine",
    image: "/images/RIG.jpg",
  },
  {
    name: "Welding & Fabrication",
    href: "/products/welding",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800",
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
        <nav className="mx-auto max-w-7xl border-t-2 border-red-600 bg-white shadow-sm flex items-center justify-between">
          <ul className="flex flex-1 flex-wrap items-center justify-center overflow-x-auto">
            {navLinks.map((link) => (
              <li
                key={link.name}
                className="border-l border-zinc-200 last:border-r"
              >
                <a
                  href={link.href}
                  className={`inline-block px-6 py-4 text-sm font-bold tracking-tight transition-colors hover:bg-zinc-50 
                    ${
                      link.name === "PRODUCTS"
                        ? "text-red-600"
                        : "text-zinc-700 hover:text-red-600"
                    }`}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <div className="px-6">
            <img
              src="/images/AMCOL_Logo.png"
              alt="AMCOL Logo"
              className="h-24 w-auto transition-transform duration-300 hover:scale-105 drop-shadow-md"
            />
          </div>
        </nav>
      </header>

      {/* Banner Section */}
      <section className="relative bg-[#1A1A1B] pt-48 pb-24 sm:pt-64 sm:pb-32 overflow-hidden">
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
            {categories.map((category) => (
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
                  <h3 className="text-2xl font-bold text-white">{category.name}</h3>
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