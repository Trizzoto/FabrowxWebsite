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
function generateId(): string {
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

// GET /api/gallery - Get all gallery images
export async function GET() {
  try {
    const images = await readGalleryData()
    return NextResponse.json(images)
  } catch (error) {
    console.error('Error reading gallery data:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery images' }, { status: 500 })
  }
}

// POST /api/gallery - Add new gallery images
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { images } = body

    if (!Array.isArray(images)) {
      return NextResponse.json({ error: 'Invalid request format. Expected array of images.' }, { status: 400 })
    }

    const existingImages = await readGalleryData()
    const newImages: GalleryImage[] = images.map(img => ({
      id: generateId(),
      url: img.url,
      caption: img.caption || '',
      category: img.category || 'general'
    }))

    const updatedImages = [...existingImages, ...newImages]
    await writeGalleryData(updatedImages)

    return NextResponse.json(newImages)
  } catch (error) {
    console.error('Error adding gallery images:', error)
    return NextResponse.json({ error: 'Failed to add gallery images' }, { status: 500 })
  }
} 