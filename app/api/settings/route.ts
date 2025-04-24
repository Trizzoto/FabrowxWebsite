import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'site_settings')
      .single()

    if (error) throw error
    
    return NextResponse.json(data?.value || {})
  } catch (error) {
    console.error('Error reading settings:', error)
    return NextResponse.json({ error: 'Failed to read settings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const settings = await request.json()
    
    const { error } = await supabase
      .from('settings')
      .upsert({
        key: 'site_settings',
        value: settings,
        updated_at: new Date().toISOString()
      })

    if (error) throw error
    
    return NextResponse.json({ message: 'Settings saved successfully' })
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
} 