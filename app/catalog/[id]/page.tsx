"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Minus, Plus, ShoppingCart, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Product } from "@/types"

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<number>(0)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (!response.ok) {
          throw new Error('Product not found')
        }
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => router.push("/catalog")} variant="outline" className="border-orange-500/30 hover:bg-orange-500/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Catalog
          </Button>
        </div>
      </div>
    )
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta))
  }

  const currentVariant = product.variants?.[selectedVariant]
  const price = currentVariant?.price || product.price
  const compareAtPrice = currentVariant?.compareAtPrice || product.originalPrice

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          className="mb-8 border-orange-500/30 hover:bg-orange-500/10"
          onClick={() => router.push("/catalog")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Catalog
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800">
              {product.images && product.images.length > 0 && (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={image}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-md border border-zinc-800",
                      selectedImage === index ? "ring-2 ring-orange-500" : "hover:border-orange-500/50"
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
              <div className="flex items-center gap-2 text-sm text-orange-400 font-medium mb-2">
                {product.category.split(' > ').map((cat, index, array) => (
                  <div key={cat} className="flex items-center">
                    <span>{cat}</span>
                    {index < array.length - 1 && <ChevronRight className="h-4 w-4 mx-1" />}
                  </div>
                ))}
              </div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-semibold text-orange-400">
                  ${price.toFixed(2)}
                </p>
                {compareAtPrice && compareAtPrice > price && (
                  <p className="text-lg text-zinc-500 line-through">
                    ${compareAtPrice.toFixed(2)}
                  </p>
                )}
              </div>
              <div className="mt-2 text-sm text-zinc-400">
                or 4 interest-free payments of ${(price / 4).toFixed(2)} with
                <span className="font-semibold ml-1">Afterpay</span>
              </div>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Options</h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.variants.map((variant, index) => (
                    <button
                      key={variant.sku || index}
                      onClick={() => setSelectedVariant(index)}
                      className={cn(
                        "px-4 py-2 rounded-lg border text-sm",
                        selectedVariant === index
                          ? "border-orange-500 bg-orange-500/10 text-orange-400"
                          : "border-zinc-800 hover:border-orange-500/30"
                      )}
                    >
                      {variant.option1}
                      {variant.option2 && ` - ${variant.option2}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Quantity</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="border-orange-500/30 hover:bg-orange-500/10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    className="border-orange-500/30 hover:bg-orange-500/10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-orange-500/30 hover:bg-orange-500/10"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button 
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Buy Now
                </Button>
              </div>
            </div>

            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h2 className="text-xl font-semibold mb-4">Product Description</h2>
              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            </Card>

            {/* Specifications */}
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h2 className="text-xl font-semibold mb-4">Specifications</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between py-2 border-b border-zinc-800">
                  <span className="text-zinc-400">Category</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                {currentVariant && (
                  <>
                    <div className="flex justify-between py-2 border-b border-zinc-800">
                      <span className="text-zinc-400">SKU</span>
                      <span className="font-medium">{currentVariant.sku}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-zinc-800">
                      <span className="text-zinc-400">Stock</span>
                      <span className="font-medium">{currentVariant.inventory} units</span>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 