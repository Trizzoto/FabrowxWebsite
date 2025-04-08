import { NextResponse } from 'next/server'
import { parse } from 'csv-parse/sync'
import { Product, Category } from '@/types'

interface ShopifyRow {
  Handle: string
  Title: string
  'Body (HTML)': string
  Vendor: string
  'Product Category': string
  Type: string
  Tags: string
  Published: string
  'Option1 Name': string
  'Option1 Value': string
  'Option1 Linked To': string
  'Option2 Name': string
  'Option2 Value': string
  'Option2 Linked To': string
  'Option3 Name': string
  'Option3 Value': string
  'Option3 Linked To': string
  'Variant SKU': string
  'Variant Grams': string
  'Variant Inventory Tracker': string
  'Variant Inventory Policy': string
  'Variant Fulfillment Service': string
  'Variant Price': string
  'Variant Compare At Price': string
  'Variant Requires Shipping': string
  'Variant Taxable': string
  'Variant Barcode': string
  'Image Src': string
  'Image Position': string
  'Image Alt Text': string
  'Gift Card': string
  'Status': string
}

function groupRowsByHandle(rows: ShopifyRow[]): Map<string, ShopifyRow[]> {
  const groupedRows = new Map<string, ShopifyRow[]>()
  
  rows.forEach(row => {
    if (!row.Handle) return
    
    const existingRows = groupedRows.get(row.Handle) || []
    existingRows.push(row)
    groupedRows.set(row.Handle, existingRows)
  })
  
  return groupedRows
}

function extractCategories(rows: ShopifyRow[]): Category[] {
  const categoryMap = new Map<string, Set<string>>()
  
  rows.forEach(row => {
    const category = row['Product Category']?.trim() || row.Type?.trim()
    const subcategory = row['Product Category']?.trim()
    
    if (category) {
      if (!categoryMap.has(category)) {
        categoryMap.set(category, new Set())
      }
      
      if (subcategory) {
        categoryMap.get(category)!.add(subcategory)
      }
    }
  })

  // Convert map to array of Category objects
  return Array.from(categoryMap.entries())
    .map(([name, subcategories]) => ({
      name,
      subcategories: Array.from(subcategories).sort()
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

function convertToProduct(rows: ShopifyRow[]): Product | null {
  try {
    if (!rows || rows.length === 0 || !rows[0].Handle) return null

    // Use the first row for basic product info
    const mainRow = rows[0]

    // Skip if it's just a variant row (has Option Value but no Title)
    if (!mainRow.Title && (mainRow['Option1 Value'] || mainRow['Option2 Value'] || mainRow['Option3 Value'])) {
      return null
    }

    // Clean and validate text
    const title = mainRow.Title?.trim() || ''
    const description = mainRow['Body (HTML)']?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || ''
    const category = mainRow['Product Category']?.trim() || mainRow.Type?.trim() || 'Uncategorized'
    const id = mainRow.Handle.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')

    // Clean and validate price
    const compareAtPrice = parseFloat(mainRow['Variant Compare At Price']) || 0
    const regularPrice = parseFloat(mainRow['Variant Price']) || 0
    const price = compareAtPrice > 0 ? compareAtPrice : regularPrice

    // Collect all images from all variants
    const images = new Set<string>()
    rows.forEach(row => {
      if (row['Image Src']?.trim() && row['Image Src'].startsWith('http')) {
        images.add(row['Image Src'].trim())
      }
    })

    // Only create product if we have the minimum required fields
    if (!title || !id || price <= 0) {
      console.warn('Skipping product due to missing required fields:', { id, title, price })
      return null
    }

    // Create variants array if product has options
    const validVariants = rows
      .filter(row => row['Option1 Value']) // Only include rows with at least one option
      .map(row => ({
        sku: row['Variant SKU'] || '',
        price: parseFloat(row['Variant Price']) || 0,
        compareAtPrice: parseFloat(row['Variant Compare At Price']) || undefined,
        option1: row['Option1 Value'] || '',
        option2: row['Option2 Value'] || undefined,
        option3: row['Option3 Value'] || undefined,
        inventory: parseInt(row['Variant Grams']) || 0
      }))

    return {
      id,
      name: title,
      description,
      category,
      price,
      images: Array.from(images),
      variants: validVariants.length > 0 ? validVariants : undefined,
      options: {
        option1: mainRow['Option1 Name'] || undefined,
        option2: mainRow['Option2 Name'] || undefined,
        option3: mainRow['Option3 Name'] || undefined
      }
    }
  } catch (error) {
    console.error('Error converting rows to product:', error, rows)
    return null
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Read file content
    const buffer = Buffer.from(await file.arrayBuffer())
    const content = buffer.toString()

    // Parse CSV with more explicit options
    let records
    try {
      records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        bom: true, // Handle BOM if present
        delimiter: ',',
        relax_column_count: true,
        skip_records_with_error: true
      }) as ShopifyRow[]
    } catch (parseError) {
      console.error('CSV parsing error:', parseError)
      return NextResponse.json({ 
        error: 'Failed to parse CSV file. Please ensure it is a valid CSV file in Shopify export format.' 
      }, { status: 400 })
    }

    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ 
        error: 'Invalid CSV format. The file must contain at least one row of data.' 
      }, { status: 400 })
    }

    // Validate required columns
    const requiredColumns = ['Handle', 'Title', 'Variant Price']
    const missingColumns = requiredColumns.filter(col => !(col in records[0]))
    if (missingColumns.length > 0) {
      return NextResponse.json({ 
        error: `Missing required columns: ${missingColumns.join(', ')}` 
      }, { status: 400 })
    }

    // Extract categories with subcategories
    const categories = extractCategories(records)

    // Add default category if none found
    if (categories.length === 0) {
      categories.push({
        name: 'Uncategorized',
        subcategories: []
      })
    }

    // Group rows by Handle (product ID)
    const groupedRows = groupRowsByHandle(records)

    // Convert grouped rows to products
    const products = Array.from(groupedRows.values())
      .map(rows => convertToProduct(rows))
      .filter(Boolean) as Product[]

    if (products.length === 0) {
      return NextResponse.json(
        { error: 'No valid products found in CSV' },
        { status: 400 }
      )
    }

    return NextResponse.json({ 
      message: 'CSV validated successfully',
      products,
      categories
    })
  } catch (error) {
    console.error('Failed to validate CSV:', error)
    return NextResponse.json(
      { error: 'Failed to process CSV file. Please check the file format and try again.' },
      { status: 500 }
    )
  }
} 