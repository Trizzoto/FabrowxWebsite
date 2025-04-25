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
  const [filteredProducts, setFilteredProducts] = useState<{
    elite: Product[],
    zoo: Product[]
  }>(() => {
    return {
      elite: initialData.products.filter(p => p.brand === "Elite Fabworx"),
      zoo: initialData.products.filter(p => p.brand !== "Elite Fabworx")
    }
  })
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

  // Filter products by search query
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredProducts({
        elite: products.filter(p => p.brand === "Elite Fabworx"),
        zoo: products.filter(p => p.brand !== "Elite Fabworx")
      })
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      )
      setFilteredProducts({
        elite: filtered.filter(p => p.brand === "Elite Fabworx"),
        zoo: filtered.filter(p => p.brand !== "Elite Fabworx")
      })
    }
  }, [searchQuery, products])

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
    return products
      .filter(product => {
      const matchesCategory = product.category === category
      const matchesSearch = searchQuery === "" || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
      .sort((a, b) => {
        // Sort Elite Fabworx products to the top
        if (a.brand === "Elite Fabworx" && b.brand !== "Elite Fabworx") return -1
        if (a.brand !== "Elite Fabworx" && b.brand === "Elite Fabworx") return 1
        return 0
      })
  }

  // Get unique categories for each brand
  const eliteCategories = Array.from(new Set(filteredProducts.elite.map(p => p.category)))
  const zooCategories = Array.from(new Set(filteredProducts.zoo.map(p => p.category)))

  const setRef = (brand: string, category: string) => (el: HTMLDivElement | null) => {
    if (el) {
      categoryRefs.current[`${brand}-${category}`] = el
    }
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
            <div className="sticky top-0 w-full bg-black/90 backdrop-blur-md px-4 pt-3 pb-2 z-10">
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
              <div className="sticky top-0 pb-4 z-10 bg-black/95 pt-2">
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm"
                />
              </div>
              
              {/* Elite Fabworx Engineered Section */}
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-full mb-1">
                  <h3 className="text-lg font-bold tracking-wide">
                    <span className="text-orange-500">ELITE</span> <span className="text-white">FABWORX</span> <span className="text-orange-500">ENGINEERED</span>
                  </h3>
                </div>
                <div className="w-full h-0.5 bg-zinc-800 my-2"></div>
                <div className="text-zinc-400 text-xs text-center italic mb-4">
                  Elite Fabworx categories coming soon
                </div>
              </div>

              {/* Zoo Performance Logo in Mobile Categories */}
              <div className="mb-4">
                <div className="w-full max-w-[140px] mx-auto mb-2">
                  <Image 
                    src="/Zoo-logo.png" 
                    alt="Zoo Performance" 
                    width={140} 
                    height={70} 
                    className="w-full h-auto"
                  />
                </div>
                <div className="w-full h-0.5 bg-zinc-800 my-2"></div>
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
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-hidden flex flex-col bg-zinc-900/50 backdrop-blur-sm rounded-lg border border-zinc-800 p-4">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-orange-400 mb-2 text-center">Categories</h2>
              </div>
              
              <div className="relative overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-orange-500/20 scrollbar-track-zinc-800/10 flex-1">
                {/* Elite Fabworx Section */}
                <div className="flex flex-col items-center mb-4">
                  <div className="inline-flex items-center justify-center">
                    <h3 className="text-lg font-bold tracking-wide mb-1">
                      <span className="text-orange-500">ELITE</span> <span className="text-white">FABWORX</span> <span className="text-orange-500">ENGINEERED</span>
                    </h3>
                  </div>
                  <div className="w-full h-0.5 bg-zinc-800 mt-2"></div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {eliteCategories.map((category) => (
                    <div 
                      key={`elite-${category}`}
                    className={`
                      px-4 py-3 
                      rounded-lg 
                      cursor-pointer 
                        ${activeCategory === `elite-${category}` ? 'bg-orange-500/20 text-orange-400 font-medium' : 'text-white hover:bg-zinc-800/50'} 
                      transition-colors
                      border border-zinc-800/50 hover:border-orange-500/30
                      flex items-center justify-between
                    `}
                      onClick={() => handleCategoryClick(`elite-${category}`)}
                    >
                      <span className="select-none">{category}</span>
                      <span className="text-sm text-zinc-500">
                        {filteredProducts.elite.filter(p => p.category === category).length}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Zoo Performance Section */}
                <div className="flex flex-col items-center mb-4">
                  <div className="w-full max-w-[160px] mb-2">
                    <Image 
                      src="/Zoo-logo.png" 
                      alt="Zoo Performance" 
                      width={160} 
                      height={80} 
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="w-full h-0.5 bg-zinc-800 mt-1"></div>
                </div>
                
                <div className="space-y-3">
                  {zooCategories.map((category) => (
                    <div 
                      key={`zoo-${category}`}
                      className={`
                        px-4 py-3 
                        rounded-lg 
                        cursor-pointer 
                        ${activeCategory === `zoo-${category}` ? 'bg-orange-500/20 text-orange-400 font-medium' : 'text-white hover:bg-zinc-800/50'} 
                        transition-colors
                        border border-zinc-800/50 hover:border-orange-500/30
                        flex items-center justify-between
                      `}
                      onClick={() => handleCategoryClick(`zoo-${category}`)}
                    >
                      <span className="select-none">{category}</span>
                      <span className="text-sm text-zinc-500">
                        {filteredProducts.zoo.filter(p => p.category === category).length}
                      </span>
                  </div>
                ))}
                </div>
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

            {/* Elite Fabworx Products */}
            {eliteCategories.length > 0 && (
              <div className="mb-16">
                <div className="border-b border-zinc-800 pb-4 mb-8 text-center">
                  <div className="inline-flex items-center justify-center mb-4">
                    <h2 className="text-4xl font-bold tracking-wide">
                      <span className="text-orange-500">ELITE</span> <span className="text-white">FABWORX</span> <span className="text-orange-500">ENGINEERED</span>
                    </h2>
                  </div>
                  <p className="text-zinc-400 max-w-2xl mx-auto">
                    Quality in-house fabricated products designed and built by our team.
                  </p>
                </div>

                {eliteCategories.map((category) => (
                  <div key={`elite-${category}`} id={`elite-${category}`} ref={setRef('elite', category)} className="mb-16">
                    <h3 className="text-2xl font-bold mb-6">{category}</h3>
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-6 lg:grid-cols-4">
                      {filteredProducts.elite
                        .filter(p => p.category === category)
                        .map((product) => (
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
                                    {product.brand || "Zoo Performance"}
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
                                    
                                      // Format the price properly
                                    if (price % 1 === 0) {
                                      return Math.round(price).toString();
                                    } else {
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
                  </div>
                ))}
              </div>
            )}

            {/* Zoo Performance Products */}
            {zooCategories.length > 0 && (
              <div className="mt-24 mb-16">
                <div className="relative flex flex-col items-center justify-center mb-10">
                  <div className="mb-6 w-full max-w-[300px]">
                    <Image 
                      src="/Zoo-logo.png" 
                      alt="Zoo Performance" 
                      width={300} 
                      height={150} 
                      className="w-full h-auto"
                    />
                  </div>
                  <p className="text-zinc-400 text-center max-w-2xl mb-8">
                    High-quality performance products from Zoo Performance, a trusted brand in the automotive industry.
                  </p>
                </div>

                {zooCategories.map((category) => (
                  <div key={`zoo-${category}`} id={`zoo-${category}`} ref={setRef('zoo', category)} className="mb-16">
                    <h3 className="text-2xl font-bold mb-6">{category}</h3>
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-6 lg:grid-cols-4">
                      {filteredProducts.zoo
                        .filter(p => p.category === category)
                        .map((product) => (
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
                                    {product.brand || "Zoo Performance"}
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
                                      
                                      // Format the price properly
                                      if (price % 1 === 0) {
                                        return Math.round(price).toString();
                                      } else {
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
                  </div>
                ))}
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 