"use client"

import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"

interface ProductGridProps {
  products: any[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/catalogue/${product.id}`}
          className="group transition-transform hover:-translate-y-1 duration-300"
        >
          <Card className="overflow-hidden border-zinc-800 bg-zinc-900 hover:border-orange-500/50 transition-all duration-300 h-full flex flex-col">
            <div className="relative aspect-square">
              <Image
                src={product.images?.[0] || "/placeholder.png"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-2 md:p-4 flex flex-col flex-1">
              <div className="mb-1 md:mb-2">
                <span className="text-xs md:text-sm text-orange-400 font-medium block mb-1">{product.category}</span>
                <h3 className="font-semibold text-sm md:text-lg line-clamp-2 group-hover:text-orange-400 transition-colors duration-300 min-h-[40px] md:min-h-[56px]">
                  {product.name}
                </h3>
              </div>
              <div className="mt-auto text-right">
                <p className="text-base md:text-xl font-bold text-orange-400">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}

