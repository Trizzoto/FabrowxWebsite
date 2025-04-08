import { NextResponse } from 'next/server'
import { Product } from '@/types'
import { promises as fs } from 'fs'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'data', 'products.json')

// Helper function to read products from file
async function readProducts(): Promise<Product[]> {
  try {
    await fs.access(dataFilePath)
    const data = await fs.readFile(dataFilePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist or is invalid, return empty array
    return []
  }
}

// Helper function to write products to file
async function writeProducts(products: Product[]): Promise<void> {
  // Ensure the directory exists
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true })
  await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2))
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
    const newProducts = await request.json()
    
    if (!Array.isArray(newProducts)) {
      return NextResponse.json(
        { error: 'Invalid products data. Expected an array.' },
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
      productMap.set(product.id, product)
    })

    // Convert map back to array
    const mergedProducts = Array.from(productMap.values())

    // Save all products to file
    await writeProducts(mergedProducts)

    return NextResponse.json({ success: true, products: mergedProducts })
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