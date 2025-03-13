"use client"

import { ReactNode } from "react"
import { ChevronRight } from "lucide-react"

export interface Service {
  title: string
  description: string
  image: string
  icon: ReactNode
  slug: string
}

export const services: Service[] = [
  {
    title: "Custom Fabrication",
    description: "Precision metal fabrication for your unique requirements. From simple brackets to complex assemblies.",
    image: "/fabrication.jpg",
    icon: <ChevronRight className="h-5 w-5 text-orange-400" />,
    slug: "custom-fabrication"
  },
  {
    title: "Roll Cages",
    description: "Safety-certified roll cages designed and built to meet competition standards.",
    image: "/rollcage.jpg",
    icon: <ChevronRight className="h-5 w-5 text-orange-400" />,
    slug: "roll-cages"
  },
  {
    title: "Prototyping",
    description: "Rapid prototyping services to bring your concepts to life with precision and expertise.",
    image: "/prototyping.jpg",
    icon: <ChevronRight className="h-5 w-5 text-orange-400" />,
    slug: "prototyping"
  },
  {
    title: "Exhaust Systems",
    description: "Custom exhaust solutions designed for optimal flow and performance. From cat-back systems to full turbo-back setups.",
    image: "/exhaust.jpg",
    icon: <ChevronRight className="h-5 w-5 text-orange-400" />,
    slug: "exhaust-systems"
  },
  {
    title: "4WD Modifications",
    description: "Comprehensive 4x4 upgrades including bull bars, rock sliders, underbody protection, and custom storage solutions.",
    image: "/4wd-mods.jpg",
    icon: <ChevronRight className="h-5 w-5 text-orange-400" />,
    slug: "4wd-modifications"
  },
  {
    title: "Custom Trailers",
    description: "Purpose-built trailers designed to your specifications. From car haulers to specialized equipment transport.",
    image: "/trailers.jpg",
    icon: <ChevronRight className="h-5 w-5 text-orange-400" />,
    slug: "custom-trailers"
  }
] 