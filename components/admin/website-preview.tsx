"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CloudinaryUpload } from '@/components/ui/cloudinary-upload'
import { 
  ChevronRight, 
  Mail, 
  MapPin, 
  Phone, 
  Wrench, 
  Cog, 
  Car, 
  Truck, 
  Shield,
  Edit,
  Check,
  ShoppingBag,
  Loader2
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

// Define the types for the data
interface Service {
  title: string
  description: string
  image: string
  icon: string
  slug: string
}

interface Product {
  id: string
  name: string
  category: string
  price: number
  image?: string
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

interface WebsitePreviewProps {
  settings: Settings
  onUpdate: (updatedSettings: Settings) => void
}

export function WebsitePreview({ settings, onUpdate }: WebsitePreviewProps) {
  const { toast } = useToast()
  const router = useRouter()
  
  // Debug the incoming settings early
  console.log("WebsitePreview received settings:", JSON.stringify(settings.theme));
  
  // State for tracking which sections are being edited
  const [editingSections, setEditingSections] = useState<{
    heroTagline: boolean,
    aboutText: boolean,
    contactInfo: boolean,
    footerText: boolean,
    services: number | null, // null or index of service being edited
    testimonials: number | null, // null or index of testimonial being edited
    themeEdit: boolean
  }>({
    heroTagline: false,
    aboutText: false,
    contactInfo: false,
    footerText: false,
    services: null,
    testimonials: null,
    themeEdit: false
  })

  // State for tracking temporary edits - Create a fresh deep copy of theme data
  const [tempEdits, setTempEdits] = useState<Settings>({
    ...settings,
    galleryImages: settings.galleryImages || [],
    testimonials: settings.testimonials || [],
    footerText: settings.footerText || "© 2023 Elite FabWorx - Professional Metal Fabrication Services",
    // Use a fixed theme instead of a dynamic one from settings
    theme: {
      primary: "orange-500",
      secondary: "zinc-800",
      accent: "orange-400",
      background: "black",
      text: "white"
    },
    socialLinks: settings.socialLinks || {
      facebook: '',
      youtube: '',
      instagram: ''
    }
  })
  
  // State for real gallery images from the gallery API
  const [galleryImages, setGalleryImages] = useState<Array<{id: string, url: string, caption: string, category: string}>>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);
  
  // Fetch real gallery images
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setIsLoadingGallery(true);
        const response = await fetch('/api/gallery');
        if (!response.ok) {
          throw new Error('Failed to fetch gallery images');
        }
        
        const images = await response.json();
        setGalleryImages(images);
        setIsLoadingGallery(false);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        setIsLoadingGallery(false);
      }
    };
    
    fetchGalleryImages();
  }, []);
  
  // Track settings changes but exclude theme from updates
  useEffect(() => {
    console.log("WebsitePreview received updated settings");
    
    // Create a deep copy of data to ensure proper updates, but keep the fixed theme
    setTempEdits(prev => ({
      ...prev,
      ...settings,
      socialLinks: settings.socialLinks || prev.socialLinks,
      theme: {
        primary: "orange-500",
        secondary: "zinc-800",
        accent: "orange-400",
        background: "black",
        text: "white"
      }
    }));
  }, [settings]);

  // Simplified utility function to get theme class names - now uses fixed values
  const getThemeClass = (type: string, color: string, modifier?: string) => {
    // Fixed theme values
    const fixedTheme = {
      primary: "orange-500",
      accent: "orange-400",
      secondary: "zinc-800",
      background: "black",
      text: "white"
    };
    
    const colorValue = color === 'primary' ? fixedTheme.primary : 
                      color === 'accent' ? fixedTheme.accent : 
                      color;
    
    // For standard Tailwind color classes
    if (modifier) {
      return `${type}-${colorValue}/${modifier}`;
    }
    
    return `${type}-${colorValue}`;
  };

  // Sample featured products for preview
  const featuredProducts: Product[] = [
    {
      id: "product-1",
      name: "Custom Exhaust System",
      category: "Exhaust Systems",
      price: 899.99,
      image: "/placeholder.jpg"
    },
    {
      id: "product-2",
      name: "Performance Headers",
      category: "Exhaust Systems",
      price: 499.99,
      image: "/placeholder.jpg"
    },
    {
      id: "product-3",
      name: "Roll Cage Kit",
      category: "Safety",
      price: 1299.99,
      image: "/placeholder.jpg"
    },
    {
      id: "product-4",
      name: "Custom Intake Manifold",
      category: "Engine Components",
      price: 749.99,
      image: "/placeholder.jpg"
    },
    {
      id: "product-5",
      name: "Sport Chassis Brace",
      category: "Chassis",
      price: 349.99,
      image: "/placeholder.jpg"
    },
    {
      id: "product-6",
      name: "Turbo Downpipe",
      category: "Exhaust Systems",
      price: 589.99,
      image: "/placeholder.jpg"
    }
  ]

  // Sample testimonials for preview
  const sampleTestimonials: Testimonial[] = [
    {
      id: "testimonial-1",
      name: "John Smith",
      role: "Car Enthusiast",
      content: "Elite FabWorx transformed my project car with their custom exhaust system. Exceptional craftsmanship and attention to detail!",
      rating: 5
    },
    {
      id: "testimonial-2",
      name: "Sarah Johnson",
      role: "Race Team Manager",
      content: "We've been working with Elite FabWorx for our safety equipment needs for years. Their roll cages are second to none.",
      rating: 5
    },
    {
      id: "testimonial-3",
      name: "Mike Davis",
      role: "Automotive Shop Owner",
      content: "As a shop owner, I appreciate Elite FabWorx's reliability and quality. Their custom solutions have helped us serve our customers better.",
      rating: 4
    }
  ]

  // Sample gallery images
  const sampleGalleryImages = [
    "/placeholder.jpg",
    "/placeholder.jpg",
    "/placeholder.jpg",
    "/placeholder.jpg",
    "/placeholder.jpg",
    "/placeholder.jpg"
  ]

  // Helper function to toggle edit mode for a section
  const toggleEditSection = (section: keyof typeof editingSections, index?: number) => {
    setEditingSections(prev => {
      if (section === 'services' && typeof index === 'number') {
        return { ...prev, services: prev.services === index ? null : index }
      }
      return { ...prev, [section]: !prev[section] }
    })
  }

  // Helper to handle testimonial edits
  const saveTestimonialEdit = (index: number) => {
    onUpdate(tempEdits)
    toggleEditSection('testimonials', index)
  }

  // Helper to save changes for a section
  const saveSection = (section: keyof typeof editingSections) => {
    onUpdate(tempEdits)
    toggleEditSection(section)
  }

  // Helper to handle service edits
  const saveServiceEdit = (index: number) => {
    onUpdate(tempEdits)
    toggleEditSection('services', index)
  }

  // Handle image uploads
  const handleHeroImageUpload = (imageUrl: string) => {
    console.log('WebsitePreview: Hero image upload received:', imageUrl);
    try {
      if (!imageUrl) {
        console.error('WebsitePreview: Received empty imageUrl');
        return;
      }
      
      const updated = {...tempEdits, heroImage: imageUrl};
      setTempEdits(updated);
      
      // Notify parent component of the change
      console.log('WebsitePreview: Notifying parent with updated settings');
      onUpdate(updated);
      
      // Show toast notification
      toast({
        title: "Hero Image Updated",
        description: "The website hero image has been updated successfully",
      });
    } catch (error) {
      console.error('WebsitePreview: Error updating hero image:', error);
      toast({
        title: "Update Failed",
        description: "There was a problem updating the hero image",
        variant: "destructive",
      });
    }
  }

  const handleServiceImageUpload = (index: number, imageUrl: string) => {
    const updatedServices = [...tempEdits.services]
    updatedServices[index] = {
      ...updatedServices[index],
      image: imageUrl
    }
    const updated = {...tempEdits, services: updatedServices}
    setTempEdits(updated)
    onUpdate(updated)
  }

  const handleAboutImageUpload = (imageUrl: string) => {
    const updated = {...tempEdits, aboutImage: imageUrl}
    setTempEdits(updated)
    onUpdate(updated)
  }

  const handleGalleryImageUpload = (index: number, imageUrl: string) => {
    const updatedGalleryImages = [...tempEdits.galleryImages]
    updatedGalleryImages[index] = imageUrl
    const updated = {...tempEdits, galleryImages: updatedGalleryImages}
    setTempEdits(updated)
    onUpdate(updated)
  }

  // Add sample gallery images if empty
  useEffect(() => {
    if (!tempEdits.galleryImages || tempEdits.galleryImages.length === 0) {
      setTempEdits({
        ...tempEdits,
        galleryImages: Array(6).fill("/placeholder.jpg")
      });
    }
  }, []);

  // First update the state to include testimonials
  useEffect(() => {
    if (!tempEdits.testimonials || tempEdits.testimonials.length === 0) {
      setTempEdits({
        ...tempEdits,
        testimonials: sampleTestimonials
      });
    }
  }, []);

  // Testimonial editing helper
  const handleTestimonialEdit = (index: number, field: string, value: string | number) => {
    const updatedTestimonials = [...tempEdits.testimonials];
    updatedTestimonials[index] = {
      ...updatedTestimonials[index],
      [field]: value
    };
    setTempEdits({...tempEdits, testimonials: updatedTestimonials});
  }

  return (
    <div className="website-preview bg-black text-white overflow-hidden rounded-xl border border-zinc-800 w-full mx-auto">
      {/* Hero Section Preview */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10"></div>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/80"></div>
          <div className="relative w-full h-full group">
            <Image
              src={tempEdits.heroImage || "/placeholder.jpg"}
              alt="Hero Background"
              fill
              className="object-cover object-center opacity-40"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        </div>
        <div className="container relative z-20 h-full flex flex-col justify-center items-center px-4">
          <div className="w-full text-center mx-auto">
            <div className="flex items-center justify-center gap-4 mb-8">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                <span 
                  className={`${getThemeClass('text', 'primary')} font-extrabold tracking-wider`}
                >ELITE</span>
                <span className="font-light tracking-widest ml-2">FABWORX</span>
              </h1>
            </div>
            
            <div className="mb-10 max-w-2xl mx-auto" onClick={() => !editingSections.heroTagline && toggleEditSection('heroTagline')}>
              {editingSections.heroTagline ? (
                <div>
                  <Textarea 
                    value={tempEdits.heroTagline}
                    onChange={(e) => setTempEdits({...tempEdits, heroTagline: e.target.value})}
                    className={`bg-zinc-900 ${getThemeClass('border', 'primary', '50')} text-center`}
                    rows={3}
                    autoFocus
                  />
                  <Button 
                    size="sm" 
                    className={`mt-2 ${getThemeClass('bg', 'primary')} ${getThemeClass('hover:bg', 'primary', '80')}`}
                    onClick={() => saveSection('heroTagline')}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save Tagline
                  </Button>
                </div>
              ) : (
                <p className="text-xl sm:text-2xl text-zinc-300 mx-auto max-w-2xl cursor-pointer hover:bg-zinc-800/30 hover:text-white transition-colors p-2 rounded">
                  {tempEdits.heroTagline}
                </p>
              )}
            </div>
            
            <div className="flex gap-5 justify-center">
              <Button 
                size="lg" 
                className={`${getThemeClass('bg', 'primary')} text-white px-6`}
              >
                Our Services
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                onClick={() => router.push("/shop")}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                View Shop
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section Preview */}
      <section className="py-12 bg-zinc-900">
        <div className="px-4 w-full max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">
              Our <span 
                className={getThemeClass('text', 'primary')}
              >Services</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              We offer a comprehensive range of metal fabrication services for both automotive and industrial applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {tempEdits.services.map((service, index) => (
              <div key={index} className="relative group">
                <Card className={`bg-zinc-800 border-zinc-700 overflow-hidden h-full group hover:${getThemeClass('border', 'primary', '50')} transition-colors`}>
                  <div className="h-48 relative">
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-1 right-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <CloudinaryUpload
                        onUploadComplete={(url) => handleServiceImageUpload(index, url)}
                        section={`service-${index + 1}`}
                        buttonText="Change"
                        buttonVariant="outline"
                        buttonSize="sm"
                      />
                    </div>
                  </div>
                  
                  {editingSections.services === index ? (
                    <CardContent className="p-5">
                      <Input
                        value={tempEdits.services[index].title}
                        onChange={(e) => {
                          const updatedServices = [...tempEdits.services]
                          updatedServices[index] = {
                            ...updatedServices[index],
                            title: e.target.value,
                            slug: e.target.value.toLowerCase().replace(/\s+/g, '-')
                          }
                          setTempEdits({...tempEdits, services: updatedServices})
                        }}
                        className={`mb-4 bg-zinc-900 ${getThemeClass('border', 'primary', '50')}`}
                        placeholder="Service Title"
                      />
                      <Textarea
                        value={tempEdits.services[index].description}
                        onChange={(e) => {
                          const updatedServices = [...tempEdits.services]
                          updatedServices[index] = {
                            ...updatedServices[index],
                            description: e.target.value
                          }
                          setTempEdits({...tempEdits, services: updatedServices})
                        }}
                        className={`mb-4 bg-zinc-900 ${getThemeClass('border', 'primary', '50')} text-base`}
                        placeholder="Service Description"
                        rows={4}
                      />
                      <Button 
                        size="default" 
                        className={`w-full mt-2 ${getThemeClass('bg', 'primary')} ${getThemeClass('hover:bg', 'primary', '80')}`}
                        onClick={() => saveServiceEdit(index)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Save Service
                      </Button>
                    </CardContent>
                  ) : (
                    <CardContent className="p-5 relative">
                      <div className="flex items-center mb-3">
                        <div className={`w-10 h-10 rounded-full ${getThemeClass('bg', 'primary', '20')} flex items-center justify-center mr-3`}>
                          {service.icon === 'Wrench' && <Wrench 
                            className={`h-5 w-5 ${getThemeClass('text', 'accent')}`}
                          />}
                          {service.icon === 'Cog' && <Cog 
                            className={`h-5 w-5 ${getThemeClass('text', 'accent')}`}
                          />}
                          {service.icon === 'Car' && <Car 
                            className={`h-5 w-5 ${getThemeClass('text', 'accent')}`}
                          />}
                          {service.icon === 'Truck' && <Truck 
                            className={`h-5 w-5 ${getThemeClass('text', 'accent')}`}
                          />}
                          {service.icon === 'Shield' && <Shield 
                            className={`h-5 w-5 ${getThemeClass('text', 'accent')}`}
                          />}
                        </div>
                        <h3 
                          className={`text-xl font-bold cursor-pointer hover:${getThemeClass('text', 'accent')} transition-colors`}
                          onClick={() => toggleEditSection('services', index)}
                        >
                          {service.title}
                        </h3>
                      </div>
                      <p 
                        className="text-zinc-400 mb-4 text-base cursor-pointer hover:text-zinc-200 transition-colors"
                        onClick={() => toggleEditSection('services', index)}
                      >
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span 
                          className={`${getThemeClass('text', 'accent')} hover:${getThemeClass('text', 'primary')} inline-flex items-center text-base font-medium`}
                        >
                          Learn more
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </span>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section Preview */}
      <section className="py-12 bg-black">
        <div className="px-4 w-full max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">
              Featured <span 
                className={getThemeClass('text', 'primary')}
              >Products</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Browse through our selection of high-quality fabricated products and automotive components.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {featuredProducts.slice(0, 6).map((product, index) => (
              <div key={index} className="relative group">
                <Card className={`bg-zinc-800 border-zinc-700 overflow-hidden h-full group hover:${getThemeClass('border', 'primary', '50')} transition-colors`}>
                  <div className="h-64 relative">
                    <Image
                      src={product.image || "/placeholder.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <CloudinaryUpload
                        onUploadComplete={(url) => {
                          const updatedProducts = [...featuredProducts];
                          updatedProducts[index] = {...updatedProducts[index], image: url};
                          // Note: This is just for preview as we're not actually storing these in state
                        }}
                        section={`product-${index}`}
                        buttonText="Change"
                        buttonVariant="outline"
                        buttonSize="sm"
                      />
                    </div>
                  </div>
                  
                  <CardContent className="p-5 relative">
                    <div className="mb-3">
                      <span 
                        className={`text-sm ${getThemeClass('text', 'accent')} font-medium block mb-2`}
                      >{product.category}</span>
                      <h3 className="text-lg font-bold mb-1">{product.name}</h3>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <p 
                        className={`text-xl font-bold ${getThemeClass('text', 'accent')}`}
                      >
                        ${product.price.toFixed(2)}
                      </p>
                      <Button 
                        size="default" 
                        variant="outline" 
                        className={`${getThemeClass('border', 'primary', '30')} ${getThemeClass('hover:bg', 'primary', '10')} h-10 w-10 p-0`}
                      >
                        <ShoppingBag className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <a href="/admin/products" className="inline-block">
              <Button 
                size="lg" 
                variant="outline" 
                className={`${getThemeClass('border', 'primary', '30')} ${getThemeClass('hover:bg', 'primary', '10')} px-6`}
              >
                View All Products
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* About Section Preview */}
      <section className="py-12 bg-zinc-900">
        <div className="px-4 w-full max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">
              About <span 
                className={getThemeClass('text', 'primary')}
              >Elite Fabworx</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Learn more about our company, values, and expertise in metal fabrication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="relative">
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src={tempEdits.aboutImage || "/placeholder.jpg"}
                  alt="About Elite FabWorx"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute top-2 right-2 z-20">
                <CloudinaryUpload
                  onUploadComplete={handleAboutImageUpload}
                  section="about"
                  buttonText="Change"
                  buttonVariant="outline"
                  buttonSize="sm"
                />
              </div>
            </div>
            
            <div className="relative group flex items-center">
              <div onClick={() => !editingSections.aboutText && toggleEditSection('aboutText')} className="w-full">
                {editingSections.aboutText ? (
                  <div className="space-y-4">
                    <Textarea
                      value={tempEdits.aboutText}
                      onChange={(e) => setTempEdits({...tempEdits, aboutText: e.target.value})}
                      className={`bg-zinc-900 ${getThemeClass('border', 'primary', '50')}`}
                      rows={8}
                      autoFocus
                    />
                    <Button 
                      size="default" 
                      className={`mt-4 ${getThemeClass('bg', 'primary')} ${getThemeClass('hover:bg', 'primary', '80')}`}
                      onClick={() => saveSection('aboutText')}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Save About Text
                    </Button>
                  </div>
                ) : (
                  <p className="text-zinc-300 text-lg leading-relaxed cursor-pointer hover:bg-zinc-800/30 hover:text-white transition-colors p-4 rounded">
                    {tempEdits.aboutText}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section Preview */}
      <section className="py-12 bg-black">
        <div className="px-4 w-full max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">
              Our <span 
                className={getThemeClass('text', 'primary')}
              >Gallery</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Browse through some of our best work and custom fabrication projects.
            </p>
          </div>

          {isLoadingGallery ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
            </div>
          ) : galleryImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {galleryImages.slice(0, 6).map((image, index) => (
                <div key={image.id} className="aspect-square relative rounded-md overflow-hidden group">
                  <Image
                    src={image.url}
                    alt={image.caption || `Gallery Image ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-base text-white bg-black/70 px-3 py-2 rounded absolute bottom-4 left-4">
                      {image.caption || image.category || 'Gallery Image'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {Array(6).fill(0).map((_, index) => (
                <div key={index} className="aspect-square relative rounded-md overflow-hidden group bg-zinc-800 flex items-center justify-center">
                  <p className="text-zinc-500 text-base">No gallery images</p>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-10">
            <a href="/admin/gallery" className="inline-block">
              <Button 
                size="lg" 
                className={`${getThemeClass('bg', 'primary')} ${getThemeClass('hover:bg', 'primary', '80')} text-white px-6`}
              >
                Manage Gallery
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section Preview */}
      <section className="py-12 bg-zinc-900">
        <div className="px-4 w-full max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">
              Client <span 
                className={getThemeClass('text', 'primary')}
              >Testimonials</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              See what our clients are saying about our work and services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {tempEdits.testimonials.slice(0, 4).map((testimonial, index) => (
              <div key={index} className="relative group">
                <Card className={`bg-zinc-800 border-zinc-700 h-full hover:${getThemeClass('border', 'primary', '50')} transition-colors`}>
                  {editingSections.testimonials === index ? (
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <Input
                          value={testimonial.name}
                          onChange={(e) => handleTestimonialEdit(index, 'name', e.target.value)}
                          className={`bg-zinc-900 ${getThemeClass('border', 'primary', '50')}`}
                          placeholder="Client Name"
                          autoFocus
                        />
                        <Input
                          value={testimonial.role}
                          onChange={(e) => handleTestimonialEdit(index, 'role', e.target.value)}
                          className={`bg-zinc-900 ${getThemeClass('border', 'primary', '50')}`}
                          placeholder="Client Role"
                        />
                        <Textarea
                          value={testimonial.content}
                          onChange={(e) => handleTestimonialEdit(index, 'content', e.target.value)}
                          className={`bg-zinc-900 ${getThemeClass('border', 'primary', '50')}`}
                          placeholder="Testimonial Content"
                          rows={4}
                        />
                        <div className="flex items-center space-x-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button 
                              key={star} 
                              className={`text-xl ${star <= testimonial.rating ? getThemeClass('text', 'accent') : 'text-zinc-600'}`}
                              onClick={() => handleTestimonialEdit(index, 'rating', star)}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                        <Button 
                          size="default" 
                          className={`w-full ${getThemeClass('bg', 'primary')} ${getThemeClass('hover:bg', 'primary', '80')}`}
                          onClick={() => saveTestimonialEdit(index)}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </CardContent>
                  ) : (
                    <CardContent className="p-6 relative cursor-pointer" onClick={() => toggleEditSection('testimonials', index)}>
                      <div className="flex items-center space-x-1 mb-3">
                        {[1, 2, 3, 4, 5].map(star => (
                          <span 
                            key={star} 
                            className={`text-lg ${star <= testimonial.rating ? getThemeClass('text', 'accent') : 'text-zinc-600'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-zinc-300 text-base italic mb-4 hover:text-white transition-colors line-clamp-4">"{testimonial.content}"</p>
                      <div className="mt-auto">
                        <p 
                          className={`font-semibold text-lg hover:${getThemeClass('text', 'accent')} transition-colors`}
                        >{testimonial.name}</p>
                        <p className="text-zinc-400 text-base">{testimonial.role}</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info Preview */}
      <section className="py-12 bg-black">
        <div className="px-4 w-full max-w-7xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Get in <span 
                className={getThemeClass('text', 'primary')}
              >Touch</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Have a project in mind? Contact us to discuss your requirements or schedule a consultation.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {editingSections.contactInfo ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-base font-medium mb-2 block">Phone Number</label>
                      <Input
                        value={tempEdits.contactInfo.phone}
                        onChange={(e) => setTempEdits({
                          ...tempEdits, 
                          contactInfo: {...tempEdits.contactInfo, phone: e.target.value}
                        })}
                        className={`bg-zinc-900 ${getThemeClass('border', 'primary', '50')} py-2`}
                      />
                    </div>
                    <div>
                      <label className="text-base font-medium mb-2 block">Email Address</label>
                      <Input
                        value={tempEdits.contactInfo.email}
                        onChange={(e) => setTempEdits({
                          ...tempEdits, 
                          contactInfo: {...tempEdits.contactInfo, email: e.target.value}
                        })}
                        className={`bg-zinc-900 ${getThemeClass('border', 'primary', '50')} py-2`}
                      />
                    </div>
                    <div>
                      <label className="text-base font-medium mb-2 block">Location</label>
                      <Input
                        value={tempEdits.contactInfo.location}
                        onChange={(e) => setTempEdits({
                          ...tempEdits, 
                          contactInfo: {...tempEdits.contactInfo, location: e.target.value}
                        })}
                        className={`bg-zinc-900 ${getThemeClass('border', 'primary', '50')} py-2`}
                      />
                    </div>
                    <Button 
                      size="default"
                      className={`w-full py-6 ${getThemeClass('bg', 'primary')} ${getThemeClass('hover:bg', 'primary', '80')}`}
                      onClick={() => saveSection('contactInfo')}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Save Contact Info
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-8 relative group" onClick={() => !editingSections.contactInfo && toggleEditSection('contactInfo')}>
                    <div className="flex items-center gap-4">
                      <div className={`rounded-full ${getThemeClass('bg', 'primary')} w-12 h-12 flex items-center justify-center`}>
                        <Phone 
                          className="h-6 w-6 text-white"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Phone</p>
                        <span className="text-base text-zinc-300 cursor-pointer hover:text-white transition-colors">{tempEdits.contactInfo.phone}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className={`rounded-full ${getThemeClass('bg', 'primary')} w-12 h-12 flex items-center justify-center`}>
                        <Mail 
                          className="h-6 w-6 text-white"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Email</p>
                        <span className="text-base text-zinc-300 cursor-pointer hover:text-white transition-colors">{tempEdits.contactInfo.email}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className={`rounded-full ${getThemeClass('bg', 'primary')} w-12 h-12 flex items-center justify-center`}>
                        <MapPin 
                          className="h-6 w-6 text-white"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Location</p>
                        <span className="text-base text-zinc-300 cursor-pointer hover:text-white transition-colors">{tempEdits.contactInfo.location}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <div className="space-y-4">
                  <Input placeholder="Your Name *" className={`bg-zinc-900 ${getThemeClass('border', 'primary', '50')} text-base py-2`} />
                  <Input placeholder="Email *" className={`bg-zinc-900 ${getThemeClass('border', 'primary', '50')} text-base py-2`} />
                  <Input placeholder="Phone Number" className={`bg-zinc-900 ${getThemeClass('border', 'primary', '50')} text-base py-2`} />
                  <div className="space-y-2">
                    <p className="text-base font-medium">Preferred Contact Method *</p>
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <input type="radio" id="email" name="contact" className="accent-orange-500 w-4 h-4" defaultChecked />
                        <label htmlFor="email" className="text-base">Email</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" id="phone" name="contact" className="accent-orange-500 w-4 h-4" />
                        <label htmlFor="phone" className="text-base">Phone</label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-base font-medium">Topic *</p>
                    <div className="relative">
                      <select className="w-full bg-zinc-900 border border-zinc-700 rounded-md py-2 px-3 text-base appearance-none">
                        <option value="">Select a topic</option>
                        <option value="custom-fabrication">Custom Fabrication</option>
                        <option value="repairs">Repairs</option>
                        <option value="consultation">Consultation</option>
                        <option value="quote">Quote Request</option>
                        <option value="other">Other</option>
                      </select>
                      <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 h-4 w-4 text-zinc-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-base font-medium">Message *</p>
                    <Textarea placeholder="Please describe your project or inquiry" className={`bg-zinc-900 ${getThemeClass('border', 'primary', '50')} text-base`} rows={5} />
                  </div>
                  <Button 
                    className={`w-full ${getThemeClass('bg', 'primary')} ${getThemeClass('hover:bg', 'primary', '80')} text-white py-6 h-auto text-lg`}
                  >
                    Send Message <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Preview */}
      <section className={`py-8 bg-zinc-950 border-t border-zinc-800`}>
        <div className="px-4 w-full max-w-7xl mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold tracking-tight text-white">
                  <span 
                    className={`${getThemeClass('text', 'primary')} font-extrabold tracking-wider`}
                  >ELITE</span>
                  <span className="font-light tracking-widest ml-2">FABWORX</span>
                </h3>
              </div>
              
              {/* Social Media Links */}
              <div className="flex gap-4 my-3">
                {tempEdits.socialLinks?.facebook && (
                  <a href={tempEdits.socialLinks.facebook} target="_blank" rel="noopener noreferrer" 
                     className={`${getThemeClass('text', 'primary')} hover:text-white transition-colors`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </a>
                )}
                {tempEdits.socialLinks?.youtube && (
                  <a href={tempEdits.socialLinks.youtube} target="_blank" rel="noopener noreferrer"
                     className={`${getThemeClass('text', 'primary')} hover:text-white transition-colors`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                  </a>
                )}
                {tempEdits.socialLinks?.instagram && (
                  <a href={tempEdits.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                     className={`${getThemeClass('text', 'primary')} hover:text-white transition-colors`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                )}
              </div>
              
              <div className="text-base text-zinc-400 mt-2">
                {editingSections.footerText ? (
                  <div>
                    <Input 
                      value={tempEdits.footerText}
                      onChange={(e) => setTempEdits({...tempEdits, footerText: e.target.value})}
                      className={`bg-zinc-900 ${getThemeClass('border', 'primary', '50')} min-w-[350px]`}
                      autoFocus
                    />
                    <Button 
                      size="default" 
                      className={`mt-3 ${getThemeClass('bg', 'primary')} ${getThemeClass('hover:bg', 'primary', '80')}`}
                      onClick={() => saveSection('footerText')}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Save Footer Text
                    </Button>
                  </div>
                ) : (
                  <p className="cursor-pointer hover:text-white transition-colors" onClick={() => toggleEditSection('footerText')}>
                    {tempEdits.footerText}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}