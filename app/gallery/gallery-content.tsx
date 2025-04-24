"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronRight, ChevronLeft, X, ArrowLeft, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface GalleryImage {
  id: string
  url: string
  caption: string
  category: string
}

interface GalleryContentProps {
  galleryImages: GalleryImage[]
}

export function GalleryContent({ galleryImages }: GalleryContentProps) {
  const router = useRouter()
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  
  const handlePrevImage = () => {
    if (selectedImageIndex === null) return
    setSelectedImageIndex(selectedImageIndex === 0 ? galleryImages.length - 1 : selectedImageIndex - 1)
  }
  
  const handleNextImage = () => {
    if (selectedImageIndex === null) return
    setSelectedImageIndex(selectedImageIndex === galleryImages.length - 1 ? 0 : selectedImageIndex + 1)
  }

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return
      
      if (e.key === 'ArrowLeft') {
        handlePrevImage()
      } else if (e.key === 'ArrowRight') {
        handleNextImage()
      } else if (e.key === 'Escape') {
        setSelectedImageIndex(null)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImageIndex])

  const selectedImage = selectedImageIndex !== null ? galleryImages[selectedImageIndex] : null

  return (
    <div className="bg-black min-h-screen">
      {/* Get a Quote Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          className="bg-orange-600 hover:bg-orange-700 text-white transition-all duration-300"
          asChild
        >
          <Link href="/contact">
            <MessageSquare className="mr-2 h-4 w-4" />
            Get a Quote
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <div className="relative h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10"></div>
        <Image
          src="https://res.cloudinary.com/dz8iqfdvf/image/upload/v1741783803/lc03gne4mnc77za4awxa.jpg"
          alt="Gallery header"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="relative z-20 container h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-7xl font-bold mb-4">
            <span className="text-orange-500 font-extrabold tracking-wider">OUR</span>
            <span className="font-light tracking-widest ml-2">GALLERY</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 max-w-2xl font-light tracking-wide">
            Browse through our portfolio of custom fabrication work and completed projects
          </p>
        </div>
      </div>

      {/* Gallery Section */}
      <section className="py-12 bg-zinc-900">
        <div className="container px-4 md:px-6">
          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group"
              >
                <Card 
                  className="bg-zinc-800 border-zinc-700 overflow-hidden hover:border-orange-500/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={image.url}
                      alt={image.caption || 'Gallery image'}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                        View
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {image.caption && (
                    <CardContent className="p-4">
                      <p className="text-zinc-300 font-medium">{image.caption}</p>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          {galleryImages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-zinc-400 text-lg">No images found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Image Detail Dialog */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={(open) => !open && setSelectedImageIndex(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-5xl p-2 sm:p-6" hideCloseButton>
          {selectedImage && (
            <>
              <DialogHeader className="mb-2">
                <DialogTitle className="text-xl font-bold flex items-center justify-between">
                  <span>{selectedImage.caption || 'Gallery Image'}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-zinc-400 hover:text-white"
                    onClick={() => setSelectedImageIndex(null)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </DialogTitle>
                {selectedImage.category && selectedImage.category !== 'general' && (
                  <DialogDescription className="text-orange-400">
                    {selectedImage.category.charAt(0).toUpperCase() + selectedImage.category.slice(1)}
                  </DialogDescription>
                )}
              </DialogHeader>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.caption || 'Gallery image'}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                  priority
                />
                
                {/* Navigation Arrows */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
              
              {/* Caption and Description */}
              {(selectedImage.caption || selectedImage.category !== 'general') && (
                <div className="mt-4 space-y-2">
                  {selectedImage.caption && (
                    <p className="text-zinc-300 text-lg font-medium">{selectedImage.caption}</p>
                  )}
                  {selectedImage.category && selectedImage.category !== 'general' && (
                    <p className="text-orange-400 text-sm">
                      Category: {selectedImage.category.charAt(0).toUpperCase() + selectedImage.category.slice(1)}
                    </p>
                  )}
                </div>
              )}
              
              {/* Image Counter */}
              <div className="mt-2 text-center text-sm text-zinc-500">
                Image {selectedImageIndex !== null ? selectedImageIndex + 1 : 0} of {galleryImages.length}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 