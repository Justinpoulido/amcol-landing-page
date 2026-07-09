export type KnowledgeCategory = {
  slug: string;
  name: string;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
};

export type KnowledgeFaq = {
  question: string;
  answer: string;
};

export type KnowledgeProductLink = {
  label: string;
  href: string;
};

export type KnowledgeSection = {
  heading: string;
  body: string;
  bullets?: string[];
};

export type KnowledgeArticle = {
  slug: string;
  categorySlug: string;
  title: string;
  question: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  lastUpdated: string;
  readingMinutes: number;
  intent: string;
  aiSummary: string;
  sections: KnowledgeSection[];
  faqs: KnowledgeFaq[];
  relatedProductCategories: KnowledgeProductLink[];
  relatedArticleSlugs: string[];
};

const productSearch = (query: string) => `/products?search=${encodeURIComponent(query)}`;

export const knowledgeCategories: KnowledgeCategory[] = [
  {
    slug: "safety",
    name: "Safety",
    title: "Industrial Safety Knowledge",
    description:
      "Practical guidance for Trinidad industrial safety supplies, worksite readiness, and compliance-minded procurement.",
    metaTitle: "Industrial Safety Knowledge | AMCOL Industrial",
    metaDescription:
      "Safety supply guides for Trinidad worksites, contractors, maintenance teams, and industrial buyers.",
  },
  {
    slug: "marine",
    name: "Marine",
    title: "Marine Supply Knowledge",
    description:
      "Marine maintenance, port operations, rigging, corrosion control, and vessel support supply guidance.",
    metaTitle: "Marine Supply Knowledge | AMCOL Industrial Trinidad",
    metaDescription:
      "Marine supply guides for Trinidad port, vessel, cargo, and maintenance teams.",
  },
  {
    slug: "lubricants",
    name: "Lubricants",
    title: "Industrial Lubricant Knowledge",
    description:
      "Selection guidance for industrial lubricants, penetrants, anti-seize compounds, and maintenance sprays.",
    metaTitle: "Industrial Lubricant Guides | AMCOL Industrial",
    metaDescription:
      "Learn how to choose lubricants, penetrants, and anti-seize products for industrial maintenance.",
  },
  {
    slug: "bearings",
    name: "Bearings",
    title: "Bearing Selection Knowledge",
    description:
      "Plain-language guidance for selecting, replacing, protecting, and sourcing industrial bearings.",
    metaTitle: "Industrial Bearing Selection Guides | AMCOL Industrial",
    metaDescription:
      "Bearing selection tips for maintenance teams choosing load, speed, seal, and corrosion requirements.",
  },
  {
    slug: "pumps",
    name: "Pumps",
    title: "Pump and Sprayer Knowledge",
    description:
      "Procurement guidance for transfer pumps, sprayers, chemical application, and fluid handling support.",
    metaTitle: "Industrial Pump and Sprayer Guides | AMCOL Industrial",
    metaDescription:
      "How to choose transfer pumps, sprayers, and fluid handling supplies for industrial worksites.",
  },
  {
    slug: "valves",
    name: "Valves",
    title: "Valve and Fitting Knowledge",
    description:
      "Guides for specifying valves, fittings, pipe support items, and industrial flow-control supplies.",
    metaTitle: "Valve and Fitting Guides | AMCOL Industrial Trinidad",
    metaDescription:
      "Valve and fitting selection guidance for industrial maintenance and construction teams.",
  },
  {
    slug: "welding",
    name: "Welding",
    title: "Welding Supply Knowledge",
    description:
      "Welding consumable, abrasive, PPE, and fabrication support guidance for industrial teams.",
    metaTitle: "Welding Supply Guides | AMCOL Industrial",
    metaDescription:
      "Welding consumable, PPE, abrasive, and fabrication supply guidance for Trinidad buyers.",
  },
  {
    slug: "electrical",
    name: "Electrical",
    title: "Electrical Safety Knowledge",
    description:
      "Electrical maintenance and safety supply guidance for contractors, facilities, and industrial crews.",
    metaTitle: "Electrical Safety Supply Guides | AMCOL Industrial",
    metaDescription:
      "Electrical safety supply guidance for gloves, lockout support, PPE, and maintenance readiness.",
  },
  {
    slug: "ppe",
    name: "PPE",
    title: "PPE Knowledge",
    description:
      "Personal protective equipment guidance for industrial, construction, marine, and maintenance teams.",
    metaTitle: "PPE Guides for Industrial Worksites | AMCOL Industrial",
    metaDescription:
      "PPE selection guides for helmets, gloves, coveralls, eye protection, respiratory protection, and site safety.",
  },
  {
    slug: "construction",
    name: "Construction",
    title: "Construction Supply Knowledge",
    description:
      "Construction consumable, safety, adhesive, ladder, and jobsite supply guidance.",
    metaTitle: "Construction Supply Guides | AMCOL Industrial Trinidad",
    metaDescription:
      "Construction supply guides for contractors sourcing safety, consumables, ladders, sealants, and jobsite materials.",
  },
  {
    slug: "fire-protection",
    name: "Fire Protection",
    title: "Fire Protection Knowledge",
    description:
      "Guidance for fire extinguishers, signs, brackets, emergency readiness, and facility protection supplies.",
    metaTitle: "Fire Protection Supply Guides | AMCOL Industrial",
    metaDescription:
      "Fire protection supply guidance for extinguishers, signage, brackets, and facility readiness.",
  },
  {
    slug: "industrial-chemicals",
    name: "Industrial Chemicals",
    title: "Industrial Chemical Knowledge",
    description:
      "Industrial chemical procurement guidance for cleaners, degreasers, HVAC chemicals, and process supplies.",
    metaTitle: "Industrial Chemical Buying Guides | AMCOL Industrial",
    metaDescription:
      "How to buy industrial chemicals safely for facilities, maintenance teams, and contractors in Trinidad.",
  },
  {
    slug: "material-handling",
    name: "Material Handling",
    title: "Material Handling Knowledge",
    description:
      "Guidance for improving site movement, cargo handling, storage, spill readiness, and operational flow.",
    metaTitle: "Material Handling Supply Guides | AMCOL Industrial",
    metaDescription:
      "Material handling supply guidance for warehouses, yards, marine operations, and industrial sites.",
  },
];

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    slug: "how-to-choose-industrial-safety-supplies",
    categorySlug: "safety",
    title: "How to Choose Industrial Safety Supplies for a Worksite",
    question: "What industrial safety supplies should a worksite keep on hand?",
    excerpt:
      "A practical checklist for choosing safety supplies based on hazards, crew size, replenishment needs, and Trinidad worksite conditions.",
    metaTitle: "How to Choose Industrial Safety Supplies | AMCOL Industrial",
    metaDescription:
      "Choose industrial safety supplies for Trinidad worksites with this practical hazard, PPE, signage, and replenishment checklist.",
    lastUpdated: "2026-07-09",
    readingMinutes: 4,
    intent: "Choose industrial safety supplies for a jobsite or facility.",
    aiSummary:
      "Start with the jobsite hazard profile, match PPE to each task, add signage and emergency supplies, then build a replenishment list for high-use items.",
    relatedProductCategories: [
      { label: "Safety supplies", href: "/products/safety" },
      { label: "Fire protection", href: "/products/fire-protection" },
      { label: "Spill containment", href: "/products/spill-containment-emergency-response" },
    ],
    relatedArticleSlugs: [
      "what-ppe-do-industrial-workers-need",
      "what-fire-protection-supplies-do-facilities-need",
      "what-electrical-safety-supplies-do-maintenance-teams-need",
    ],
    sections: [
      {
        heading: "Start with the site hazards",
        body:
          "A safety supply list should be built around the real hazards on site, not a generic shopping list. Review work at height, hot work, chemicals, noise, moving equipment, electrical exposure, spill risk, and traffic movement before choosing products.",
      },
      {
        heading: "Build the core supply list",
        body:
          "Most industrial locations need a core kit for daily work and a separate emergency supply list for incidents.",
        bullets: [
          "Head, eye, hand, foot, hearing, and respiratory protection.",
          "High-visibility gear for yards, road-facing work, and loading areas.",
          "Safety signage, barricade tape, matting, and spill response supplies.",
          "Fire extinguishers and mounting accessories where required by the site.",
        ],
      },
      {
        heading: "Plan replenishment",
        body:
          "Gloves, disposable PPE, respirator cartridges, marking tape, cleaners, and spill absorbents are consumed quickly. Track reorder points so supervisors can request a quote before the stockroom runs low.",
      },
    ],
    faqs: [
      {
        question: "Should every site use the same safety supply list?",
        answer:
          "No. A welding bay, marine yard, warehouse, and construction site each have different hazards. Use a baseline list, then adjust it by task and exposure.",
      },
      {
        question: "Can AMCOL help prepare a safety supply list?",
        answer:
          "Yes. Send the worksite type, crew size, hazards, and preferred brands, and AMCOL can help quote practical safety and PPE options.",
      },
    ],
  },
  {
    slug: "what-marine-maintenance-supplies-do-port-teams-need",
    categorySlug: "marine",
    title: "What Marine Maintenance Supplies Do Port and Vessel Teams Need?",
    question: "What supplies should marine teams keep ready for port, cargo, and vessel maintenance?",
    excerpt:
      "A marine procurement guide covering corrosion control, lubricants, rigging support, PPE, and cargo-handling supplies.",
    metaTitle: "Marine Maintenance Supplies for Port Teams | AMCOL Industrial",
    metaDescription:
      "Marine maintenance supply guide for Trinidad port, cargo, vessel, and logistics teams sourcing industrial products.",
    lastUpdated: "2026-07-09",
    readingMinutes: 4,
    intent: "Identify marine maintenance supplies for port and vessel operations.",
    aiSummary:
      "Marine teams should prioritize corrosion control, lubricants, rigging support, PPE, spill readiness, and fast replenishment because salt, cargo movement, and weather accelerate wear.",
    relatedProductCategories: [
      { label: "Marine supplies", href: "/products/marine" },
      { label: "Lubricants", href: "/products/lubricants" },
      { label: "Corrosion control", href: "/products/corrosion-control" },
    ],
    relatedArticleSlugs: [
      "which-industrial-lubricant-should-you-use",
      "what-material-handling-supplies-improve-site-operations",
      "how-to-choose-industrial-safety-supplies",
    ],
    sections: [
      {
        heading: "Focus on corrosion and uptime",
        body:
          "Marine environments expose equipment to salt air, water, impact, and constant movement. Maintenance teams should keep corrosion inhibitors, lubricants, cleaning supplies, and replacement consumables available before shutdown work begins.",
      },
      {
        heading: "Common marine supply groups",
        body:
          "A useful marine supply list usually includes items for protection, maintenance, cargo movement, and emergency response.",
        bullets: [
          "Marine-grade lubricants, penetrants, and anti-seize compounds.",
          "PPE, gloves, eye protection, and high-visibility gear.",
          "Rigging support items, cargo handling aids, and cleaning supplies.",
          "Spill response supplies for fuel, oil, and chemical handling areas.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why are marine supplies different from general industrial supplies?",
        answer:
          "Marine work has higher corrosion, moisture, and cargo movement exposure, so products must be selected for durability and environmental conditions.",
      },
      {
        question: "What information helps AMCOL quote marine supplies?",
        answer:
          "Share the vessel or site type, operating environment, item specifications, quantity, brand preference, and required delivery timing.",
      },
    ],
  },
  {
    slug: "which-industrial-lubricant-should-you-use",
    categorySlug: "lubricants",
    title: "Which Industrial Lubricant Should You Use?",
    question: "How do you choose the right lubricant for industrial maintenance?",
    excerpt:
      "Learn how to match lubricants, penetrants, greases, and anti-seize products to load, temperature, moisture, and maintenance tasks.",
    metaTitle: "Which Industrial Lubricant Should You Use? | AMCOL",
    metaDescription:
      "Industrial lubricant selection guide covering load, temperature, corrosion, moisture, penetrants, greases, and anti-seize products.",
    lastUpdated: "2026-07-09",
    readingMinutes: 4,
    intent: "Select a lubricant for a maintenance or repair task.",
    aiSummary:
      "Choose lubricants by matching the product to motion type, load, temperature, moisture exposure, metal compatibility, and whether the job needs lubrication, release, corrosion protection, or assembly protection.",
    relatedProductCategories: [
      { label: "Lubricants", href: "/products/lubricants" },
      { label: "Corrosion control", href: "/products/corrosion-control" },
      { label: "Marine supplies", href: "/products/marine" },
    ],
    relatedArticleSlugs: [
      "what-marine-maintenance-supplies-do-port-teams-need",
      "how-to-select-industrial-bearings-for-maintenance",
      "how-to-buy-industrial-chemicals-safely",
    ],
    sections: [
      {
        heading: "Define the maintenance problem",
        body:
          "Lubricants are not interchangeable. A penetrant helps loosen stuck parts, a lubricant reduces friction, a grease stays in place under load, and anti-seize protects threaded assemblies exposed to heat or corrosion.",
      },
      {
        heading: "Selection factors",
        body:
          "Before buying, confirm the operating conditions and the material being protected.",
        bullets: [
          "Load, speed, temperature, and moisture exposure.",
          "Indoor, outdoor, marine, food-adjacent, or chemical exposure.",
          "Compatibility with rubber, plastic, painted surfaces, or metals.",
          "Application method: spray, tube, cartridge, tub, or bulk pack.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can one lubricant handle every maintenance job?",
        answer:
          "No. Multi-use lubricants are useful, but bearings, threaded assemblies, high-heat parts, and marine equipment often need more specific products.",
      },
      {
        question: "When should anti-seize be used?",
        answer:
          "Anti-seize is used on threaded assemblies, fasteners, and metal contact points where future removal, heat, corrosion, or galling are concerns.",
      },
    ],
  },
  {
    slug: "how-to-select-industrial-bearings-for-maintenance",
    categorySlug: "bearings",
    title: "How to Select Industrial Bearings for Maintenance",
    question: "What information do you need before buying replacement industrial bearings?",
    excerpt:
      "A bearing selection checklist covering dimensions, load, speed, sealing, lubrication, and operating environment.",
    metaTitle: "How to Select Industrial Bearings | AMCOL Industrial",
    metaDescription:
      "Industrial bearing selection checklist for maintenance teams sourcing replacement bearings and related supplies.",
    lastUpdated: "2026-07-09",
    readingMinutes: 4,
    intent: "Gather the right details to source replacement bearings.",
    aiSummary:
      "To source bearings, identify the bearing number or dimensions, load and speed conditions, seal or shield type, lubrication needs, and environmental exposure.",
    relatedProductCategories: [
      { label: "Search bearings", href: productSearch("bearings") },
      { label: "Lubricants", href: "/products/lubricants" },
      { label: "Corrosion control", href: "/products/corrosion-control" },
    ],
    relatedArticleSlugs: [
      "which-industrial-lubricant-should-you-use",
      "what-material-handling-supplies-improve-site-operations",
      "what-electrical-safety-supplies-do-maintenance-teams-need",
    ],
    sections: [
      {
        heading: "Capture the bearing identity first",
        body:
          "The fastest way to source a replacement bearing is with the bearing number from the old part, equipment manual, or nameplate. If that is unavailable, measure the inside diameter, outside diameter, and width accurately.",
      },
      {
        heading: "Check operating conditions",
        body:
          "A correct fit is only part of the decision. Bearings fail early when load, speed, contamination, alignment, or lubrication conditions are ignored.",
        bullets: [
          "Confirm load direction and approximate operating speed.",
          "Identify dust, water, chemicals, heat, or washdown exposure.",
          "Match seals or shields to the environment.",
          "Choose compatible lubricants and maintenance intervals.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is the bearing number enough to request a quote?",
        answer:
          "It is usually enough to start. Photos, equipment details, quantity, and operating environment help confirm the right replacement.",
      },
      {
        question: "Why do replacement bearings fail quickly?",
        answer:
          "Common causes include misalignment, contamination, wrong lubricant, overloading, improper installation, or using the wrong seal type.",
      },
    ],
  },
  {
    slug: "how-to-choose-a-sprayer-or-transfer-pump",
    categorySlug: "pumps",
    title: "How to Choose a Sprayer or Transfer Pump",
    question: "How do you select the right pump or sprayer for industrial use?",
    excerpt:
      "A guide to pump and sprayer selection based on fluid type, flow rate, pressure, chemical compatibility, and site conditions.",
    metaTitle: "How to Choose an Industrial Sprayer or Pump | AMCOL",
    metaDescription:
      "Choose sprayers and transfer pumps by fluid type, flow rate, pressure, chemical compatibility, and industrial site conditions.",
    lastUpdated: "2026-07-09",
    readingMinutes: 4,
    intent: "Select a pump or sprayer for chemical, water, or maintenance use.",
    aiSummary:
      "Choose a pump or sprayer by identifying the fluid, compatibility requirements, required flow and pressure, suction conditions, duty cycle, and power source.",
    relatedProductCategories: [
      { label: "Sprayers and pumps", href: "/products/sprayers-pumps" },
      { label: "Industrial chemicals", href: "/products/commodity-chemicals" },
      { label: "HVAC chemicals", href: "/products/hvac-chemicals" },
    ],
    relatedArticleSlugs: [
      "how-to-buy-industrial-chemicals-safely",
      "what-material-handling-supplies-improve-site-operations",
      "what-marine-maintenance-supplies-do-port-teams-need",
    ],
    sections: [
      {
        heading: "Start with the fluid",
        body:
          "Water, degreaser, fuel, solvent, and chemical mixtures can require different seals, hoses, and pump materials. Chemical compatibility should be confirmed before a pump or sprayer is used.",
      },
      {
        heading: "Match performance to the job",
        body:
          "The right unit depends on where the fluid is moving, how fast it must move, and how often the equipment will be used.",
        bullets: [
          "Fluid type, viscosity, temperature, and solids content.",
          "Flow rate, pressure, suction lift, and discharge distance.",
          "Manual, electric, gasoline, pneumatic, or battery operation.",
          "Hose, nozzle, fitting, and storage requirements.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can a standard pump be used for chemicals?",
        answer:
          "Only if the pump, seals, hoses, and fittings are compatible with the chemical. Always check compatibility before use.",
      },
      {
        question: "What should be included in a pump quote request?",
        answer:
          "Include the fluid, required flow, pressure, hose length, power source, quantity, and whether accessories are needed.",
      },
    ],
  },
  {
    slug: "what-valves-and-fittings-do-industrial-sites-use",
    categorySlug: "valves",
    title: "What Valves and Fittings Do Industrial Sites Use?",
    question: "Which valves and fittings are commonly used in industrial maintenance?",
    excerpt:
      "A plain-language guide to valve and fitting selection for water, air, chemical, and maintenance systems.",
    metaTitle: "Industrial Valves and Fittings Guide | AMCOL Industrial",
    metaDescription:
      "Valve and fitting guide for industrial maintenance teams choosing size, material, pressure rating, and connection type.",
    lastUpdated: "2026-07-09",
    readingMinutes: 4,
    intent: "Understand which valves and fittings to specify for industrial work.",
    aiSummary:
      "Valve and fitting selection depends on media, pressure, temperature, pipe size, material compatibility, connection type, and whether the system needs isolation, control, check, or drainage.",
    relatedProductCategories: [
      { label: "Search valves and fittings", href: productSearch("valves fittings") },
      { label: "Industrial chemicals", href: "/products/commodity-chemicals" },
      { label: "Marine supplies", href: "/products/marine" },
    ],
    relatedArticleSlugs: [
      "how-to-choose-a-sprayer-or-transfer-pump",
      "what-marine-maintenance-supplies-do-port-teams-need",
      "how-to-buy-industrial-chemicals-safely",
    ],
    sections: [
      {
        heading: "Know what the system carries",
        body:
          "Valves and fittings must be matched to the media in the line. Water, air, oil, fuel, steam, chemical, and wastewater service can require different materials and pressure ratings.",
      },
      {
        heading: "Specify the key details",
        body:
          "A clear request reduces mismatches and delays.",
        bullets: [
          "Pipe size, thread or flange type, and pressure rating.",
          "Valve function: isolation, control, check, relief, or drainage.",
          "Body material, seal material, and corrosion exposure.",
          "Quantity, preferred brand, and replacement urgency.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the most important valve detail to confirm?",
        answer:
          "The media, pressure rating, size, and connection type are the first details to confirm before matching a valve.",
      },
      {
        question: "Can AMCOL quote valves from photos?",
        answer:
          "Photos help, but dimensions, markings, system media, and pressure requirements are needed for a more accurate quote.",
      },
    ],
  },
  {
    slug: "what-welding-consumables-should-fabrication-teams-stock",
    categorySlug: "welding",
    title: "What Welding Consumables Should Fabrication Teams Stock?",
    question: "What welding supplies should a fabrication or maintenance team keep available?",
    excerpt:
      "A welding stockroom guide covering electrodes, abrasives, PPE, cleaning supplies, and maintenance consumables.",
    metaTitle: "Welding Consumables Stock List | AMCOL Industrial",
    metaDescription:
      "Welding consumable stock guide for fabrication teams sourcing electrodes, abrasives, PPE, and cleaning supplies.",
    lastUpdated: "2026-07-09",
    readingMinutes: 4,
    intent: "Build a stock list for welding consumables.",
    aiSummary:
      "A welding team should stock matched electrodes or wire, abrasive discs, PPE, clamps, marking tools, cleaning supplies, and fire-safety items based on metal type and process.",
    relatedProductCategories: [
      { label: "Welding supplies", href: "/products/welding" },
      { label: "Abrasives", href: "/products/abrasives" },
      { label: "Safety and PPE", href: "/products/safety" },
    ],
    relatedArticleSlugs: [
      "what-ppe-do-industrial-workers-need",
      "what-fire-protection-supplies-do-facilities-need",
      "how-to-choose-industrial-safety-supplies",
    ],
    sections: [
      {
        heading: "Match consumables to the process",
        body:
          "The right consumables depend on the welding process, base metal, material thickness, amperage, and finish requirements. Stock items should support the actual jobs performed most often.",
      },
      {
        heading: "Useful welding stock groups",
        body:
          "A practical welding supply list supports preparation, welding, finishing, and protection.",
        bullets: [
          "Electrodes, wire, tips, nozzles, and holders for the process.",
          "Cutting, grinding, flap, and finishing discs.",
          "Welding helmets, gloves, sleeves, respiratory protection, and eye protection.",
          "Fire extinguishers, welding blankets, markers, clamps, and cleaners.",
        ],
      },
    ],
    faqs: [
      {
        question: "How should welding consumables be reordered?",
        answer:
          "Track high-use electrodes, discs, gloves, and consumables by weekly usage and reorder before active jobs exhaust stock.",
      },
      {
        question: "What details help quote welding supplies?",
        answer:
          "Share process type, material, size, grade, brand preference, pack quantity, and urgency.",
      },
    ],
  },
  {
    slug: "what-electrical-safety-supplies-do-maintenance-teams-need",
    categorySlug: "electrical",
    title: "What Electrical Safety Supplies Do Maintenance Teams Need?",
    question: "What supplies help maintenance teams work around electrical hazards?",
    excerpt:
      "Electrical safety supply guidance for insulating gloves, PPE, lockout support, signage, and inspection planning.",
    metaTitle: "Electrical Safety Supplies for Maintenance Teams | AMCOL",
    metaDescription:
      "Electrical safety supply guide covering insulating gloves, PPE, lockout support, signage, and maintenance readiness.",
    lastUpdated: "2026-07-09",
    readingMinutes: 4,
    intent: "Identify safety supplies for electrical maintenance work.",
    aiSummary:
      "Electrical maintenance teams should identify voltage exposure, use properly rated PPE, maintain lockout procedures, inspect gloves and tools, and keep signage and emergency supplies ready.",
    relatedProductCategories: [
      { label: "Electrical safety search", href: productSearch("electrical safety") },
      { label: "Safety and PPE", href: "/products/safety" },
      { label: "Locks and security", href: "/products/locks-security" },
    ],
    relatedArticleSlugs: [
      "what-ppe-do-industrial-workers-need",
      "how-to-choose-industrial-safety-supplies",
      "how-to-select-industrial-bearings-for-maintenance",
    ],
    sections: [
      {
        heading: "Identify voltage and task exposure",
        body:
          "Electrical safety supplies should be chosen by qualified personnel based on voltage, task type, work environment, and applicable site procedures.",
      },
      {
        heading: "Core supply areas",
        body:
          "For procurement planning, maintenance teams often group electrical safety items by protection, control, and visibility.",
        bullets: [
          "Insulating rubber gloves and leather protectors where required.",
          "Arc-rated or task-specific PPE when specified by the safety plan.",
          "Lockout support items, tags, padlocks, and warning signs.",
          "Inspection records, storage bags, and replacement planning for wear items.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can any rubber glove be used for electrical work?",
        answer:
          "No. Electrical work requires properly rated insulating gloves and inspection/testing practices based on the work conditions.",
      },
      {
        question: "What product details should be included in a quote request?",
        answer:
          "Include glove class or rating, size, quantity, leather protector needs, standards required by your site, and delivery timing.",
      },
    ],
  },
  {
    slug: "what-ppe-do-industrial-workers-need",
    categorySlug: "ppe",
    title: "What PPE Do Industrial Workers Need?",
    question: "What PPE should industrial workers use for common worksite hazards?",
    excerpt:
      "A PPE guide for matching protection to hazards across construction, maintenance, marine, warehouse, and industrial sites.",
    metaTitle: "What PPE Do Industrial Workers Need? | AMCOL Industrial",
    metaDescription:
      "PPE selection guide for helmets, gloves, eye protection, coveralls, respiratory protection, and industrial worksite hazards.",
    lastUpdated: "2026-07-09",
    readingMinutes: 4,
    intent: "Select PPE for industrial workers and worksite tasks.",
    aiSummary:
      "Industrial PPE should be chosen by hazard: head impact, eye splash, hand cuts or chemicals, respiratory exposure, noise, visibility, heat, and contamination.",
    relatedProductCategories: [
      { label: "Safety and PPE", href: "/products/safety" },
      { label: "Medical and respiratory", href: "/products/medical" },
      { label: "Matting", href: "/products/matting" },
    ],
    relatedArticleSlugs: [
      "how-to-choose-industrial-safety-supplies",
      "what-electrical-safety-supplies-do-maintenance-teams-need",
      "what-welding-consumables-should-fabrication-teams-stock",
    ],
    sections: [
      {
        heading: "Match PPE to the hazard",
        body:
          "The right PPE depends on the task. A warehouse picker, welder, chemical handler, marine worker, and construction crew member may need different protection even if they work on the same site.",
      },
      {
        heading: "Common PPE categories",
        body:
          "Use a hazard review to decide which categories apply.",
        bullets: [
          "Head, eye, face, hand, foot, hearing, and respiratory protection.",
          "High-visibility clothing for traffic, yards, and loading areas.",
          "Coveralls and chemical-resistant PPE for splash or contamination risk.",
          "Task-specific welding, electrical, or fall-protection equipment where required.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is PPE enough to control hazards?",
        answer:
          "PPE is the last layer of protection. Sites should also use elimination, engineering controls, procedures, signage, and training where appropriate.",
      },
      {
        question: "How often should PPE be replaced?",
        answer:
          "Replace PPE when it is damaged, contaminated, expired, no longer fits, or fails inspection. High-use disposable PPE should have planned reorder points.",
      },
    ],
  },
  {
    slug: "what-construction-consumables-should-contractors-stock",
    categorySlug: "construction",
    title: "What Construction Consumables Should Contractors Stock?",
    question: "Which consumables help construction crews avoid delays?",
    excerpt:
      "A contractor stock guide for safety items, abrasives, sealants, ladders, cleaners, marking supplies, and site readiness.",
    metaTitle: "Construction Consumables Contractors Should Stock | AMCOL",
    metaDescription:
      "Construction consumable stock guide for contractors sourcing safety gear, abrasives, sealants, ladders, cleaners, and site supplies.",
    lastUpdated: "2026-07-09",
    readingMinutes: 4,
    intent: "Build a construction consumables list for active jobs.",
    aiSummary:
      "Contractors can reduce delays by stocking safety PPE, abrasives, sealants, adhesives, ladders, cleaners, marking supplies, fire protection, and fast-replenishment consumables.",
    relatedProductCategories: [
      { label: "Safety supplies", href: "/products/safety" },
      { label: "Adhesives, sealants and tape", href: "/products/adhesives-sealants-tape" },
      { label: "Ladders", href: "/products/ladders" },
    ],
    relatedArticleSlugs: [
      "how-to-choose-industrial-safety-supplies",
      "what-welding-consumables-should-fabrication-teams-stock",
      "what-fire-protection-supplies-do-facilities-need",
    ],
    sections: [
      {
        heading: "Stock by job phase",
        body:
          "Construction teams should plan consumables by mobilization, installation, finishing, cleanup, and safety needs. This makes procurement easier as site conditions change.",
      },
      {
        heading: "High-use categories",
        body:
          "Consumables are small items, but missing them can stop work.",
        bullets: [
          "PPE, safety signage, barricade tape, and fire extinguishers.",
          "Abrasives, cutting discs, adhesives, sealants, and tape.",
          "Ladders, matting, cleaners, degreasers, and marking supplies.",
          "Spill response items, gloves, wipes, and disposable protection.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why should contractors standardize consumables?",
        answer:
          "Standardizing high-use consumables reduces emergency purchases, mismatched products, and jobsite downtime.",
      },
      {
        question: "Can AMCOL quote a contractor supply list?",
        answer:
          "Yes. Send the job type, duration, crew size, preferred brands, and quantities for a practical quote.",
      },
    ],
  },
  {
    slug: "what-fire-protection-supplies-do-facilities-need",
    categorySlug: "fire-protection",
    title: "What Fire Protection Supplies Do Facilities Need?",
    question: "What basic fire protection supplies should facilities keep available?",
    excerpt:
      "Fire protection procurement guidance for extinguishers, signs, brackets, access, inspections, and emergency readiness.",
    metaTitle: "Fire Protection Supplies for Facilities | AMCOL Industrial",
    metaDescription:
      "Fire protection supply guide for facilities sourcing extinguishers, signage, brackets, and emergency readiness items.",
    lastUpdated: "2026-07-09",
    readingMinutes: 4,
    intent: "Identify basic fire protection supplies for a facility or jobsite.",
    aiSummary:
      "Facilities should keep suitable extinguishers, visible signage, mounts or brackets, clear access, inspection records, and replacement planning for active work areas.",
    relatedProductCategories: [
      { label: "Fire protection", href: "/products/fire-protection" },
      { label: "Safety supplies", href: "/products/safety" },
      { label: "Welding supplies", href: "/products/welding" },
    ],
    relatedArticleSlugs: [
      "how-to-choose-industrial-safety-supplies",
      "what-welding-consumables-should-fabrication-teams-stock",
      "what-construction-consumables-should-contractors-stock",
    ],
    sections: [
      {
        heading: "Match equipment to the hazard",
        body:
          "Fire protection supply needs depend on the materials present, work performed, building layout, vehicles, and emergency plan. Extinguisher type and placement should follow the facility safety requirements.",
      },
      {
        heading: "Procurement checklist",
        body:
          "Use a practical list for stockrooms, workshops, vehicles, and temporary work areas.",
        bullets: [
          "Portable extinguishers suited to the hazard class.",
          "Wall brackets, vehicle brackets, cabinets, and signage.",
          "Inspection tags, access markings, and replacement planning.",
          "Extra attention for welding, fuel, chemical, and storage areas.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should extinguishers be placed anywhere convenient?",
        answer:
          "No. Placement should follow site safety requirements so extinguishers are visible, accessible, and appropriate for the hazard.",
      },
      {
        question: "What details help quote fire protection supplies?",
        answer:
          "Share extinguisher type or size, quantity, mounting needs, signage needs, vehicle or wall use, and delivery timing.",
      },
    ],
  },
  {
    slug: "how-to-buy-industrial-chemicals-safely",
    categorySlug: "industrial-chemicals",
    title: "How to Buy Industrial Chemicals Safely",
    question: "What should buyers check before ordering industrial chemicals?",
    excerpt:
      "Industrial chemical buying guidance covering application, compatibility, SDS review, storage, handling, and packaging size.",
    metaTitle: "How to Buy Industrial Chemicals Safely | AMCOL Industrial",
    metaDescription:
      "Industrial chemical buying guide for cleaners, degreasers, HVAC chemicals, compatibility, SDS review, storage, and handling.",
    lastUpdated: "2026-07-09",
    readingMinutes: 4,
    intent: "Buy industrial chemicals safely for maintenance or facility operations.",
    aiSummary:
      "Before buying chemicals, confirm the application, surface or system compatibility, concentration, SDS, storage conditions, PPE needs, disposal considerations, and package size.",
    relatedProductCategories: [
      { label: "Commodity chemicals", href: "/products/commodity-chemicals" },
      { label: "Cleaners and degreasers", href: "/products/cleaners-degreasers" },
      { label: "HVAC chemicals", href: "/products/hvac-chemicals" },
    ],
    relatedArticleSlugs: [
      "how-to-choose-a-sprayer-or-transfer-pump",
      "which-industrial-lubricant-should-you-use",
      "what-ppe-do-industrial-workers-need",
    ],
    sections: [
      {
        heading: "Define the application",
        body:
          "Industrial chemicals should be selected for a specific task such as degreasing, coil cleaning, odor control, surface preparation, corrosion control, or process support.",
      },
      {
        heading: "Check safety and compatibility",
        body:
          "A chemical purchase should include enough information for safe handling and use.",
        bullets: [
          "Surface, equipment, material, and dilution compatibility.",
          "SDS availability, PPE needs, ventilation, and storage requirements.",
          "Package size, concentration, shelf life, and transport considerations.",
          "Disposal expectations and spill response supplies.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is an SDS?",
        answer:
          "An SDS is a Safety Data Sheet. It provides important handling, hazard, storage, PPE, first-aid, and disposal information for a chemical product.",
      },
      {
        question: "What should I send to request a chemical quote?",
        answer:
          "Send the chemical name or application, quantity, concentration, preferred brand, SDS requirement, packaging size, and delivery timing.",
      },
    ],
  },
  {
    slug: "what-material-handling-supplies-improve-site-operations",
    categorySlug: "material-handling",
    title: "What Material Handling Supplies Improve Site Operations?",
    question: "Which material handling supplies help industrial sites move goods safely?",
    excerpt:
      "Material handling guidance for warehouses, yards, marine operations, maintenance stores, spill readiness, and cargo movement.",
    metaTitle: "Material Handling Supplies for Industrial Sites | AMCOL",
    metaDescription:
      "Material handling supply guide for warehouses, yards, marine operations, cargo movement, storage, and site safety.",
    lastUpdated: "2026-07-09",
    readingMinutes: 4,
    intent: "Improve material movement, storage, and handling at industrial sites.",
    aiSummary:
      "Material handling improves when teams standardize cargo support, storage aids, marking supplies, spill response, PPE, and replenishment for high-movement areas.",
    relatedProductCategories: [
      { label: "Marine and cargo support", href: "/products/marine" },
      { label: "Spill containment", href: "/products/spill-containment-emergency-response" },
      { label: "Safety supplies", href: "/products/safety" },
    ],
    relatedArticleSlugs: [
      "what-marine-maintenance-supplies-do-port-teams-need",
      "how-to-select-industrial-bearings-for-maintenance",
      "how-to-choose-industrial-safety-supplies",
    ],
    sections: [
      {
        heading: "Look at movement points",
        body:
          "Material handling problems often appear at receiving areas, storage rooms, loading bays, marine yards, maintenance stores, and temporary work zones.",
      },
      {
        heading: "Supply areas to review",
        body:
          "The right supplies help reduce damage, waiting time, spill risk, and unsafe manual handling.",
        bullets: [
          "Cargo support, straps, marking supplies, and storage organization.",
          "PPE, high-visibility gear, matting, and signage.",
          "Spill containment and emergency response supplies.",
          "Lubricants and maintenance supplies for moving equipment.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the goal of material handling supplies?",
        answer:
          "The goal is to move, store, protect, and identify materials safely while reducing damage, delays, and emergency purchases.",
      },
      {
        question: "Can AMCOL support material handling supply lists?",
        answer:
          "Yes. AMCOL can quote practical support items when you share the operation type, materials handled, quantities, and site constraints.",
      },
    ],
  },
];

export function getKnowledgeCategory(slug: string) {
  return knowledgeCategories.find((category) => category.slug === slug);
}

export function getKnowledgeArticle(categorySlug: string, articleSlug: string) {
  return knowledgeArticles.find(
    (article) => article.categorySlug === categorySlug && article.slug === articleSlug,
  );
}

export function getKnowledgeArticleBySlug(articleSlug: string) {
  return knowledgeArticles.find((article) => article.slug === articleSlug);
}

export function getKnowledgeArticlesByCategory(categorySlug: string) {
  return knowledgeArticles.filter((article) => article.categorySlug === categorySlug);
}

export function getKnowledgeArticlePath(article: Pick<KnowledgeArticle, "categorySlug" | "slug">) {
  return `/knowledge/${article.categorySlug}/${article.slug}`;
}

export function getRelatedKnowledgeArticles(article: KnowledgeArticle) {
  return article.relatedArticleSlugs
    .map((slug) => getKnowledgeArticleBySlug(slug))
    .filter((related): related is KnowledgeArticle => Boolean(related));
}

export function searchKnowledgeArticles(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return knowledgeArticles;
  }

  return knowledgeArticles.filter((article) => {
    const category = getKnowledgeCategory(article.categorySlug);
    const searchable = [
      article.title,
      article.question,
      article.excerpt,
      article.intent,
      article.aiSummary,
      category?.name,
      ...article.sections.flatMap((section) => [
        section.heading,
        section.body,
        ...(section.bullets ?? []),
      ]),
      ...article.faqs.flatMap((faq) => [faq.question, faq.answer]),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchable.includes(normalizedQuery);
  });
}
