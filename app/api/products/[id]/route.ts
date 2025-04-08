import { NextResponse } from "next/server"
import { promises as fs } from 'fs'
import path from 'path'
import { Product } from "@/types"

const dataFilePath = path.join(process.cwd(), 'data', 'products.json')

// Helper function to read products from file
async function readProducts(): Promise<Product[]> {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading products:', error)
    return []
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const products = await readProducts()
    const product = products.find((p) => p.id === params.id)

    if (!product) {
      return new NextResponse("Product not found", { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("[PRODUCT_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 