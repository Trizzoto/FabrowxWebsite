import { headers } from 'next/headers'
import { GalleryContent } from './gallery-content'

interface GalleryImage {
  id: string
  url: string
  caption: string
  category: string
}

async function getGalleryImages(): Promise<GalleryImage[]> {
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  
  const response = await fetch(`${protocol}://${host}/api/gallery`, {
    next: { revalidate: 60 } // Revalidate every minute
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch gallery images');
  }
  return response.json();
}

export default async function GalleryPage() {
  const galleryImages = await getGalleryImages();
  
  return <GalleryContent galleryImages={galleryImages} />
} 