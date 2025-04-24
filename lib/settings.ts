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
  const response = await fetch('http://localhost:3000/api/settings', { cache: 'no-store' })
  const settings = await response.json()
  return settings
} 