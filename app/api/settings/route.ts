import { promises as fs } from 'fs'
import { NextResponse } from 'next/server'
import path from 'path'

const defaultSettings = {
  heroImage: '/images/hero-default.jpg',
  heroTagline: 'Professional Metal Fabrication Services',
  aboutText: 'Welcome to Elite FabWorx',
  aboutImage: '/images/about-default.jpg',
  contactInfo: {
    phone: '',
    email: '',
    location: ''
  },
  footerText: '© 2024 Elite FabWorx - Professional Metal Fabrication Services',
  services: [],
  theme: {
    primary: 'orange-500',
    secondary: 'zinc-800',
    accent: 'orange-400',
    background: 'black',
    text: 'white'
  },
  socialLinks: {
    facebook: '',
    youtube: '',
    instagram: ''
  }
}

export async function GET() {
  try {
    const settingsPath = path.join(process.cwd(), 'app/data/settings.json')
    const settings = await fs.readFile(settingsPath, 'utf-8')
    return NextResponse.json(JSON.parse(settings))
  } catch (error) {
    console.error('Error reading settings:', error)
    // Return default settings if file cannot be read
    return NextResponse.json(defaultSettings)
  }
}

export async function POST(request: Request) {
  try {
    const settingsPath = path.join(process.cwd(), 'app/data/settings.json')
    const settings = await request.json()
    await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2))
    return NextResponse.json({ message: 'Settings saved successfully' })
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
} 