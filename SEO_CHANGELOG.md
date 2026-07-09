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

## Remaining Manual Tasks

- Add verified social profile URLs to Vercel env vars.
- Add verified Google Business Profile URL to `NEXT_PUBLIC_GBP_URL`.
- Create/verify GA4, GTM, and Meta Pixel IDs before enabling tracking.
- Configure SPF, DKIM, and DMARC with the mail/DNS provider.
- Build backlinks through legitimate supplier, customer, local directory, and industry publication relationships.

## Remaining Code Tasks For Next Loop

- Add `/news/[slug]` detail pages or remove detail links to prevent 404s.
- Convert meaningful CSS background images to `next/image` with alt text.
- Add `<main>` landmarks to public pages.
- Shorten global meta description and improve homepage/product/news headings around Trinidad & Tobago industrial supply terms.
- Move homepage inline marquee `<style>` blocks into `app/globals.css`.
- Consider true 404 handling for unknown product/category slugs with `notFound()`.
