import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const productsPath = path.join(process.cwd(), 'data', 'products.json')
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'))
    
    // Extract unique categories from products and sort them alphabetically
    const categories = Array.from(new Set(productsData.map((product: any) => product.category)))
      .filter((category): category is string => Boolean(category && category !== "To do")) // Filter out empty or "To do" categories
      .sort((a: string, b: string) => a.localeCompare(b))
    
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error reading categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { category } = await request.json()
    
    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }

    // Read existing products
    const productsPath = path.join(process.cwd(), 'data', 'products.json')
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'))
    
    // Get current categories
    const categories = Array.from(new Set(productsData.map((product: any) => product.category)))
      .filter(Boolean)
    
    // Check if category already exists
    if (categories.includes(category)) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 400 })
    }
    
    // Category will be added when a product uses it
    return NextResponse.json({ message: 'Category created successfully' })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
} 