import type { Metadata } from "next"
import ProductGrid from "@/components/shop/product-grid"
import ProductFilters from "@/components/shop/product-filters"
import { getProducts } from "@/lib/api"

export const metadata: Metadata = {
  title: "Shop - Elite FabWorx",
  description: "Browse our selection of custom-fabricated performance parts for your vehicle",
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string }
}) {
  const products = await getProducts(searchParams)

  return (
    <div className="container px-4 md:px-6 py-24 mt-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        Shop <span className="text-blue-500">Products</span>
      </h1>

      <div className="grid md:grid-cols-[240px_1fr] gap-8">
        <ProductFilters />
        <ProductGrid products={products} />
      </div>
    </div>
  )
}

