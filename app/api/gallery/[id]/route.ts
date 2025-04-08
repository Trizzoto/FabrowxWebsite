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

// Helper function to read gallery data
async function readGalleryData(): Promise<GalleryImage[]> {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

// Helper function to write gallery data
async function writeGalleryData(data: GalleryImage[]) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2))
}

// PATCH /api/gallery/[id] - Update a gallery image
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { caption, category } = body

    const images = await readGalleryData()
    const imageIndex = images.findIndex(img => img.id === params.id)

    if (imageIndex === -1) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Update only the fields that are provided
    const updatedImage = {
      ...images[imageIndex],
      ...(caption !== undefined && { caption }),
      ...(category !== undefined && { category })
    }

    images[imageIndex] = updatedImage
    await writeGalleryData(images)

    return NextResponse.json(updatedImage)
  } catch (error) {
    console.error('Error updating image:', error)
    return NextResponse.json({ error: 'Failed to update image' }, { status: 500 })
  }
}

// DELETE /api/gallery/[id] - Delete a gallery image
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const images = await readGalleryData()
    const imageToDelete = images.find(img => img.id === params.id)

    if (!imageToDelete) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    const updatedImages = images.filter(img => img.id !== params.id)
    await writeGalleryData(updatedImages)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
} 