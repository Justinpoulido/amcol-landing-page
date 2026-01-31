"use client";

import { useState, useEffect } from "react";

const heroImages = [
  "/images/industrial_energy.png",
  "/images/TGU.jpg",
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
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#" className="text-xl font-semibold tracking-tight text-zinc-900">
            AMCOL
          </a>
          <div className="flex items-center gap-6">
            <a
              href="#features"
              className="hidden text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 sm:block"
            >
              Features
            </a>
            <a
              href="#"
              className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              Get Started
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 lg:pt-48 lg:pb-40 overflow-hidden">
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
        <div className="absolute inset-0 -z-10">
          {heroImages.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url('${image}')` }}
            />
          ))}
          <div className="absolute inset-0 bg-white/80" />
        </div>

        {/* Carousel Controls */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/50 p-3 text-zinc-900 backdrop-blur-sm transition-colors hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-zinc-500 hidden sm:block"
          aria-label="Previous slide"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/50 p-3 text-zinc-900 backdrop-blur-sm transition-colors hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-zinc-500 hidden sm:block"
          aria-label="Next slide"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-3">
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

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
              Do more with{" "}
              <span className="text-zinc-600">less effort</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-600 sm:text-xl">
              The simplest way to streamline your workflow. Join thousands of
              teams who ship faster.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#"
                className="w-full rounded-full bg-zinc-900 px-8 py-4 text-center text-base font-medium text-white transition-all hover:bg-zinc-800 hover:shadow-lg sm:w-auto"
              >
                Start Now
              </a>
              <a
                href="#features"
                className="w-full rounded-full border border-zinc-300 px-8 py-4 text-center text-base font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-50 sm:w-auto"
              >
                See how it works
              </a>
            </div>
            <p className="mt-4 text-sm text-zinc-500">
              No credit card required ·
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
            Industrial Welding
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

      {/* Tools/Hardware Card (Adding a 4th for balance) */}
      <div className="group relative min-h-[320px] overflow-hidden rounded-2xl sm:min-h-[380px]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1581244276891-83393a6b324d?auto=format&fit=crop&w=800')",
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative flex h-full flex-col items-center justify-center p-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-center">
            Power Tools
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
              Everything you need
            </h2>
            <p className="mt-4 text-lg text-zinc-600">
              Built for modern teams who value simplicity and performance.
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
