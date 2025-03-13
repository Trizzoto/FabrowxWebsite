import { promises as fs } from 'fs'
import { NextResponse } from 'next/server'
import path from 'path'

export async function GET() {
  try {
    const settingsPath = path.join(process.cwd(), 'app/data/settings.json')
    const settings = await fs.readFile(settingsPath, 'utf-8')
    return NextResponse.json(JSON.parse(settings))
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read settings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const settingsPath = path.join(process.cwd(), 'app/data/settings.json')
    const settings = await request.json()
    await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2))
    return NextResponse.json({ message: 'Settings saved successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
} 