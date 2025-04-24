import { Suspense } from "react"
import { getProducts } from "@/lib/products"
import { getSettings } from "@/lib/settings"
import { ShopContent } from "./shop-content"

async function getInitialData() {
  const [products, settings] = await Promise.all([
    getProducts(),
    getSettings()
  ])

  // Extract unique categories from products
  const categories = Array.from(new Set(products.map(p => p.category)))

  return {
    products,
    categories,
    settings
  }
}

export default async function ShopPage() {
  const initialData = await getInitialData()

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    }>
      <ShopContent initialData={initialData} />
    </Suspense>
  )
} 