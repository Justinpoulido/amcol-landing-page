import Image from "next/image";
import Link from "next/link";
import { getCategoryBySlug, getProductBySlug } from "@/lib/catalog-store";

const navLinks = [
  { name: "HOME", href: "https://www.amcolhardwarett.com/index.php" },
  { name: "PRODUCTS", href: "/products" },
  { name: "CONSTRUCTION", href: "https://www.amcolhardwarett.com/construction.php" },
  { name: "INDUSTRIAL", href: "/" },
  { name: "DEPARTMENTS", href: "/departments" },
  { name: "CONTACT US", href: "/contact" },
  { name: "ADMIN LOGIN", href: "/admin" },
];

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const slug = category.toLowerCase();
  const data = await getCategoryBySlug(slug);
  const product = data ? null : await getProductBySlug(slug);

  if (product) {
    const specifications = [
      ...(product.specifications ?? []),
      product.brand ? `Brand: ${product.brand}` : null,
      product.sku ? `SKU: ${product.sku}` : null,
      product.unit ? `Unit: ${product.unit}` : null,
      product.stockStatus ? `Availability: ${product.stockStatus}` : null,
    ].filter((item): item is string => Boolean(item));

    const useCases =
      product.useCases && product.useCases.length > 0
        ? product.useCases
        : [
            `Industrial ${product.category.toLowerCase()} applications`,
            "Maintenance, facility operations, and procurement support",
            `Related ${product.categoryName} workflows`,
          ];

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

        <main className="bg-[linear-gradient(180deg,#f8fbff_0%,#eef5fb_48%,#ffffff_100%)]">
          <section className="border-t border-slate-200 px-6 py-16 sm:px-8 sm:py-24 lg:px-10">
            <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
              <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.55)] sm:p-6">
                <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.20),transparent_68%)] opacity-90" />
                <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-[1.4rem] border border-slate-100 bg-[linear-gradient(180deg,#f8fbfd_0%,#eef6fb_100%)] sm:min-h-[460px]">
                  <Image
                    src={product.image}
                    alt={product.imageAlt || product.name}
                    fill
                    priority
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-contain p-6"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/products/${product.categorySlug}`}
                    className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-800 transition hover:border-cyan-300 hover:bg-cyan-100"
                  >
                    {product.categoryName}
                  </Link>
                  <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    {product.category}
                  </span>
                </div>

                <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  {product.name}
                </h1>

                <p className="mt-5 text-2xl font-semibold text-red-600">
                  {product.price}
                </p>

                <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
                  {product.description ||
                    "Contact our sales team for full specifications, compatible use cases, and ordering support."}
                </p>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <section className="rounded-[1.4rem] border border-slate-200 bg-white p-6">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-900">
                      Specifications
                    </h2>
                    {specifications.length > 0 ? (
                      <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
                        {specifications.map((specification) => (
                          <li key={specification}>{specification}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-5 text-sm leading-6 text-slate-600">
                        Detailed specifications are available through our sales team.
                      </p>
                    )}
                  </section>

                  <section className="rounded-[1.4rem] border border-slate-200 bg-white p-6">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-900">
                      Compatible Use Cases
                    </h2>
                    <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
                      {useCases.map((useCase) => (
                        <li key={useCase}>{useCase}</li>
                      ))}
                    </ul>
                  </section>
                </div>

                <div className="mt-8 rounded-[1.4rem] border border-cyan-200 bg-cyan-50 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-900">
                    Contact Sales / Order Support
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    Need pricing confirmation, bulk quantities, or compatibility guidance? AMCOL can help confirm fit and availability before you order.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-5 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-slate-800"
                  >
                    Contact sales
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (!data) {
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
              </div>
            </div>
          </div>
        </header>

        <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
          <p className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-700">
            Product Not Found
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            We couldn&apos;t find that product.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            The link may be outdated, or the product may have moved. You can head back to the main products page and continue browsing from there.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex items-center rounded-full border border-slate-300 bg-slate-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-slate-800"
          >
            Return to Products
          </Link>
        </main>
      </div>
    );
  }

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

      <section className="relative overflow-hidden bg-[#091624] px-6 py-20 sm:px-8 sm:py-24 lg:px-10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url('${data.banner}')` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(6,17,30,0.96)_0%,rgba(8,24,41,0.84)_55%,rgba(21,91,120,0.52)_100%)]" />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100">
              Category Spotlight
            </p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {data.title}
            </h1>
            <p className="mt-4 text-lg font-medium text-cyan-200 sm:text-xl">
              {data.subtitle}
            </p>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
              {data.description}
            </p>
          </div>

          <div className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-100/80">
              Product Focus
            </p>
            <p className="mt-4 text-2xl font-semibold text-white">
              {data.products.length} featured items in this category
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-200/85">
              Browse a tailored selection built around this category so visitors land on relevant items instead of a generic product listing.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.16em] text-cyan-100 transition hover:text-white"
            >
              View all categories
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#eef5fb_52%,#ffffff_100%)] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-800">
              Available Products
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Related items in {data.name}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Each category includes the seeded product lineup plus any additional items uploaded through the admin dashboard.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {data.products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug || product.id}`}
                className="group relative flex min-h-[390px] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-[0_24px_50px_-26px_rgba(8,47,73,0.35)] sm:p-6"
              >
                <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.20),transparent_68%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex h-72 w-full items-center justify-center overflow-hidden rounded-[1.4rem] border border-slate-100 bg-[linear-gradient(180deg,#f8fbfd_0%,#eef6fb_100%)] sm:h-80">
                  <Image
                    src={product.image}
                    alt={product.imageAlt || product.name}
                    fill
                    sizes="(min-width: 1280px) 24vw, (min-width: 640px) 50vw, 100vw"
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.05]"
                  />
                </div>

                <div className="relative flex flex-1 flex-col pt-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-700">
                      {product.category}
                    </span>
                    {product.featured ? (
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-700">
                        Featured
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-3 text-xl font-semibold leading-7 text-slate-900">
                    {product.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {product.description ||
                      "Contact our sales team for full specifications, compatible use cases, and ordering support."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
                    <span className="font-semibold uppercase tracking-[0.16em] text-slate-800">
                      {product.price}
                    </span>
                    {product.brand ? <span>Brand: {product.brand}</span> : null}
                    {product.sku ? <span>SKU: {product.sku}</span> : null}
                    {product.unit ? <span>Unit: {product.unit}</span> : null}
                  </div>

                  <p className="mt-auto pt-6 text-sm font-semibold text-slate-600">
                    {product.stockStatus || "Call for availability"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
