"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Filter, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { products, productCategories } from "../data"
import ProductGrid from "@/components/shop/product-grid"
import { useRouter } from "next/navigation"

interface Settings {
  heroImage: string
  heroTagline: string
}

const DEFAULT_HERO_IMAGE = "/images/placeholder.jpg"

export default function CatalogPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        if (!response.ok) throw new Error('Failed to fetch settings')
        const data = await response.json()
        setSettings(data)
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }

    fetchSettings()
  }, [])

  const filteredProducts = products.filter(
    (product) => selectedCategory === "all" || product.category === selectedCategory
  )

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return (a.price as number) - (b.price as number)
    if (sortBy === "price-desc") return (b.price as number) - (a.price as number)
    if (sortBy === "name") return a.name.localeCompare(b.name)
    return 0
  })

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Home Button */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          className="border-orange-500/30 bg-black/20 backdrop-blur-sm hover:bg-black/40 hover:border-orange-500/50 transition-all duration-300"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Home
        </Button>
      </div>

      {/* Hero Section */}
      <div className="relative h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10"></div>
        <Image
          src={settings?.heroImage ?? DEFAULT_HERO_IMAGE}
          alt="Catalog header"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="relative z-20 container h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-7xl font-bold mb-4">
            <span className="text-orange-500 font-extrabold tracking-wider">PRODUCT</span>
            <span className="font-light tracking-widest ml-2">CATALOG</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 max-w-2xl font-light tracking-wide">
            Browse our comprehensive range of high-performance parts and fabrication supplies
          </p>
        </div>
      </div>

      <div className="container px-4 py-8">
        <div className="lg:grid lg:grid-cols-5 lg:gap-8">
          {/* Mobile Filters Toggle */}
          <div className="lg:hidden mb-4">
            <Button 
              variant="outline" 
              className="w-full border-orange-500/30 hover:bg-orange-500/10"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showMobileFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {/* Categories Sidebar */}
          <div className={`lg:col-span-1 ${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="sticky top-20 bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Categories</h2>
              <div className="flex flex-col gap-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("all")}
                  className={`justify-start ${
                    selectedCategory === "all" 
                      ? "bg-orange-600 hover:bg-orange-700" 
                      : "border-orange-500/30 hover:bg-orange-500/10"
                  }`}
                >
                  All Products
                </Button>
                {productCategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className={`justify-start ${
                      selectedCategory === category 
                        ? "bg-orange-600 hover:bg-orange-700" 
                        : "border-orange-500/30 hover:bg-orange-500/10"
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-4">
            {/* Sort Controls */}
            <div className="flex justify-end mb-6">
              <div className="w-[200px]">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                    <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products */}
            <ProductGrid products={sortedProducts} />
          </div>
        </div>
      </div>
    </div>
  )
} 