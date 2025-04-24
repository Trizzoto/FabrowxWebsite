import { Product } from './products'

export type BlockType = 
  | 'HeroVariant1' 
  | 'ProductGrid'
  | 'Testimonials'
  | 'Features'
  | 'Newsletter'
  | 'ContactForm'

export interface LayoutBlock {
  type: BlockType
  props: Record<string, any>
}

export interface PageLayout {
  id: string
  name: string
  blocks: LayoutBlock[]
}

export async function getLayout(pageId: string): Promise<PageLayout> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const response = await fetch(`${baseUrl}/api/layouts/${pageId}`, { cache: 'no-store' })
  const layout = await response.json()
  return layout
}

export async function saveLayout(layout: PageLayout): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  await fetch(`${baseUrl}/api/layouts/${layout.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(layout),
  })
}

export function createEmptyLayout(name: string): PageLayout {
  return {
    id: crypto.randomUUID(),
    name,
    blocks: []
  }
} 