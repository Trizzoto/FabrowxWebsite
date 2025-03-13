export interface Product {
  id: string
  name: string
  description: string
  price: number | string
  image: string
  category: string
}

// Mock product data
const products: Product[] = []

export async function getProducts(searchParams?: { category?: string; sort?: string }): Promise<Product[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  let filteredProducts = [...products]

  // Apply category filter
  if (searchParams?.category) {
    const categories = searchParams.category.split(",")
    filteredProducts = filteredProducts.filter(product => 
      categories.includes(product.category)
    )
  }

  // Apply sorting
  if (searchParams?.sort) {
    switch (searchParams.sort) {
      case "price-asc":
        filteredProducts.sort((a, b) => {
          const priceA = typeof a.price === "number" ? a.price : parseFloat(a.price.replace(/[^0-9.-]+/g, ""))
          const priceB = typeof b.price === "number" ? b.price : parseFloat(b.price.replace(/[^0-9.-]+/g, ""))
          return priceA - priceB
        })
        break
      case "price-desc":
        filteredProducts.sort((a, b) => {
          const priceA = typeof a.price === "number" ? a.price : parseFloat(a.price.replace(/[^0-9.-]+/g, ""))
          const priceB = typeof b.price === "number" ? b.price : parseFloat(b.price.replace(/[^0-9.-]+/g, ""))
          return priceB - priceA
        })
        break
      case "name-asc":
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // Featured sorting (default) - no change to order
        break
    }
  }

  return filteredProducts
}

export async function getFeaturedProducts(): Promise<Product[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return products.slice(0, 3)
}

export async function getProductById(id: string): Promise<Product | undefined> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return products.find(product => product.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(product => product.category === category)
} 