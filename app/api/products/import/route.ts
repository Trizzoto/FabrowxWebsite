import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'csv-parse/sync'
import { Product, ProductVariant, ProductOption } from '@/types'
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

function sanitizeText(text: string | undefined): string {
  if (!text) return ''
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()
}

function validateNumber(value: string | undefined, defaultValue: number = 0): number {
  if (!value) return defaultValue
  const num = parseFloat(value.replace(/[^0-9.-]+/g, ''))
  return isNaN(num) ? defaultValue : num
}

interface GroupedProduct {
  mainRow: any
  images: { src: string, position: number, alt: string }[]
  variants: any[]
}

// Process CSV data and convert to products
function processCSV(records: any[]): Product[] {
  // First, group rows by product handle
  const productGroups: Record<string, GroupedProduct> = {}
  
  // Sort records by Image Position to ensure main products (position 1) are processed first
  const sortedRecords = [...records].sort((a, b) => {
    const posA = parseInt(a['Image Position'] || '99', 10)
    const posB = parseInt(b['Image Position'] || '99', 10)
    return posA - posB
  })
  
  // Group records by Handle, identifying main products and variants
  sortedRecords.forEach(row => {
    const handle = row['Handle']?.trim()
    if (!handle) return
    
    const imagePosition = parseInt(row['Image Position'] || '99', 10)
    
    // If this is the first occurrence of this handle or it's the main product image,
    // create/update the main product entry
    if (!productGroups[handle] || imagePosition === 1) {
      if (!productGroups[handle]) {
        productGroups[handle] = {
          mainRow: row,
          images: [],
          variants: []
        }
      }
      
      // If this is position 1, update the main row
      if (imagePosition === 1) {
        productGroups[handle].mainRow = row
      }
    }
    
    // Add the image if there is one
    if (row['Image Src'] && imagePosition > 0) {
      productGroups[handle].images.push({
        src: row['Image Src'],
        position: imagePosition,
        alt: row['Image Alt Text'] || row['Title'] || ''
      })
    }
    
    // Add this row as a variant (all rows can potentially be variants)
    productGroups[handle].variants.push(row)
  })
  
  // Convert groups to products
  return Object.entries(productGroups).map(([handle, group]) => {
    const { mainRow, images, variants } = group
    
    // Sort images by position
    const sortedImages = [...images].sort((a, b) => a.position - b.position).map(img => img.src)
    
    // Extract unique option names and values
    const optionNames = new Set<string>()
    const optionValues: Record<string, Set<string>> = {}
    
    variants.forEach(variant => {
      // Add option names
      for (let i = 1; i <= 3; i++) {
        const optionNameKey = `Option${i} Name`
        const optionValueKey = `Option${i} Value`
        
        if (variant[optionNameKey] && variant[optionNameKey] !== 'Title') {
          const optionName = sanitizeText(variant[optionNameKey])
          optionNames.add(optionName)
          
          optionValues[optionName] = optionValues[optionName] || new Set()
          if (variant[optionValueKey] && variant[optionValueKey] !== 'Default Title') {
            optionValues[optionName].add(sanitizeText(variant[optionValueKey]))
          }
        }
      }
    })
    
    // Create option objects for the product
    const options: ProductOption[] = Array.from(optionNames).map(name => ({
      name,
      values: Array.from(optionValues[name] || new Set())
    })).filter(opt => opt.values.length > 0)
    
    // Create product variants - making sure to only create unique variants
    const variantMap = new Map<string, ProductVariant>()
    
    variants.forEach(variant => {
      // Get option values
      const option1 = sanitizeText(variant['Option1 Value'])
      const option2 = sanitizeText(variant['Option2 Value'])
      const option3 = sanitizeText(variant['Option3 Value'])
      
      // Skip default title variants if we have other options
      if (options.length > 0 && option1 === 'Default Title') return
      
      // Create a unique key for this variant
      const variantKey = `${option1}|${option2}|${option3}`
      
      // Only add if we don't already have this variant
      if (!variantMap.has(variantKey)) {
        // Use Compare At Price if available, otherwise use regular Price
        const price = validateNumber(variant['Variant Compare At Price']) || validateNumber(variant['Variant Price'])
        const compareAtPrice = validateNumber(variant['Variant Compare At Price']) || undefined
        
        variantMap.set(variantKey, {
          sku: variant['Variant SKU'] || `${handle}-${variantMap.size + 1}`,
          price,
          compareAtPrice: compareAtPrice && compareAtPrice > price ? compareAtPrice : undefined,
          inventory: validateNumber(variant['Variant Inventory Qty'] || '0'),
          option1: option1 !== 'Default Title' ? option1 : undefined,
          option2: option2 !== '' ? option2 : undefined,
          option3: option3 !== '' ? option3 : undefined
        })
      }
    })
    
    const productVariants = Array.from(variantMap.values())
    
    // If no variants were created but we have options, create default variants
    if (productVariants.length === 0 && options.length > 0) {
      // Generate all possible combinations of option values
      const generateCombinations = (opt: ProductOption[], index: number = 0, current: string[] = []): string[][] => {
        if (index === opt.length) return [current]
        const result: string[][] = []
        
        for (const value of opt[index].values) {
          result.push(...generateCombinations(opt, index + 1, [...current, value]))
        }
        
        return result
      }
      
      const combinations = generateCombinations(options)
      const basePrice = validateNumber(mainRow['Variant Price'])
      
      combinations.forEach((combo, i) => {
        productVariants.push({
          sku: `${handle}-${i + 1}`,
          price: basePrice,
          inventory: 10, // Default inventory
          option1: combo[0] || undefined,
          option2: combo[1] || undefined,
          option3: combo[2] || undefined
        })
      })
    }
    
    // If we still have no variants, create a default one
    if (productVariants.length === 0) {
      productVariants.push({
        sku: `${handle}-1`,
        price: validateNumber(mainRow['Variant Price']),
        inventory: 10,
        option1: undefined,
        option2: undefined,
        option3: undefined
      })
    }
    
    // Build the product object
    return {
      id: handle.toLowerCase(),
      name: sanitizeText(mainRow['Title'] || handle),
      description: sanitizeText(mainRow['Body (HTML)'] || ''),
      category: sanitizeText(mainRow['Product Category'] || mainRow['Type'] || 'Uncategorized'),
      price: validateNumber(mainRow['Variant Price']),
      images: sortedImages,
      options,
      variants: productVariants
    } as Product
  })
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Read and parse CSV
    const content = await file.text()
    
    // Parse CSV with forgiving options
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
      skip_records_with_error: true,
      relaxColumnCount: true,
      relaxQuotes: true,
      delimiter: ','
    })

    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { error: 'CSV file is empty or invalid' },
        { status: 400 }
      )
    }
    
    // Process the records into products
    const newProducts = processCSV(records)
    
    // Validate products array
    if (!newProducts || newProducts.length === 0) {
      return NextResponse.json(
        { error: 'No valid products found in CSV file' },
        { status: 400 }
      )
    }
    
    // Read existing products
    const existingProducts = await readExistingProducts()
    
    // Merge products (new products will replace existing ones with the same ID)
    const productMap = new Map<string, Product>()
    existingProducts.forEach(product => {
      productMap.set(product.id, product)
    })
    
    newProducts.forEach(product => {
      productMap.set(product.id, product)
    })
    
    const mergedProducts = Array.from(productMap.values())
    
    // Save to file
    await writeProducts(mergedProducts)
    
    return NextResponse.json({
      success: true,
      message: `Successfully imported ${newProducts.length} products`,
      products: newProducts
    })
  } catch (error) {
    console.error('Failed to process products:', error)
    return NextResponse.json(
      { error: 'Failed to process products: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
} 