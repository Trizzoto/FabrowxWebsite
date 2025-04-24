"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/components/ui/use-toast"

interface RelatedProductsProps {
  products: any[]
  currentProductId: string
}

export default function RelatedProducts({ products, currentProductId }: RelatedProductsProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()

  const filteredProducts = products.filter((product) => product._id !== currentProductId)

  if (filteredProducts.length === 0) {
    return null
  }

  const handleAddToCart = (product: any) => {
    addToCart(product, 1)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 3000,
    })
  }

  return (
    <div className="mt-20">
      <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
              <div className="h-48 relative">
                <Link href={`/shop/${product._id}`}>
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </Link>
              </div>
              <div className="p-4">
                <Link href={`/shop/${product._id}`}>
                  <h3 className="font-bold mb-1 hover:text-orange-400 transition-colors">{product.name}</h3>
                </Link>
                <p className="text-zinc-500 text-sm mb-2">{product.category}</p>
                <div className="flex justify-between items-center">
                  <span className="text-orange-400 font-semibold">${(() => {
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
                  })()}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-zinc-400 hover:text-white hover:bg-orange-600"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stockCount === 0}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

