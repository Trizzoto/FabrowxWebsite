"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Show loading state while cart is initializing
  if (cart.length === 0) {
    return (
      <div className="container px-4 md:px-6 py-24 mt-16">
        <div className="max-w-md mx-auto text-center py-12">
          <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-zinc-400" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-zinc-400 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Button asChild>
            <Link href="/shop">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-24 mt-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        Your <span className="text-blue-500">Cart</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="hidden md:grid grid-cols-5 gap-4 mb-4 text-sm font-medium text-zinc-400">
                <div className="col-span-2">Product</div>
                <div>Price</div>
                <div>Quantity</div>
                <div>Total</div>
              </div>

              <div className="divide-y divide-zinc-800">
                {cart.map((item) => (
                  <div key={item._id} className="py-4 md:grid md:grid-cols-5 md:gap-4 flex flex-col gap-4">
                    <div className="col-span-2 flex items-center gap-4">
                      <div className="w-16 h-16 relative flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-sm text-red-500 flex items-center mt-1"
                        >
                          <Trash className="h-3 w-3 mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center md:block">
                      <span className="text-sm text-zinc-400 md:hidden mr-2">Price:</span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center">
                      <span className="text-sm text-zinc-400 md:hidden mr-2">Quantity:</span>
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-r-none"
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item._id, Number.parseInt(e.target.value) || 1)}
                          className="h-8 w-12 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-l-none"
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center md:block">
                      <span className="text-sm text-zinc-400 md:hidden mr-2">Total:</span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-between">
            <Button variant="outline" onClick={() => clearCart()}>
              Clear Cart
            </Button>
            <Button asChild variant="outline">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>

        <div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4 mb-6">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
                onClick={() => router.push("/checkout")}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Proceed to Checkout"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

