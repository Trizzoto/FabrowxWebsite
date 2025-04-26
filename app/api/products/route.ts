import { NextResponse } from 'next/server'
import { Product, ProductOption, ProductVariant } from '@/types'
import { MongoClient, ObjectId } from 'mongodb'

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'elitefabworx';
const collectionName = 'products';

// Helper function to connect to MongoDB with better error handling
async function connectToDatabase() {
  console.log("Attempting MongoDB connection for GET request");
  console.log(`Connecting to MongoDB with URI: ${uri.slice(0, 15)}...`);
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    return client;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error(`MongoDB connection failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // Connect to MongoDB
    const mongoClient = await connectToDatabase();
    const db = mongoClient.db(dbName);
    const collection = db.collection(collectionName);
    
    let result;
    
    if (id) {
      // If an ID is provided, return a single product
      result = await collection.findOne({ id });
      
      if (!result) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
    } else {
      // Otherwise, return all products
      result = await collection.find({}).toArray();
      console.log(`Found ${result.length} products in MongoDB`);
    }
    
    // Close the connection
    await mongoClient.close();
    
    // Return the result
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    
    // Make sure we return a proper JSON response even on error
    return NextResponse.json(
      { 
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
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
      // Log detailed validation information
      const validationErrors = newProducts.map(product => {
        const errors = [];
        if (!product.id) errors.push('Missing id');
        if (!product.name) errors.push('Missing name');
        if (!product.category) errors.push('Missing category');
        if (typeof product.price !== 'number') errors.push('Price must be a number');
        
        return {
          providedData: { 
            id: product.id || 'MISSING', 
            name: product.name || 'MISSING',
            category: product.category || 'MISSING',
            price: product.price,
            priceType: typeof product.price
          },
          errors
        };
      });
      
      console.error('Product validation failed:', JSON.stringify(validationErrors, null, 2));
      
      return NextResponse.json(
        { 
          error: 'Invalid product data. Missing required fields.',
          validationErrors
        },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const mongoClient = await connectToDatabase();
    const db = mongoClient.db(dbName);
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

    // Close the connection
    await mongoClient.close();

    // Return the processed product(s)
    return NextResponse.json({ 
      success: true, 
      products: Array.isArray(data) ? processedProducts : processedProducts[0]
    });
  } catch (error) {
    console.error('Error updating products:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update products',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // Connect to MongoDB
    const mongoClient = await connectToDatabase();
    const db = mongoClient.db(dbName);
    const collection = db.collection(collectionName);
    
    let result;
    
    if (id) {
      // Delete a specific product
      result = await collection.deleteOne({ id });
      
      if (result.deletedCount === 0) {
        await mongoClient.close();
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
    } else {
      // Delete all products - this should be used with caution!
      result = await collection.deleteMany({});
    }
    
    // Close the connection
    await mongoClient.close();
    
    return NextResponse.json({ 
      success: true, 
      message: id ? `Product ${id} deleted successfully` : 'All products deleted successfully',
      result
    });
  } catch (error) {
    console.error('Failed to delete products:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete products',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 