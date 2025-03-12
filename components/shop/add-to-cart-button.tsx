"use client"

import { useState } from "react"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/components/ui/use-toast"

interface AddToCartButtonProps {
  product: any
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    addToCart(product, quantity)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 3000,
    })
  }

  const incrementQuantity = () => {
    if (quantity < product.stockCount) {
      setQuantity((prev) => prev + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={decrementQuantity}
          disabled={quantity <= 1}
          className="h-10 w-10 rounded-r-none"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <div className="h-10 w-12 flex items-center justify-center border-y border-zinc-700 bg-zinc-800">
          {quantity}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={incrementQuantity}
          disabled={quantity >= product.stockCount}
          className="h-10 w-10 rounded-l-none"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Button
        className="bg-blue-600 hover:bg-blue-700 w-full"
        size="lg"
        onClick={handleAddToCart}
        disabled={product.stockCount === 0}
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        {product.stockCount > 0 ? "Add to Cart" : "Out of Stock"}
      </Button>
    </div>
  )
}

