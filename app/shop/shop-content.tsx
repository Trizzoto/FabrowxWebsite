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

interface ShopContentProps {
  initialData: {
    products: Product[]
    categories: string[]
    settings: any
  }
}

export function ShopContent({ initialData }: ShopContentProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [products] = useState<Product[]>(initialData.products)
  const [settings] = useState<any>(initialData.settings)
  const [categoryTree, setCategoryTree] = useState<Map<string, CategoryLevel>>(() => {
    const tree = buildCategoryTree(initialData.categories)
    tree.forEach((category, categoryName) => {
      category.count = initialData.products.filter((p: Product) => p.category === categoryName).length
    })
    return tree
  })
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [isContentVisible, setIsContentVisible] = useState(false)
  const [visibleProducts, setVisibleProducts] = useState<{ [key: string]: Product[] }>({})
  const [page, setPage] = useState<{ [key: string]: number }>({})
  const [hasMore, setHasMore] = useState<{ [key: string]: boolean }>({})
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const searchParams = useSearchParams()
  const scrollPositionRef = useRef<number | null>(null)

  const ITEMS_PER_PAGE = 50

  // Store scroll position before navigation
  const handleProductClick = (productId: string) => {
    scrollPositionRef.current = window.scrollY
    router.push(`/shop/${productId}?scrollY=${window.scrollY}`)
  }

  // Handle initial load and scroll restoration
  useEffect(() => {
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
  }, [searchParams])

  // Initialize visible products for each category
  useEffect(() => {
    if (categoryTree.size === 0) return

    const initialVisibleProducts: { [key: string]: Product[] } = {}
    const initialPage: { [key: string]: number } = {}
    const initialHasMore: { [key: string]: boolean } = {}

    categoryTree.forEach((_, categoryName) => {
      const categoryProducts = getFilteredProductsByCategory(categoryName)
      initialVisibleProducts[categoryName] = categoryProducts.slice(0, ITEMS_PER_PAGE)
      initialPage[categoryName] = 1
      initialHasMore[categoryName] = categoryProducts.length > ITEMS_PER_PAGE
    })

    setVisibleProducts(initialVisibleProducts)
    setPage(initialPage)
    setHasMore(initialHasMore)
  }, [categoryTree, searchQuery])

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const categoryName = entry.target.getAttribute('data-category')
            if (categoryName && hasMore[categoryName]) {
              loadMoreProducts(categoryName)
            }
          }
        })
      },
      {
        rootMargin: '100px',
        threshold: 0.1
      }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [hasMore, visibleProducts])

  const loadMoreProducts = (categoryName: string) => {
    const categoryProducts = getFilteredProductsByCategory(categoryName)
    const currentPage = page[categoryName]
    const startIndex = currentPage * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const newProducts = categoryProducts.slice(startIndex, endIndex)

    setVisibleProducts(prev => ({
      ...prev,
      [categoryName]: [...prev[categoryName], ...newProducts]
    }))

    setPage(prev => ({
      ...prev,
      [categoryName]: currentPage + 1
    }))

    setHasMore(prev => ({
      ...prev,
      [categoryName]: endIndex < categoryProducts.length
    }))
  }

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

  return (
    <div className={cn(
      "min-h-screen bg-black text-white transition-opacity duration-300",
      isContentVisible ? "opacity-100" : "opacity-0"
    )}>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={settings?.heroImage ?? DEFAULT_HERO_IMAGE}
            alt="Elite FabWorx Shop"
            fill
            className="object-cover object-center opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
        </div>
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our <span className="text-orange-500">Products</span>
            </h1>
            <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
              Browse our comprehensive range of parts and supplies for your performance vehicle needs.
            </p>
          </div>
        </div>
      </section>

      <div className="container px-4 py-8">
        <div className="lg:grid lg:grid-cols-5 lg:gap-8">
          {/* Mobile Categories Bottom Sheet */}
          <div className={`
            lg:hidden fixed inset-x-0 bottom-0 z-[10000] bg-black/95 backdrop-blur-sm transition-all duration-300
            ${showMobileFilters ? 'translate-y-0 h-[85vh]' : 'translate-y-full h-0'}
            rounded-t-3xl overflow-hidden
          `}>
            {/* Drag Handle */}
            <div className="sticky top-0 w-full bg-black/90 backdrop-blur-md px-4 pt-3 pb-2">
              <div className="w-12 h-1 bg-zinc-600 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Categories</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-zinc-400 hover:text-white"
                  onClick={() => setShowMobileFilters(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="h-full overflow-y-auto p-4 pt-2">
              {/* Search Bar in Mobile Menu */}
              <div className="sticky top-0 pb-4">
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                {Array.from(categoryTree.entries()).map(([categoryName, category]) => (
                  <div 
                    key={categoryName}
                    className={`
                      px-4 py-3 
                      rounded-xl
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

          {/* Mobile Search Toggle Button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden fixed bottom-6 right-6 z-[9999] bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
          >
            <Filter className="w-5 h-5" />
          </button>

          {/* Desktop Categories Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="
              sticky 
              top-20 
              max-h-[calc(100vh-6rem)] 
              overflow-hidden 
              flex 
              flex-col 
              bg-zinc-900/50 
              backdrop-blur-sm 
              rounded-lg 
              border
              border-zinc-800 
              p-4
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
            {/* Search Bar - Desktop */}
            <div className="hidden lg:block mb-6 sticky top-0 z-[998] bg-black/80 backdrop-blur-sm py-4">
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
                const categoryProducts = visibleProducts[categoryName] || []
                if (categoryProducts.length === 0) return null

                return (
                  <div 
                    key={categoryName}
                    id={categoryName}
                    ref={(el) => { categoryRefs.current[categoryName] = el }}
                    className="scroll-mt-40 lg:scroll-mt-24"
                  >
                    <h2 className="text-2xl font-bold mb-6 text-orange-400">{category.name}</h2>
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:grid-cols-4">
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
                            <CardContent className="p-2 sm:p-4">
                              <div className="mb-1 sm:mb-2">
                                <span className="text-[10px] sm:text-xs text-orange-400 font-medium block mb-0.5 sm:mb-1">
                                  {product.category}
                                </span>
                                <h3 className="font-semibold text-sm sm:text-lg line-clamp-2 group-hover:text-orange-400 transition-colors">
                                  {product.name}
                                </h3>
                              </div>
                              <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 mb-2 sm:mb-4">
                                {product.description}
                              </p>
                              <div className="mt-auto text-right">
                                <p className="text-base md:text-xl font-bold text-orange-400">
                                  ${(() => {
                                    // Ensure we have a valid number
                                    let price = typeof product.price === 'number' ? product.price : Number(product.price);
                                    if (isNaN(price)) return '0';
                                    
                                    // Use parseFloat to normalize the number and remove any extra precision issues
                                    price = parseFloat(price.toString());
                                    
                                    // Format the price: no decimals for whole numbers, up to 2 decimals otherwise
                                    if (price % 1 === 0) {
                                      return Math.round(price).toString();
                                    } else {
                                      // Round to 2 decimal places and remove trailing zeros
                                      return price.toFixed(2).replace(/\.?0+$/, '');
                                    }
                                  })()}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </button>
                      ))}
                    </div>
                    {hasMore[categoryName] && (
                      <div 
                        ref={loadMoreRef}
                        data-category={categoryName}
                        className="h-20 flex items-center justify-center"
                      >
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                      </div>
                    )}
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