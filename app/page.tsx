import { HomeContent } from './components/home-content'
import { headers } from 'next/headers'

interface Service {
  title: string
  description: string
  image: string
  icon: string
  slug: string
}

interface GalleryImage {
  id: string
  url: string
  caption: string
  category: string
}

interface Settings {
  heroImage: string
  heroTagline: string
  aboutText: string
  aboutImage: string
  contactInfo: {
    phone: string
    email: string
    location: string
  }
  services: Service[]
  socialLinks?: {
    facebook?: string
    youtube?: string
    instagram?: string
  }
}

async function getSettings(): Promise<Settings> {
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  
  const response = await fetch(`${protocol}://${host}/api/settings`, {
    next: { revalidate: 60 } // Revalidate every minute
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch settings');
  }
  return response.json();
}

async function getGalleryImages(): Promise<GalleryImage[]> {
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  
  // Fetch all gallery images - the HomeContent component will randomly select 6 to display
  const response = await fetch(`${protocol}://${host}/api/gallery`, {
    next: { revalidate: 60 } // Revalidate every minute
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch gallery images');
  }
  return response.json();
}

export default async function Home() {
  const [settings, galleryImages] = await Promise.all([
    getSettings(),
    getGalleryImages()
  ]);
  
  return <HomeContent settings={settings} galleryImages={galleryImages} />
}

