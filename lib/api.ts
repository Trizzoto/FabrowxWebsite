export interface Product {
  id: string
  name: string
  description: string
  price: number | string
  images?: string[]
  category: string
  _id?: string
  stockCount?: number
  specifications?: Record<string, string>
  compatibleVehicles?: string[]
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const response = await fetch(`/api/products/${slug}`)
    if (!response.ok) return undefined
    return await response.json()
  } catch (error) {
    console.error('Error fetching product by slug:', error)
    return undefined
  }
}

// Mock product data
const products: Product[] = []

export async function getProducts(searchParams?: { category?: string; sort?: string }): Promise<Product[]> {
  try {
    const response = await fetch('/api/products')
    if (!response.ok) throw new Error('Failed to fetch products')
    let products = await response.json()

    // Apply category filter
    if (searchParams?.category) {
      const categories = searchParams.category.split(",")
      products = products.filter((product: Product) => 
        categories.includes(product.category)
      )
    }

    // Apply sorting
    if (searchParams?.sort) {
      switch (searchParams.sort) {
        case "price-asc":
          products.sort((a: Product, b: Product) => {
            const priceA = typeof a.price === "number" ? a.price : parseFloat(a.price.replace(/[^0-9.-]+/g, ""))
            const priceB = typeof b.price === "number" ? b.price : parseFloat(b.price.replace(/[^0-9.-]+/g, ""))
            return priceA - priceB
          })
          break
        case "price-desc":
          products.sort((a: Product, b: Product) => {
            const priceA = typeof a.price === "number" ? a.price : parseFloat(a.price.replace(/[^0-9.-]+/g, ""))
            const priceB = typeof b.price === "number" ? b.price : parseFloat(b.price.replace(/[^0-9.-]+/g, ""))
            return priceB - priceA
          })
          break
        case "name-asc":
          products.sort((a: Product, b: Product) => a.name.localeCompare(b.name))
          break
        default:
          // Default sorting - by category, then by name within each category
          products.sort((a: Product, b: Product) => {
            // First sort by category
            const categoryCompare = a.category.localeCompare(b.category)
            if (categoryCompare !== 0) return categoryCompare
            // If categories are the same, sort by name
            return a.name.localeCompare(b.name)
          })
          break
      }
    } else {
      // If no sort parameter is provided, use the default category + name sorting
      products.sort((a: Product, b: Product) => {
        const categoryCompare = a.category.localeCompare(b.category)
        if (categoryCompare !== 0) return categoryCompare
        return a.name.localeCompare(b.name)
      })
    }

    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function getFeaturedProducts(count: number = 3): Promise<Product[]> {
  try {
    const products = await getProducts()
    return products.slice(0, count)
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const response = await fetch(`/api/products/${id}`)
    if (!response.ok) return undefined
    return await response.json()
  } catch (error) {
    console.error('Error fetching product by ID:', error)
    return undefined
  }
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(product => product.category === category)
} 