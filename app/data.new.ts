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
  images?: string[]
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
  "Apparel",
  "Accessories",
  "Vehicles & Parts",
  "Services",
  "Safety"
]

// Products array
export const products: Product[] = [
  {
    id: "zoo-performance-5-year-anniversary-t-shirt",
    name: "Limited Edition 5 YEAR ANNIVERSARY T-Shirt",
    category: "Apparel",
    price: 70,
    description: "Purchase our limited editon Australian Proud merch to celebrate our 5 year Anniversay. High quality print colours on a superior black AS Colour T-Shirt. Size Guide: AS Colour Sizes. Please allow 7-14 working days for printing and shipping!",
    images: [
      "https://cdn.shopify.com/s/files/1/0416/4393/3854/files/t-shirtbackFINAL.jpg?v=1741222958",
      "https://cdn.shopify.com/s/files/1/0416/4393/3854/files/T-ShirtFrontFINAL.jpg?v=1741222958",
      "https://cdn.shopify.com/s/files/1/0416/4393/3854/files/model_back.jpg?v=1741223014"
    ]
  }
]

// Featured products 