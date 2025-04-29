import { headers } from 'next/headers'
import { ServicesContent } from './services-content'
import { Metadata } from 'next'

interface Service {
  title: string
  description: string
  image: string
  icon: string
  slug: string
}

interface Settings {
  services: Service[]
}

// Define metadata for better SEO
export const metadata: Metadata = {
  title: 'Custom Automotive Fabrication Services | Based in Tailem Bend, Servicing Adelaide',
  description: 'Expert metal fabrication services from our Tailem Bend workshop, serving clients across Adelaide and South Australia. Custom exhausts, roll cages, and 4x4 accessories built for performance and durability.',
  keywords: 'metal fabrication Adelaide, custom exhaust Adelaide, roll cage fabrication Adelaide, 4x4 fabrication Adelaide, metal fabrication Tailem Bend, 4x4 fabrication South Australia, The Bend Motorsport Park fabrication',
  openGraph: {
    title: 'Custom Automotive Fabrication Services | Based in Tailem Bend, Servicing Adelaide',
    description: 'Expert metal fabrication services from our Tailem Bend workshop, serving clients across Adelaide and South Australia. Custom exhausts, roll cages, and 4x4 accessories built for performance and durability.',
    images: ['/fabrication.jpg'],
    type: 'website',
  },
}

async function getSettings(): Promise<Settings> {
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  
  const response = await fetch(`${protocol}://${host}/api/settings`, {
    next: { revalidate: 60 }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch settings');
  }
  return response.json();
}

export default async function ServicesPage() {
  const settings = await getSettings();
  
  return <ServicesContent services={settings.services} />
} 