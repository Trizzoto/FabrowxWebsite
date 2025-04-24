import { NextResponse } from "next/server"
import { MongoClient } from 'mongodb'
import { Product } from "@/types"

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const client = new MongoClient(uri)
const dbName = 'elitefabworx'
const collectionName = 'products'

// Helper function to get the database connection
async function getDb() {
  try {
    await client.connect()
    return client.db(dbName)
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    throw error
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb()
    const collection = db.collection(collectionName)
    
    const product = await collection.findOne({ id: params.id })
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.name || !data.category || typeof data.price !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const collection = db.collection(collectionName)
    
    // Update the product
    const result = await collection.findOneAndUpdate(
      { id: params.id },
      { $set: data },
      { returnDocument: 'after' }
    )
    
    if (!result) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true,
      product: result
    })
  } catch (error) {
    console.error('Failed to update product:', error)
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
    const db = await getDb()
    const collection = db.collection(collectionName)
    
    const result = await collection.deleteOne({ id: params.id })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true,
      message: `Product ${params.id} deleted successfully`
    })
  } catch (error) {
    console.error('Failed to delete product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
} 