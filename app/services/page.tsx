import { headers } from 'next/headers'
import { ServicesContent } from './services-content'

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