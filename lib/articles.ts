export type IndustrialArticle = {
  id: number;
  title: string;
  slug: string;
  sector: "Energy" | "Welding" | "Marine" | "Safety";
  location: string;
  completedOn: string;
  summary: string;
  image: string;
  tags: string[];
};

export const industrialArticles: IndustrialArticle[] = [
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
  {
    id: 5,
    title: "Turnaround Lubrication and MRO Supply Support",
    slug: "turnaround-lubrication-mro-supply-support",
    sector: "Energy",
    location: "South Oropouche",
    completedOn: "2024-12-05",
    summary:
      "Supplied maintenance, repair, and operations inventory including specialty lubricants and cleaners for turnaround execution.",
    image: "/images/3 WD-40 Cans Banner.webp",
    tags: ["mro", "turnaround", "maintenance"],
  },
  {
    id: 6,
    title: "Workshop Tooling and Preventive Maintenance Upgrade",
    slug: "workshop-tooling-and-preventive-maintenance-upgrade",
    sector: "Welding",
    location: "San Fernando",
    completedOn: "2024-08-16",
    summary:
      "Delivered portable power tools, grinder kits, and service accessories to modernize workshop readiness and uptime.",
    image: "/images/Dewalt Kit.webp",
    tags: ["tooling", "maintenance", "workshop"],
  },
];
