import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductBySlug, getFeaturedProducts } from "@/lib/api"
import AddToCartButton from "@/components/shop/add-to-cart-button"
import ProductGallery from "@/components/shop/product-gallery"
import RelatedProducts from "@/components/shop/related-products"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return {
      title: "Product Not Found - Elite FabWorx",
    }
  }

  return {
    title: `${product.name} - Elite FabWorx`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getFeaturedProducts(4)

  return (
    <div className="container px-4 md:px-6 py-24 mt-16">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <ProductGallery images={product.images || []} name={product.name} />

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-zinc-400 mb-4">{product.category}</p>

          <div className="text-2xl font-bold text-blue-500 mb-6">
            ${typeof product.price === 'number' 
              ? product.price.toFixed(2) 
              : parseFloat(product.price.toString()).toFixed(2)}
          </div>

          <div className="prose prose-invert max-w-none mb-8">
            <p>{product.description}</p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Specifications</h3>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(product.specifications || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-zinc-800">
                  <span className="text-zinc-400 capitalize">{key}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Compatible Vehicles</h3>
            <div className="flex flex-wrap gap-2">
              {product.compatibleVehicles?.map((vehicle) => (
                <span key={vehicle} className="px-3 py-1 bg-zinc-800 rounded-full text-sm">
                  {vehicle}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Availability:</span>
              {(product.stockCount ?? 0) > 0 ? (
                <span className="text-green-500">In Stock ({product.stockCount} available)</span>
              ) : (
                <span className="text-red-500">Out of Stock</span>
              )}
            </div>

            <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      <RelatedProducts products={relatedProducts} currentProductId={product._id || product.id} />
    </div>
  )
}

