export interface ProductVariant {
  sku: string
  price: number
  compareAtPrice?: number
  option1: string
  option2?: string
  option3?: string
  inventory: number
}

export interface ProductOptions {
  option1?: string
  option2?: string
  option3?: string
}

export interface Product {
  id: string
  name: string
  category: string
  subcategory?: string
  price: number
  originalPrice?: number
  description: string
  images?: string[]
  variants?: ProductVariant[]
  options?: ProductOptions
}

export interface Category {
  name: string
  subcategories: string[]
}

export interface GalleryImage {
  url: string
  alt: string
  description?: string
}

export interface Testimonial {
  id: string
  name: string
  role?: string
  content: string
  rating: number
} 