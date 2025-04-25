import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const productsPath = path.join(process.cwd(), 'data', 'products.json')
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'))
    
    // Extract unique categories from products and sort them alphabetically
    const categories = Array.from(new Set(productsData.map((product: any) => product.category)))
      .filter((category): category is string => Boolean(category && category !== "To do")) 
      .sort((a: string, b: string) => a.localeCompare(b))
    
    // Return with Cache-Control headers to prevent caching
    return new NextResponse(JSON.stringify(categories), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0, must-revalidate'
      }
    })
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
      // If it already exists, this isn't an error - just return success
      return NextResponse.json({ 
        message: 'Category already exists',
        categories: categories
      })
    }

    // Create dummy product with new category to ensure it shows up in lists
    // This is a workaround since categories are derived from products
    const dummyProduct = {
      id: `category-placeholder-${Date.now()}`,
      name: `${category} Placeholder`,
      description: "Category placeholder product - not visible in shop",
      category: category,
      price: 0,
      images: [],
      hidden: true // Mark as hidden so it doesn't appear in the shop
    }
    
    // Add the dummy product to ensure the category exists
    productsData.push(dummyProduct)
    
    // Write back to the products file
    fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2))
    
    // Return the updated categories list
    const updatedCategories = Array.from(new Set(productsData.map((product: any) => product.category)))
      .filter(Boolean)
    
    return NextResponse.json({ 
      message: 'Category created successfully', 
      categories: updatedCategories
    })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
} 