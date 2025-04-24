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
    
    // Transform the data to match the expected format in the frontend
    const settingsValue = data?.value || {}
    const transformedSettings = {
      contactInfo: {
        phone: settingsValue.phone || '',
        email: settingsValue.contactEmail || '',
        location: settingsValue.address || ''
      },
      socialLinks: {
        facebook: settingsValue.socialMedia?.facebook || '',
        instagram: settingsValue.socialMedia?.instagram || '',
        youtube: '' // Not in original data, but expected by component
      },
      siteName: settingsValue.siteName || 'Elite Fabworx'
    }
    
    return NextResponse.json(transformedSettings)
  } catch (error) {
    console.error('Error reading settings:', error)
    return NextResponse.json({ 
      contactInfo: {
        phone: '',
        email: '',
        location: ''
      },
      socialLinks: {
        facebook: '',
        instagram: '',
        youtube: ''
      },
      siteName: 'Elite Fabworx'
    })
  }
}

export async function POST(request: Request) {
  try {
    const frontendSettings = await request.json()
    
    // Transform the frontend format back to the Supabase format
    const supabaseSettings = {
      siteName: frontendSettings.siteName || 'Elite Fabworx',
      contactEmail: frontendSettings.contactInfo?.email || '',
      phone: frontendSettings.contactInfo?.phone || '',
      address: frontendSettings.contactInfo?.location || '',
      socialMedia: {
        facebook: frontendSettings.socialLinks?.facebook || '',
        instagram: frontendSettings.socialLinks?.instagram || '',
        linkedin: frontendSettings.socialLinks?.youtube || '' // Using youtube for linkedin as a stopgap
      }
    }
    
    const { error } = await supabase
      .from('settings')
      .upsert({
        key: 'site_settings',
        value: supabaseSettings,
        updated_at: new Date().toISOString()
      })

    if (error) throw error
    
    return NextResponse.json({ message: 'Settings saved successfully' })
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
} 