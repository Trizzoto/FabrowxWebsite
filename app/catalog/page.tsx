"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronDown, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { products, productCategories } from "../data"

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const filteredProducts = products.filter(
    (product) => selectedCategory === "all" || product.category === selectedCategory
  )

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price
    if (sortBy === "price-desc") return b.price - a.price
    if (sortBy === "name") return a.name.localeCompare(b.name)
    return 0
  })

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10"></div>
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gKlIX1RnqoHi6QB745twxRV5LBhg61.png"
          alt="Catalog header"
          fill
          className="object-cover object-center"
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
            <div className="sticky top-4 bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProducts.map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-orange-500/50 transition-colors"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <span className="text-sm text-orange-400 font-medium">{product.category}</span>
                      <h3 className="font-bold text-lg mt-1 line-clamp-2 min-h-[56px]">{product.name}</h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-orange-400">${product.price.toFixed(2)}</span>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        View Details
                      </Button>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="outline" className="rounded-full border-orange-500/30 hover:bg-orange-500/10">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 