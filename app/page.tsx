"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { landingCategoryRows } from "@/lib/product-categories";

const heroImages = [
  "/images/Heritage Industry.jpg",
  "/images/TGU.jpg",
  "/images/Proman_industrial.png",
  "/images/Port Authority.png",
];

const navLinks = [
  { name: "HOME", href: "https://www.amcolhardwarett.com/index.php" },
  { name: "PRODUCTS", href: "/products" },
  { name: "CONSTRUCTION", href: "https://www.amcolhardwarett.com/construction.php" },
  { name: "INDUSTRIAL", href: "/industrial" },
  { name: "DEPARTMENTS", href: "/departments" },
  { name: "CONTACT US", href: "/contact" },
];

const tickerItems = [
  "Location: #22 Ramjohn Trace, Penal",
  "Opening Hours: 7am - 5pm",
  "Industrial, marine, safety, and maintenance supplies available",
  "Bulk orders and business inquiries welcome",
  "Call ahead for product availability and category support",
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
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] items-center overflow-hidden bg-transparent pt-24 pb-24 sm:pt-28 sm:pb-32 lg:pt-36 lg:pb-40">
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

      <div className="relative left-1/2 z-10 mt-2 w-screen -translate-x-1/2 px-0 sm:mt-4">
        <div className="overflow-hidden border-y border-red-200/70 bg-[linear-gradient(135deg,rgba(127,29,29,0.92)_0%,rgba(185,28,28,0.76)_45%,rgba(239,68,68,0.5)_100%)] p-[1px_0] shadow-[0_22px_50px_-28px_rgba(127,29,29,0.6)]">
          <div className="relative overflow-hidden border-y border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.06))] px-4 py-4 backdrop-blur-2xl sm:px-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.28),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(254,202,202,0.18),transparent_28%)]" />
            <div className="pointer-events-none absolute inset-y-3 left-8 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className="relative mx-auto flex max-w-[1800px] items-center gap-4 px-4 sm:px-6 lg:px-8">
              <div className="hidden shrink-0 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-red-50 sm:inline-flex">
                Store Updates
              </div>
              <div className="relative overflow-hidden">
                <style>{`
                  @keyframes liquidGlassTicker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                  }
                  .liquid-glass-ticker {
                    animation: liquidGlassTicker 26s linear infinite;
                  }
                `}</style>
                <div className="liquid-glass-ticker flex w-max min-w-full items-center">
                  {[0, 1].map((loop) => (
                    <div key={loop} className="flex shrink-0 items-center gap-3 pr-3">
                      {tickerItems.map((item) => (
                        <div
                          key={`${loop}-${item}`}
                          className="inline-flex items-center gap-3 rounded-full border border-white/16 bg-white/12 px-4 py-2 text-sm font-medium text-red-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
                        >
                          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-200 shadow-[0_0_16px_rgba(254,202,202,0.85)]" />
                          <span className="whitespace-nowrap">{item}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
            {landingCategoryRows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className={`grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:gap-6 xl:gap-7 ${
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
                      <span className="mt-3 text-base font-semibold leading-6 text-slate-900 transition-colors duration-300 group-hover:text-cyan-900 sm:text-[17px]">
                        {tile.name}
                      </span>
                      <span className="mt-auto inline-flex items-center gap-3 pt-6 text-sm font-medium text-slate-600 transition-colors duration-300 group-hover:text-slate-900">
                        Browse products
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-base text-slate-700 transition-all duration-300 group-hover:border-cyan-300 group-hover:bg-cyan-50 group-hover:text-cyan-800">
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
