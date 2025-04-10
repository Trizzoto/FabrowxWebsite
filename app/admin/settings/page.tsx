"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CloudinaryUpload } from '@/components/ui/cloudinary-upload'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Wrench, Car, Truck, Cog, Shield } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { Toaster } from '@/components/ui/toaster'

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
  role: string
  content: string
  rating: number
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
    <div className="container-fluid max-w-full py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Website Settings</h1>
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

        {/* Website Images Section */}
        <Card>
          <CardHeader>
            <CardTitle>Website Images</CardTitle>
            <CardDescription>
              Update the main images on your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label>Hero Image</Label>
                <div className="mt-2 relative w-full aspect-video rounded-md overflow-hidden border border-zinc-700 group">
                  <img 
                    src={settings.heroImage} 
                    alt="Hero Image" 
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors"></div>
                  <div className="absolute bottom-2 left-2 text-white text-sm font-medium">
                    Hero Image
                  </div>
                </div>
                <div className="mt-2">
                  <CloudinaryUpload
                    onUploadComplete={(url) => {
                      setSettings({
                        ...settings,
                        heroImage: url
                      });
                      toast({
                        title: "Success",
                        description: "Hero image updated successfully",
                      });
                    }}
                    section="hero"
                    buttonText="Change Hero Image"
                  />
                </div>
              </div>
              
              <div>
                <Label>About Image</Label>
                <div className="mt-2 relative w-full aspect-video rounded-md overflow-hidden border border-zinc-700 group">
                  <img 
                    src={settings.aboutImage} 
                    alt="About Image" 
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors"></div>
                  <div className="absolute bottom-2 left-2 text-white text-sm font-medium">
                    About Image
                  </div>
                </div>
                <div className="mt-2">
                  <CloudinaryUpload
                    onUploadComplete={(url) => {
                      setSettings({
                        ...settings,
                        aboutImage: url
                      });
                      toast({
                        title: "Success",
                        description: "About image updated successfully",
                      });
                    }}
                    section="about"
                    buttonText="Change About Image"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Section */}
        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
            <CardDescription>
              Manage your services information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {settings.services.map((service, index) => (
                <div key={service.slug} className="space-y-4 pb-6 border-b border-zinc-200 dark:border-zinc-800 last:border-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                      {service.icon === 'Wrench' && <Wrench className="h-6 w-6 text-orange-500" />}
                      {service.icon === 'Car' && <Car className="h-6 w-6 text-orange-500" />}
                      {service.icon === 'Truck' && <Truck className="h-6 w-6 text-orange-500" />}
                      {service.icon === 'Cog' && <Cog className="h-6 w-6 text-orange-500" />}
                      {service.icon === 'Shield' && <Shield className="h-6 w-6 text-orange-500" />}
                    </div>
                    <h3 className="text-lg font-semibold">{service.title}</h3>
                  </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={service.description}
                          onChange={(e) => {
                            const newServices = [...settings.services]
                            newServices[index] = {
                              ...service,
                              description: e.target.value
                            }
                            setSettings({
                              ...settings,
                              services: newServices
                            })
                          }}
                          placeholder="Enter service description"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>What We Offer</Label>
                        <div className="space-y-2 mt-2">
                          {(service.offerings || []).map((offering, offeringIndex) => (
                            <div key={offeringIndex} className="flex items-center space-x-2">
                              <Input
                                value={offering}
                                onChange={(e) => {
                                  const newServices = [...settings.services]
                                  const newOfferings = [...(service.offerings || [])]
                                  newOfferings[offeringIndex] = e.target.value
                                  newServices[index] = {
                                    ...service,
                                    offerings: newOfferings
                                  }
                                  setSettings({
                                    ...settings,
                                    services: newServices
                                  })
                                }}
                                placeholder={`Offering ${offeringIndex + 1}`}
                                className="flex-1"
                              />
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  const newServices = [...settings.services]
                                  const newOfferings = [...(service.offerings || [])]
                                  newOfferings.splice(offeringIndex, 1)
                                  newServices[index] = {
                                    ...service,
                                    offerings: newOfferings
                                  }
                                  setSettings({
                                    ...settings,
                                    services: newServices
                                  })
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newServices = [...settings.services]
                              newServices[index] = {
                                ...service,
                                offerings: [...(service.offerings || []), ""]
                              }
                              setSettings({
                                ...settings,
                                services: newServices
                              })
                            }}
                          >
                            Add Offering
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Service Image</Label>
                      <div className="mt-2 relative aspect-video rounded-lg overflow-hidden border border-zinc-700 group">
                        <img 
                          src={service.image} 
                          alt={service.title} 
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors"></div>
                      </div>
                      <div className="mt-2">
                        <CloudinaryUpload
                          onUploadComplete={(url) => {
                            const newServices = [...settings.services]
                            newServices[index] = {
                              ...service,
                              image: url
                            }
                            setSettings({
                              ...settings,
                              services: newServices
                            })
                            toast({
                              title: "Success",
                              description: "Service image updated successfully",
                            })
                          }}
                          section={`service-${index}`}
                          buttonText="Change Image"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gallery Section */}
        <Card>
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
            <CardDescription>
              Manage your gallery images
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryImages.map((image, index) => (
                  <div key={image.id || index} className="relative group">
                    <div className="aspect-square rounded-md overflow-hidden border border-zinc-700">
                      <img 
                        src={image.url} 
                        alt={image.caption || `Gallery Image ${index + 1}`} 
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => {
                            const updatedGallery = [...galleryImages];
                            updatedGallery.splice(index, 1);
                            setGalleryImages(updatedGallery);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Input
                        value={image.caption || ""}
                        onChange={(e) => {
                          const updatedGallery = [...galleryImages];
                          updatedGallery[index] = {
                            ...updatedGallery[index],
                            caption: e.target.value
                          };
                          setGalleryImages(updatedGallery);
                        }}
                        placeholder="Image caption"
                        className="w-full"
                      />
                    </div>
                    <div className="mt-2">
                      <Input
                        value={image.category || ""}
                        onChange={(e) => {
                          const updatedGallery = [...galleryImages];
                          updatedGallery[index] = {
                            ...updatedGallery[index],
                            category: e.target.value
                          };
                          setGalleryImages(updatedGallery);
                        }}
                        placeholder="Image category"
                        className="w-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div>
                <CloudinaryUpload
                  onUploadComplete={(url) => {
                    setGalleryImages([
                      ...galleryImages,
                      {
                        id: `gallery-${Date.now()}`,
                        url: url,
                        caption: "New Gallery Image",
                        category: "Uncategorized"
                      }
                    ]);
                    toast({
                      title: "Success",
                      description: "Gallery image added successfully",
                    });
                  }}
                  section="gallery"
                  buttonText="Add Gallery Images"
                  multiple={true}
                />
                <p className="text-sm text-zinc-400 mt-2">
                  You can select multiple images at once to add to your gallery.
                </p>
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
      </div>
      <Toaster />
    </div>
  )
}

