export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  images: string[]
  featured?: boolean
}

export async function getProducts(): Promise<Product[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const response = await fetch(`${baseUrl}/api/products`, { cache: 'no-store' })
  const products = await response.json()
  return products
} 