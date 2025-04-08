import fs from 'fs'
import path from 'path'
import { Product, ProductOption, ProductVariant } from '@/types'

// Read products from JSON file
const productsPath = path.join(process.cwd(), 'data', 'products.json')
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'))

// Extract unique categories from products
const initialCategories = Array.from(new Set(productsData.map((product: Product) => product.category))).sort() as string[]

// Re-export the Product interface from types
export type { Product, ProductOption, ProductVariant }

export interface Category {
  id: string
  name: string
  parentId?: string
}

// This will be populated from the API
export let productCategories: string[] = initialCategories

// Function to update categories
export function updateCategories(categories: string[]) {
  productCategories = Array.from(new Set(categories)).sort()
} 