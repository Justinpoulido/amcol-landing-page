This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Admin Portal Access

The `/admin` dashboard and `/api/admin/*` routes are protected by a login page
backed by server-only Vercel environment variables.

Set these environment variables locally and in Vercel:

```bash
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-secure-password
# Optional: use a separate signing secret for admin session cookies.
ADMIN_SESSION_SECRET=your-long-random-session-secret
```

In Vercel, add the variables under Project Settings > Environment Variables for
Production, Preview, and Development as needed. Do not prefix these values with
`NEXT_PUBLIC_`; that would expose them to the browser bundle.

For local development, place the same values in `.env.local`, or pull them from
Vercel after linking the project:

```bash
vercel env pull .env.local --yes
```

If `ADMIN_USERNAME` or `ADMIN_PASSWORD` is missing, the admin login page disables
sign-in instead of exposing admin access.

## Contact Request Email Notifications

Contact form submissions are saved to Supabase first, then the server attempts to
email AMCOL with the request details through Resend.

Set these server-only environment variables locally and in Vercel:

```bash
RESEND_API_KEY=re_your_resend_api_key
CONTACT_NOTIFICATION_TO=sales@amcolindustrial.com
CONTACT_NOTIFICATION_FROM="AMCOL Website <notifications@amcolindustrial.com>"
```

`CONTACT_NOTIFICATION_TO` can be a comma-separated list for multiple inboxes.
The `CONTACT_NOTIFICATION_FROM` domain must be verified in Resend. Do not prefix
these values with `NEXT_PUBLIC_`.

## SEO, Analytics, and Authority Setup

The site includes metadata, sitemap, robots.txt, JSON-LD structured data, `llms.txt`, and optional tracking/social placeholders.

Set only verified values in Vercel:

```bash
NEXT_PUBLIC_SITE_URL=https://amcolindustrial.com
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=000000000000000
NEXT_PUBLIC_FACEBOOK_URL=https://www.facebook.com/your-verified-profile
NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/your-verified-profile
NEXT_PUBLIC_LINKEDIN_URL=https://www.linkedin.com/company/your-verified-profile
NEXT_PUBLIC_YOUTUBE_URL=https://www.youtube.com/@your-verified-channel
NEXT_PUBLIC_GBP_URL=https://g.page/r/your-verified-google-business-profile
```

Recommended tracking setup: use `NEXT_PUBLIC_GTM_ID` as the primary container and configure GA4/Meta Pixel inside GTM. Leave direct GA4/Meta env vars empty when GTM already loads them to avoid duplicate pageviews.

Manual DNS tasks:

```txt
Host/Name: _dmarc
Type: TXT
Value: v=DMARC1; p=none; rua=mailto:dmarc@amcolindustrial.com; adkim=s; aspf=s
```

Start DMARC with `p=none`, confirm SPF/DKIM alignment with the mail provider, then move gradually to `quarantine` and `reject`.

Manual authority checklist:

- Claim and complete the verified Google Business Profile.
- Add AMCOL to legitimate Trinidad & Tobago business directories.
- Request supplier/dealer links from manufacturers and brands AMCOL carries.
- Ask customers and partners for supplier/resource page mentions where appropriate.
- Publish useful project/use-case articles and pitch them to local industry publications.
- Avoid paid link farms, generic directory blasts, and AI-spun guest posts.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
