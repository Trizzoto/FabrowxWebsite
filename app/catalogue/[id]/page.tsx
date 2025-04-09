"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Minus, Plus, ShoppingCart, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Product, ProductVariant, ProductOption } from "@/types"
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (!response.ok) {
          throw new Error('Product not found')
        }
        const data = await response.json()
        setProduct(data)
        
        // Initialize selected options with first value of each option
        if (data.options) {
          const initialOptions: Record<string, string> = {}
          data.options.forEach((option: ProductOption) => {
            if (option.values.length > 0) {
              initialOptions[option.name] = option.values[0]
            }
          })
          setSelectedOptions(initialOptions)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  useEffect(() => {
    if (product?.variants && Object.keys(selectedOptions).length > 0) {
      // Find the variant that matches all selected options
      const variant = product.variants.find((v) => {
        return product.options?.every((opt, index) => {
          const optionKey = `option${index + 1}` as keyof ProductVariant
          return v[optionKey] === selectedOptions[opt.name]
        })
      })
      setSelectedVariant(variant || null)
    }
  }, [selectedOptions, product])

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta))
  }

  const handleOptionSelect = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }))
  }

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
          <Button onClick={() => router.push("/catalogue")} variant="outline" className="border-orange-500/30 hover:bg-orange-500/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Catalogue
          </Button>
        </div>
      </div>
    )
  }

  const price = selectedVariant?.price || product.price
  const compareAtPrice = selectedVariant?.compareAtPrice || product.originalPrice

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          className="mb-8 border-orange-500/30 hover:bg-orange-500/10"
          onClick={() => router.push("/catalogue")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Catalogue
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

            {/* Product Options */}
            {product.options && product.options.length > 0 && product.options.some(opt => opt.name !== 'Title' && opt.values.some(v => v !== 'Default Title')) && (
              <div className="space-y-6">
                {product.options.map((option, optionIndex) => (
                  option.name !== 'Title' && option.values.some(v => v !== 'Default Title') && (
                    <div key={option.name} className="space-y-3">
                      <h3 className="font-semibold text-lg">{option.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        {option.values.filter(value => value !== 'Default Title').map((value) => (
                          <Button
                            key={value}
                            variant={selectedOptions[option.name] === value ? "default" : "outline"}
                            className={cn(
                              selectedOptions[option.name] === value
                                ? "bg-orange-500 text-white hover:bg-orange-600"
                                : "border-orange-500/30 text-orange-300 hover:bg-orange-500/10",
                              "focus-visible:ring-orange-500"
                            )}
                            onClick={() => handleOptionSelect(option.name, value)}
                          >
                            {value}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Quantity</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-orange-500/30 text-orange-300 hover:bg-orange-500/10 focus-visible:ring-orange-500"
                  onClick={() => handleQuantityChange(-1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-orange-500/30 text-orange-300 hover:bg-orange-500/10 focus-visible:ring-orange-500"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              size="lg"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>

            {/* Product Description */}
            <div className="space-y-4 pt-6">
              <Separator className="bg-zinc-800" />
              <div className="prose prose-invert max-w-none">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <div className="text-zinc-400 space-y-4" dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 