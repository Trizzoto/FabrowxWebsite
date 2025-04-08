import { NextResponse } from 'next/server'
import { parse } from 'csv-parse/sync'
import { Product } from '@/types'
import { promises as fs } from 'fs'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'data', 'products.json')

// Helper function to read existing products
async function readExistingProducts(): Promise<Product[]> {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

// Helper function to write products to file
async function writeProducts(products: Product[]): Promise<void> {
  // Ensure the directory exists
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true })
  await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2))
}

function sanitizeText(text: string): string {
  if (!text) return ''
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()
}

function convertToProduct(row: any): Product | null {
  try {
    // Skip rows without a Handle
    if (!row['Handle']) return null

    // For variant rows, we still want to process them but differently
    const isVariant = !row['Title'] && row['Option1 Value']

    const id = row['Handle'].toLowerCase()
    const name = isVariant ? '' : sanitizeText(row['Title'])
    const description = sanitizeText(row['Body (HTML)'])
    const category = row['Product Category'] || row['Type'] || 'Uncategorized'
    
    // Parse prices - handle both main product and variant prices
    const variantPrice = parseFloat(row['Variant Price']?.replace(/[^0-9.-]+/g, '') || '0')
    const compareAtPrice = parseFloat(row['Variant Compare At Price']?.replace(/[^0-9.-]+/g, '') || '0')
    const price = compareAtPrice > 0 ? compareAtPrice : variantPrice

    // Collect images
    const images: string[] = []
    if (row['Image Src'] && row['Image Src'].startsWith('http')) {
      images.push(row['Image Src'])
    }

    // Create variant object
    const variant = {
      sku: row['Variant SKU'] || '',
      price: variantPrice,
      compareAtPrice: compareAtPrice || undefined,
      option1: row['Option1 Value'] || undefined,
      option2: row['Option2 Value'] || undefined,
      option3: row['Option3 Value'] || undefined,
      inventory: parseInt(row['Variant Grams']?.replace(/[^0-9-]+/g, '') || '0', 10)
    }

    // If this is a variant row, return null (we'll handle variants separately)
    if (isVariant) {
      return null
    }

    // Create the product object
    return {
      id,
      name,
      category,
      price,
      description,
      images,
      variants: [variant]
    }
  } catch (error) {
    console.error('Error converting row to product:', error, row)
    return null
  }
}

export async function POST(request: Request) {
  try {
    let data;
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      
      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }

      // Read file content as text
      const buffer = await file.arrayBuffer();
      const content = Buffer.from(buffer).toString('utf-8');

      try {
        // Parse CSV with proper options
        data = parse(content, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
          bom: true,
          skip_records_with_error: true,
          relaxColumnCount: true,
          relaxQuotes: true,
          delimiter: ',',
          comment: '#'
        });

        // Group rows by Handle to combine variants
        const productGroups = new Map<string, any[]>();
        data.forEach((row: any) => {
          const handle = row['Handle'];
          if (handle) {
            const group = productGroups.get(handle) || [];
            group.push(row);
            productGroups.set(handle, group);
          }
        });

        // Convert each group to a product
        const newProducts = Array.from(productGroups.values())
          .map(rows => {
            // First row contains the main product info
            const mainRow = rows[0];
            const product = convertToProduct(mainRow);
            
            if (!product) return null;

            // Add variants from other rows
            const variants = rows.slice(1)
              .map(row => ({
                sku: row['Variant SKU'] || '',
                price: parseFloat(row['Variant Price']?.replace(/[^0-9.-]+/g, '') || '0'),
                compareAtPrice: parseFloat(row['Variant Compare At Price']?.replace(/[^0-9.-]+/g, '') || '0'),
                option1: row['Option1 Value'] || undefined,
                option2: row['Option2 Value'] || undefined,
                option3: row['Option3 Value'] || undefined,
                inventory: parseInt(row['Variant Grams']?.replace(/[^0-9-]+/g, '') || '0', 10)
              }))
              .filter(v => v.option1 || v.option2 || v.option3);

            if (variants.length > 0) {
              product.variants = variants;
            }

            return product;
          })
          .filter((p): p is Product => p !== null);

        if (newProducts.length === 0) {
          return NextResponse.json(
            { error: 'No valid products found in CSV.' },
            { status: 400 }
          );
        }

        // Read existing products
        const existingProducts = await readExistingProducts();

        // Merge new products with existing ones, replacing duplicates by ID
        const productMap = new Map<string, Product>();
        
        // Add existing products to map
        existingProducts.forEach(product => {
          productMap.set(product.id, product);
        });

        // Add or update new products
        newProducts.forEach(product => {
          productMap.set(product.id, product);
        });

        // Convert map back to array
        const mergedProducts = Array.from(productMap.values());

        // Save all products to file
        await writeProducts(mergedProducts);

        // Return success response
        return NextResponse.json({
          success: true,
          message: `Successfully imported ${newProducts.length} products`,
          products: mergedProducts
        });

      } catch (error) {
        console.error('CSV parsing error:', error);
        return NextResponse.json({
          error: 'Failed to parse CSV file. Please ensure it is a valid CSV file.'
        }, { status: 400 });
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid content type. Expected multipart/form-data.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error processing CSV upload:', error);
    return NextResponse.json(
      { error: 'Failed to process CSV file. Please check the format and try again.' },
      { status: 500 }
    );
  }
} 