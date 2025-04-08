"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Filter, ChevronRight } from "lucide-react"
import { Product } from "@/types"
import { buildCategoryTree, renderCategoryLevel, CategoryLevel } from "@/lib/categories"

const DEFAULT_HERO_IMAGE = "/hero-catalog.jpg"

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [categoryTree, setCategoryTree] = useState<Map<string, CategoryLevel>>(new Map())
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse, settingsResponse] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
          fetch('/api/settings')
        ])
        
        if (!productsResponse.ok || !categoriesResponse.ok || !settingsResponse.ok) {
          throw new Error('Failed to fetch data')
        }

        const productsData = await productsResponse.json()
        const categoriesData = await categoriesResponse.json() as string[]
        const settingsData = await settingsResponse.json()
        
        setProducts(productsData)
        setFilteredProducts(productsData)
        setSettings(settingsData)
        
        // Build category tree with counts
        const tree = buildCategoryTree(categoriesData)
        // Add counts to categories
        tree.forEach((category, categoryName) => {
          category.count = productsData.filter((p: Product) => p.category === categoryName).length
        })
        setCategoryTree(tree)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter products whenever filters change
  useEffect(() => {
    let filtered = [...products]

    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      )
    }

    setFilteredProducts(filtered)
  }, [selectedCategory, searchQuery, products])

  const handleCategoryClick = (categoryPath: string) => {
    setSelectedCategory(categoryPath)
    // Expand the clicked category to show its contents
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      newSet.add(categoryPath)
      return newSet
    })
  }

  const toggleCategory = (categoryPath: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryPath)) {
        newSet.delete(categoryPath)
      } else {
        newSet.add(categoryPath)
      }
      return newSet
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Home Button */}
      <div className="fixed top-4 left-4 z-50">
        <Link href="/">
          <Button
            variant="outline"
            className="border-orange-500/30 bg-black/20 backdrop-blur-sm hover:bg-black/40 hover:border-orange-500/50 transition-all duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Home
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10"></div>
        <Image
          src={settings?.heroImage ?? DEFAULT_HERO_IMAGE}
          alt="Catalog header"
          fill
          sizes="100vw"
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
          <div className={`lg:col-span-1 ${showMobileFilters ? 'block' : 'hidden'} lg:block relative z-[9999]`}>
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-hidden flex flex-col bg-zinc-900/50 backdrop-blur-sm rounded-lg border border-zinc-800 p-4">
              <h2 className="text-xl font-semibold mb-4 text-orange-400">Categories</h2>
              <div className="relative group space-y-2 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-orange-500/20 scrollbar-track-zinc-800/10">
                <div 
                  className={`
                    px-4 py-2 
                    rounded-lg 
                    cursor-pointer 
                    ${selectedCategory === "all" ? 'bg-orange-500/20 text-orange-400 font-medium' : 'text-white hover:bg-zinc-800/50'} 
                    transition-colors
                    border border-zinc-800/50 hover:border-orange-500/30
                    flex items-center justify-between
                  `}
                  onClick={() => handleCategoryClick("all")}
                >
                  <span>All Products</span>
                  <span className="text-sm text-zinc-500">{products.length}</span>
                </div>
                {Array.from(categoryTree.entries()).map(([categoryName, category]) => (
                  <div 
                    key={categoryName}
                    className={`
                      px-4 py-2 
                      rounded-lg 
                      cursor-pointer 
                      ${selectedCategory === categoryName ? 'bg-orange-500/20 text-orange-400 font-medium' : 'text-white hover:bg-zinc-800/50'} 
                      transition-colors
                      border border-zinc-800/50 hover:border-orange-500/30
                      flex items-center justify-between
                    `}
                    onClick={() => handleCategoryClick(categoryName)}
                  >
                    <span className="select-none">{category.name}</span>
                    <span className="text-sm text-zinc-500">{category.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-4 relative z-[1]">
            {/* Search Bar */}
            <div className="mb-6">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm"
              />
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link key={product.id} href={`/catalog/${product.id}`} className="group">
                    <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm overflow-hidden hover:border-orange-500/50 transition-colors h-full">
                      <div className="aspect-square relative bg-zinc-800">
                        {product.images && product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                            quality={75}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                            No Image
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <CardContent className="p-4">
                        <div className="mb-2">
                          <span className="text-xs text-orange-400 font-medium block mb-1">
                            {product.category}
                          </span>
                          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-orange-400 transition-colors">
                            {product.name}
                          </h3>
                        </div>
                        <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-orange-500 font-semibold text-lg">
                            ${product.price.toFixed(2)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-zinc-500 line-through">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-zinc-900/50 backdrop-blur-sm rounded-lg border border-zinc-800">
                <p className="text-zinc-400">No products found matching your criteria.</p>
                <p className="text-zinc-500 text-sm mt-1">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 