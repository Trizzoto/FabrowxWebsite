import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'app/data/gallery.json')

interface GalleryImage {
  id: string
  url: string
  caption: string
  category: string
}

// Helper function to generate a unique ID
function generateId() {
  return `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// Helper function to read gallery data
async function readGalleryData(): Promise<GalleryImage[]> {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist, create it with empty array
    await fs.writeFile(dataFilePath, '[]')
    return []
  }
}

// Helper function to write gallery data
async function writeGalleryData(data: GalleryImage[]) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2))
}

// Helper function to extract Cloudinary public ID from URL
function getCloudinaryPublicId(url: string): string {
  const matches = url.match(/\/upload\/.*?\/([^/]+)$/)
  return matches ? matches[1] : url
}

// Helper function to remove duplicates
function removeDuplicates(images: GalleryImage[]): GalleryImage[] {
  const seen = new Map<string, GalleryImage>()
  
  // Sort by ID to keep the most recent version of each image
  const sortedImages = [...images].sort((a, b) => b.id.localeCompare(a.id))
  
  for (const image of sortedImages) {
    const publicId = getCloudinaryPublicId(image.url)
    if (!seen.has(publicId)) {
      seen.set(publicId, image)
    }
  }
  
  return Array.from(seen.values())
}

// GET /api/gallery - Get all gallery images
export async function GET() {
  try {
    const images = await readGalleryData()
    const uniqueImages = removeDuplicates(images)
    
    // If we removed duplicates, update the file
    if (uniqueImages.length !== images.length) {
      await writeGalleryData(uniqueImages)
    }
    
    return NextResponse.json(uniqueImages)
  } catch (error) {
    console.error('Error in GET /api/gallery:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery images' }, { status: 500 })
  }
}

// POST /api/gallery - Add new gallery images
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newImages: Omit<GalleryImage, 'id'>[] = Array.isArray(body.images) ? body.images : [body.images]
    
    const existingImages = await readGalleryData()
    const existingPublicIds = new Set(existingImages.map(img => getCloudinaryPublicId(img.url)))
    
    const uniqueNewImages = newImages.filter(img => !existingPublicIds.has(getCloudinaryPublicId(img.url)))
    
    if (uniqueNewImages.length === 0) {
      return NextResponse.json({ message: 'All images already exist in gallery' }, { status: 200 })
    }
    
    const imagesWithIds = uniqueNewImages.map(image => ({
      ...image,
      id: generateId(),
      caption: image.caption || '',
      category: image.category || 'general'
    }))
    
    const updatedImages = [...existingImages, ...imagesWithIds]
    await writeGalleryData(updatedImages)
    
    return NextResponse.json(imagesWithIds)
  } catch (error) {
    console.error('Error in POST /api/gallery:', error)
    return NextResponse.json({ error: 'Failed to add gallery images' }, { status: 500 })
  }
} 