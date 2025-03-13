import { Metadata } from "next"
import { getProducts } from "@/lib/api"
import ProductGrid from "@/components/shop/product-grid"
import ProductFilters from "@/components/shop/product-filters"

export const metadata: Metadata = {
  title: "Shop | Elite Fabworx",
  description: "Browse our selection of high-quality automotive products and services.",
}

interface ShopPageProps {
  searchParams: {
    category?: string
    sort?: string
  }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const products = await getProducts(searchParams)

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <ProductFilters />
        </aside>
        <main className="flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Our Products</h1>
            <p className="text-zinc-400">
              Browse our selection of high-quality automotive products and services.
            </p>
          </div>
          <ProductGrid products={products} />
        </main>
      </div>
    </div>
  )
}

