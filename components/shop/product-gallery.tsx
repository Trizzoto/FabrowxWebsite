"use client"

import { useState } from "react"
import Image from "next/image"

interface ProductGalleryProps {
  images: string[]
  name: string
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="space-y-4">
      <div className="aspect-square relative rounded-lg overflow-hidden border border-zinc-800">
        <Image src={images[selectedImage] || "/placeholder.svg"} alt={name} fill className="object-cover" priority />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square relative rounded-md overflow-hidden border ${
                selectedImage === index ? "border-blue-500" : "border-zinc-800"
              }`}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${name} - Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

