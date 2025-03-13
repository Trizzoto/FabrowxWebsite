"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { MultiImageUpload } from "../../components/ui/multi-image-upload"

interface GalleryImage {
  id: string
  url: string
  caption: string
  category: string
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/gallery')
      if (!response.ok) throw new Error('Failed to fetch images')
      const data = await response.json()
      setImages(data)
    } catch (error) {
      console.error('Error fetching images:', error)
      toast.error('Failed to load gallery images')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadComplete = (urls: string[]) => {
    fetchImages() // Refresh the gallery after upload
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete image')
      
      setImages(images.filter(img => img.id !== id))
      toast.success('Image deleted successfully')
    } catch (error) {
      console.error('Error deleting image:', error)
      toast.error('Failed to delete image')
    }
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gallery Management</h1>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Images</h2>
          <MultiImageUpload onUploadComplete={handleUploadComplete} />
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative group"
            >
              <Card className="overflow-hidden">
                <div className="relative aspect-video">
                  <Image
                    src={image.url}
                    alt={image.caption || 'Gallery image'}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(image.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-zinc-500">{image.caption || 'No caption'}</p>
                  {image.category && (
                    <span className="text-xs text-orange-500 mt-1 inline-block">
                      {image.category}
                    </span>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
} 