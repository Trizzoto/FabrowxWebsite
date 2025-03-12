"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Search } from "lucide-react"

export default function TrackOrderPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [orderId, setOrderId] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!orderId.trim()) {
      toast({
        title: "Order ID required",
        description: "Please enter your order ID to track your order.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/orders/${orderId}/track`)

      if (!response.ok) {
        throw new Error("Order not found")
      }

      router.push(`/track-order/${orderId}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Order not found. Please check your order ID and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container px-4 md:px-6 py-24 mt-16">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Track Your <span className="text-blue-500">Order</span>
        </h1>
        <p className="text-zinc-400 text-center mb-8">Enter your order ID to track the status of your order.</p>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Order Tracking</CardTitle>
            <CardDescription>You can find your order ID in your order confirmation email.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="orderId" className="text-sm font-medium">
                  Order ID
                </label>
                <div className="relative">
                  <Input
                    id="orderId"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="Enter your order ID"
                    className="bg-zinc-800 border-zinc-700 pl-10"
                    required
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  "Track Order"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

