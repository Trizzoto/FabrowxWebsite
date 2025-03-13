import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProductById } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface ProductPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductById(params.id)

  if (!product) {
    return {
      title: "Product Not Found | Elite Fabworx",
    }
  }

  return {
    title: `${product.name} | Elite Fabworx`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container py-10">
      <Link 
        href="/products" 
        className="inline-flex items-center text-zinc-400 hover:text-white mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-zinc-400 mb-6">{product.description}</p>

          <div className="flex items-center justify-between mb-8">
            <p className="text-2xl font-bold text-orange-600">
              {typeof product.price === "number" 
                ? `$${product.price.toFixed(2)}`
                : product.price
              }
            </p>
            <p className="text-zinc-400">Category: {product.category}</p>
          </div>

          <Button 
            size="lg" 
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            Contact Us About This Product
          </Button>

          <div className="mt-8 p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Why Choose Elite Fabworx?</h2>
            <ul className="space-y-3 text-zinc-400">
              <li>✓ Custom fabrication to your exact specifications</li>
              <li>✓ High-quality materials and craftsmanship</li>
              <li>✓ Expert consultation and support</li>
              <li>✓ Competitive pricing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 