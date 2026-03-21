"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const heroImages = [
  "/images/Heritage Industry.jpg",
  "/images/TGU.jpg",
];

const navLinks = [
  { name: "HOME", href: "https://www.amcolhardwarett.com/index.php" },
  { name: "PRODUCTS", href: "/products" },
  { name: "CONSTRUCTION", href: "https://www.amcolhardwarett.com/construction.php" },
  { name: "INDUSTRIAL", href: "/industrial" },
  { name: "DEPARTMENTS", href: "/departments" },
  { name: "CONTACT US", href: "/contact" },
];

const categoryRows = [
  [
    { name: "Cleaners & Degreasers", href: "/products", image: "/images/wd40 degreaser.png" },
    { name: "Surface Disinfectants & Deodorizers", href: "/products", image: "/images/Surface Cleaner.png" },
    { name: "Sprayers & Pumps", href: "/products", image: "/images/Gasoline Sprayer.png" },
    { name: "Adhesives, Sealants & Tape", href: "/products", image: "/images/Silicon Sealer.png" },
  ],
  [
    { name: "Fire Protection", href: "/products", image: "/images/Fire extinguisher.png" },
    { name: "Safety", href: "/products/safety", image: "/images/protective_equipment.png" },
    { name: "Locks & Security", href: "/products", image: "/images/Fence Lock.jpg" },
    { name: "Lubricants", href: "/products", image: "/images/3 WD-40 Cans Banner.png" },
    { name: "Abrasives", href: "/products", image: "/images/Abrasives1.png" },
    { name: "Welding", href: "/products/welding", image: "/images/Welding_industrial.png" },
  ],
  [
    { name: "HVAC Chemicals", href: "/products", image: "/images/HVAC.png" },
    { name: "Coatings & Sealers", href: "/products", image: "/images/Jotun sealer.png" },
    { name: "Corrosion Control", href: "/products", image: "/images/Wd40 bottle.png" },
    { name: "Ladders", href: "/products", image: "/images/Ladder 6ft.png" },
  ],
  [
    { name: "Spill Containment & Emergency Response", href: "/products", image: "/images/Crate.png" },
    { name: "Marine", href: "/products/marine", image: "/images/Cargo ship.png" },
    { name: "Medical", href: "/products", image: "/images/medical respirator.png" },
    { name: "Commodity Chemicals", href: "/products", image: "/images/TGU.jpg" },
    { name: "Matting", href: "/products", image: "/images/Dewalt Kit.jpg" },
  ],
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="hero-mainnav relative z-40">
        <div className="flex w-full flex-col overflow-hidden md:flex-row md:items-stretch">
          <div className="hero-brand-panel flex items-center justify-center px-6 py-5 sm:px-8 md:w-[35%] md:min-w-[340px] md:justify-start">
            <Link className="relative z-10 shrink-0" href="/">
              <Image
                src="/images/AMCOL_Logo.png"
                alt="AMCOL Logo"
                width={420}
                height={104}
                priority
                className="hero-brand-logo h-20 w-auto max-w-[420px] sm:h-24 md:h-[6.3rem]"
              />
            </Link>
          </div>

          <div className="hero-links-panel flex flex-1 items-center justify-center px-4 py-4 sm:px-6 lg:px-10">
            <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 text-[11px] font-bold uppercase tracking-[0.2em] sm:gap-x-4">
              {navLinks.map((link) => {
                const isActive = link.name === "INDUSTRIAL";

                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`hero-nav-link rounded-sm border px-4 py-3 ${isActive ? "border-[#39d9cd]/70 bg-[#0d2238] text-[#39d9cd]" : "border-slate-200 bg-white text-slate-700 hover:border-[#39d9cd]/45 hover:text-[#0d2238]"}`}
                  >
                    {link.name}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] items-center overflow-hidden bg-transparent pt-24 pb-24 sm:pt-28 sm:pb-32 lg:pt-36 lg:pb-40">
        {/* Background Slideshow */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url('${image}')` }}
            />
          ))}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Carousel Controls */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/50 p-3 text-zinc-900 backdrop-blur-sm transition-colors hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-zinc-500 hidden sm:block"
          aria-label="Previous slide"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/50 p-3 text-zinc-900 backdrop-blur-sm transition-colors hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-zinc-500 hidden sm:block"
          aria-label="Next slide"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? "w-8 bg-zinc-900" : "w-2.5 bg-zinc-400 hover:bg-zinc-600"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="relative flex items-center w-full max-w-md leading-[28px]">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="absolute left-4 h-4 w-4 fill-[#bdbecb] pointer-events-none z-10"
              >
                <g>
                  <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-3.365-7.5-7.5z"></path>
                </g>
              </svg>
              <input
                id="query"
                className="w-full h-[45px] pl-10 text-[#bdbecb] bg-[#16171d] border-0 rounded-[12px] shadow-[0_0_0_1.5px_#2b2c37,0_0_25px_-17px_#000] outline-none transition-all duration-250 ease-[cubic-bezier(0.19,1,0.22,1)] cursor-text z-0 placeholder:text-[#bdbecb] hover:shadow-[0_0_0_2.5px_#2f303d,0px_0px_25px_-15px_#000] focus:shadow-[0_0_0_2.5px_#2f303d] active:scale-95 font-['Montserrat',sans-serif]"
                type="search"
                placeholder="Search..."
                name="searchbar"
              />
            </div>
          </div>
        </div>
      </div>

      <section className="border-t border-zinc-200 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-700">
              Industrial Categories
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black sm:text-4xl">
              Shop by product category
            </h2>
            <p className="mt-4 text-base text-zinc-600 sm:text-lg">
              Browse core industrial supply lines with a clean catalog view built for quick scanning.
            </p>
          </div>

          <div className="mt-14 space-y-12 sm:space-y-14 xl:space-y-16">
            {categoryRows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className={`grid gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3 md:gap-x-10 md:gap-y-14 lg:gap-x-12 xl:gap-y-16 ${
                  row.length === 4
                    ? "xl:grid-cols-4"
                    : row.length === 5
                      ? "xl:grid-cols-5"
                      : "xl:grid-cols-6"
                }`}
              >
                {row.map((tile) => (
                  <Link
                    key={tile.name}
                    href={tile.href}
                    className="group flex min-h-[220px] flex-col items-center justify-start text-center"
                  >
                    <div className="flex h-40 w-full items-center justify-center sm:h-44">
                      <Image
                        src={tile.image}
                        alt={tile.name}
                        width={220}
                        height={180}
                        className="h-auto max-h-36 w-auto max-w-[180px] object-contain transition-transform duration-300 group-hover:scale-105 sm:max-h-40 sm:max-w-[190px]"
                      />
                    </div>
                    <span className="mt-5 max-w-[190px] text-sm font-semibold leading-6 text-blue-700 transition-colors group-hover:text-blue-900 group-hover:underline sm:text-[15px]">
                      {tile.name}
                    </span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Features Grid */}
      <section
        id="features"
        className="border-t border-zinc-200 bg-zinc-50/50 py-24 sm:py-32"
      >
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Industries We Serve
            
            </h2>
            <p className="mt-4 text-lg text-zinc-600">
            We carry some of the top industrial brands across a number of sectors. Click the relevant option below to see more details on our brands and how they can work for you!
            </p>
          </div>
            <div className="mt-12 w-full overflow-hidden">
              <style>{`
                @keyframes scroll {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                  animation: scroll 20s linear infinite;
                }
              `}</style>
              <div className="flex w-[200%] animate-scroll">
                {[0, 1].map((i) => (
                  <div key={i} className="flex w-1/2 justify-around">
                    {["WD-40","Simple Green","Red Devil", "DEWALT"].map((brand) => (
                      <div key={brand} className="flex items-center justify-center rounded-lg bg-zinc-100 px-10 py-6">
                        <span className="text-xl font-bold text-zinc-400">{brand}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-12 w-full overflow-hidden">
              <div className="flex w-[200%] animate-scroll">
                {[0, 1].map((i) => (
                  <div key={i} className="flex w-1/2 items-center">
                    <div className="flex-1 px-4">
                      <img
                        src="/images/3 WD-40 Cans Banner.png"
                        alt="WD-40 Banner"
                        className="w-full h-64 object-cover rounded-2xl"
                      />
                    </div>
                    <div className="flex-1 px-4">
                      <img
                        src="/images/Simple Green Safer Choice Banner.png"
                        alt="Simple Green Safer Choice Banner"
                        className="w-full h-64 object-cover rounded-2xl"
                      />
                    </div>
                    <div className="flex-1 px-4">
                      <img
                        src="/images/Reddevel-poster.png"
                        alt="Silicone Tube with Red Devil Background"
                        className="w-full h-64 object-cover rounded-2xl"
                      />
                    </div>
                    <div className="flex-1 px-4">
                      <img
                        src="/images/Dewalt Kit.jpg"
                        alt="Dewalt Kit"
                        className="w-full h-64 object-cover rounded-2xl"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-zinc-900 px-8 py-24 text-center sm:px-16 sm:py-32">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/Proman.png')" }}
            />
            <div className="absolute inset-0 bg-zinc-900/65" />

            <div className="relative z-10">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              News & Events
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
              A collection of articles on various industrial sectors, business tips and the latest happenings from in and around Americas Marketing Company. Stay informed with our latest updates and industry insights designed to help your business grow.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/News&Articles"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Read Latest News
              </a>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-12">
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
