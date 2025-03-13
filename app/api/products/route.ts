import { NextResponse } from 'next/server'
import { products as initialProducts } from '@/app/data'

// Initialize products with our data
let products = [...initialProducts]

export async function GET() {
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  const product = await request.json()
  
  // Add new product
  const newProduct = {
    ...product,
    id: Math.random().toString(36).substr(2, 9)
  }
  products.push(newProduct)
  
  return NextResponse.json(newProduct)
}

export async function PUT(request: Request) {
  const product = await request.json()
  
  // Update existing product
  products = products.map(p => 
    p.id === product.id ? { ...p, ...product } : p
  )
  
  return NextResponse.json(product)
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
  }

  // Remove product
  products = products.filter(p => p.id !== id)
  
  return NextResponse.json({ success: true })
} 