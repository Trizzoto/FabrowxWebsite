"use client"

import { useState } from 'react'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Upload, Loader2 } from 'lucide-react'

export interface CloudinaryUploadProps {
  onUploadComplete: (url: string) => void
  section?: string
}

export function CloudinaryUpload({ onUploadComplete, section = 'general' }: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default')
      formData.append('folder', section)

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      onUploadComplete(data.secure_url)
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={isUploading}
        className="hidden"
        id={`cloudinary-upload-${section}`}
      />
      <Label
        htmlFor={`cloudinary-upload-${section}`}
        className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Image
          </>
        )}
      </Label>
    </div>
  )
} 