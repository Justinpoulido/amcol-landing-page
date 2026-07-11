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
      "Source industrial cleaners and degreasers in Trinidad & Tobago for maintenance teams, plant shutdowns, workshops, and routine equipment care.",
    products: [
      { id: 1, name: "WD-40 Specialist Degreaser", price: "Request Quote", image: "/images/wd40 degreaser.webp", category: "Degreaser" },
      { id: 2, name: "Industrial Cleaner Degreaser", price: "Request Quote", image: "/images/Simple Green Safer Choice Banner.webp", category: "Cleaner" },
      { id: 3, name: "Heavy-Duty Surface Cleaner", price: "Request Quote", image: "/images/Surface Cleaner.webp", category: "Facility Care" },
    ],
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
      { id: 1, name: "Multi-Surface Disinfectant Spray", price: "Request Quote", image: "/images/Surface Cleaner.webp", category: "Disinfectant" },
      { id: 2, name: "Concentrated Odor Neutralizer", price: "Request Quote", image: "/images/Surface Cleaner.webp", category: "Deodorizer" },
      { id: 3, name: "Janitorial Sanitizing Refill", price: "Request Quote", image: "/images/Surface Cleaner.webp", category: "Facility Care" },
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
      { id: 1, name: "Gasoline Pressure Sprayer", price: "Request Quote", image: "/images/Gasoline Sprayer.webp", category: "Pressure Sprayer" },
      { id: 2, name: "Handheld Utility Pump", price: "Request Quote", image: "/images/Gasoline Sprayer.webp", category: "Transfer Pump" },
      { id: 3, name: "Chemical Application Sprayer", price: "Request Quote", image: "/images/Gasoline Sprayer.webp", category: "Chemical Handling" },
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
      { id: 1, name: "Red Devil Silicone Sealant", price: "Request Quote", image: "/images/Silicone Tube with Red Devil Background.webp", category: "Sealant" },
      { id: 2, name: "Industrial Silicone Cartridge", price: "Request Quote", image: "/images/Silicone-Sealant.webp", category: "Silicone" },
      { id: 3, name: "Multipurpose Bonding Adhesive", price: "Request Quote", image: "/images/E6000.webp", category: "Adhesive" },
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
      "Source fire protection supplies in Trinidad for facilities, yards, workshops, and jobsites that need extinguishers, signage, brackets, and emergency-readiness support.",
    products: [
      { id: 1, name: "Portable Fire Extinguisher", price: "Request Quote", image: "/images/Fire extinguisher.webp", category: "Extinguishers" },
      { id: 2, name: "Wall Mount Fire Bracket", price: "Request Quote", image: "/images/Fire extinguisher.webp", category: "Accessories" },
      { id: 3, name: "Safety Fire Station Signage", price: "Request Quote", image: "/images/Fire extinguisher.webp", category: "Safety Signage" },
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
      "Find safety supplies and PPE in Trinidad for construction zones, industrial plants, logistics yards, maintenance crews, and contractor teams.",
    products: [
      { id: 1, name: "Industrial Safety Helmet", price: "Request Quote", image: "/images/Hardhat.webp", category: "Head Protection" },
      { id: 2, name: "High-Visibility PPE Kit", price: "Request Quote", image: "/images/PPE Equipment.webp", category: "PPE" },
      { id: 3, name: "Protective Equipment Set", price: "Request Quote", image: "/images/protective_equipment.webp", category: "Worksite Safety" },
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
      { id: 1, name: "Heavy-Duty Fence Lock", price: "Request Quote", image: "/images/locks-security-deadbolts.webp", category: "Padlocks" },
      { id: 2, name: "Security Hasp and Staple Set", price: "Request Quote", image: "/images/locks-security-deadbolts.webp", category: "Hardware" },
      { id: 3, name: "Commercial Locking Assembly", price: "Request Quote", image: "/images/locks-security-deadbolts.webp", category: "Access Control" },
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
      "Source lubricants and penetrants in Trinidad & Tobago for workshops, fleets, industrial maintenance programs, seized parts, and metal surface protection.",
    products: [
      { id: 1, name: "WD-40 Multi-Use Product", price: "Request Quote", image: "/images/Wd40 bottle.webp", category: "Lubricant" },
      { id: 2, name: "Marine Grade Lubricant", price: "Request Quote", image: "/images/3 WD-40 Cans Banner.webp", category: "Maintenance" },
      { id: 3, name: "Penetrating Maintenance Spray", price: "Request Quote", image: "/images/Wd40 bottle.webp", category: "Penetrant" },
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
      { id: 1, name: "Industrial Abrasive Disc", price: "Request Quote", image: "/images/Abrasives1.webp", category: "Grinding" },
      { id: 2, name: "Diablo Cutting Disc", price: "Request Quote", image: "/images/Diablo Disc Banner.webp", category: "Cutting" },
      { id: 3, name: "Metal Surface Finishing Wheel", price: "Request Quote", image: "/images/Abrasives1.webp", category: "Finishing" },
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
      "Source welding supplies in Trinidad for fabrication, repair, structural work, maintenance crews, and shop-floor productivity.",
    products: [
      { id: 1, name: "Heavy Duty Welding Equipment", price: "Request Quote", image: "/images/Welding.webp", category: "Equipment" },
      { id: 2, name: "Welding Electrodes", price: "Request Quote", image: "/images/Welding_industrial.webp", category: "Consumables" },
      { id: 3, name: "Auto-Darkening Welding Helmet", price: "Request Quote", image: "/images/PPE Equipment.webp", category: "Protection" },
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
      "Find HVAC chemicals in Trinidad & Tobago for service contractors, facility managers, coil cleaning, treatment needs, and scheduled maintenance programs.",
    products: [
      { id: 1, name: "HVAC Coil Cleaner", price: "Request Quote", image: "/images/HVAC.webp", category: "System Cleaner" },
      { id: 2, name: "Condensate Line Treatment", price: "Request Quote", image: "/images/HVAC.webp", category: "Maintenance" },
      { id: 3, name: "Air Handler Service Chemical", price: "Request Quote", image: "/images/HVAC.webp", category: "Facility Care" },
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
      { id: 1, name: "Protective Surface Sealer", price: "Request Quote", image: "/images/Jotun sealer.webp", category: "Sealer" },
      { id: 2, name: "Industrial Protective Coating", price: "Request Quote", image: "/images/Jotun sealer.webp", category: "Coating" },
      { id: 3, name: "Heavy Duty Surface Primer", price: "Request Quote", image: "/images/Jotun sealer.webp", category: "Primer" },
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
      { id: 1, name: "Anti-Corrosion Protective Spray", price: "Request Quote", image: "/images/Corrosion Spray.webp", category: "Corrosion Inhibitor" },
      { id: 2, name: "Rust Protection Coating", price: "Request Quote", image: "/images/Corrosion Spray.webp", category: "Metal Protection" },
      { id: 3, name: "Surface Preservation Treatment", price: "Request Quote", image: "/images/Corrosion Spray.webp", category: "Maintenance" },
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
      { id: 1, name: "Industrial Extension Ladder", price: "Request Quote", image: "/images/Industrial-Aluminium-Extension-Ladder.webp", category: "Extension Ladder" },
      { id: 2, name: "Heavy Duty Site Ladder", price: "Request Quote", image: "/images/Ladder.webp", category: "Access Equipment" },
      { id: 3, name: "Warehouse Utility Ladder", price: "Request Quote", image: "/images/Ladder.webp", category: "Facility Access" },
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
      "Source spill containment supplies in Trinidad for leaks, drips, fluid emergencies, maintenance crews, and environmental-control response needs.",
    products: [
      { id: 1, name: "Emergency Spill Response Crate", price: "Request Quote", image: "/images/Crate.webp", category: "Spill Kit" },
      { id: 2, name: "Absorbent Response Pack", price: "Request Quote", image: "/images/Crate.webp", category: "Containment" },
      { id: 3, name: "Industrial Spill Control Station", price: "Request Quote", image: "/images/Crate.webp", category: "Emergency Response" },
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
      "Source marine maintenance supplies in Trinidad for port operations, offshore work, dockside maintenance, salt-air exposure, and heavy handling needs.",
    products: [
      { id: 1, name: "Marine Rigging Supplies", price: "Request Quote", image: "/images/RIG.webp", category: "Rigging" },
      { id: 2, name: "Cargo Handling Support Equipment", price: "Request Quote", image: "/images/Cargo ship.webp", category: "Logistics" },
      { id: 3, name: "Marine Maintenance Lubricant", price: "Request Quote", image: "/images/3 WD-40 Cans Banner.webp", category: "Maintenance" },
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
      { id: 1, name: "Medical Respirator", price: "Request Quote", image: "/images/medical respirator.webp", category: "Respiratory" },
      { id: 2, name: "Protective Medical PPE Set", price: "Request Quote", image: "/images/PPE Equipment.webp", category: "PPE" },
      { id: 3, name: "Facility First Response Kit", price: "Request Quote", image: "/images/medical respirator.webp", category: "Preparedness" },
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
      { id: 1, name: "Bulk Commodity Chemical Drum", price: "Request Quote", image: "/images/Barrel.webp", category: "Bulk Supply" },
      { id: 2, name: "Industrial Process Chemical", price: "Request Quote", image: "/images/Barrel.webp", category: "Processing" },
      { id: 3, name: "Facility Chemical Replenishment", price: "Request Quote", image: "/images/Barrel.webp", category: "Operations" },
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
      { id: 1, name: "Industrial Non-Slip Matting", price: "Request Quote", image: "/images/Matting Industrial non-slip.webp", category: "Safety Matting" },
      { id: 2, name: "Entrance Protection Floor Mat", price: "Request Quote", image: "/images/Matting Industrial non-slip.webp", category: "Facility Protection" },
      { id: 3, name: "Workshop Anti-Fatigue Mat", price: "Request Quote", image: "/images/Matting Industrial non-slip.webp", category: "Ergonomic Support" },
    ],
  },
};

type ProductContentDetails = Pick<
  ProductItem,
  "summary" | "description" | "specifications" | "useCases" | "brand" | "unit" | "stockStatus" | "imageAlt"
>;

const productContentOverrides: Record<string, Partial<ProductContentDetails>> = {
  "WD-40 Multi-Use Product": {
    brand: "WD-40",
    summary:
      "Multi-purpose lubricant and penetrant for loosening stuck parts, displacing moisture, and protecting metal surfaces.",
    description:
      "WD-40 Multi-Use Product supports day-to-day maintenance across workshops, fleet yards, industrial plants, and facility teams. Use it to help free seized fasteners, quiet light-duty moving parts, protect exposed metal, and displace moisture during routine equipment care.",
    specifications: [
      "Multi-use lubricant, penetrant, and moisture displacer",
      "Suitable for tools, hinges, locks, light mechanisms, and exposed metal",
      "Useful for preventive maintenance kits and workshop stockrooms",
    ],
    useCases: [
      "Freeing seized nuts, bolts, hinges, and light mechanisms",
      "Displacing moisture from tools and metal components",
      "Routine workshop, fleet, and facility maintenance",
    ],
  },
  "Portable Fire Extinguisher": {
    summary:
      "Portable fire extinguisher supply for facility readiness, worksite protection, and emergency response points.",
    description:
      "Portable fire extinguishers help facilities, workshops, vehicles, and construction areas maintain accessible first-response protection. AMCOL can support extinguisher sourcing for offices, warehouses, plants, yards, and work crews that need practical fire-safety coverage.",
    specifications: [
      "Portable extinguisher options available by application",
      "Suitable for facility, workshop, vehicle, and jobsite placement",
      "Ask AMCOL for size, class, mounting, and compliance guidance",
    ],
    useCases: [
      "Fire point coverage for offices, stores, yards, and industrial facilities",
      "Safety readiness for construction and maintenance crews",
      "Replacement or expansion of emergency-response equipment",
    ],
  },
  "Industrial Safety Helmet": {
    summary:
      "Durable head protection for construction, maintenance, warehouse, and plant personnel.",
    description:
      "Industrial safety helmets help protect crews from overhead hazards, bumps, and site-impact risks during daily work. Suitable for contractors, maintenance teams, warehouse crews, and plant personnel who need practical head protection for active work areas.",
    specifications: [
      "Hard-hat style head protection for industrial and construction settings",
      "Compatible with common site-safety and PPE programs",
      "Available for bulk procurement and crew outfitting",
    ],
    useCases: [
      "Construction and maintenance work zones",
      "Plant, warehouse, and yard operations",
      "Contractor safety kits and PPE replenishment",
    ],
  },
  "High-Visibility PPE Kit": {
    summary:
      "Visibility-focused PPE bundle for crews working around vehicles, equipment, traffic, and active yards.",
    description:
      "High-visibility PPE kits help crews remain easier to identify in busy work environments. They are useful for contractors, logistics teams, road crews, warehouses, and plant maintenance groups that need fast PPE replenishment for personnel and visitors.",
    specifications: [
      "PPE bundle options available for high-visibility work areas",
      "Supports visitor, contractor, and crew outfitting",
      "Suitable for roadway, yard, warehouse, and plant environments",
    ],
    useCases: [
      "Roadwork and construction site readiness",
      "Warehouse, port, and logistics operations",
      "Visitor PPE and contractor onboarding packs",
    ],
  },
  "Red Devil Silicone Sealant": {
    brand: "Red Devil",
    summary:
      "Silicone sealant for sealing joints, gaps, windows, doors, kitchens, bathrooms, and maintenance repairs.",
    description:
      "Red Devil Silicone Sealant provides flexible sealing support for building maintenance, repair work, and general installation tasks. It is suited for sealing joints and gaps where crews need a dependable cartridge sealant for facilities, workshops, and contractor jobs.",
    specifications: [
      "Cartridge-style silicone sealant",
      "Useful for windows, doors, fixtures, joints, and general sealing",
      "Suitable for contractor, facility, and maintenance stockrooms",
    ],
    useCases: [
      "Sealing gaps around windows, doors, and fixtures",
      "Facility maintenance and building repairs",
      "Contractor installation and punch-list work",
    ],
  },
  "Industrial Abrasive Disc": {
    summary:
      "Abrasive disc support for grinding, deburring, surface preparation, and metal maintenance tasks.",
    description:
      "Industrial abrasive discs are used by fabrication shops, contractors, and maintenance teams for surface preparation, grinding, and finishing. AMCOL can help source abrasive options based on material, tool type, finish requirements, and jobsite demand.",
    specifications: [
      "Grinding and surface-preparation abrasive options",
      "Suitable for fabrication, maintenance, and repair workflows",
      "Ask about disc size, grit, material, and application matching",
    ],
    useCases: [
      "Metal preparation before welding or coating",
      "Grinding, deburring, and edge cleanup",
      "Workshop and maintenance stock replenishment",
    ],
  },
  "HVAC Coil Cleaner": {
    summary:
      "Coil-cleaning chemical support for HVAC service teams and facility maintenance programs.",
    description:
      "HVAC coil cleaners help maintenance teams remove buildup from cooling and ventilation equipment so systems can operate more efficiently. AMCOL supports facilities, contractors, and service teams sourcing HVAC chemicals for scheduled service work.",
    specifications: [
      "Chemical cleaner options for HVAC service workflows",
      "Suitable for facility maintenance and contractor service teams",
      "Ask about dilution, application method, and surface compatibility",
    ],
    useCases: [
      "Routine air-conditioning and ventilation maintenance",
      "Facility service programs and shutdown work",
      "Contractor HVAC chemical replenishment",
    ],
  },
  "Anti-Corrosion Protective Spray": {
    summary:
      "Corrosion-control spray for protecting metal components exposed to moisture, salt air, and outdoor conditions.",
    description:
      "Anti-corrosion protective sprays support metal preservation in marine, industrial, workshop, and outdoor environments. They are useful for maintenance teams protecting tools, fasteners, fittings, exposed parts, and equipment surfaces from rust-prone conditions.",
    specifications: [
      "Metal protection and corrosion-control spray options",
      "Useful in marine, outdoor, plant, and workshop environments",
      "Supports preventive maintenance and asset preservation programs",
    ],
    useCases: [
      "Protecting exposed metal from moisture and salt-air exposure",
      "Maintenance of tools, fittings, equipment, and spare parts",
      "Corrosion-control support for yards, ports, and facilities",
    ],
  },
  "Industrial Extension Ladder": {
    summary:
      "Industrial ladder support for elevated access in maintenance, warehouse, utility, and construction work.",
    description:
      "Industrial extension ladders provide elevated access for site crews, facility maintenance teams, and warehouse operations. AMCOL can support ladder sourcing for teams that need dependable access equipment matched to jobsite conditions and duty requirements.",
    specifications: [
      "Extension ladder options for industrial and commercial access",
      "Suitable for maintenance, warehouse, utility, and contractor work",
      "Ask about height, duty rating, material, and storage requirements",
    ],
    useCases: [
      "Facility maintenance and elevated inspection work",
      "Warehouse, yard, and contractor access needs",
      "Replacement ladders for site safety programs",
    ],
  },
  "Medical Respirator": {
    summary:
      "Respiratory protection supply for occupational health, facility readiness, and controlled work environments.",
    description:
      "Medical respirators support occupational health and facility preparedness where respiratory protection is required. AMCOL can assist with respirator sourcing for industrial buyers, healthcare-adjacent facilities, emergency stores, and safety programs.",
    specifications: [
      "Respiratory protection options available by application",
      "Suitable for health stations, emergency stores, and controlled work areas",
      "Ask about fit, rating, packaging, and bulk availability",
    ],
    useCases: [
      "Occupational health and emergency preparedness",
      "Controlled work environments and facility response kits",
      "PPE replenishment for safety and medical-support teams",
    ],
  },
};

const categorySpecificationFocus: Record<string, string[]> = {
  "surface-disinfectants-deodorizers": [
    "Facility hygiene and odor-control support",
    "Suitable for commercial and industrial cleaning programs",
    "Ask about dilution, surface compatibility, and packaging options",
  ],
  "sprayers-pumps": [
    "Application and transfer equipment options",
    "Suitable for chemicals, coatings, cleaning agents, and fluids",
    "Ask about capacity, seals, pressure, and chemical compatibility",
  ],
  "adhesives-sealants-tape": [
    "Bonding, sealing, and repair product options",
    "Suitable for contractor, facility, and maintenance work",
    "Ask about cure time, flexibility, substrate compatibility, and packaging",
  ],
  "fire-protection": [
    "Fire-safety and emergency-readiness equipment",
    "Suitable for offices, yards, warehouses, workshops, and industrial sites",
    "Ask about mounting, signage, class, and replacement schedules",
  ],
  safety: [
    "Personal protective equipment and jobsite safety support",
    "Suitable for contractors, plants, warehouses, logistics, and maintenance crews",
    "Ask about size ranges, compliance needs, and bulk quantities",
  ],
  lubricants: [
    "Lubrication, penetrating, and maintenance chemical options",
    "Suitable for workshops, fleets, tools, hinges, bearings, and metal parts",
    "Ask about application method, packaging, and material compatibility",
  ],
  abrasives: [
    "Cutting, grinding, deburring, and finishing options",
    "Suitable for fabrication, repair, and metal-prep workflows",
    "Ask about disc size, grit, tool compatibility, and material type",
  ],
  welding: [
    "Welding equipment, consumables, and protection support",
    "Suitable for fabrication, repair, structural, and workshop jobs",
    "Ask about process, amperage, material, and consumable requirements",
  ],
  "hvac-chemicals": [
    "HVAC maintenance chemical options",
    "Suitable for facility service and contractor maintenance work",
    "Ask about dilution, application method, and surface compatibility",
  ],
  "coatings-sealers": [
    "Surface protection, coating, sealer, and primer options",
    "Suitable for steel, concrete, tanks, yards, and facility assets",
    "Ask about coverage, cure time, preparation, and exposure conditions",
  ],
  "corrosion-control": [
    "Rust prevention and metal-preservation support",
    "Suitable for marine, industrial, outdoor, and workshop environments",
    "Ask about exposure level, surface preparation, and maintenance intervals",
  ],
  marine: [
    "Marine, port, logistics, and offshore maintenance support",
    "Suitable for salt-air exposure and heavy operational environments",
    "Ask about material grade, load needs, and corrosion resistance",
  ],
};

function productSlugText(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function buildDefaultProductSummary(product: ProductItem) {
  return `${product.name} suited for ${productSlugText(
    product.category,
  )}, maintenance, contractor, and facility supply needs. Contact AMCOL Industrial to confirm availability, options, and bulk order support.`;
}

function buildDefaultProductDescription(
  product: ProductItem,
  category: ProductCategoryPageData,
) {
  return `${product.name} supports teams sourcing ${productSlugText(
    category.name,
  )} in Trinidad & Tobago for maintenance, contractor, and facility work. AMCOL can help confirm availability, packaging, compatibility, and bulk purchasing needs before the item is added to a supply list or quote request.`;
}

function buildDefaultUseCases(product: ProductItem, category: ProductCategoryPageData) {
  return [
    `${category.name} procurement for industrial, commercial, and contractor teams`,
    `Maintenance, replenishment, and jobsite use involving ${productSlugText(product.category)}`,
    "Quote requests, bulk supply lists, and product availability checks",
  ];
}

function enrichSeededProduct(
  product: ProductItem,
  category: ProductCategoryPageData,
): ProductItem {
  const overrides = productContentOverrides[product.name] ?? {};
  const specifications =
    overrides.specifications ??
    product.specifications ??
    categorySpecificationFocus[category.slug] ?? [
      `${category.name} product support for industrial buyers`,
      `Suitable for ${productSlugText(product.category)} applications`,
      "Ask AMCOL for availability, packaging, and bulk order support",
    ];

  return {
    ...product,
    summary: overrides.summary ?? product.summary ?? buildDefaultProductSummary(product),
    description:
      overrides.description ??
      product.description ??
      buildDefaultProductDescription(product, category),
    specifications,
    useCases:
      overrides.useCases ?? product.useCases ?? buildDefaultUseCases(product, category),
    brand: overrides.brand ?? product.brand,
    unit: overrides.unit ?? product.unit ?? "Each",
    stockStatus: overrides.stockStatus ?? product.stockStatus ?? "Available on request",
    imageAlt:
      overrides.imageAlt ??
      product.imageAlt ??
      `${product.name} for ${category.name.toLowerCase()} supply`,
  };
}

for (const category of Object.values(productCategoryData)) {
  category.products = category.products.map((product) =>
    enrichSeededProduct(product, category),
  );
}

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


