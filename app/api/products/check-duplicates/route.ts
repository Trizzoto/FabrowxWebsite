import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { Product } from '@/types'

const dataFilePath = path.join(process.cwd(), 'data', 'products.json')

// Helper function to read existing products
async function readExistingProducts(): Promise<Product[]> {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

export async function POST(request: Request) {
  try {
    const newProducts: Product[] = await request.json()
    const existingProducts = await readExistingProducts()

    // Find duplicates by comparing IDs
    const duplicates = newProducts
      .filter(newProduct => 
        existingProducts.some(existingProduct => existingProduct.id === newProduct.id)
      )
      .map(newProduct => ({
        existing: existingProducts.find(p => p.id === newProduct.id)!,
        new: newProduct
      }))

    return NextResponse.json(duplicates)
  } catch (error) {
    console.error('Failed to check for duplicates:', error)
    return NextResponse.json(
      { error: 'Failed to check for duplicates' },
      { status: 500 }
    )
  }
} 