export interface Settings {
  shopName: string
  description: string
  logo?: string
  theme: {
    primary: string
    secondary: string
  }
}

export async function getSettings(): Promise<Settings> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL 
    ? (process.env.NEXT_PUBLIC_BASE_URL.startsWith('http') 
        ? process.env.NEXT_PUBLIC_BASE_URL 
        : `https://${process.env.NEXT_PUBLIC_BASE_URL}`)
    : (process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : 'http://localhost:3000');
  const response = await fetch(`${baseUrl}/api/settings`, { cache: 'no-store' })
  const settings = await response.json()
  return settings
} 