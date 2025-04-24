import { NextResponse } from 'next/server'
import { Product, ProductOption, ProductVariant } from '@/types'
import { MongoClient, ObjectId } from 'mongodb'

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'elitefabworx';
const collectionName = 'products';

// Helper function to get the database connection
async function getDb() {
  try {
    await client.connect();
    return client.db(dbName);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const db = await getDb();
    const collection = db.collection(collectionName);
    
    if (id) {
      // If an ID is provided, return a single product
      const product = await collection.findOne({ id });
      
      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(product);
    }
    
    // Otherwise, return all products
    const products = await collection.find({}).toArray();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Handle both single product and array of products
    const newProducts = Array.isArray(data) ? data : [data];
    
    if (newProducts.length === 0) {
      return NextResponse.json(
        { error: 'No product data provided' },
        { status: 400 }
      );
    }

    // Validate each product has required fields
    const isValid = newProducts.every(product => 
      product.id && 
      product.name && 
      product.category && 
      typeof product.price === 'number'
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid product data. Missing required fields.' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection(collectionName);
    
    // Process each product
    const processedProducts = [];
    
    for (const product of newProducts) {
      // Ensure options and variants are properly formatted
      if (product.options) {
        product.options = product.options.map((option: ProductOption) => ({
          name: option.name || '',
          values: Array.isArray(option.values) ? option.values : []
        }));
      }
      
      if (product.variants) {
        product.variants = product.variants.map((variant: ProductVariant) => ({
          sku: variant.sku || '',
          price: typeof variant.price === 'number' ? variant.price : product.price,
          option1: variant.option1,
          option2: variant.option2,
          option3: variant.option3,
          inventory: typeof variant.inventory === 'number' ? variant.inventory : 0
        }));
      }
      
      // Check if product already exists
      const existingProduct = await collection.findOne({ id: product.id });
      
      if (existingProduct) {
        // Update existing product
        await collection.updateOne(
          { id: product.id },
          { $set: product }
        );
      } else {
        // Insert new product
        await collection.insertOne(product);
      }
      
      processedProducts.push(product);
    }

    // Return the processed product(s)
    return NextResponse.json({ 
      success: true, 
      products: Array.isArray(data) ? processedProducts : processedProducts[0]
    });
  } catch (error) {
    console.error('Error updating products:', error);
    return NextResponse.json(
      { error: 'Failed to update products' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const db = await getDb();
    const collection = db.collection(collectionName);
    
    if (id) {
      // Delete a specific product
      const result = await collection.deleteOne({ id });
      
      if (result.deletedCount === 0) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ 
        success: true, 
        message: `Product ${id} deleted successfully` 
      });
    } else {
      // Delete all products - this should be used with caution!
      await collection.deleteMany({});
      return NextResponse.json({ 
        success: true, 
        message: 'All products deleted successfully' 
      });
    }
  } catch (error) {
    console.error('Failed to delete products:', error);
    return NextResponse.json(
      { error: 'Failed to delete products' },
      { status: 500 }
    );
  }
} 