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
  const response = await fetch('http://localhost:3000/api/products', { cache: 'no-store' })
  const products = await response.json()
  return products
} 