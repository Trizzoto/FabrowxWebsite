// Mock product data
const products = [
  {
    _id: "1",
    slug: "performance-exhaust-header",
    name: "Performance Exhaust Header",
    category: "Exhaust Systems",
    price: 899,
    description: "High-performance exhaust header designed for maximum flow and power gains.",
    stockCount: 5,
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-O6uyXI2qKZ2CwTXjc9Z4xBQyd4B1wD.png"
    ],
    specifications: {
      material: "304 Stainless Steel",
      finish: "Polished",
      design: "4-2-1",
      diameter: "1.75 inches"
    },
    compatibleVehicles: ["Toyota 86", "Subaru BRZ", "Scion FR-S"]
  },
  {
    _id: "2",
    slug: "4wd-snorkel-kit",
    name: "4WD Snorkel Kit",
    category: "4WD Accessories",
    price: 349,
    description: "High-mounted air intake system for water crossings and dusty conditions.",
    stockCount: 8,
    images: ["/placeholder.svg?height=300&width=300"],
    specifications: {
      material: "UV-Resistant HDPE",
      color: "Black",
      airflow: "Enhanced",
      installation: "Bolt-on"
    },
    compatibleVehicles: ["Toyota Landcruiser", "Nissan Patrol", "Toyota Hilux"]
  }
]

export async function getProducts(searchParams?: { category?: string; sort?: string }) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  let filteredProducts = [...products]

  // Apply category filter
  if (searchParams?.category) {
    filteredProducts = filteredProducts.filter(
      product => product.category.toLowerCase() === searchParams.category!.toLowerCase()
    )
  }

  // Apply sorting
  if (searchParams?.sort) {
    switch (searchParams.sort) {
      case "price-asc":
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case "name-asc":
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name))
        break
    }
  }

  return filteredProducts
}

export async function getProductBySlug(slug: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  return products.find(product => product.slug === slug)
}

export async function getFeaturedProducts(count: number = 4) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  // For now, just return the first n products as featured
  return products.slice(0, count)
} 