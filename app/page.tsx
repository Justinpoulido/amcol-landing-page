"use client";

import { useState, useEffect } from "react";

const heroImages = [
  "/images/Heritage Industry.jpg",
  "/images/TGU.jpg",
];

const navLinks = [
  { name: "HOME", href: "/" },
  { name: "PRODUCTS", href: "/products" },
  { name: "CONSTRUCTION", href: "/construction" },
  { name: "DEPARTMENTS", href: "/departments" },
  { name: "CONTACT US", href: "/contact" },
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBannerVisible, setIsBannerVisible] = useState(true);

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

  const features = [
    {
      title: "Lightning Fast",
      description:
        "Built for speed. Get results in milliseconds, not minutes.",
      icon: (
        <svg
          className="size-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      title: "Simple by Design",
      description:
        "No clutter, no complexity. Everything you need, nothing you don't.",
      icon: (
        <svg
          className="size-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
          />
        </svg>
      ),
    },
    {
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security with 99.9% uptime. Your data, protected.",
      icon: (
        <svg
          className="size-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
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
            ${link.name === "HOME" ? "text-red-600" : "text-zinc-700 hover:text-red-600"}`}
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
              className="h-12 w-auto"
            />
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-transparent pt-32 pb-24 sm:pt-40 sm:pb-32 lg:pt-48 lg:pb-40">
        {isBannerVisible && (
          <div
            id="sticky-banner"
            tabIndex={-1}
            className="fixed top-0 start-0 z-50 flex justify-between w-full p-4 border-b border-zinc-200 bg-zinc-50"
          >
            <div className="flex items-center mx-auto">
              <p className="flex items-center text-sm font-normal text-zinc-500">
                <span className="inline-flex items-center justify-center w-6 h-6 shrink-0 me-2.5 bg-zinc-200 rounded-full">
                  <svg
                    className="w-3.5 h-3.5 text-zinc-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 9H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h6m0-6v6m0-6 5.419-3.87A1 1 0 0 1 18 5.942v12.114a1 1 0 0 1-1.581.814L11 15m7 0a3 3 0 0 0 0-6M6 15h3v5H6v-5Z"
                    />
                  </svg>
                  <span className="sr-only">Bullhorn</span>
                </span>
                <span>
                  New brand identity has been launched for the{" "}
                  <a
                    href="https://flowbite.com"
                    className="inline font-medium text-blue-600 underline hover:no-underline"
                  >
                    Flowbite Library
                  </a>
                </span>
              </p>
            </div>
            <div className="flex items-center">
              <button
                data-dismiss-target="#sticky-banner"
                type="button"
                className="shrink-0 inline-flex justify-center text-sm w-7 h-7 items-center text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 rounded-sm"
                onClick={() => setIsBannerVisible(false)}
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18 17.94 6M18 18 6.06 6"
                  />
                </svg>
                <span className="sr-only">Close banner</span>
              </button>
            </div>
          </div>
        )}
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

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <div className="relative flex items-center w-full max-w-md leading-[28px]">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="absolute left-4 h-4 w-4 fill-[#bdbecb] pointer-events-none z-10"
                >
                  <g>
                    <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
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
            <p className="mt-4 text-sm text-zinc-500">
              
            </p>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      {/* Category Cards */}
<section className="border-t border-zinc-200 py-16 sm:py-24">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    {/* Grid container: 1 col on mobile, 2 on tablet, 4 on desktop */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      
      {/* Energy Card */}
      <div className="group relative min-h-[320px] overflow-hidden rounded-2xl sm:min-h-[380px]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: "url('/images/solar_panel.png')" }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative flex h-full flex-col items-center justify-center p-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-center">
            Energy
          </h2>
          <a
            href="#"
            className="mt-6 rounded-lg bg-white px-8 py-3 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
          >
            Shop Now
          </a>
        </div>
      </div>

      {/* Industrial Welding Card */}
      <div className="group relative min-h-[320px] overflow-hidden rounded-2xl sm:min-h-[380px]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800')",
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative flex h-full flex-col items-center justify-center p-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-center">
           Welding
          </h2>
          <a
            href="#"
            className="mt-6 rounded-lg bg-white px-8 py-3 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
          >
            Shop Now
          </a>
        </div>
      </div>

      {/* Safety Card */}
      <div className="group relative min-h-[320px] overflow-hidden rounded-2xl sm:min-h-[380px]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: "url('/images/protective_equipment.png')" }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative flex h-full flex-col items-center justify-center p-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-center">
            Safety
          </h2>
          <a
            href="#"
            className="mt-6 rounded-lg bg-white px-8 py-3 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
          >
            Shop Now
          </a>
        </div>
      </div>

      {/*Marine/Hardware Card (Adding a 4th for balance) */}
      <div className="group relative min-h-[320px] overflow-hidden rounded-2xl sm:min-h-[380px]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundImage: "url('/images/RIG.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative flex h-full flex-col items-center justify-center p-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-center">
            Marine
          </h2>
          <a
            href="#"
            className="mt-6 rounded-lg bg-white px-8 py-3 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
          >
            Shop Now
          </a>
        </div>
      </div>

    </div>
  </div>
</section>
      {/* Features Grid */}
      <section
        id="features"
        className="border-t border-zinc-200 bg-zinc-50/50 py-24 sm:py-32"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Industries We Serve
            
            </h2>
            <p className="mt-4 text-lg text-zinc-600">
            We carry some of the top industrial brands across a number of sectors. Click the relevant option below to see more details on our brands and how they can work for you!
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-lg font-semibold text-zinc-900">
                  {feature.title}
                </h3>
                <p className="mt-3 text-zinc-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-zinc-900 px-8 py-16 text-center sm:px-16 sm:py-24">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-400">
              Join thousands of teams already using AMCOL. Start your free trial
              today.
            </p>
            <a
              href="#"
              className="mt-8 inline-block rounded-full bg-white px-8 py-4 text-base font-medium text-zinc-900 transition-all hover:bg-zinc-100"
            >
              Get started for free
            </a>
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
