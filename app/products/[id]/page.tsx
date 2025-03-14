import { Metadata } from "next"
import { getProductById } from "@/lib/api"
import { ProductDetail } from "./product-detail"

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
  
  return <ProductDetail product={product || null} id={params.id} />
} 