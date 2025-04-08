"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CloudinaryUpload } from '@/components/ui/cloudinary-upload'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, ChevronRight } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { WebsitePreview } from '@/components/admin/website-preview'
import { Toaster } from '@/components/ui/toaster'

interface Service {
  title: string
  description: string
  image: string
  icon: string
  slug: string
}

interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
}

interface Settings {
  heroImage: string
  heroTagline: string
  aboutText: string
  aboutImage: string
  galleryImages: string[]
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
  const [activeTab, setActiveTab] = useState("live-editor")

  useEffect(() => {
    loadSettings()
  }, [])

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
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) throw new Error('Failed to save settings')

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

  const handleHeroImageUpload = (imageUrl: string) => {
    if (!settings) return
    console.log('Settings page: Hero image upload received:', imageUrl)
    
    // Show a toast notification
    toast({
      title: "Image Updated",
      description: "Hero image updated successfully",
    })
    
    setSettings({
      ...settings,
      heroImage: imageUrl
    })
  }

  const handleServiceImageUpload = (index: number, imageUrl: string) => {
    if (!settings) return
    const updatedServices = [...settings.services]
    updatedServices[index] = {
      ...updatedServices[index],
      image: imageUrl
    }
    setSettings({
      ...settings,
      services: updatedServices
    })
  }

  const handleServiceTitleChange = (index: number, title: string) => {
    if (!settings) return
    const updatedServices = [...settings.services]
    updatedServices[index] = {
      ...updatedServices[index],
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-')
    }
    setSettings({
      ...settings,
      services: updatedServices
    })
  }

  const handleServiceDescriptionChange = (index: number, description: string) => {
    if (!settings) return
    const updatedServices = [...settings.services]
    updatedServices[index] = {
      ...updatedServices[index],
      description
    }
    setSettings({
      ...settings,
      services: updatedServices
    })
  }

  const handleHeroTaglineChange = (tagline: string) => {
    if (!settings) return
    setSettings({
      ...settings,
      heroTagline: tagline
    })
  }

  const handleAboutTextChange = (text: string) => {
    if (!settings) return
    setSettings({
      ...settings,
      aboutText: text
    })
  }

  const handleAboutImageChange = (imageUrl: string) => {
    if (!settings) return
    setSettings({
      ...settings,
      aboutImage: imageUrl
    })
  }

  const handleContactInfoChange = (field: keyof Settings['contactInfo'], value: string) => {
    if (!settings) return
    setSettings({
      ...settings,
      contactInfo: {
        ...settings.contactInfo,
        [field]: value
      }
    })
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container-fluid max-w-full py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Website Settings</h1>
        <Button onClick={saveSettings} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save All Changes
        </Button>
      </div>
      
      <Tabs defaultValue="live-editor" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="live-editor">Live Editor</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Live Editor Tab */}
        <TabsContent value="live-editor" className="space-y-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Live Website Editor</CardTitle>
              <CardDescription>
                Edit your website content directly by clicking on elements. Changes are shown instantly and saved when you click "Save All Changes".
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-auto">
              {/* Add Hero Image Upload Button */}
              {settings && (
                <div className="flex justify-end p-4 bg-zinc-950">
                  <CloudinaryUpload
                    onUploadComplete={handleHeroImageUpload}
                    section="hero"
                    buttonText="Change Hero Image"
                    buttonVariant="outline"
                    buttonSize="default"
                  />
                </div>
              )}
              
              {settings && (
                <WebsitePreview 
                  settings={settings} 
                  onUpdate={(updatedSettings) => setSettings(updatedSettings)} 
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab (formerly Appearance) */}
        <TabsContent value="settings" className="space-y-6">
          {/* Logo Section */}
          <Card>
            <CardHeader>
              <CardTitle>Logo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-orange-500">
                    <img src="/logo.png" alt="Logo" className="object-cover w-full h-full" />
                  </div>
                  <CloudinaryUpload
                    onUploadComplete={(url) => {
                      // This would need server implementation to actually replace the logo file
                      toast({
                        title: "Logo Upload",
                        description: "To update the logo, please replace the logo.png file in your public directory",
                      })
                    }}
                    section="logo"
                    buttonText="Upload New Logo"
                  />
                  <p className="text-sm text-zinc-500">
                    Note: Uploading a new logo requires manual replacement of the logo file in your project.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Logo Sizes</label>
                    <p className="text-sm text-zinc-500">
                      The logo is displayed at these sizes:
                      <ul className="list-disc pl-5 mt-2">
                        <li>Header: 40px x 40px</li>
                        <li>Hero: 150px x 150px (mobile), 225px x 225px (desktop)</li>
                        <li>Footer: 60px x 60px</li>
                      </ul>
                    </p>
                    <p className="text-sm text-zinc-500 mt-4">
                      For best results, upload a square image at least 300x300px in PNG format with transparency.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media Links Section */}
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
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  )
}

