"use client";

import React from "react";
import { useParams } from "next/navigation";

const navLinks = [
  { name: "HOME", href: "https://www.amcolhardwarett.com/index.php" },
  { name: "PRODUCTS", href: "/products" },
  { name: "CONSTRUCTION", href: "https://www.amcolhardwarett.com/construction.php" },
  { name: "INDUSTRIAL", href: "/industrial" },
  { name: "DEPARTMENTS", href: "/departments" },
  { name: "CONTACT US", href: "/contact" },
];

const categoryData: Record<string, {
  banner: string;
  title: string;
  subtitle: string;
  description: string;
  products: { id: number; name: string; price: string; image: string; category: string }[];
}> = {
  energy: {
    banner: "/images/solar_panel.png",
    title: "Energy Sector",
    subtitle: "Powering the Future",
    description: "AMCOL provides high-grade industrial equipment for the oil and gas industry, renewable energy sectors, and power generation facilities. Our commitment to quality ensures your operations run without interruption.",
    products: [
      { id: 1, name: "Solar Panel Module", price: "Inquire", image: "/images/solar_panel.png", category: "Energy" },
      { id: 2, name: "Industrial Generator", price: "Call for Quote", image: "/images/solar_panel.png", category: "Power" },
      { id: 3, name: "Battery Storage System", price: "Inquire", image: "/images/solar_panel.png", category: "Storage" },
    ]
  },
  safety: {
    banner: "/images/protective_equipment.png",
    title: "Occupational Safety",
    subtitle: "Protecting Your Workforce",
    description: "Protecting your workforce with certified safety gear and equipment. From head protection to respiratory safety, we supply ANSI/ISEA compliant gear for hazardous environments.",
    products: [
      { id: 1, name: "Industrial Safety Gear", price: "Inquire", image: "/images/protective_equipment.png", category: "PPE" },
      { id: 2, name: "Steel Toe Boots", price: "$450 TTD", image: "/images/protective_equipment.png", category: "Footwear" },
      { id: 3, name: "High-Visibility Vest", price: "$45 TTD", image: "/images/protective_equipment.png", category: "Apparel" },
      { id: 4, name: "Safety Helmet", price: "$85 TTD", image: "/images/protective_equipment.png", category: "Head Protection" },
    ]
  },
  marine: {
    banner: "/images/RIG.jpg",
    title: "Marine & Offshore",
    subtitle: "Navigating Excellence",
    description: "Comprehensive marine logistics and rigging supplies for offshore operations. We provide certified hardware, lifting equipment, and marine-grade consumables designed to withstand harsh saltwater environments.",
    products: [
      { id: 1, name: "Marine Rigging Supplies", price: "Inquire", image: "/images/RIG.jpg", category: "Rigging" },
      { id: 2, name: "Offshore Safety Vest", price: "$120 TTD", image: "/images/protective_equipment.png", category: "Safety" },
      { id: 3, name: "Heavy Duty Shackle", price: "Inquire", image: "/images/RIG.jpg", category: "Hardware" },
      { id: 4, name: "Marine Grade Lubricant", price: "$45 TTD", image: "/images/3 WD-40 Cans Banner.png", category: "Maintenance" },
    ]
  },
  welding: {
    banner: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800",
    title: "Welding & Fabrication",
    subtitle: "Precision Joining Solutions",
    description: "Top-tier welding machines, electrodes, and safety gear for industrial fabrication and structural repairs. We ensure you have the power and precision needed for every weld.",
    products: [
      { id: 1, name: "Heavy Duty Welding Machine", price: "Inquire", image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800", category: "Equipment" },
      { id: 2, name: "Welding Electrodes (50lb)", price: "$180 TTD", image: "/images/protective_equipment.png", category: "Consumables" },
      { id: 3, name: "Auto-Darkening Helmet", price: "$650 TTD", image: "/images/protective_equipment.png", category: "Safety" },
      { id: 4, name: "Angle Grinder Kit", price: "$850 TTD", image: "/images/Dewalt Kit.jpg", category: "Tools" },
    ]
  }
};

export default function CategoryPage() {
  const params = useParams();
  const category = typeof params?.category === 'string' ? params.category : Array.isArray(params?.category) ? params.category[0] : '';
  const data = categoryData[category.toLowerCase()];

  if (!data) {
    return (
      <div className="min-h-screen bg-white font-sans text-zinc-900 flex flex-col">
         {/* Navigation (Simplified for 404) */}
         <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
            <nav className="mx-auto max-w-7xl border-t-2 border-red-600 bg-white shadow-sm flex items-center justify-between p-4">
                <a href="/" className="text-red-600 font-bold">AMCOL</a>
            </nav>
         </header>
         <div className="flex-1 flex flex-col items-center justify-center pt-24">
            <h1 className="text-4xl font-bold text-zinc-900">Category Not Found</h1>
            <p className="mt-4 text-zinc-600">The requested product category does not exist.</p>
            <a href="/products" className="mt-6 rounded-md bg-red-600 px-6 py-3 text-white hover:bg-red-700 transition-colors">Return to Products</a>
         </div>
      </div>
    );
  }

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
            style={{ backgroundImage: `url('${data.banner}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1B]/80 via-[#1A1A1B]/60 to-[#1A1A1B]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            {data.title}
          </h1>
          <p className="mt-4 text-xl text-red-500 font-semibold">
            {data.subtitle}
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
            {data.description}
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="bg-zinc-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl mb-10 text-center">
            Available Products
          </h2>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {data.products.map((product) => (
              <div key={product.id} className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md border border-zinc-200">
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
                      <a href="#">
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">{product.category}</p>
                  </div>
                  <p className="mt-2 text-sm font-medium text-red-600">{product.price}</p>
                </div>
              </div>
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