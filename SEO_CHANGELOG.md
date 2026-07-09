# SEO Changelog

## Baseline

Baseline issues came from the attached SEO audit and user brief: weak backlinks, missing schema, weak GEO, no `llms.txt`, thin homepage content, missing image alt text, long meta description, no analytics, missing local business/address signals, no DMARC, missing social links, inline styles, and weak keyword distribution.

The PDF was copied temporarily to `tmp/seo-audit/report-for-amcol-industrial.pdf` for review, but this environment did not have a working Python/PDF extraction runtime. The implementation uses the audit issues listed in the request plus codebase inspection.

## Completed Fixes

- Added and verified `/sitemap.xml`.
- Added and verified `/robots.txt`.
- Added unique page metadata, canonical URLs, Open Graph metadata, and Twitter card metadata.
- Removed the broken `/departments` navigation link.
- Renamed `/News&Articles` to `/news` and preserved the old URL with a permanent redirect.
- Improved seeded product content depth with summaries, descriptions, specifications, use cases, alt text, stock status, and cleaner category products.
- Added business identity source data in `lib/business-info.ts`.
- Added JSON-LD infrastructure for Organization, LocalBusiness, WebSite/SearchAction, BreadcrumbList, and Product schema.
- Added global Organization, LocalBusiness, and WebSite JSON-LD rendering.
- Added Product and Breadcrumb JSON-LD rendering for product/category routes.
- Added optional analytics/tracking scripts gated by env vars.
- Added local NAP signals and social/GBP placeholders in the footer.
- Added conditional Google Business Profile link support on the contact page.
- Added `/llms.txt` for AI-search readability.
- Added README documentation for tracking env vars, social/GBP placeholders, DMARC, and backlink outreach.
- Shortened the global homepage meta description.
- Improved homepage hero, category, industries, products, and news copy with natural Trinidad & Tobago industrial supply terms.
- Added `/news/[slug]` article detail pages to fix broken article links.
- Added news article URLs to the sitemap.
- Replaced meaningful news/project CSS background images with `next/image` and descriptive alt text.
- Removed category-template wording that referenced seeded products and the admin dashboard.
- Moved homepage marquee keyframes out of inline `<style>` blocks and into `app/globals.css`.
- Replaced homepage news card and product category content background images with `next/image` and descriptive alt text.
- Added `<main>` landmarks to homepage, products, news, and contact pages.
- Added `/knowledge` Industrial Knowledge Center with search.
- Added 13 SEO category pages for Safety, Marine, Lubricants, Bearings, Pumps, Valves, Welding, Electrical, PPE, Construction, Fire Protection, Industrial Chemicals, and Material Handling.
- Added 13 search-intent article pages with reading time, last updated date, Request a Quote CTA, related product category links, and related articles.
- Added Article, FAQPage, and BreadcrumbList JSON-LD support for knowledge articles.
- Added Knowledge Center entries to `/sitemap.xml`, header navigation, footer navigation, and `/llms.txt`.
- Improved internal link health by keeping header HOME and CONSTRUCTION links on `amcolindustrial.com`.
- Replaced placeholder `href="#"` contact links with verified phone links.
- Replaced possible dead pipe/fittings homepage card URLs with valid product search URLs.
- Linked homepage news cards to individual article URLs instead of only the news index.
- Added stronger footer links to Products, Knowledge, News, and Contact.
- Added product-catalog links into the Knowledge Center and PPE buying guide.

## Files Changed In Current SEO Orchestration Pass

- `app/components/JsonLd.tsx`
- `app/components/SiteFooter.tsx`
- `app/components/TrackingScripts.tsx`
- `app/contact/page.tsx`
- `app/layout.tsx`
- `app/products/[category]/page.tsx`
- `lib/business-info.ts`
- `lib/structured-data.ts`
- `public/llms.txt`
- `README.md`
- `SEO_CHANGELOG.md`
- `app/news/[slug]/page.tsx`
- `app/news/page.tsx`
- `app/page.tsx`
- `app/products/page.tsx`
- `app/sitemap.ts`
- `app/contact/page.tsx`
- `app/globals.css`
- `app/knowledge/page.tsx`
- `app/knowledge/[category]/page.tsx`
- `app/knowledge/[category]/[slug]/page.tsx`
- `app/components/SiteHeader.tsx`
- `app/components/SiteFooter.tsx`
- `lib/knowledge-base.ts`
- `lib/structured-data.ts`
- `public/llms.txt`
- `app/components/SiteHeader.tsx`
- `app/contact/page.tsx`
- `app/page.tsx`
- `app/products/page.tsx`

## Remaining Manual Tasks

- Run `npm run build` and `npm run lint` in an environment where Node/npm are available. PowerShell in this agent session could not find `node` or `npm`.
- Add verified social profile URLs to Vercel env vars.
- Add verified Google Business Profile URL to `NEXT_PUBLIC_GBP_URL`.
- Create/verify GA4, GTM, and Meta Pixel IDs before enabling tracking.
- Configure SPF, DKIM, and DMARC with the mail/DNS provider.
- Build backlinks through legitimate supplier, customer, local directory, and industry publication relationships.

## Remaining Code Tasks For Next Loop

- Convert remaining decorative hero/banner background images to `next/image` only if they become content-bearing.
- Consider true 404 handling for unknown product/category slugs with `notFound()`.
