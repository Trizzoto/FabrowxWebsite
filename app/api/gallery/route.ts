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

const defaultGalleryImages: GalleryImage[] = []

// Helper function to generate a unique ID
function generateId(): string {
  return `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// Helper function to read gallery data
async function readGalleryData(): Promise<GalleryImage[]> {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf-8')
    return JSON.parse(fileContents)
  } catch (error) {
    console.error('Error reading gallery data:', error)
    return defaultGalleryImages
  }
}

// Helper function to write gallery data
async function writeGalleryData(data: GalleryImage[]): Promise<void> {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error writing gallery data:', error)
    throw error
  }
}

// GET /api/gallery - Get all gallery images
export async function GET() {
  try {
    const images = await readGalleryData()
    return NextResponse.json(images)
  } catch (error) {
    console.error('Error reading gallery data:', error)
    return NextResponse.json(defaultGalleryImages)
  }
}

// POST /api/gallery - Add new gallery images
export async function POST(request: Request) {
  try {
    const { images } = await request.json()
    const currentImages = await readGalleryData()
    
    // Add new images to the existing ones
    const updatedImages = [...currentImages, ...images]
    await writeGalleryData(updatedImages)
    
    return NextResponse.json(images)
  } catch (error) {
    console.error('Error saving gallery data:', error)
    return NextResponse.json({ error: 'Failed to save gallery images' }, { status: 500 })
  }
}

// DELETE /api/gallery - Delete all gallery images
export async function DELETE() {
  try {
    await writeGalleryData([])
    return NextResponse.json({ message: 'All gallery images deleted successfully' })
  } catch (error) {
    console.error('Error deleting gallery data:', error)
    return NextResponse.json({ error: 'Failed to delete gallery images' }, { status: 500 })
  }
} 