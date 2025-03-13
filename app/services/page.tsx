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
  title: 'Professional Metal Fabrication Services | Elite FabWorx',
  description: 'Expert metal fabrication services for performance vehicles and 4WDs. Custom builds, repairs, and modifications with quality craftsmanship.',
  keywords: 'metal fabrication, custom exhaust, roll cages, performance upgrades, 4WD modifications, Elite FabWorx',
  openGraph: {
    title: 'Professional Metal Fabrication Services | Elite FabWorx',
    description: 'Expert metal fabrication services for performance vehicles and 4WDs. Custom builds, repairs, and modifications with quality craftsmanship.',
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