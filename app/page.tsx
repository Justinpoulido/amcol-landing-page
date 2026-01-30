export default function Home() {
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
      <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 lg:pt-48 lg:pb-40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
                Start free trial
              </a>
              <a
                href="#features"
                className="w-full rounded-full border border-zinc-300 px-8 py-4 text-center text-base font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-50 sm:w-auto"
              >
                See how it works
              </a>
            </div>
            <p className="mt-4 text-sm text-zinc-500">
              No credit card required · 14-day free trial
            </p>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="border-t border-zinc-200 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl flex flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:gap-8 lg:px-8">
          {/* Energy Card */}
          <div className="group relative mb-6 min-h-[320px] overflow-hidden rounded-2xl sm:min-h-[380px] lg:mb-0 lg:flex-1">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: "url('/images/solar_panel.png')" }}
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative flex h-full min-h-[320px] flex-col items-center justify-center p-8 sm:min-h-[380px]">
              <button
                type="button"
                className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-md transition-colors hover:bg-white"
                aria-label="Previous"
              >
                <svg
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
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

          {/* Safety Card */}
          <div className="group relative min-h-[320px] overflow-hidden rounded-2xl sm:min-h-[380px] lg:flex-1">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800')",
              }}
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative flex h-full min-h-[320px] flex-col items-center justify-center p-8 sm:min-h-[380px]">
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Safety
              </h2>
              <a
                href="#"
                className="mt-6 rounded-lg bg-white px-8 py-3 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
              >
                Shop Now
              </a>
              <button
                type="button"
                className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-md transition-colors hover:bg-white"
                aria-label="Next"
              >
                <svg
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
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
