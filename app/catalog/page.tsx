"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Filter, ChevronRight } from "lucide-react"
import { Product } from "@/types"
import { buildCategoryTree, CategoryLevel } from "@/lib/categories"

const DEFAULT_HERO_IMAGE = "/hero-catalog.jpg"

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [categoryTree, setCategoryTree] = useState<Map<string, CategoryLevel>>(new Map())
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const observerRef = useRef<IntersectionObserver | null>(null)

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

  // Set up intersection observer for category sections
  useEffect(() => {
    if (typeof window === 'undefined') return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0px -60% 0px'
      }
    )

    // Observe all category sections
    Object.values(categoryRefs.current).forEach((ref) => {
      if (ref && observerRef.current) {
        observerRef.current.observe(ref)
      }
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [categoryTree])

  const handleCategoryClick = (categoryName: string) => {
    const element = categoryRefs.current[categoryName]
    if (element && typeof window !== 'undefined') {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const getFilteredProductsByCategory = (category: string) => {
    return products.filter(product => {
      const matchesCategory = product.category === category
      const matchesSearch = searchQuery === "" || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
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
      <div className="fixed top-4 left-4 z-[10000] pointer-events-auto">
        <Link href="/" className="pointer-events-auto">
          <Button
            variant="outline"
            className="border-orange-600/50 bg-black/40 backdrop-blur-sm hover:bg-black/60 hover:border-orange-600/70 transition-all duration-300 text-orange-300 focus-visible:ring-orange-600"
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-700 hover:bg-orange-800 text-white px-6 py-3 h-auto text-base focus-visible:ring-orange-600">
              <Link href="/services" className="flex items-center">
                Our Services
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-orange-600 text-orange-300 hover:bg-orange-950/50 px-6 py-3 h-auto text-base focus-visible:ring-orange-600">
              <Link href="/catalog" className="flex items-center">
                View Catalogue
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8">
        <div className="lg:grid lg:grid-cols-5 lg:gap-8">
          {/* Mobile Filters Toggle */}
          <div className="lg:hidden mb-4">
            <Button 
              variant="outline" 
              className="w-full border-orange-600/50 hover:bg-orange-700/20 text-orange-300 focus-visible:ring-orange-600"
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
                {Array.from(categoryTree.entries()).map(([categoryName, category]) => (
                  <div 
                    key={categoryName}
                    className={`
                      px-4 py-2 
                      rounded-lg 
                      cursor-pointer 
                      ${activeCategory === categoryName ? 'bg-orange-500/20 text-orange-400 font-medium' : 'text-white hover:bg-zinc-800/50'} 
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

            {/* Products by Category */}
            <div className="space-y-12">
              {Array.from(categoryTree.entries()).map(([categoryName, category]) => {
                const categoryProducts = getFilteredProductsByCategory(categoryName)
                if (categoryProducts.length === 0) return null

                return (
                  <div 
                    key={categoryName}
                    id={categoryName}
                    ref={(el) => { categoryRefs.current[categoryName] = el }}
                    className="scroll-mt-24"
                  >
                    <h2 className="text-2xl font-bold mb-6 text-orange-400">{category.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryProducts.map((product) => (
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
                              <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
                                {product.description}
                              </p>
                              <div className="flex items-baseline justify-between">
                                <div className="text-lg font-semibold">
                                  ${typeof product.price === 'number' 
                                    ? product.price.toFixed(2) 
                                    : (Number(product.price) || 0).toFixed(2)
                                  }
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 