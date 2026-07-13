export type IndustrialArticle = {
  id: number;
  title: string;
  slug: string;
  sector: "Energy" | "Welding" | "Marine" | "Safety" | "Events";
  location: string;
  completedOn: string;
  summary: string;
  image: string;
  tags: string[];
  eventUrl?: string;
  eventLabel?: string;
};

const seogsEventUrl = "https://suriname-energy.com/";

export const industrialArticles: IndustrialArticle[] = [
  {
    id: 5,
    title: "AMCOL at SEOGS 2026 Energy Summit",
    slug: "amcol-at-seogs-2026-energy-summit",
    sector: "Events",
    location: "Paramaribo, Suriname",
    completedOn: "2026-06-26",
    summary:
      "AMCOL attended SEOGS 2026, the Suriname Energy, Oil & Gas Summit & Exhibition, connecting with regional energy, offshore, and industrial procurement stakeholders.",
    image: "/images/AMCOL_Suriname/AMCOL_Surinam_showcase.webp",
    tags: ["SEOGS 2026", "Suriname energy", "industrial procurement"],
    eventUrl: seogsEventUrl,
    eventLabel: "Visit SEOGS 2026",
  },
  {
    id: 6,
    title: "Regional Partnership Discussions at SEOGS",
    slug: "regional-partnership-discussions-at-seogs",
    sector: "Events",
    location: "Paramaribo, Suriname",
    completedOn: "2026-06-25",
    summary:
      "During SEOGS 2026, AMCOL held executive discussions focused on regional supply relationships, local content opportunities, and support for future energy-sector projects.",
    image: "/images/AMCOL_Suriname/AMCOL_Surinam_Executive_partnership.webp",
    tags: ["SEOGS 2026", "partnerships", "local content"],
    eventUrl: seogsEventUrl,
    eventLabel: "Visit SEOGS 2026",
  },
  {
    id: 7,
    title: "Industrial Catalogue Presentation in Suriname",
    slug: "industrial-catalogue-presentation-in-suriname",
    sector: "Events",
    location: "Paramaribo, Suriname",
    completedOn: "2026-06-24",
    summary:
      "AMCOL shared industrial catalogue resources with SEOGS attendees, highlighting supply categories for maintenance, safety, construction, marine, and facility operations.",
    image: "/images/AMCOL_Suriname/AMCOL_Surinam_catalouge.webp",
    tags: ["SEOGS 2026", "product catalogue", "industrial supply"],
    eventUrl: seogsEventUrl,
    eventLabel: "Visit SEOGS 2026",
  },
  {
    id: 1,
    title: "Offshore Platform Retrofit Support Program",
    slug: "offshore-platform-retrofit-support-program",
    sector: "Marine",
    location: "Galeota Point",
    completedOn: "2025-11-18",
    summary:
      "AMCOL supplied corrosion-resistant fasteners, marine-grade sealants, and maintenance chemicals for a multi-stage retrofit initiative.",
    image: "/images/RIG.webp",
    tags: ["retrofit", "offshore", "marine maintenance"],
  },
  {
    id: 2,
    title: "Utility-Scale Solar Mounting Hardware Delivery",
    slug: "utility-scale-solar-mounting-hardware-delivery",
    sector: "Energy",
    location: "Central Trinidad",
    completedOn: "2025-09-30",
    summary:
      "Delivered anchors, panel mounting supports, and consumables for a grid-tied solar installation with phased procurement support.",
    image: "/images/Solar  light.webp",
    tags: ["solar", "procurement", "bulk supply"],
  },
  {
    id: 3,
    title: "Fabrication Yard Welding Consumables Rollout",
    slug: "fabrication-yard-welding-consumables-rollout",
    sector: "Welding",
    location: "La Brea",
    completedOn: "2025-07-14",
    summary:
      "Coordinated recurring supply for welding electrodes, abrasives, and PPE across fabrication crews working on structural assemblies.",
    image: "/images/Heritage-tank with crane.webp",
    tags: ["fabrication", "consumables", "site support"],
  },
  {
    id: 4,
    title: "Plant-Wide Safety Compliance Restocking",
    slug: "plant-wide-safety-compliance-restocking",
    sector: "Safety",
    location: "Point Lisas",
    completedOn: "2025-04-22",
    summary:
      "Implemented staged delivery of PPE kits, signage, and inspection-ready safety inventory for operations and maintenance teams.",
    image: "/images/Road-Work.webp",
    tags: ["ppe", "compliance", "industrial plant"],
  },
];
