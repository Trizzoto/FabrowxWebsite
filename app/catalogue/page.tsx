"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Filter, ChevronRight, Menu, X } from "lucide-react"
import { Product } from "@/types"
import { buildCategoryTree, CategoryLevel } from "@/lib/categories"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

const DEFAULT_HERO_IMAGE = "/hero-catalogue.jpg"

export default function CataloguePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [categoryTree, setCategoryTree] = useState<Map<string, CategoryLevel>>(new Map())
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isContentVisible, setIsContentVisible] = useState(false)
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const observerRef = useRef<IntersectionObserver | null>(null)
  const searchParams = useSearchParams()
  const scrollPositionRef = useRef<number | null>(null)

  // Store scroll position before navigation
  const handleProductClick = (productId: string) => {
    scrollPositionRef.current = window.scrollY
    router.push(`/catalogue/${productId}?scrollY=${window.scrollY}`)
  }

  // Handle initial load and scroll restoration
  useEffect(() => {
    if (!isLoading) {
      const scrollPosition = searchParams.get('scrollY')
      if (scrollPosition) {
        window.scrollTo(0, 0) // Ensure we're at the top before showing content
        setIsContentVisible(false) // Hide content initially
        
        const timer = setTimeout(() => {
          setIsContentVisible(true) // Show content
          window.scrollTo({
            top: parseInt(scrollPosition),
            behavior: 'smooth' // Use smooth scrolling for better UX
          })
        }, 100)
        
        return () => clearTimeout(timer)
      } else {
        setIsContentVisible(true) // If no scroll position, show content immediately
      }
    }
  }, [searchParams, isLoading])

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
    <div className={cn(
      "min-h-screen bg-black text-white transition-opacity duration-300",
      isContentVisible ? "opacity-100" : "opacity-0"
    )}>
      {/* Hero Section */}
      <div className="relative h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10"></div>
        <Image
          src={settings?.heroImage ?? DEFAULT_HERO_IMAGE}
          alt="Catalogue header"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="relative z-20 container h-full flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-2 sm:mb-4">
            <span className="text-orange-500 font-extrabold tracking-wider block sm:inline">PRODUCT</span>
            <span className="font-light tracking-widest block sm:inline sm:ml-2">CATALOGUE</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-zinc-300 max-w-2xl font-light tracking-wide px-4">
            Browse our comprehensive range of parts and supplies
          </p>
        </div>
      </div>

      <div className="container px-4 py-8">
        <div className="lg:grid lg:grid-cols-5 lg:gap-8">
          {/* Top Navigation Bar - Mobile */}
          <div className="lg:hidden fixed top-4 left-4 right-4 z-[10001] flex items-center gap-3">
            <Button
              variant="outline"
              className="border-orange-600/50 bg-black/40 backdrop-blur-sm hover:bg-black/60 hover:border-orange-600/70 transition-all duration-300 text-orange-300 focus-visible:ring-orange-600 shrink-0"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Home
            </Button>

            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/40 backdrop-blur-sm border-orange-600/50 hover:border-orange-600/70 focus-visible:ring-orange-600 text-orange-300 placeholder:text-orange-300/50 flex-1"
            />

            <Button 
              variant="outline" 
              className="border-orange-600/50 bg-black/40 backdrop-blur-sm hover:bg-black/60 hover:border-orange-600/70 transition-all duration-300 text-orange-300 focus-visible:ring-orange-600 w-12 h-12 p-0 shrink-0"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* Categories Sidebar */}
          <div 
            className={`
              lg:col-span-1 
              ${showMobileFilters ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'} 
              lg:translate-x-0
              lg:pointer-events-auto
              lg:block 
              fixed 
              lg:relative 
              inset-y-0 
              right-0
              w-[250px]
              lg:w-auto
              lg:inset-auto 
              z-[9999] 
              lg:z-auto
              bg-black/90 backdrop-blur-md
              lg:bg-transparent
              transition-all duration-300 ease-in-out
            `}
          >
            <div className="
              lg:sticky 
              lg:top-20 
              h-full
              lg:h-auto
              max-h-screen
              lg:max-h-[calc(100vh-6rem)] 
              overflow-hidden 
              flex 
              flex-col 
              bg-zinc-900/50 
              backdrop-blur-sm 
              rounded-lg 
              border-l
              lg:border
              border-zinc-800 
              p-4
              lg:mx-0
              mt-20
              lg:mt-0
              transition-transform duration-300 ease-in-out
            ">
              <div className="flex items-center mb-6">
                <h2 className="text-xl font-semibold text-orange-400">Categories</h2>
              </div>
              <div className="relative group space-y-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-orange-500/20 scrollbar-track-zinc-800/10">
                {Array.from(categoryTree.entries()).map(([categoryName, category]) => (
                  <div 
                    key={categoryName}
                    className={`
                      px-4 py-3 
                      rounded-lg 
                      cursor-pointer 
                      ${activeCategory === categoryName ? 'bg-orange-500/20 text-orange-400 font-medium' : 'text-white hover:bg-zinc-800/50'} 
                      transition-colors
                      border border-zinc-800/50 hover:border-orange-500/30
                      flex items-center justify-between
                    `}
                    onClick={() => {
                      handleCategoryClick(categoryName);
                      setShowMobileFilters(false);
                    }}
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
            {/* Search Bar - Desktop */}
            <div className="hidden lg:block mb-6 sticky top-0 z-[998] bg-black/80 backdrop-blur-sm">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm"
              />
            </div>

            {/* Products by Category */}
            <div className="space-y-12 mt-16 lg:mt-0">
              {Array.from(categoryTree.entries()).map(([categoryName, category]) => {
                const categoryProducts = getFilteredProductsByCategory(categoryName)
                if (categoryProducts.length === 0) return null

                return (
                  <div 
                    key={categoryName}
                    id={categoryName}
                    ref={(el) => { categoryRefs.current[categoryName] = el }}
                    className="scroll-mt-40 lg:scroll-mt-24"
                  >
                    <h2 className="text-2xl font-bold mb-6 text-orange-400">{category.name}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {categoryProducts.map((product) => (
                        <button 
                          key={product.id} 
                          className="group text-left w-full"
                          onClick={() => handleProductClick(product.id)}
                        >
                          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm overflow-hidden hover:border-orange-500/50 transition-colors h-full">
                            <div className="aspect-square relative bg-zinc-800 overflow-hidden">
                              {product.images && product.images[0] ? (
                                <>
                                  <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                    quality={75}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105" />
                                </>
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                                  No Image
                                </div>
                              )}
                            </div>
                            <CardContent className="p-4">
                              <div className="mb-2">
                                <span className="text-xs text-orange-400 font-medium block mb-1">
                                  {product.category}
                                </span>
                                <h3 className="font-semibold text-base sm:text-lg line-clamp-2 group-hover:text-orange-400 transition-colors">
                                  {product.name}
                                </h3>
                              </div>
                              <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
                                {product.description}
                              </p>
                              <div className="flex items-baseline justify-between">
                                <div className="text-base sm:text-lg font-semibold">
                                  ${typeof product.price === 'number' 
                                    ? product.price.toFixed(2) 
                                    : (Number(product.price) || 0).toFixed(2)
                                  }
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </button>
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