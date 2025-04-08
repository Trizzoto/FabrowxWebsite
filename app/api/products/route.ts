import { NextResponse } from 'next/server'
import { Product, ProductOption, ProductVariant } from '@/types'
import fs from 'fs'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'data', 'products.json')

// Helper function to read products from file
async function readProducts(): Promise<Product[]> {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading products:', error)
    return []
  }
}

// Helper function to write products to file
async function writeProducts(products: Product[]): Promise<void> {
  fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2))
}

export async function GET() {
  try {
    const products = await readProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error getting products:', error)
    return NextResponse.json({ error: 'Failed to get products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Handle both single product and array of products
    const newProducts = Array.isArray(data) ? data : [data]
    
    if (newProducts.length === 0) {
      return NextResponse.json(
        { error: 'No product data provided' },
        { status: 400 }
      )
    }

    // Validate each product has required fields
    const isValid = newProducts.every(product => 
      product.id && 
      product.name && 
      product.category && 
      typeof product.price === 'number'
    )

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid product data. Missing required fields.' },
        { status: 400 }
      )
    }

    // Read existing products
    const existingProducts = await readProducts()

    // Merge new products with existing ones, replacing duplicates by ID
    const productMap = new Map<string, Product>()
    
    // Add existing products to map
    existingProducts.forEach(product => {
      productMap.set(product.id, product)
    })

    // Add or update new products
    newProducts.forEach(product => {
      // Ensure options and variants are properly formatted
      if (product.options) {
        product.options = product.options.map((option: ProductOption) => ({
          name: option.name || '',
          values: Array.isArray(option.values) ? option.values : []
        }))
      }
      
      if (product.variants) {
        product.variants = product.variants.map((variant: ProductVariant) => ({
          sku: variant.sku || '',
          price: typeof variant.price === 'number' ? variant.price : product.price,
          compareAtPrice: variant.compareAtPrice,
          option1: variant.option1,
          option2: variant.option2,
          option3: variant.option3,
          inventory: typeof variant.inventory === 'number' ? variant.inventory : 0
        }))
      }
      
      productMap.set(product.id, product)
    })

    // Convert map back to array
    const mergedProducts = Array.from(productMap.values())

    // Save all products to file
    await writeProducts(mergedProducts)

    // Return the newly created/updated product(s)
    return NextResponse.json({ 
      success: true, 
      products: Array.isArray(data) ? mergedProducts : mergedProducts.find(p => p.id === data.id) 
    })
  } catch (error) {
    console.error('Error updating products:', error)
    return NextResponse.json(
      { error: 'Failed to update products' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    // Clear all products
    await writeProducts([])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting products:', error)
    return NextResponse.json(
      { error: 'Failed to delete products' },
      { status: 500 }
    )
  }
} 