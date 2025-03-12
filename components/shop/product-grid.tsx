"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/components/ui/use-toast"

interface Product {
  _id: string
  name: string
  slug: string
  price: number
  images: string[]
  category: string
}

export default function ProductGrid({ products }: { products: Product[] }) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 3000,
    })
  }

  return (
    <div>
      {products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No products found</h3>
          <p className="text-zinc-400">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="group"
              onMouseEnter={() => setHoveredProduct(product._id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                <div className="h-48 relative">
                  <Link href={`/shop/${product.slug}`}>
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </Link>
                  {hoveredProduct === product._id && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button onClick={() => handleAddToCart(product)} className="bg-blue-600 hover:bg-blue-700">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <Link href={`/shop/${product.slug}`}>
                    <h3 className="font-bold mb-1 hover:text-blue-400 transition-colors">{product.name}</h3>
                  </Link>
                  <p className="text-zinc-500 text-sm mb-2">{product.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-400 font-semibold">${product.price.toFixed(2)}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-zinc-400 hover:text-white hover:bg-blue-600"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

