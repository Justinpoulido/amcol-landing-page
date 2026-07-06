export type ProductItem = {
  id: number | string;
  slug?: string;
  name: string;
  price: string;
  image: string;
  category: string;
  summary?: string;
  description?: string;
  specifications?: string[];
  useCases?: string[];
  brand?: string;
  sku?: string;
  unit?: string;
  stockStatus?: string;
  imageAlt?: string;
  galleryImages?: string[];
  featured?: boolean;
  createdAt?: string;
  source?: "seed" | "admin";
};

export type ProductCategoryPageData = {
  slug: string;
  name: string;
  href: string;
  image: string;
  banner: string;
  title: string;
  subtitle: string;
  description: string;
  products: ProductItem[];
};

export const productCategoryData: Record<string, ProductCategoryPageData> = {
  "cleaners-degreasers": {
    slug: "cleaners-degreasers",
    name: "Cleaners & Degreasers",
    href: "/products/cleaners-degreasers",
    image: "/images/wd40 degreaser.webp",
    banner: "/images/Heritage Industry.webp",
    title: "Cleaners & Degreasers",
    subtitle: "Heavy-duty cleaning for demanding worksites",
    description:
      "Cut through grease, oil, carbon buildup, and shop-floor grime with industrial cleaning solutions designed for maintenance teams, plant shutdowns, and routine equipment care.",
    products: [],
  },
  "surface-disinfectants-deodorizers": {
    slug: "surface-disinfectants-deodorizers",
    name: "Surface Disinfectants & Deodorizers",
    href: "/products/surface-disinfectants-deodorizers",
    image: "/images/Surface Cleaner.webp",
    banner: "/images/Proman_industrial.webp",
    title: "Surface Disinfectants & Deodorizers",
    subtitle: "Hygiene products for facilities and shared spaces",
    description:
      "Keep workplaces, washrooms, kitchens, and high-touch surfaces clean with dependable disinfectants and odor-control products suited to industrial and commercial environments.",
    products: [
      { id: 1, name: "Multi-Surface Disinfectant Spray", price: "Inquire", image: "/images/Surface Cleaner.webp", category: "Disinfectant" },
      { id: 2, name: "Concentrated Odor Neutralizer", price: "Inquire", image: "/images/Surface Cleaner.webp", category: "Deodorizer" },
      { id: 3, name: "Janitorial Sanitizing Refill", price: "Call for Quote", image: "/images/Surface Cleaner.webp", category: "Facility Care" },
    ],
  },
  "sprayers-pumps": {
    slug: "sprayers-pumps",
    name: "Sprayers & Pumps",
    href: "/products/sprayers-pumps",
    image: "/images/Gasoline Sprayer.webp",
    banner: "/images/TGU.webp",
    title: "Sprayers & Pumps",
    subtitle: "Application tools built for coverage and control",
    description:
      "From chemical application to fluid transfer, our sprayers and pumps help crews handle maintenance chemicals, coatings, and cleaning agents with accuracy and efficiency.",
    products: [
      { id: 1, name: "Gasoline Pressure Sprayer", price: "Inquire", image: "/images/Gasoline Sprayer.webp", category: "Pressure Sprayer" },
      { id: 2, name: "Handheld Utility Pump", price: "Call for Quote", image: "/images/Gasoline Sprayer.webp", category: "Transfer Pump" },
      { id: 3, name: "Chemical Application Sprayer", price: "Inquire", image: "/images/Gasoline Sprayer.webp", category: "Chemical Handling" },
    ],
  },
  "adhesives-sealants-tape": {
    slug: "adhesives-sealants-tape",
    name: "Adhesives, Sealants & Tape",
    href: "/products/adhesives-sealants-tape",
    image: "/images/Silicone-Sealant.webp",
    banner: "/images/Proman.webp",
    title: "Adhesives, Sealants & Tape",
    subtitle: "Reliable sealing and bonding for industrial use",
    description:
      "Seal joints, bond materials, and protect surfaces with industrial-grade silicones, construction adhesives, specialty sealants, and tapes for maintenance and installation work.",
    products: [
      { id: 1, name: "Red Devil Silicone Sealant", price: "$8.75", image: "/images/Silicone Tube with Red Devil Background.webp", category: "Sealant" },
      { id: 2, name: "Industrial Silicone Cartridge", price: "Inquire", image: "/images/Silicone-Sealant.webp", category: "Silicone" },
      { id: 3, name: "Multipurpose Bonding Adhesive", price: "Call for Quote", image: "/images/E6000.webp", category: "Adhesive" },
    ],
  },
  "fire-protection": {
    slug: "fire-protection",
    name: "Fire Protection",
    href: "/products/fire-protection",
    image: "/images/Fire extinguisher.webp",
    banner: "/images/Heritage tank- on site.webp",
    title: "Fire Protection",
    subtitle: "Preparedness products for safer facilities",
    description:
      "Support emergency readiness with extinguishers, signage, and safety accessories designed to help sites stay compliant and respond quickly when every second matters.",
    products: [
      { id: 1, name: "Portable Fire Extinguisher", price: "Inquire", image: "/images/Fire extinguisher.webp", category: "Extinguishers" },
      { id: 2, name: "Wall Mount Fire Bracket", price: "Call for Quote", image: "/images/Fire extinguisher.webp", category: "Accessories" },
      { id: 3, name: "Safety Fire Station Signage", price: "Inquire", image: "/images/Fire extinguisher.webp", category: "Safety Signage" },
    ],
  },
  safety: {
    slug: "safety",
    name: "Safety",
    href: "/products/safety",
    image: "/images/Hardhat.webp",
    banner: "/images/Road-Work.webp",
    title: "Safety",
    subtitle: "Worksite protection for crews and contractors",
    description:
      "Outfit your team with trusted personal protective equipment and site-safety essentials for construction zones, industrial plants, logistics yards, and maintenance operations.",
    products: [
      { id: 1, name: "Industrial Safety Helmet", price: "$85 TTD", image: "/images/Hardhat.webp", category: "Head Protection" },
      { id: 2, name: "High-Visibility PPE Kit", price: "Inquire", image: "/images/PPE Equipment.webp", category: "PPE" },
      { id: 3, name: "Protective Equipment Set", price: "Call for Quote", image: "/images/protective_equipment.webp", category: "Worksite Safety" },
    ],
  },
  "locks-security": {
    slug: "locks-security",
    name: "Locks & Security",
    href: "/products/locks-security",
    image: "/images/locks-security-deadbolts.webp",
    banner: "/images/Port Authority.webp",
    title: "Locks & Security",
    subtitle: "Secure access control for facilities and assets",
    description:
      "Protect gates, storage areas, tools, and perimeter assets with robust locking hardware and security accessories built for industrial and commercial settings.",
    products: [
      { id: 1, name: "Heavy-Duty Fence Lock", price: "Inquire", image: "/images/locks-security-deadbolts.webp", category: "Padlocks" },
      { id: 2, name: "Security Hasp and Staple Set", price: "Call for Quote", image: "/images/locks-security-deadbolts.webp", category: "Hardware" },
      { id: 3, name: "Commercial Locking Assembly", price: "Inquire", image: "/images/locks-security-deadbolts.webp", category: "Access Control" },
    ],
  },
  lubricants: {
    slug: "lubricants",
    name: "Lubricants",
    href: "/products/lubricants",
    image: "/images/Wd40 bottle.webp",
    banner: "/images/Heritage Industry.webp",
    title: "Lubricants",
    subtitle: "Reduce friction, wear, and unplanned downtime",
    description:
      "Maintain moving equipment, free seized parts, and protect metal surfaces with lubricants and penetrants suited for workshops, fleets, and industrial maintenance programs.",
    products: [
      { id: 1, name: "WD-40 Multi-Use Product", price: "$12.99", image: "/images/Wd40 bottle.webp", category: "Lubricant" },
      { id: 2, name: "Marine Grade Lubricant", price: "Inquire", image: "/images/3 WD-40 Cans Banner.webp", category: "Maintenance" },
      { id: 3, name: "Penetrating Maintenance Spray", price: "Call for Quote", image: "/images/Wd40 bottle.webp", category: "Penetrant" },
    ],
  },
  abrasives: {
    slug: "abrasives",
    name: "Abrasives",
    href: "/products/abrasives",
    image: "/images/Abrasives1.webp",
    banner: "/images/Welding_industrial.webp",
    title: "Abrasives",
    subtitle: "Grinding, cutting, and finishing solutions",
    description:
      "Handle prep, cutting, deburring, and finishing with abrasive discs and accessories selected for fabrication shops, maintenance work, and metal-processing tasks.",
    products: [
      { id: 1, name: "Industrial Abrasive Disc", price: "Inquire", image: "/images/Abrasives1.webp", category: "Grinding" },
      { id: 2, name: "Diablo Cutting Disc", price: "Call for Quote", image: "/images/Diablo Disc Banner.webp", category: "Cutting" },
      { id: 3, name: "Metal Surface Finishing Wheel", price: "Inquire", image: "/images/Abrasives1.webp", category: "Finishing" },
    ],
  },
  welding: {
    slug: "welding",
    name: "Welding",
    href: "/products/welding",
    image: "/images/Welding.webp",
    banner: "/images/Welding_industrial.webp",
    title: "Welding",
    subtitle: "Fabrication equipment for precision and strength",
    description:
      "Support fabrication, repair, and structural work with welding machines, consumables, and accessories chosen for dependable arc performance and shop-floor productivity.",
    products: [
      { id: 1, name: "Heavy Duty Welding Equipment", price: "Inquire", image: "/images/Welding.webp", category: "Equipment" },
      { id: 2, name: "Welding Electrodes", price: "Call for Quote", image: "/images/Welding_industrial.webp", category: "Consumables" },
      { id: 3, name: "Auto-Darkening Welding Helmet", price: "Inquire", image: "/images/PPE Equipment.webp", category: "Protection" },
    ],
  },
  "hvac-chemicals": {
    slug: "hvac-chemicals",
    name: "HVAC Chemicals",
    href: "/products/hvac-chemicals",
    image: "/images/HVAC.webp",
    banner: "/images/TGU.webp",
    title: "HVAC Chemicals",
    subtitle: "Chemical support for cooling and ventilation systems",
    description:
      "Keep HVAC systems running cleanly and efficiently with coil cleaners, treatment products, and maintenance chemicals formulated for service teams and facility managers.",
    products: [
      { id: 1, name: "HVAC Coil Cleaner", price: "Inquire", image: "/images/HVAC.webp", category: "System Cleaner" },
      { id: 2, name: "Condensate Line Treatment", price: "Call for Quote", image: "/images/HVAC.webp", category: "Maintenance" },
      { id: 3, name: "Air Handler Service Chemical", price: "Inquire", image: "/images/HVAC.webp", category: "Facility Care" },
    ],
  },
  "coatings-sealers": {
    slug: "coatings-sealers",
    name: "Coatings & Sealers",
    href: "/products/coatings-sealers",
    image: "/images/Jotun sealer.webp",
    banner: "/images/Heritage-tank with crane.webp",
    title: "Coatings & Sealers",
    subtitle: "Protective finishes for industrial surfaces",
    description:
      "Preserve assets and extend service life with coatings and sealers engineered for demanding environments, exposed steel, concrete surfaces, and corrosion-prone installations.",
    products: [
      { id: 1, name: "Protective Surface Sealer", price: "Inquire", image: "/images/Jotun sealer.webp", category: "Sealer" },
      { id: 2, name: "Industrial Protective Coating", price: "Call for Quote", image: "/images/Jotun sealer.webp", category: "Coating" },
      { id: 3, name: "Heavy Duty Surface Primer", price: "Inquire", image: "/images/Jotun sealer.webp", category: "Primer" },
    ],
  },
  "corrosion-control": {
    slug: "corrosion-control",
    name: "Corrosion Control",
    href: "/products/corrosion-control",
    image: "/images/Corrosion Spray.webp",
    banner: "/images/Heritage-tank with crane.webp",
    title: "Corrosion Control",
    subtitle: "Preserve metal assets in harsh environments",
    description:
      "Defend equipment, structures, and exposed components against rust and corrosion with treatments and maintenance products suited for marine, industrial, and outdoor use.",
    products: [
      { id: 1, name: "Anti-Corrosion Protective Spray", price: "Inquire", image: "/images/Corrosion Spray.webp", category: "Corrosion Inhibitor" },
      { id: 2, name: "Rust Protection Coating", price: "Call for Quote", image: "/images/Corrosion Spray.webp", category: "Metal Protection" },
      { id: 3, name: "Surface Preservation Treatment", price: "Inquire", image: "/images/Corrosion Spray.webp", category: "Maintenance" },
    ],
  },
  ladders: {
    slug: "ladders",
    name: "Ladders",
    href: "/products/ladders",
    image: "/images/Ladder.webp",
    banner: "/images/Industrial-Aluminium-Extension-Ladder.webp",
    title: "Ladders",
    subtitle: "Access equipment for safe elevated work",
    description:
      "Choose from dependable ladder solutions for warehouses, maintenance teams, utility jobs, and site work where safe access and durability are essential.",
    products: [
      { id: 1, name: "Industrial Extension Ladder", price: "Inquire", image: "/images/Industrial-Aluminium-Extension-Ladder.webp", category: "Extension Ladder" },
      { id: 2, name: "Heavy Duty Site Ladder", price: "Call for Quote", image: "/images/Ladder.webp", category: "Access Equipment" },
      { id: 3, name: "Warehouse Utility Ladder", price: "Inquire", image: "/images/Ladder.webp", category: "Facility Access" },
    ],
  },
  "spill-containment-emergency-response": {
    slug: "spill-containment-emergency-response",
    name: "Spill Containment & Emergency Response",
    href: "/products/spill-containment-emergency-response",
    image: "/images/Crate.webp",
    banner: "/images/Port Authority.webp",
    title: "Spill Containment & Emergency Response",
    subtitle: "Fast-response solutions when control matters most",
    description:
      "Prepare teams for leaks, drips, and fluid emergencies with containment and response products that help reduce downtime, protect personnel, and support environmental control measures.",
    products: [
      { id: 1, name: "Emergency Spill Response Crate", price: "Inquire", image: "/images/Crate.webp", category: "Spill Kit" },
      { id: 2, name: "Absorbent Response Pack", price: "Call for Quote", image: "/images/Crate.webp", category: "Containment" },
      { id: 3, name: "Industrial Spill Control Station", price: "Inquire", image: "/images/Crate.webp", category: "Emergency Response" },
    ],
  },
  marine: {
    slug: "marine",
    name: "Marine",
    href: "/products/marine",
    image: "/images/Cargo ship.webp",
    banner: "/images/RIG.webp",
    title: "Marine",
    subtitle: "Products selected for offshore and port operations",
    description:
      "Support marine logistics, offshore work, and dockside maintenance with durable supplies chosen for salt-air exposure, heavy handling, and operational reliability.",
    products: [
      { id: 1, name: "Marine Rigging Supplies", price: "Inquire", image: "/images/RIG.webp", category: "Rigging" },
      { id: 2, name: "Cargo Handling Support Equipment", price: "Call for Quote", image: "/images/Cargo ship.webp", category: "Logistics" },
      { id: 3, name: "Marine Maintenance Lubricant", price: "Inquire", image: "/images/3 WD-40 Cans Banner.webp", category: "Maintenance" },
    ],
  },
  medical: {
    slug: "medical",
    name: "Medical",
    href: "/products/medical",
    image: "/images/medical respirator.webp",
    banner: "/images/PPE Equipment.webp",
    title: "Medical",
    subtitle: "Essential protective and support supplies",
    description:
      "Source medical-support and hygiene-related products suited for occupational health stations, emergency preparedness, and frontline protection in controlled environments.",
    products: [
      { id: 1, name: "Medical Respirator", price: "Inquire", image: "/images/medical respirator.webp", category: "Respiratory" },
      { id: 2, name: "Protective Medical PPE Set", price: "Call for Quote", image: "/images/PPE Equipment.webp", category: "PPE" },
      { id: 3, name: "Facility First Response Kit", price: "Inquire", image: "/images/medical respirator.webp", category: "Preparedness" },
    ],
  },
  "commodity-chemicals": {
    slug: "commodity-chemicals",
    name: "Commodity Chemicals",
    href: "/products/commodity-chemicals",
    image: "/images/Barrel.webp",
    banner: "/images/Industrial_ Energy.webp",
    title: "Commodity Chemicals",
    subtitle: "Bulk chemical supply for industrial operations",
    description:
      "Meet processing, cleaning, and manufacturing demand with commodity chemical supply options that support production continuity and site-level operational needs.",
    products: [
      { id: 1, name: "Bulk Commodity Chemical Drum", price: "Inquire", image: "/images/Barrel.webp", category: "Bulk Supply" },
      { id: 2, name: "Industrial Process Chemical", price: "Call for Quote", image: "/images/Barrel.webp", category: "Processing" },
      { id: 3, name: "Facility Chemical Replenishment", price: "Inquire", image: "/images/Barrel.webp", category: "Operations" },
    ],
  },
  matting: {
    slug: "matting",
    name: "Matting",
    href: "/products/matting",
    image: "/images/Matting Industrial non-slip.webp",
    banner: "/images/Road-Work.webp",
    title: "Matting",
    subtitle: "Floor protection and anti-slip support",
    description:
      "Improve footing, reduce fatigue, and protect surfaces with matting solutions tailored for industrial entrances, wet areas, workshop floors, and high-traffic zones.",
    products: [
      { id: 1, name: "Industrial Non-Slip Matting", price: "Inquire", image: "/images/Matting Industrial non-slip.webp", category: "Safety Matting" },
      { id: 2, name: "Entrance Protection Floor Mat", price: "Call for Quote", image: "/images/Matting Industrial non-slip.webp", category: "Facility Protection" },
      { id: 3, name: "Workshop Anti-Fatigue Mat", price: "Inquire", image: "/images/Matting Industrial non-slip.webp", category: "Ergonomic Support" },
    ],
  },
};

export const landingCategoryRows = [
  [
    productCategoryData["cleaners-degreasers"],
    productCategoryData["surface-disinfectants-deodorizers"],
    productCategoryData["sprayers-pumps"],
    productCategoryData["adhesives-sealants-tape"],
  ],
  [
    productCategoryData["fire-protection"],
    productCategoryData.safety,
    productCategoryData["locks-security"],
    productCategoryData.lubricants,
    productCategoryData.abrasives,
    productCategoryData.welding,
  ],
  [
    productCategoryData["hvac-chemicals"],
    productCategoryData["coatings-sealers"],
    productCategoryData["corrosion-control"],
    productCategoryData.ladders,
  ],
  [
    productCategoryData["spill-containment-emergency-response"],
    productCategoryData.marine,
    productCategoryData.medical,
    productCategoryData["commodity-chemicals"],
    productCategoryData.matting,
  ],
];

export const featuredProductCategories = [
  productCategoryData["cleaners-degreasers"],
  productCategoryData.safety,
  productCategoryData.marine,
  productCategoryData.welding,
];
