"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
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
  Award,
  Instagram,
  Facebook,
  Youtube,
  Star,
  ArrowRight,
  Twitter,
  ThumbsUp,
  MessageSquare,
  Share,
} from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ParticleContainer } from "@/components/particle-container"
import { Product } from "@/types"
import dynamic from 'next/dynamic'

interface Service {
  title: string
  description: string
  image: string
  icon: string
  slug: string
}

interface GalleryImage {
  id: string
  url: string
  caption: string
  category: string
}

interface Testimonial {
  id: string
  name: string
  role?: string
  content: string
  rating: number
  avatar?: string
  date: string
  comments: number
  likes: number
  platform: string
}

interface HomeContentProps {
  settings: {
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
    socialLinks?: {
      facebook?: string
      youtube?: string
      instagram?: string
    }
  }
  galleryImages: GalleryImage[]
}

// Add type declaration for Instagram embed script
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      }
    }
  }
}

// Import ContactForm with no SSR to prevent hydration issues
const ContactForm = dynamic(() => import('@/app/contact/contact-form').then(mod => mod.ContactForm), { 
  ssr: false 
})

function getCloudinaryUrl(url: string, width: number) {
  return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
}

export function HomeContent({ settings, galleryImages }: HomeContentProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Get 6 random gallery images that change on each page load
  const [randomGalleryImages, setRandomGalleryImages] = useState<GalleryImage[]>([])
  
  useEffect(() => {
    // Shuffle the gallery images and take the first 6
    const shuffled = [...galleryImages].sort(() => 0.5 - Math.random())
    setRandomGalleryImages(shuffled.slice(0, 6))
    
    // Set up an interval to rotate the images every 10 seconds
    const intervalId = setInterval(() => {
      const newShuffled = [...galleryImages].sort(() => 0.5 - Math.random())
      setRandomGalleryImages(newShuffled.slice(0, 6))
    }, 10000) // 10 seconds
    
    return () => clearInterval(intervalId)
  }, [galleryImages])

  // Get random featured products that change on each page load
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) throw new Error('Failed to fetch products')
        const products = await response.json()
        
        // Shuffle all products and take 4 random ones
        const shuffledProducts = [...products].sort(() => 0.5 - Math.random())
        setFeaturedProducts(shuffledProducts.slice(0, 4))
      } catch (error) {
        console.error('Error fetching featured products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  // Add state for Instagram embeds
  const [instagramLoaded, setInstagramLoaded] = useState(false);
  const [embedsProcessed, setEmbedsProcessed] = useState(false);
  const instagramContainerRef = useRef<HTMLDivElement>(null);
  
  // Function to process Instagram embeds
  const processEmbeds = useCallback(() => {
    if (window.instgrm && !embedsProcessed) {
      try {
        window.instgrm.Embeds.process();
        setEmbedsProcessed(true);
      } catch (error) {
        console.error('Error processing Instagram embeds:', error);
      }
    }
  }, [embedsProcessed]);
  
  // Load Instagram embed script with better error handling
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Set a timeout to defer loading of non-critical Instagram embeds
    const timer = setTimeout(() => {
      const loadInstagramScript = () => {
        const existingScript = document.querySelector('script[src="https://www.instagram.com/embed.js"]');
        if (existingScript) {
          existingScript.remove();
        }

        const script = document.createElement('script');
        script.src = 'https://www.instagram.com/embed.js';
        script.async = true;
        script.defer = true;
        script.crossOrigin = 'anonymous';

        script.onload = () => {
          setInstagramLoaded(true);
          // Add a small delay before processing embeds
          setTimeout(processEmbeds, 1000);
        };

        script.onerror = (error) => {
          console.error('Failed to load Instagram embed script:', error);
          setInstagramLoaded(false);
        };

        document.body.appendChild(script);
      };

      loadInstagramScript();
    }, 3000); // Delay Instagram loading by 3 seconds after page load

    // Set up a retry mechanism
    const retryInterval = setInterval(() => {
      if (!embedsProcessed && instagramContainerRef.current) {
        processEmbeds();
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(retryInterval);
    };
  }, [embedsProcessed, processEmbeds]);

  // Reprocess embeds when container becomes visible
  useEffect(() => {
    if (!instagramContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && window.instgrm && !embedsProcessed) {
            processEmbeds();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(instagramContainerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [instagramLoaded, embedsProcessed, processEmbeds]);

  return (
    <div className="bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section ref={ref} className="relative h-screen overflow-hidden">
        <ParticleContainer />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10"></div>
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/80"></div>
          <Image
            src={settings.heroImage && settings.heroImage.includes('cloudinary')
              ? getCloudinaryUrl(settings.heroImage, 1200)
              : settings.heroImage}
            alt="Elite FabWorx metal fabrication"
            fill
            className="object-cover object-center opacity-40"
            priority
            sizes="100vw"
            loading="eager"
          />
        </motion.div>
        <div className="container relative z-20 h-full flex flex-col justify-center items-center px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-5xl mx-auto"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white mb-4">
                <span className="text-orange-500 font-extrabold tracking-wider">ELITE</span>
                <span className="font-bold tracking-widest ml-1 md:ml-2">FABWORX</span>
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl text-orange-500 font-light tracking-wider mb-6">
                CUSTOM METAL FABRICATION
              </p>
              <p className="text-base sm:text-lg md:text-xl mb-8 text-zinc-300 max-w-2xl mx-auto font-light tracking-wide">
                {settings.heroTagline || "Precision metal fabrication for performance vehicles and 4WDs"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-orange-700 hover:bg-orange-800 text-white px-6 py-3 h-auto text-base focus-visible:ring-orange-600">
                  <Link href="/services" className="flex items-center">
                    Our Services
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-orange-600 text-orange-300 hover:bg-orange-950/50 px-6 py-3 h-auto text-base focus-visible:ring-orange-600">
                  <Link href="/shop" className="flex items-center">
                    View Shop
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-zinc-900 overflow-x-hidden">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="text-orange-500">Services</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              We offer a comprehensive range of metal fabrication services tailored for performance vehicles and 4WDs.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-full">
            {settings.services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="w-full"
              >
                <Card className="bg-zinc-800 border-zinc-700 overflow-hidden h-full group hover:border-orange-500/50 transition-colors border-0">
                  <div className="h-48 md:h-64 relative">
                    <Image
                      src={service.image.includes('cloudinary')
                        ? getCloudinaryUrl(service.image, 800)
                        : service.image || "/placeholder.svg"}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw"
                      priority={index < 3}
                      loading={index < 3 ? "eager" : "lazy"}
                    />
                    <div className="absolute inset-0 bg-black/20 transition-transform duration-300 group-hover:scale-105"></div>
                  </div>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center mb-3 md:mb-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-500/20 flex items-center justify-center mr-3 md:mr-4">
                        {service.icon === 'Wrench' && <Wrench className="h-4 w-4 md:h-5 md:w-5 text-orange-400" />}
                        {service.icon === 'Cog' && <Cog className="h-4 w-4 md:h-5 md:w-5 text-orange-400" />}
                        {service.icon === 'Car' && <Car className="h-4 w-4 md:h-5 md:w-5 text-orange-400" />}
                        {service.icon === 'Truck' && <Truck className="h-4 w-4 md:h-5 md:w-5 text-orange-400" />}
                        {service.icon === 'Shield' && <Shield className="h-4 w-4 md:h-5 md:w-5 text-orange-400" />}
                      </div>
                      <h3 className="text-sm sm:text-base md:text-xl font-bold">{service.title}</h3>
                    </div>
                    <p className="text-zinc-400 mb-3 md:mb-4 text-sm md:text-base line-clamp-3">{service.description}</p>
                    <Link
                      href="/services"
                      className="text-orange-400 hover:text-orange-300 inline-flex items-center text-sm md:text-base"
                    >
                      Learn more
                      <ChevronRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-zinc-400 text-lg mb-6">
              And much more! From custom one-off projects to full vehicle builds, we have the expertise to bring your vision to life.
            </p>
            <Link href="/services">
              <Button variant="outline" className="border-orange-600 text-orange-300 hover:bg-orange-950/50 focus-visible:ring-orange-600">
                View All Services
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured <span className="text-orange-500">Products</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Browse through our selection of high-quality fabricated products and custom solutions.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-full">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product: Product, index: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative w-full"
                >
                  <Link href={`/shop/${product.id}`}>
                    <div className="aspect-square bg-zinc-800 rounded-lg overflow-hidden">
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0].includes('cloudinary')
                            ? product.images[0].replace('/upload/', '/upload/w_600,q_auto,f_auto/')
                            : product.images[0].includes('shopify')
                              ? product.images[0].includes('?')
                                ? `${product.images[0]}&width=600&height=600&crop=center`
                                : `${product.images[0]}?width=600&height=600&crop=center`
                              : product.images[0]
                          }
                          alt={product.name}
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          width={300}
                          height={300}
                          loading="lazy"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <h3 className="font-semibold text-lg group-hover:text-orange-500 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-zinc-400 text-sm line-clamp-2 mt-1">
                        {product.description}
                      </p>
                      <div className="mt-2">
                        <span className="text-orange-500 font-semibold">
                          ${(() => {
                            // Ensure we have a valid number
                            let price = typeof product.price === 'number' ? product.price : Number(product.price);
                            if (isNaN(price)) return '0';
                            
                            // Use parseFloat to normalize the number and remove any extra precision issues
                            price = parseFloat(price.toString());
                            
                            // Format the price: no decimals for whole numbers, up to 2 decimals otherwise
                            if (price % 1 === 0) {
                              return Math.round(price).toString();
                            } else {
                              // Round to 2 decimal places and remove trailing zeros
                              return price.toFixed(2).replace(/\.?0+$/, '');
                            }
                          })()}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-zinc-400">No featured products available at the moment.</p>
                <Link href="/shop" className="mt-4 inline-block">
                  <Button variant="outline" className="border-orange-600 text-orange-300 hover:bg-orange-950/50 focus-visible:ring-orange-600">
                    View All Products
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <Link href="/shop">
              <Button variant="outline" className="border-orange-600 text-orange-300 hover:bg-orange-950/50 focus-visible:ring-orange-600">
                View All Products
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-zinc-900 overflow-x-hidden">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                About <span className="text-orange-500">ELITE</span> <span className="font-bold">FABWORX</span>
              </h2>
              <p className="text-zinc-400 mb-6">
                {settings.aboutText}
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Award className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Quality</h4>
                    <p className="text-sm text-zinc-400">Premium materials</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Certified</h4>
                    <p className="text-sm text-zinc-400">Industry approved</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative h-[400px] lg:h-[500px]"
            >
              <Image
                src={settings.aboutImage && settings.aboutImage.includes('cloudinary')
                  ? getCloudinaryUrl(settings.aboutImage, 800)
                  : settings.aboutImage || "/workshop.jpg"}
                alt="Elite FabWorx Workshop"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-black">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Project <span className="text-orange-500">Gallery</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Check out our recent projects and custom fabrication work.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {randomGalleryImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true, margin: "100px" }}
                className="relative aspect-square overflow-hidden rounded-lg"
              >
                <Image
                  src={image.url.includes('cloudinary')
                    ? getCloudinaryUrl(image.url, 800)
                    : image.url}
                  alt={image.caption || "Gallery image"}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 33vw, 25vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-white font-medium">{image.caption}</p>
                  <p className="text-zinc-300 text-sm">{image.category}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/gallery">
              <Button variant="outline" className="border-orange-600 text-orange-300 hover:bg-orange-950/50 focus-visible:ring-orange-600">
                View Full Gallery
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-20 bg-zinc-900">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">
              Client <span className="text-orange-500">Testimonials</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              Read what our clients say about us
            </p>
          </div>

          <TestimonialSlider />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-black relative overflow-x-hidden">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Get in <span className="text-orange-500">Touch</span>
              </h2>
              <p className="text-zinc-400 mb-8">
                Have a project in mind? Contact us to discuss your requirements or schedule a consultation.
              </p>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Phone className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Phone</h4>
                    <p className="text-zinc-400">{settings.contactInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p className="text-zinc-400">{settings.contactInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Location</h4>
                    <p className="text-zinc-400">{settings.contactInfo.location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="w-full max-w-2xl mx-auto">
              <div className="bg-black/40 backdrop-blur-md border border-orange-500/30 rounded-lg p-6 md:p-8 shadow-2xl">
              <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Preview Section */}
      {settings.socialLinks?.instagram && (
        <section className="py-16 md:py-20 bg-black">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">
                Follow Us on <span className="text-orange-500">Instagram</span>
              </h2>
              <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
                Check out our latest projects and behind-the-scenes content
              </p>
            </div>

            <div ref={instagramContainerRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-start max-w-full">
              {/* Instagram Post 1 */}
              <div className="instagram-post-container w-full overflow-hidden bg-zinc-800 rounded-lg">
                {instagramLoaded ? (
                  <blockquote 
                    className="instagram-media w-full !max-w-full !min-w-0 !m-0 bg-zinc-800 rounded-lg aspect-square" 
                    data-instgrm-captioned
                    data-instgrm-permalink="https://www.instagram.com/p/C5XmvX6Ru18/"
                    data-instgrm-version="14"
                    style={{ 
                      border: '1px solid #333',
                      minHeight: '300px',
                      background: '#1a1a1a',
                      maxWidth: '100%'
                    }}
                  ></blockquote>
                ) : (
                  <div className="aspect-square flex items-center justify-center p-4">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mb-4 mx-auto"></div>
                      <p className="text-zinc-400">Loading Instagram post...</p>
                      <a 
                        href="https://www.instagram.com/p/C5XmvX6Ru18/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-4 text-orange-400 hover:text-orange-300 text-sm inline-block"
                      >
                        View on Instagram
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Instagram Post 2 */}
              <div className="instagram-post-container w-full overflow-hidden bg-zinc-800 rounded-lg">
                {instagramLoaded ? (
                  <blockquote 
                    className="instagram-media w-full !max-w-full !min-w-0 !m-0 bg-zinc-800 rounded-lg aspect-square" 
                    data-instgrm-captioned
                    data-instgrm-permalink="https://www.instagram.com/p/C00fKqJRL8O/"
                    data-instgrm-version="14"
                    style={{ 
                      border: '1px solid #333',
                      minHeight: '300px',
                      background: '#1a1a1a'
                    }}
                  ></blockquote>
                ) : (
                  <div className="aspect-square flex items-center justify-center p-4">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mb-4 mx-auto"></div>
                      <p className="text-zinc-400">Loading Instagram post...</p>
                      <a 
                        href="https://www.instagram.com/p/C00fKqJRL8O/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-4 text-orange-400 hover:text-orange-300 text-sm inline-block"
                      >
                        View on Instagram
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Instagram Post 3 */}
              <div className="instagram-post-container w-full overflow-hidden bg-zinc-800 rounded-lg">
                {instagramLoaded ? (
                  <blockquote 
                    className="instagram-media w-full !max-w-full !min-w-0 !m-0 bg-zinc-800 rounded-lg aspect-square" 
                    data-instgrm-captioned
                    data-instgrm-permalink="https://www.instagram.com/p/CpR0E0zPU6O/"
                    data-instgrm-version="14"
                    style={{ 
                      border: '1px solid #333',
                      minHeight: '300px',
                      background: '#1a1a1a'
                    }}
                  ></blockquote>
                ) : (
                  <div className="aspect-square flex items-center justify-center p-4">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mb-4 mx-auto"></div>
                      <p className="text-zinc-400">Loading Instagram post...</p>
                      <a 
                        href="https://www.instagram.com/p/CpR0E0zPU6O/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-4 text-orange-400 hover:text-orange-300 text-sm inline-block"
                      >
                        View on Instagram
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link href="https://www.instagram.com/elite_fabworx/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-orange-600 text-orange-300 hover:bg-orange-950/50 focus-visible:ring-orange-600">
                  <Instagram className="mr-2 h-4 w-4" />
                  Follow Us
                </Button>
                  </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

function TestimonialSlider() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch testimonials with caching
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const cachedTestimonials = sessionStorage.getItem('testimonials');
        if (cachedTestimonials) {
          setTestimonials(JSON.parse(cachedTestimonials));
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/testimonials');
        if (!response.ok) throw new Error('Failed to fetch testimonials');
        const data = await response.json();
        
        setTestimonials(data);
        sessionStorage.setItem('testimonials', JSON.stringify(data));
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Defer testimonial loading until after core content
    const timer = setTimeout(() => {
      fetchTestimonials();
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 relative">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={`testimonial-${testimonial.id || index}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Card className="bg-zinc-800 border-zinc-700 h-full hover:border-blue-500/20 transition-colors">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex flex-col h-full">
                  {/* Header with name and date */}
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full overflow-hidden bg-zinc-700">
                        <div className="w-full h-full flex items-center justify-center text-zinc-400">
                          <svg className="w-4 sm:w-6 h-4 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-xs sm:text-sm">{testimonial.name}</div>
                        <div className="text-[10px] sm:text-xs text-zinc-400">{testimonial.date}</div>
                      </div>
                    </div>
                    <a 
                      href="https://www.facebook.com/ELITEFABWORX/reviews"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-blue-500 transition-colors"
                    >
                      <Facebook className="h-3 sm:h-4 w-3 sm:w-4" />
                    </a>
                  </div>

                  {/* Review content */}
                  <p className="text-xs sm:text-sm mb-3 sm:mb-4 flex-grow">{testimonial.content}</p>

                  {/* Footer with likes and comments */}
                  <div className="mt-auto pt-2 sm:pt-4 border-t border-zinc-700">
                    <div className="flex items-center justify-between text-[10px] sm:text-xs text-zinc-400">
                      <div className="flex items-center gap-1">
                        <div className="flex -space-x-1">
                          <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-blue-500 flex items-center justify-center">
                            <ThumbsUp className="w-1.5 sm:w-2 h-1.5 sm:h-2 text-white" />
                          </div>
                        </div>
                        <span>{testimonial.likes}</span>
                      </div>
                      {testimonial.comments > 0 && (
                        <div>{testimonial.comments} comment{testimonial.comments > 1 ? 's' : ''}</div>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-between mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-zinc-700">
                    <button className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-zinc-400 hover:text-blue-500 transition-colors">
                      <ThumbsUp className="w-3 sm:w-4 h-3 sm:h-4" />
                      Like
                    </button>
                    <button className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-zinc-400 hover:text-blue-500 transition-colors">
                      <MessageSquare className="w-3 sm:w-4 h-3 sm:h-4" />
                      Comment
                    </button>
                    <button className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-zinc-400 hover:text-blue-500 transition-colors">
                      <Share className="w-3 sm:w-4 h-3 sm:h-4" />
                      Share
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500"></div>
    </div>
  )
} 