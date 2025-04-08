"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Product as ApiProduct } from "@/lib/api"

// Extended product interface that includes images array
interface Product extends ApiProduct {
  // images is already defined in ApiProduct
}

interface ProductDetailProps {
  product: Product | null
  id: string
}

export function ProductDetail({ product, id }: ProductDetailProps) {
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Button onClick={() => router.push("/products")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </div>
    )
  }

  // Create an images array from the single image if needed
  const productImages = product.images || []
  
  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta))
  }

  // Convert price to number if it's a string
  const price = typeof product.price === "number" 
    ? product.price 
    : parseFloat(product.price.replace(/[^0-9.-]+/g, ""))

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-8"
        onClick={() => router.push("/products")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-zinc-900">
            {productImages.length > 0 && (
              <Image
                src={productImages[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            )}
          </div>
          
          {/* Thumbnails */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-md",
                    selectedImage === index && "ring-2 ring-orange-500"
                  )}
                >
                  <Image
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl font-semibold text-orange-500">
              ${price.toFixed(2)}
            </p>
            <div className="mt-2 text-sm text-zinc-400">
              or 4 interest-free payments of ${(price / 4).toFixed(2)} with
              <span className="font-semibold ml-1">Afterpay</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Quantity</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button size="lg" variant="outline" className="border-orange-500 text-orange-400 hover:bg-orange-950/50">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white">
                Buy Now
              </Button>
            </div>
          </div>

          <Card className="bg-zinc-900 p-6 border-zinc-800">
            <h2 className="text-xl font-semibold mb-4">Product Description</h2>
            <p className="text-zinc-300 whitespace-pre-wrap">{product.description}</p>
          </Card>

          {/* Specifications */}
          <Card className="bg-zinc-900 p-6 border-zinc-800">
            <h2 className="text-xl font-semibold mb-4">Specifications</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-400">Category</span>
                <span className="font-medium">{product.category}</span>
              </div>
              {/* Add more specifications as needed */}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 