"use client"

import { useState, useRef } from "react"
import { Button } from "./button"
import { Loader2, Upload } from "lucide-react"
import { toast } from "sonner"

interface MultiImageUploadProps {
  onUploadComplete: (urls: string[]) => void
  section?: string
}

export function MultiImageUpload({ onUploadComplete, section = 'general' }: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [totalFiles, setTotalFiles] = useState(0)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setTotalFiles(files.length)
    setUploadProgress(0)

    try {
      const uploadedImages = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('section', section)

        // Upload to Cloudinary through our API route
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadResponse.ok) {
          throw new Error(`Failed to upload image ${i + 1}`)
        }

        const uploadData = await uploadResponse.json()
        uploadedImages.push({
          url: uploadData.url,
          caption: '',
          category: section
        })

        // Update progress
        setUploadProgress(((i + 1) / files.length) * 100)
      }

      // Save all images to gallery
      const galleryResponse = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images: uploadedImages }),
      })

      if (!galleryResponse.ok) {
        throw new Error('Failed to save images to gallery')
      }

      const savedImages = await galleryResponse.json()
      onUploadComplete(savedImages.map((img: any) => img.url))
      toast.success(`Successfully uploaded ${files.length} images`)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload images')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        variant="outline"
        className="w-full"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading {Math.round(uploadProgress)}%
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Select Images
          </>
        )}
      </Button>
      {isUploading && (
        <div className="w-full bg-zinc-700 rounded-full h-2">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
    </div>
  )
} 