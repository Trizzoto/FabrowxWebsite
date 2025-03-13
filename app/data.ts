import { ReactNode } from "react"
import { Service } from "./components/services"

// Types
export interface Product {
  id: number
  name: string
  description: string
  price: number | string
  image: string
  category: string
}

export interface GalleryImage {
  url: string
  alt: string
  description: string
}

export interface Testimonial {
  name: string
  vehicle: string
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

// Testimonials
export const testimonials: Testimonial[] = [
  {
    name: "John Smith",
    vehicle: "Toyota LandCruiser",
    content: "Elite FabWorx did an amazing job on my custom bull bar and rock sliders. The quality of work is outstanding!",
    avatar: "/testimonials/avatar1.jpg"
  },
  {
    name: "Sarah Johnson",
    vehicle: "Nissan Patrol",
    content: "Couldn't be happier with my roof rack and storage system. Professional service and excellent craftsmanship.",
    avatar: "/testimonials/avatar2.jpg"
  },
  {
    name: "Mike Williams",
    vehicle: "Ford Ranger",
    content: "The team went above and beyond with my custom canopy build. Highly recommend their services!",
    avatar: "/testimonials/avatar3.jpg"
  }
]

// Product Categories
export const productCategories: string[] = [
  "Fabrication",
  "Performance",
  "Protection",
  "4WD Accessories",
  "Custom Work"
]

// Empty products array to start fresh
export const products: Product[] = []

// Empty featured products array
export const featuredProducts: Product[] = [] 