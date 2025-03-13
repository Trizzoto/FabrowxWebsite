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

interface Service {
  title: string
  description: string
  image: string
  icon: string
  slug: string
}

interface Settings {
  heroImage: string
  heroTagline: string
  aboutText: string
  aboutImage: string
  contactInfo: {
    phone: string
    email: string
    location: string
  }
  services: Service[]
}

export default function SettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()
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
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Button onClick={saveSettings} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
      
      <Tabs defaultValue="appearance">
        <TabsList>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-6">
          {/* Hero Image Section */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {settings.heroImage && (
                    <div className="relative w-full max-w-md h-64 rounded-lg overflow-hidden">
                      <img src={settings.heroImage} alt="Hero" className="object-cover w-full h-full" />
                    </div>
                  )}
                  <CloudinaryUpload
                    onUploadComplete={handleHeroImageUpload}
                    section="hero"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Hero Tagline</label>
                    <Input
                      value={settings.heroTagline || ""}
                      onChange={(e) => handleHeroTaglineChange(e.target.value)}
                      placeholder="Enter hero section tagline"
                      className="w-full"
                    />
                    <p className="text-sm text-zinc-500 mt-1">This text appears below the main title in the hero section</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Boxes Section */}
          <Card>
            <CardHeader>
              <CardTitle>Service Boxes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {settings.services.map((service, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">Service {index + 1}</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <Input
                          value={service.title}
                          onChange={(e) => handleServiceTitleChange(index, e.target.value)}
                          placeholder="Service title"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <Input
                          value={service.description}
                          onChange={(e) => handleServiceDescriptionChange(index, e.target.value)}
                          placeholder="Service description"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Image</label>
                        {service.image && (
                          <div className="relative w-full max-w-md h-64 rounded-lg overflow-hidden mb-2">
                            <img src={service.image} alt={service.title} className="object-cover w-full h-full" />
                          </div>
                        )}
                        <CloudinaryUpload
                          onUploadComplete={(url) => handleServiceImageUpload(index, url)}
                          section={`service-${index + 1}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle>About Section</CardTitle>
              <CardDescription>Update the about section content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="aboutText">About Text</Label>
                  <Textarea
                    id="aboutText"
                    value={settings.aboutText}
                    onChange={(e) => handleAboutTextChange(e.target.value)}
                    className="h-[200px]"
                  />
                </div>
                <div>
                  <Label>About Image</Label>
                  <CloudinaryUpload
                    onUploadComplete={handleAboutImageChange}
                    section="about"
                  />
                  {settings.aboutImage && (
                    <div className="mt-4 relative w-full max-w-md h-64 rounded-lg overflow-hidden">
                      <img src={settings.aboutImage} alt="About" className="object-cover w-full h-full" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gallery Management</CardTitle>
              <CardDescription>Manage your gallery images and categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-zinc-400">
                  Upload, organize, and manage all your gallery images in one place.
                </p>
                <Link href="/admin/gallery">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    Open Gallery Manager
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <p className="text-sm text-zinc-500">Update your business contact details that appear throughout the website</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <Input
                    value={settings.contactInfo.phone}
                    onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full"
                  />
                  <p className="text-sm text-zinc-500 mt-1">Format: +61 XXX XXX XXX</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <Input
                    value={settings.contactInfo.email}
                    onChange={(e) => handleContactInfoChange('email', e.target.value)}
                    placeholder="Enter email address"
                    type="email"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <Input
                    value={settings.contactInfo.location}
                    onChange={(e) => handleContactInfoChange('location', e.target.value)}
                    placeholder="Enter business location"
                    className="w-full"
                  />
                  <p className="text-sm text-zinc-500 mt-1">Example: Brisbane, Queensland</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

