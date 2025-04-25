"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CloudinaryUpload } from '@/components/ui/cloudinary-upload'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Wrench, Car, Truck, Cog } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'

interface Service {
  title: string
  description: string
  image: string
  icon: string
  slug: string
  offerings: string[]
}

interface Testimonial {
  id: string
  name: string
  text: string
  rating: number
  date: string
}

interface Settings {
  heroImage: string
  heroTagline: string
  aboutText: string
  aboutImage: string
  galleryImages: {
    id: string
    url: string
    caption: string
    category: string
  }[]
  testimonials: Testimonial[]
  contactInfo: {
    phone: string
    email: string
    location: string
  }
  footerText: string
  services: Service[]
  theme: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  socialLinks?: {
    facebook?: string
    youtube?: string
    instagram?: string
  }
}

export default function SettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState<Settings | null>(null)
  const [galleryImages, setGalleryImages] = useState<{
    id: string
    url: string
    caption: string
    category: string
  }[]>([])

  useEffect(() => {
    loadSettings()
    loadGalleryImages()
  }, [])

  const loadGalleryImages = async () => {
    try {
      const response = await fetch('/api/gallery')
      if (!response.ok) throw new Error('Failed to fetch gallery images')
      const data = await response.json()
      setGalleryImages(data)
    } catch (error) {
      console.error('Failed to load gallery images:', error)
      toast({
        title: "Error",
        description: "Failed to load gallery images",
        variant: "destructive"
      })
    }
  }

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()
      
      // Initialize socialLinks if they don't exist
      if (!data.socialLinks) {
        data.socialLinks = {
          facebook: '',
          youtube: '',
          instagram: ''
        }
      }
      
      // Initialize galleryImages if they don't exist
      if (!data.galleryImages) {
        data.galleryImages = []
      }
      
      setSettings(data)
    } catch (error) {
      console.error('Failed to load settings:', error)
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive"
      })
    }
  }

  const saveSettings = async () => {
    if (!settings) return

    setIsLoading(true)
    try {
      // Save settings
      const settingsResponse = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (!settingsResponse.ok) throw new Error('Failed to save settings')

      // Save gallery images
      const galleryResponse = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images: galleryImages }),
      })

      if (!galleryResponse.ok) throw new Error('Failed to save gallery images')

      toast({
        title: "Success",
        description: "Settings saved successfully",
      })
    } catch (error) {
      console.error('Failed to save settings:', error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-end mb-6">
        <Button onClick={saveSettings} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
      
      <div className="space-y-6">
        {/* Website Content Section */}
        <Card>
          <CardHeader>
            <CardTitle>Website Content</CardTitle>
            <CardDescription>
              Manage the main content of your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="heroTagline">Hero Tagline</Label>
                <Input
                  id="heroTagline"
                  value={settings.heroTagline}
                  onChange={(e) => setSettings({
                    ...settings,
                    heroTagline: e.target.value
                  })}
                  placeholder="Enter your hero tagline"
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="aboutText">About Text</Label>
                <Textarea
                  id="aboutText"
                  value={settings.aboutText}
                  onChange={(e) => setSettings({
                    ...settings,
                    aboutText: e.target.value
                  })}
                  placeholder="Enter your about text"
                  className="w-full min-h-[150px]"
                />
              </div>
              
              <div>
                <Label htmlFor="footerText">Footer Text</Label>
                <Input
                  id="footerText"
                  value={settings.footerText || ""}
                  onChange={(e) => setSettings({
                    ...settings,
                    footerText: e.target.value
                  })}
                  placeholder="Enter your footer text"
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Section */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Update your contact details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={settings.contactInfo.phone}
                  onChange={(e) => setSettings({
                    ...settings,
                    contactInfo: {
                      ...settings.contactInfo,
                      phone: e.target.value
                    }
                  })}
                  placeholder="Enter your phone number"
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={settings.contactInfo.email}
                  onChange={(e) => setSettings({
                    ...settings,
                    contactInfo: {
                      ...settings.contactInfo,
                      email: e.target.value
                    }
                  })}
                  placeholder="Enter your email address"
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={settings.contactInfo.location}
                  onChange={(e) => setSettings({
                    ...settings,
                    contactInfo: {
                      ...settings.contactInfo,
                      location: e.target.value
                    }
                  })}
                  placeholder="Enter your location"
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Links */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>
              Add your social media profile URLs to display in the website footer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Facebook</label>
                <div className="flex">
                  <Input
                    value={settings?.socialLinks?.facebook || ""}
                    onChange={(e) => setSettings({
                      ...settings,
                      socialLinks: {
                        ...(settings.socialLinks || {}),
                        facebook: e.target.value
                      }
                    })}
                    placeholder="https://facebook.com/yourpage"
                    className="w-full"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">YouTube</label>
                <div className="flex">
                  <Input
                    value={settings?.socialLinks?.youtube || ""}
                    onChange={(e) => setSettings({
                      ...settings,
                      socialLinks: {
                        ...(settings.socialLinks || {}),
                        youtube: e.target.value
                      }
                    })}
                    placeholder="https://youtube.com/channel/yourchannel"
                    className="w-full"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Instagram</label>
                <div className="flex">
                  <Input
                    value={settings?.socialLinks?.instagram || ""}
                    onChange={(e) => setSettings({
                      ...settings,
                      socialLinks: {
                        ...(settings.socialLinks || {}),
                        instagram: e.target.value
                      }
                    })}
                    placeholder="https://instagram.com/youraccount"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

