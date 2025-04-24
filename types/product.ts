export interface ProductVariant {
  title: string
  sku: string
  price: number
  compareAtPrice?: number
  weight?: number
  inventory: number
}

export interface ProductImage {
  src: string
  alt: string
}

export interface Product {
  id: string
  name: string
  description: string
  category: string
  published: boolean
  variants: ProductVariant[]
  images: string[]
} 