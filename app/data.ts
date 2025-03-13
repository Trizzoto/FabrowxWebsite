import { ReactNode } from "react"
import { Service } from "./components/services"

// Types
export interface Product {
  id: string
  name: string
  category: string
  price: number
  description: string
  originalPrice?: number
  image?: string
}

export interface GalleryImage {
  url: string
  alt: string
  description: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  avatar: string
}

// Gallery Images
export const galleryImages: GalleryImage[] = [
  {
    url: "/gallery/project1.jpg",
    alt: "Custom Fabrication Project",
    description: "Full vehicle build with custom roll cage"
  },
  {
    url: "/gallery/project2.jpg",
    alt: "4WD Modifications",
    description: "Custom rock sliders and bull bar installation"
  },
  {
    url: "/gallery/project3.jpg",
    alt: "Performance Upgrades",
    description: "Custom exhaust system fabrication"
  },
  {
    url: "/gallery/project4.jpg",
    alt: "Roll Cage Installation",
    description: "Competition-spec roll cage"
  },
  {
    url: "/gallery/project5.jpg",
    alt: "Custom Trailer",
    description: "Heavy-duty off-road trailer build"
  },
  {
    url: "/gallery/project6.jpg",
    alt: "Workshop Project",
    description: "Custom fabrication in progress"
  },
  {
    url: "/gallery/project7.jpg",
    alt: "Vehicle Protection",
    description: "Bull bar and protection upgrades"
  },
  {
    url: "/gallery/project8.jpg",
    alt: "Performance Build",
    description: "Race car preparation"
  }
]

// Product Categories
export const productCategories = [
  "Hose",
  "AN Fittings",
  "Air Filtration",
  "Apparel",
  "Safety",
  "Fuel Regulators & Gauges",
  "Fuel Rails",
  "Accessories",
  "Brake",
  "Cooling",
  "Heat Management",
  "Exhaust & Fabrication",
  "Fuel Systems"
]

// Empty products array to start fresh
export const products: Product[] = [
  // Hose Products
  {
    id: "100-series-black-nylon",
    name: "100 Series Black Nylon Braided Cutter Hose",
    category: "Hose",
    price: 36.29,
    description: "High-quality black nylon braided cutter hose for performance applications"
  },
  {
    id: "100-series-ss-cutter",
    name: "100 Series Stainless Steel Cutter Hose",
    category: "Hose",
    price: 32.99,
    description: "Premium stainless steel cutter hose for demanding applications"
  },
  {
    id: "200-series-ptfe-black-nylon",
    name: "200 Series PTFE (Teflon) Hose - Black Nylon Braided",
    category: "Hose",
    price: 43.77,
    description: "PTFE hose with black nylon braiding for superior chemical resistance"
  },
  {
    id: "200-series-ptfe-black-ss",
    name: "200 Series PTFE (Teflon) Hose - Black Stainless Steel Braid",
    category: "Hose",
    price: 34.46,
    description: "PTFE hose with black stainless steel braiding"
  },
  {
    id: "200-series-ptfe-ss",
    name: "200 Series PTFE (Teflon) Hose - Stainless Steel Braid",
    category: "Hose",
    price: 34.46,
    description: "PTFE hose with stainless steel braiding for maximum durability"
  },
  {
    id: "400-series-push-lock",
    name: "400 Series Push Lock Hose",
    category: "Hose",
    price: 20.99,
    description: "Easy-to-install push lock hose system"
  },
  
  // AN Fittings
  {
    id: "100-series-straight-ends",
    name: "100 Series Straight Hose Ends (Cutter)",
    category: "AN Fittings", 
    price: 16.49,
    description: "Straight hose ends for 100 series cutter hose"
  },
  {
    id: "100-series-45-deg",
    name: "100 Series 45 Deg Hose Ends (Cutter)",
    category: "AN Fittings",
    price: 30.13,
    description: "45-degree hose ends for 100 series cutter hose"
  },
  {
    id: "100-series-90-deg",
    name: "100 Series 90 Deg Hose Ends (Cutter)",
    category: "AN Fittings",
    price: 41.57,
    description: "90-degree hose ends for 100 series cutter hose"
  },
  {
    id: "200-series-ptfe-straight",
    name: "200 Series PTFE Straight Hose Ends (Teflon)",
    category: "AN Fittings",
    price: 15.39,
    description: "Straight hose ends for 200 series PTFE hose"
  },
  
  // Air Filtration
  {
    id: "performance-air-filter",
    name: "Performance Air Filter",
    category: "Air Filtration",
    price: 89.99,
    description: "High-flow performance air filter"
  },
  {
    id: "breather-filter",
    name: "Breather Filter",
    category: "Air Filtration",
    price: 45.99,
    description: "Engine breather filter system"
  },
  
  // Safety Equipment
  {
    id: "2-inch-harness",
    name: '2" FIA Approved 6-Point Race Harness',
    category: "Safety",
    price: 306.90,
    description: "FIA approved 6-point racing harness"
  },
  {
    id: "3-inch-harness",
    name: '3" FIA Approved 6-Point Race Harness',
    category: "Safety",
    price: 306.90,
    description: "FIA approved 6-point racing harness, 3-inch width"
  },
  
  // Fuel Systems
  {
    id: "1l-catch-can",
    name: "1 Litre Aluminium Catch Cans with drain tap",
    category: "Fuel Systems",
    price: 164.99,
    description: "1L aluminum catch can with integrated drain tap"
  },
  {
    id: "2l-catch-can",
    name: "2 Litre Aluminium Catch Cans with drain tap",
    category: "Fuel Systems",
    price: 185.49,
    description: "2L aluminum catch can with integrated drain tap"
  },
  {
    id: "ls-throttle-body",
    name: "108mm LS Cable Billet Throttle Body",
    category: "Fuel Systems",
    price: 999.00,
    description: "Large diameter billet throttle body for LS engines",
    originalPrice: 1199.00
  },
  
  // Fuel Rails
  {
    id: "ls1-fuel-rail",
    name: "LS1 Fuel Rails",
    category: "Fuel Rails",
    price: 299.99,
    description: "High-flow fuel rails for LS1 engines"
  },
  {
    id: "ls2-fuel-rail",
    name: "LS2 Fuel Rails",
    category: "Fuel Rails",
    price: 299.99,
    description: "High-flow fuel rails for LS2 engines"
  },
  {
    id: "ls3-fuel-rail",
    name: "LS3 Fuel Rails",
    category: "Fuel Rails",
    price: 299.99,
    description: "High-flow fuel rails for LS3 engines"
  },
  {
    id: "rb25-fuel-rail",
    name: "NISSAN RB25 FUEL RAILS",
    category: "Fuel Rails",
    price: 299.99,
    description: "High-flow fuel rails for Nissan RB25 engines"
  },
  {
    id: "sr20-fuel-rail",
    name: "NISSAN SR20 FUEL RAILS",
    category: "Fuel Rails",
    price: 299.99,
    description: "High-flow fuel rails for Nissan SR20 engines"
  },
  {
    id: "2jz-fuel-rail",
    name: "TOYOTA 2JZ FUEL RAILS",
    category: "Fuel Rails",
    price: 299.99,
    description: "High-flow fuel rails for Toyota 2JZ engines"
  },
  
  // Accessories
  {
    id: "bonnet-pins",
    name: "ZOO BONNET PINS",
    category: "Accessories",
    price: 49.99,
    description: "High-quality bonnet pins"
  },
  {
    id: "quick-release-fasteners",
    name: "QUICK RELEASE FASTENERS",
    category: "Accessories",
    price: 29.99,
    description: "Quick release fastener kit"
  },
  
  // Brake Components
  {
    id: "gtr-2-piston",
    name: "GTR Style 2 Piston Calipers",
    category: "Brake",
    price: 599.99,
    description: "2 piston brake calipers in GTR style"
  },
  {
    id: "gtr-4-piston",
    name: "GTR Style 4 Piston Calipers",
    category: "Brake",
    price: 799.99,
    description: "4 piston brake calipers in GTR style"
  },
  {
    id: "billet-ebrake",
    name: "Billet E Brake",
    category: "Brake",
    price: 249.99,
    description: "Billet aluminum emergency brake handle"
  },
  
  // Cooling
  {
    id: "oil-cooler",
    name: "Oil Coolers",
    category: "Cooling",
    price: 299.99,
    description: "High-performance oil cooler system"
  },
  {
    id: "radiator-gauge-adaptor",
    name: "RADIATOR HOSE GAUGE ADAPTOR",
    category: "Cooling",
    price: 39.99,
    description: "Radiator hose gauge adapter fitting"
  },
  {
    id: "overflow-tank",
    name: "Overflow Tank",
    category: "Cooling",
    price: 129.99,
    description: "Universal coolant overflow tank"
  },
  
  // Heat Management
  {
    id: "turbo-beanie",
    name: "TURBO BEANIE",
    category: "Heat Management",
    price: 49.99,
    description: "Turbo heat shield beanie"
  },
  {
    id: "heat-wrap",
    name: "EXHAUST HEAT WRAP",
    category: "Heat Management",
    price: 29.99,
    description: "High-temperature exhaust wrap"
  },
  {
    id: "heat-sleeve",
    name: "HEAT PROOF SLEEVE",
    category: "Heat Management",
    price: 19.99,
    description: "Heat resistant protective sleeve"
  },
  
  // Exhaust & Fabrication
  {
    id: "v-band-quick",
    name: "QUICK RELEASE V BAND CLAMPS",
    category: "Exhaust & Fabrication",
    price: 49.99,
    description: "Quick release V-band clamp assembly"
  },
  {
    id: "v-band-standard",
    name: "Standard V BAND CLAMPS",
    category: "Exhaust & Fabrication",
    price: 39.99,
    description: "Standard V-band clamp"
  },
  {
    id: "intercooler-clamps",
    name: "INTERCOOLER / BOOST CLAMPS",
    category: "Exhaust & Fabrication",
    price: 24.99,
    description: "High-pressure intercooler/boost pipe clamps"
  },

  // More AN Fittings
  {
    id: "200-series-45-deg-ptfe",
    name: "200 Series 45 Deg PTFE Hose Ends",
    category: "AN Fittings",
    price: 32.99,
    description: "45-degree hose ends for 200 series PTFE hose"
  },
  {
    id: "200-series-90-deg-ptfe",
    name: "200 Series 90 Deg PTFE Hose Ends",
    category: "AN Fittings",
    price: 44.99,
    description: "90-degree hose ends for 200 series PTFE hose"
  },
  {
    id: "400-series-straight-push",
    name: "400 Series Straight Push Lock Hose Ends",
    category: "AN Fittings",
    price: 14.99,
    description: "Straight push lock hose ends for 400 series hose"
  },
  {
    id: "400-series-45-deg-push",
    name: "400 Series 45 Deg Push Lock Hose Ends",
    category: "AN Fittings",
    price: 24.99,
    description: "45-degree push lock hose ends for 400 series hose"
  },
  {
    id: "400-series-90-deg-push",
    name: "400 Series 90 Deg Push Lock Hose Ends",
    category: "AN Fittings",
    price: 29.99,
    description: "90-degree push lock hose ends for 400 series hose"
  },
  {
    id: "an-male-female-adaptor",
    name: "AN Male to Female Adaptors",
    category: "AN Fittings",
    price: 12.99,
    description: "AN male to female adapter fittings"
  },
  {
    id: "an-male-male-adaptor",
    name: "AN Male to Male Adaptors",
    category: "AN Fittings",
    price: 12.99,
    description: "AN male to male adapter fittings"
  },
  {
    id: "an-tee-piece",
    name: "AN Tee Piece",
    category: "AN Fittings",
    price: 19.99,
    description: "AN tee piece fitting for fluid distribution"
  },

  // More Air Filtration
  {
    id: "pod-filter-3inch",
    name: "3 Inch Pod Filter",
    category: "Air Filtration",
    price: 49.99,
    description: "3-inch universal pod air filter"
  },
  {
    id: "pod-filter-4inch",
    name: "4 Inch Pod Filter",
    category: "Air Filtration",
    price: 59.99,
    description: "4-inch universal pod air filter"
  },
  {
    id: "velocity-stack-3inch",
    name: "3 Inch Velocity Stack",
    category: "Air Filtration",
    price: 39.99,
    description: "3-inch aluminum velocity stack"
  },
  {
    id: "velocity-stack-4inch",
    name: "4 Inch Velocity Stack",
    category: "Air Filtration",
    price: 44.99,
    description: "4-inch aluminum velocity stack"
  },
  {
    id: "filter-cleaner-kit",
    name: "Air Filter Cleaning Kit",
    category: "Air Filtration",
    price: 24.99,
    description: "Complete air filter cleaning and maintenance kit"
  },

  // More Fuel Systems
  {
    id: "fuel-pressure-regulator-1000hp",
    name: "1000HP Fuel Pressure Regulator",
    category: "Fuel Systems",
    price: 199.99,
    description: "High-flow fuel pressure regulator for up to 1000HP"
  },
  {
    id: "fuel-pressure-regulator-2000hp",
    name: "2000HP Fuel Pressure Regulator",
    category: "Fuel Systems",
    price: 299.99,
    description: "High-flow fuel pressure regulator for up to 2000HP"
  },
  {
    id: "fuel-filter-100micron",
    name: "100 Micron Fuel Filter",
    category: "Fuel Systems",
    price: 49.99,
    description: "100 micron stainless steel fuel filter"
  },
  {
    id: "fuel-filter-40micron",
    name: "40 Micron Fuel Filter",
    category: "Fuel Systems",
    price: 49.99,
    description: "40 micron stainless steel fuel filter"
  },
  {
    id: "fuel-surge-tank-2l",
    name: "2L Fuel Surge Tank",
    category: "Fuel Systems",
    price: 249.99,
    description: "2 liter aluminum fuel surge tank"
  },
  {
    id: "fuel-surge-tank-3l",
    name: "3L Fuel Surge Tank",
    category: "Fuel Systems",
    price: 299.99,
    description: "3 liter aluminum fuel surge tank"
  },

  // More Cooling Products
  {
    id: "oil-cooler-10row",
    name: "10 Row Oil Cooler",
    category: "Cooling",
    price: 149.99,
    description: "10 row aluminum oil cooler"
  },
  {
    id: "oil-cooler-13row",
    name: "13 Row Oil Cooler",
    category: "Cooling",
    price: 179.99,
    description: "13 row aluminum oil cooler"
  },
  {
    id: "oil-cooler-16row",
    name: "16 Row Oil Cooler",
    category: "Cooling",
    price: 199.99,
    description: "16 row aluminum oil cooler"
  },
  {
    id: "oil-cooler-19row",
    name: "19 Row Oil Cooler",
    category: "Cooling",
    price: 229.99,
    description: "19 row aluminum oil cooler"
  },
  {
    id: "oil-thermostat",
    name: "Oil Thermostat",
    category: "Cooling",
    price: 89.99,
    description: "Thermostatic oil control valve"
  },

  // More Heat Management
  {
    id: "heat-barrier-sheet",
    name: "Heat Barrier Sheet",
    category: "Heat Management",
    price: 39.99,
    description: "Self-adhesive heat barrier material"
  },
  {
    id: "thermal-barrier-coating",
    name: "Thermal Barrier Coating",
    category: "Heat Management",
    price: 49.99,
    description: "High-temperature thermal barrier coating"
  },
  {
    id: "heat-shield-blanket",
    name: "Heat Shield Blanket",
    category: "Heat Management",
    price: 79.99,
    description: "Flexible heat shield blanket"
  },

  // More Exhaust & Fabrication
  {
    id: "v-band-flange-2inch",
    name: "2 Inch V-Band Flange Set",
    category: "Exhaust & Fabrication",
    price: 29.99,
    description: "2-inch V-band flange set"
  },
  {
    id: "v-band-flange-3inch",
    name: "3 Inch V-Band Flange Set",
    category: "Exhaust & Fabrication",
    price: 34.99,
    description: "3-inch V-band flange set"
  },
  {
    id: "v-band-flange-4inch",
    name: "4 Inch V-Band Flange Set",
    category: "Exhaust & Fabrication",
    price: 39.99,
    description: "4-inch V-band flange set"
  },
  {
    id: "exhaust-spring-kit",
    name: "Exhaust Spring Kit",
    category: "Exhaust & Fabrication",
    price: 19.99,
    description: "High-temperature exhaust spring kit"
  },

  // Fuel Regulators & Gauges
  {
    id: "fuel-pressure-gauge-0-100",
    name: "0-100 PSI Fuel Pressure Gauge",
    category: "Fuel Regulators & Gauges",
    price: 49.99,
    description: "0-100 PSI liquid-filled fuel pressure gauge"
  },
  {
    id: "fuel-pressure-gauge-0-160",
    name: "0-160 PSI Fuel Pressure Gauge",
    category: "Fuel Regulators & Gauges",
    price: 54.99,
    description: "0-160 PSI liquid-filled fuel pressure gauge"
  },
  {
    id: "boost-gauge-0-30",
    name: "0-30 PSI Boost Gauge",
    category: "Fuel Regulators & Gauges",
    price: 59.99,
    description: "0-30 PSI boost pressure gauge"
  },
  {
    id: "boost-gauge-0-60",
    name: "0-60 PSI Boost Gauge",
    category: "Fuel Regulators & Gauges",
    price: 64.99,
    description: "0-60 PSI boost pressure gauge"
  },
  {
    id: "oil-pressure-gauge-0-100",
    name: "0-100 PSI Oil Pressure Gauge",
    category: "Fuel Regulators & Gauges",
    price: 49.99,
    description: "0-100 PSI liquid-filled oil pressure gauge"
  },
  {
    id: "oil-temp-gauge",
    name: "Oil Temperature Gauge",
    category: "Fuel Regulators & Gauges",
    price: 54.99,
    description: "Oil temperature gauge with sensor"
  },
  {
    id: "water-temp-gauge",
    name: "Water Temperature Gauge",
    category: "Fuel Regulators & Gauges",
    price: 54.99,
    description: "Water/coolant temperature gauge with sensor"
  },

  // More Safety Equipment
  {
    id: "racing-seat-standard",
    name: "FIA Approved Racing Seat - Standard",
    category: "Safety",
    price: 399.99,
    description: "FIA approved racing seat for standard applications"
  },
  {
    id: "racing-seat-large",
    name: "FIA Approved Racing Seat - Large",
    category: "Safety",
    price: 429.99,
    description: "FIA approved racing seat for larger drivers"
  },
  {
    id: "seat-rail-kit-universal",
    name: "Universal Seat Rail Kit",
    category: "Safety",
    price: 129.99,
    description: "Universal adjustable seat mounting rails"
  },
  {
    id: "fire-extinguisher-1kg",
    name: "1KG Fire Extinguisher",
    category: "Safety",
    price: 79.99,
    description: "1KG racing approved fire extinguisher"
  },
  {
    id: "fire-extinguisher-2kg",
    name: "2KG Fire Extinguisher",
    category: "Safety",
    price: 99.99,
    description: "2KG racing approved fire extinguisher"
  },
  {
    id: "extinguisher-mount",
    name: "Quick Release Fire Extinguisher Mount",
    category: "Safety",
    price: 49.99,
    description: "Quick release fire extinguisher mounting bracket"
  },
  {
    id: "window-net",
    name: "FIA Approved Window Net",
    category: "Safety",
    price: 89.99,
    description: "FIA approved racing window net"
  },

  // Apparel
  {
    id: "racing-suit-s",
    name: "FIA Racing Suit - Small",
    category: "Apparel",
    price: 599.99,
    description: "FIA approved racing suit - Size Small"
  },
  {
    id: "racing-suit-m",
    name: "FIA Racing Suit - Medium",
    category: "Apparel",
    price: 599.99,
    description: "FIA approved racing suit - Size Medium"
  },
  {
    id: "racing-suit-l",
    name: "FIA Racing Suit - Large",
    category: "Apparel",
    price: 599.99,
    description: "FIA approved racing suit - Size Large"
  },
  {
    id: "racing-suit-xl",
    name: "FIA Racing Suit - XL",
    category: "Apparel",
    price: 599.99,
    description: "FIA approved racing suit - Size XL"
  },
  {
    id: "racing-gloves-s",
    name: "Racing Gloves - Small",
    category: "Apparel",
    price: 89.99,
    description: "FIA approved racing gloves - Size Small"
  },
  {
    id: "racing-gloves-m",
    name: "Racing Gloves - Medium",
    category: "Apparel",
    price: 89.99,
    description: "FIA approved racing gloves - Size Medium"
  },
  {
    id: "racing-gloves-l",
    name: "Racing Gloves - Large",
    category: "Apparel",
    price: 89.99,
    description: "FIA approved racing gloves - Size Large"
  },
  {
    id: "racing-shoes-8",
    name: "Racing Shoes - Size 8",
    category: "Apparel",
    price: 149.99,
    description: "FIA approved racing shoes - Size 8"
  },
  {
    id: "racing-shoes-9",
    name: "Racing Shoes - Size 9",
    category: "Apparel",
    price: 149.99,
    description: "FIA approved racing shoes - Size 9"
  },
  {
    id: "racing-shoes-10",
    name: "Racing Shoes - Size 10",
    category: "Apparel",
    price: 149.99,
    description: "FIA approved racing shoes - Size 10"
  },
  {
    id: "racing-shoes-11",
    name: "Racing Shoes - Size 11",
    category: "Apparel",
    price: 149.99,
    description: "FIA approved racing shoes - Size 11"
  },
  {
    id: "racing-shoes-12",
    name: "Racing Shoes - Size 12",
    category: "Apparel",
    price: 149.99,
    description: "FIA approved racing shoes - Size 12"
  },
  {
    id: "nomex-balaclava",
    name: "Nomex Racing Balaclava",
    category: "Apparel",
    price: 49.99,
    description: "Fire resistant Nomex racing balaclava"
  },
  {
    id: "racing-socks",
    name: "Nomex Racing Socks",
    category: "Apparel",
    price: 29.99,
    description: "Fire resistant Nomex racing socks"
  },

  // More Accessories
  {
    id: "battery-relocation-kit",
    name: "Battery Relocation Kit",
    category: "Accessories",
    price: 149.99,
    description: "Complete battery relocation kit with cables"
  },
  {
    id: "battery-box",
    name: "Aluminum Battery Box",
    category: "Accessories",
    price: 79.99,
    description: "Aluminum battery box with mounting hardware"
  },
  {
    id: "battery-cutoff",
    name: "Battery Cut-Off Switch",
    category: "Accessories",
    price: 39.99,
    description: "Racing specification battery cut-off switch"
  },
  {
    id: "hood-pins-black",
    name: "Hood Pins - Black",
    category: "Accessories",
    price: 29.99,
    description: "Black anodized aluminum hood pins"
  },
  {
    id: "hood-pins-red",
    name: "Hood Pins - Red",
    category: "Accessories",
    price: 29.99,
    description: "Red anodized aluminum hood pins"
  },
  {
    id: "hood-pins-blue",
    name: "Hood Pins - Blue",
    category: "Accessories",
    price: 29.99,
    description: "Blue anodized aluminum hood pins"
  },
  {
    id: "tow-hook-front",
    name: "Front Tow Hook",
    category: "Accessories",
    price: 39.99,
    description: "Universal front tow hook"
  },
  {
    id: "tow-hook-rear",
    name: "Rear Tow Hook",
    category: "Accessories",
    price: 39.99,
    description: "Universal rear tow hook"
  },

  // More Brake Components
  {
    id: "brake-line-kit-universal",
    name: "Universal Brake Line Kit",
    category: "Brake",
    price: 199.99,
    description: "Complete universal brake line kit"
  },
  {
    id: "brake-proportioning-valve",
    name: "Adjustable Brake Proportioning Valve",
    category: "Brake",
    price: 89.99,
    description: "Adjustable brake proportioning valve"
  },
  {
    id: "brake-bias-adjuster",
    name: "Brake Bias Adjuster",
    category: "Brake",
    price: 149.99,
    description: "In-cabin brake bias adjustment system"
  },
  {
    id: "brake-fluid-dot4",
    name: "DOT 4 Racing Brake Fluid",
    category: "Brake",
    price: 19.99,
    description: "High-performance DOT 4 racing brake fluid"
  },
  {
    id: "brake-fluid-dot5",
    name: "DOT 5.1 Racing Brake Fluid",
    category: "Brake",
    price: 24.99,
    description: "High-performance DOT 5.1 racing brake fluid"
  },
  {
    id: "brake-pads-race",
    name: "Racing Brake Pads",
    category: "Brake",
    price: 149.99,
    description: "High-performance racing brake pads"
  },
  {
    id: "brake-rotors-slotted",
    name: "Slotted Brake Rotors",
    category: "Brake",
    price: 199.99,
    description: "High-performance slotted brake rotors"
  },
  {
    id: "brake-rotors-drilled",
    name: "Drilled Brake Rotors",
    category: "Brake",
    price: 219.99,
    description: "High-performance drilled brake rotors"
  },

  // More Fuel Rails
  {
    id: "rb26-fuel-rail",
    name: "NISSAN RB26 FUEL RAILS",
    category: "Fuel Rails",
    price: 299.99,
    description: "High-flow fuel rails for Nissan RB26 engines"
  },
  {
    id: "1jz-fuel-rail",
    name: "TOYOTA 1JZ FUEL RAILS",
    category: "Fuel Rails",
    price: 299.99,
    description: "High-flow fuel rails for Toyota 1JZ engines"
  },
  {
    id: "4age-fuel-rail",
    name: "TOYOTA 4AGE FUEL RAILS",
    category: "Fuel Rails",
    price: 299.99,
    description: "High-flow fuel rails for Toyota 4AGE engines"
  },
  {
    id: "ka24-fuel-rail",
    name: "NISSAN KA24 FUEL RAILS",
    category: "Fuel Rails",
    price: 299.99,
    description: "High-flow fuel rails for Nissan KA24 engines"
  },
  {
    id: "4g63-fuel-rail",
    name: "MITSUBISHI 4G63 FUEL RAILS",
    category: "Fuel Rails",
    price: 299.99,
    description: "High-flow fuel rails for Mitsubishi 4G63 engines"
  },
  {
    id: "ej20-fuel-rail",
    name: "SUBARU EJ20 FUEL RAILS",
    category: "Fuel Rails",
    price: 299.99,
    description: "High-flow fuel rails for Subaru EJ20 engines"
  },
  {
    id: "ej25-fuel-rail",
    name: "SUBARU EJ25 FUEL RAILS",
    category: "Fuel Rails",
    price: 299.99,
    description: "High-flow fuel rails for Subaru EJ25 engines"
  },
  {
    id: "b-series-fuel-rail",
    name: "HONDA B-SERIES FUEL RAILS",
    category: "Fuel Rails",
    price: 299.99,
    description: "High-flow fuel rails for Honda B-series engines"
  },
  {
    id: "k-series-fuel-rail",
    name: "HONDA K-SERIES FUEL RAILS",
    category: "Fuel Rails",
    price: 299.99,
    description: "High-flow fuel rails for Honda K-series engines"
  }
]

// Featured products subset
export const featuredProducts = products.slice(0, 6)

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "John Smith",
    role: "Professional Mechanic",
    content: "The quality of Zoo Performance products is outstanding. I've been using their AN fittings and hoses for years with zero issues.",
    avatar: "/testimonials/john.jpg"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    role: "Race Team Manager",
    content: "Their fuel system components are top-notch. The customer service is excellent and shipping is always quick.",
    avatar: "/testimonials/sarah.jpg"
  },
  {
    id: "3",
    name: "Mike Williams",
    role: "Performance Shop Owner",
    content: "We exclusively use Zoo Performance parts in our builds. The reliability and quality are consistently excellent.",
    avatar: "/testimonials/mike.jpg"
  }
] 