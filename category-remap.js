// Category Remapping for Elite Fabworx
// This script defines how to map the current categories to cleaner, more organized ones

const categoryMapping = {
  // Auto Care & Detailing
  "Vehicles & Parts > Vehicle Parts & Accessories > Vehicle Maintenance, Care & Decor > Vehicle Cleaning > Car Wash Solutions": "Auto Care & Detailing",
  
  // Engine & Performance
  "Vehicles & Parts > Vehicle Parts & Accessories > Motor Vehicle Parts > Motor Vehicle Engine Parts": "Engine & Performance",
  "ADAPTORS": "Engine & Performance",
  "Vehicles & Parts > Vehicle Parts & Accessories > Motor Vehicle Parts > Motor Vehicle Fuel Systems": "Fuel Systems",
  
  // Turbo Components
  "Vehicles & Parts > Vehicle Parts & Accessories": "Engine Components",
  
  // Silicone Hoses & Clamps
  "Silicone": "Silicone Hoses",
  "silicone": "Silicone Hoses",
  "CLAMP": "Clamps & Fasteners",
  "Hose": "Silicone Hoses",
  
  // Braking Systems
  "Vehicles & Parts > Vehicle Parts & Accessories > Motor Vehicle Parts > Motor Vehicle Braking": "Braking Systems",
  
  // Tools & Hardware
  "Hardware > Tools": "Tools & Hardware",
  
  // Apparel & Merchandise
  "Apparel & Accessories": "Apparel & Merchandise",
  "Apparel & Accessories > Clothing > Clothing Tops > T-Shirts": "Apparel & Merchandise",
  
  // Services
  "Services > Business Services > Logistics & Removals": "Services",
  "Services > Business Services": "Services",
  "Gift Cards": "Gift Cards",
  
  // Default for uncategorized items
  "Uncategorized": "Engine Components",
  "Vehicles & Parts": "Engine Components",
  "Vehicles & Parts > Vehicle Parts & Accessories > Motor Vehicle Parts": "Engine Components",
  "Vehicles & Parts > Vehicle Parts & Accessories > Motor Vehicle Parts > Motor Vehicle Wheel Systems": "Wheels & Suspension"
};

// Special case handling based on product names
const specialCases = [
  { 
    contains: ["turbo", "beanie", "blanket"], 
    category: "Turbo Components" 
  },
  { 
    contains: ["silicone", "hose", "elbow", "joiner", "reducer"],
    category: "Silicone Hoses"
  },
  { 
    contains: ["clamp", "fastener", "clip", "mount", "bracket"],
    category: "Clamps & Fasteners"
  },
  { 
    contains: ["fuel", "tank", "pump", "injector", "surge", "filter", "cell", "regulator"],
    category: "Fuel Systems"
  },
  {
    contains: ["brake", "caliper", "rotor", "disc", "line", "pad", "master cylinder"],
    category: "Braking Systems"
  },
  {
    contains: ["wheel", "suspension", "coilover", "strut", "spring", "shock", "damper"],
    category: "Wheels & Suspension"
  },
  {
    contains: ["t-shirt", "hoodie", "hat", "beanie", "cap", "sticker", "decal", "apparel"],
    category: "Apparel & Merchandise"
  },
  {
    contains: ["oil", "cooler", "radiator", "heat exchanger", "cooling", "intercooler"],
    category: "Cooling Systems"
  },
  {
    contains: ["clean", "wash", "wax", "polish", "detail", "microfibre", "foam", "ceramic", "soap"],
    category: "Auto Care & Detailing"
  },
  {
    contains: ["adaptor", "adapter", "fitting", "barb", "an fitting", "fitting", "banjo"],
    category: "Fittings & Adaptors"
  },
  {
    contains: ["catch can", "breather", "ventilation", "oil catch"],
    category: "Engine Components"
  }
];

// Function to determine the appropriate category for a product
function determineCategory(product) {
  // First check special cases based on product name
  const productName = product.name.toLowerCase();
  
  for (const specialCase of specialCases) {
    if (specialCase.contains.some(keyword => productName.includes(keyword.toLowerCase()))) {
      return specialCase.category;
    }
  }
  
  // Then check the general category mapping
  if (categoryMapping[product.category]) {
    return categoryMapping[product.category];
  }
  
  // Default to a generic category if no match found
  return "Engine Components";
}

module.exports = {
  categoryMapping,
  specialCases,
  determineCategory
}; 