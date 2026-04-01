import Image from "next/image";
import Link from "next/link";
import { getAllProducts, getFeaturedCategories } from "@/lib/catalog-store";

const navLinks = [
  { name: "HOME", href: "https://www.amcolhardwarett.com/index.php" },
  { name: "PRODUCTS", href: "/products" },
  { name: "CONSTRUCTION", href: "https://www.amcolhardwarett.com/construction.php" },
  { name: "INDUSTRIAL", href: "/" },
  { name: "DEPARTMENTS", href: "/departments" },
  { name: "CONTACT US", href: "/contact" },
  { name: "ADMIN LOGIN", href: "/admin" },
];

export default async function ProductsPage() {
  const [products, featuredProductCategories] = await Promise.all([
    getAllProducts(),
    Promise.resolve(getFeaturedCategories()),
  ]);

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900">
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
                  const isAdminLink = link.name === "ADMIN LOGIN";

                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      className={`hero-nav-link rounded-sm border px-4 py-3 ${
                        isAdminLink
                          ? "border-red-500 bg-red-600 text-white hover:border-red-600 hover:bg-red-700"
                          : isActive
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

      <section className="relative overflow-hidden bg-[#1A1A1B] pt-32 pb-24 sm:pt-40 sm:pb-32">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-50 grayscale mix-blend-overlay"
            style={{ backgroundImage: "url('/images/Heritage Industry.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1B]/80 via-[#1A1A1B]/60 to-[#1A1A1B]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            World-Class <span className="text-red-600">Products</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg leading-8 text-gray-300">
            Explore our comprehensive catalog of industrial, construction, and marine supplies designed for performance and durability.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/admin"
              className="inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Open product admin
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Industries We Serve
          </h2>
          <p className="mt-6 mx-auto max-w-3xl text-lg leading-8 text-zinc-600">
            At AMCOL, we pride ourselves on being the backbone of major industries. From heavy construction and industrial manufacturing to marine logistics and energy production, our diverse product range ensures that you have the right tools and materials for every job.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProductCategories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative flex h-64 flex-col overflow-hidden rounded-2xl transition-all hover:shadow-lg"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${category.image}')` }}
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative flex flex-1 items-center justify-center">
                  <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-700">
                Product Catalog
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Browse all products
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              Showing {products.length} items across the AMCOL catalog.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="group relative flex min-h-[420px] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-[0_24px_50px_-26px_rgba(8,47,73,0.35)] sm:p-6"
              >
                <div className="relative flex h-56 w-full items-center justify-center overflow-hidden rounded-[1.4rem] border border-slate-100 bg-[linear-gradient(180deg,#f8fbfd_0%,#eef6fb_100%)] px-4">
                  <Image
                    src={product.image}
                    alt={product.imageAlt || product.name}
                    fill
                    sizes="(min-width: 1280px) 24vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                  />
                </div>

                <div className="relative flex flex-1 flex-col pt-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/products/${product.categorySlug}`}
                      className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-800 transition hover:border-cyan-300 hover:bg-cyan-100"
                    >
                      {product.category}
                    </Link>
                    {product.featured ? (
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700">
                        Featured
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-3 text-xl font-semibold leading-7 text-slate-900">
                    {product.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {product.description ||
                      "Product details are available through our sales team for this category."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
                    <span className="font-semibold text-red-600">{product.price}</span>
                    {product.brand ? <span>Brand: {product.brand}</span> : null}
                    {product.sku ? <span>SKU: {product.sku}</span> : null}
                    {product.unit ? <span>Unit: {product.unit}</span> : null}
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-6">
                    <span className="text-sm font-medium text-slate-500">
                      {product.stockStatus || "Call for availability"}
                    </span>
                    <Link
                      href={`/products/${product.categorySlug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-cyan-800"
                    >
                      View category
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-200 bg-white py-12">
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
