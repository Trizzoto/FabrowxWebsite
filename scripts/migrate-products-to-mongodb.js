// Script to migrate products from JSON file to MongoDB
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// MongoDB connection details
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('Error: MONGODB_URI environment variable is required');
  process.exit(1);
}

const client = new MongoClient(uri);
const dbName = 'elitefabworx';
const collectionName = 'products';

// Path to the JSON file
const dataFilePath = path.join(process.cwd(), 'data', 'products.json');

async function migrateProducts() {
  try {
    console.log('Starting migration of products to MongoDB...');
    
    // Read the JSON file
    let products = [];
    try {
      const data = fs.readFileSync(dataFilePath, 'utf-8');
      products = JSON.parse(data);
      console.log(`Read ${products.length} products from JSON file`);
    } catch (error) {
      console.warn('Warning: Could not read products.json file:', error.message);
      console.log('Continuing with an empty product list...');
    }
    
    if (products.length === 0) {
      console.log('No products to migrate. Exiting.');
      return;
    }
    
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    
    // Check if the collection already has products
    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing products in MongoDB`);
      const answer = await promptUser('Would you like to (O)verwrite, (A)ppend, or (C)ancel? ');
      
      if (answer.toLowerCase() === 'c') {
        console.log('Migration cancelled');
        return;
      } else if (answer.toLowerCase() === 'o') {
        console.log('Deleting existing products...');
        await collection.deleteMany({});
      }
    }
    
    // Insert products
    console.log('Inserting products into MongoDB...');
    const result = await collection.insertMany(products);
    
    console.log(`Migration complete! ${result.insertedCount} products migrated to MongoDB`);
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

function promptUser(question) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

// Run the migration
migrateProducts(); 