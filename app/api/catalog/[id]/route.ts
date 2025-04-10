import { NextResponse } from "next/server"
import products from "@/app/data/products.json"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = products.find(p => p.id === params.id)
    
    if (!product) {
      return new NextResponse("Product not found", { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 