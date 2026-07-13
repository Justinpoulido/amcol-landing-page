export const businessInfo = {
  name: "AMCOL Industrial",
  legalName: "AMCOL Industrial",
  url: "https://amcolindustrial.com",
  logo: "/images/AMCOL_Logo.webp",
  email: "sales@amcolindustrial.com",
  supportEmail: "support@amcolindustrial.com",
  telephone: "+1-868-288-5800",
  address: {
    streetAddress: "22 Ramjohn Trace",
    addressLocality: "Penal",
    addressRegion: "Penal-Debe",
    addressCountry: "TT",
  },
  areaServed: ["Trinidad and Tobago", "Penal", "San Fernando", "Port of Spain"],
  openingHours: ["Mo-Fr 07:00-17:00", "Sa 07:00-16:00"],
  priceRange: "$$",
};

export const socialLinks = [
  process.env.NEXT_PUBLIC_FACEBOOK_URL,
  process.env.NEXT_PUBLIC_INSTAGRAM_URL,
  process.env.NEXT_PUBLIC_LINKEDIN_URL,
  process.env.NEXT_PUBLIC_YOUTUBE_URL,
].filter((url): url is string => Boolean(url));

export const googleBusinessProfileUrl = process.env.NEXT_PUBLIC_GBP_URL;
