"use client"

import Link from "next/link"
import Image from "next/image"
import { Product } from "@/lib/api"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products?.length) {
    return (
      <div className="text-center py-10">
        <p className="text-zinc-400">No products found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden bg-zinc-900 border-zinc-800 hover:border-orange-600 transition-colors">
            <Link href={`/products/${product.id}`}>
              <div className="aspect-square relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-white">{product.name}</h3>
                <p className="text-zinc-400 text-sm line-clamp-2">{product.description}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <p className="font-semibold text-orange-600">
                  {typeof product.price === "number" 
                    ? `$${product.price.toFixed(2)}`
                    : product.price
                  }
                </p>
                <Button 
                  variant="outline"
                  className="border-zinc-700 hover:bg-orange-600 hover:text-white hover:border-orange-600"
                >
                  View Details
                </Button>
              </CardFooter>
            </Link>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

