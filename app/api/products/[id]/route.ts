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

// Helper function to write products to file
async function writeProducts(products: Product[]): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2))
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updatedProduct = await request.json()
    
    if (!updatedProduct || !updatedProduct.id) {
      return NextResponse.json(
        { error: 'Invalid product data' },
        { status: 400 }
      )
    }

    // Read existing products
    const products = await readProducts()
    
    // Find the index of the product to update
    const productIndex = products.findIndex(p => p.id === params.id)
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Update the product
    products[productIndex] = {
      ...products[productIndex],
      ...updatedProduct,
      id: params.id // Ensure ID doesn't change
    }
    
    // Save updated products
    await writeProducts(products)
    
    return NextResponse.json({ success: true, product: products[productIndex] })
  } catch (error) {
    console.error("[PRODUCT_PUT]", error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Read existing products
    const products = await readProducts()
    
    // Filter out the product to delete
    const filteredProducts = products.filter(p => p.id !== params.id)
    
    if (filteredProducts.length === products.length) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Save filtered products
    await writeProducts(filteredProducts)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
} 