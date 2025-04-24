// Update Categories Script for Elite Fabworx
// This script reads products.json, applies the category mapping, and saves the updated file

const fs = require('fs');
const path = require('path');
const { determineCategory } = require('./category-remap');

// File paths
const productsFilePath = path.join(process.cwd(), 'data', 'products.json');
const backupFilePath = path.join(process.cwd(), 'data', 'products.backup.json');
const updatedFilePath = path.join(process.cwd(), 'data', 'products.updated.json');

// Main function to update categories
async function updateCategories() {
  try {
    console.log('Reading products.json file...');
    
    // Create a backup of the original file
    fs.copyFileSync(productsFilePath, backupFilePath);
    console.log('Created backup at products.backup.json');
    
    // Read the products file
    const data = fs.readFileSync(productsFilePath, 'utf8');
    const products = JSON.parse(data);
    
    console.log(`Found ${products.length} products. Updating categories...`);
    
    // Track category changes for reporting
    const categoryChanges = {};
    const newCategories = new Set();
    
    // Update each product's category
    const updatedProducts = products.map(product => {
      const oldCategory = product.category;
      const newCategory = determineCategory(product);
      
      // Track the changes
      if (!categoryChanges[oldCategory]) {
        categoryChanges[oldCategory] = {
          count: 0,
          to: {}
        };
      }
      
      categoryChanges[oldCategory].count++;
      
      if (!categoryChanges[oldCategory].to[newCategory]) {
        categoryChanges[oldCategory].to[newCategory] = 0;
      }
      
      categoryChanges[oldCategory].to[newCategory]++;
      newCategories.add(newCategory);
      
      // Update the product
      return {
        ...product,
        category: newCategory
      };
    });
    
    // Write the updated file
    fs.writeFileSync(updatedFilePath, JSON.stringify(updatedProducts, null, 2));
    console.log(`Updated products saved to products.updated.json`);
    
    // Print summary of changes
    console.log('\n=== Category Update Summary ===');
    console.log(`Original categories: ${Object.keys(categoryChanges).length}`);
    console.log(`New categories: ${newCategories.size}`);
    console.log('\nNew categories:');
    Array.from(newCategories).sort().forEach(category => {
      console.log(`- ${category}`);
    });
    
    console.log('\nCategory mapping details:');
    Object.keys(categoryChanges).sort().forEach(oldCategory => {
      const changes = categoryChanges[oldCategory];
      console.log(`${oldCategory} (${changes.count} products):`);
      Object.keys(changes.to).forEach(newCategory => {
        console.log(`  → ${newCategory}: ${changes.to[newCategory]} products`);
      });
    });
    
    console.log('\nTo apply these changes, rename products.updated.json to products.json');
    
  } catch (error) {
    console.error('Error updating categories:', error);
  }
}

// Run the update
updateCategories().catch(console.error); 