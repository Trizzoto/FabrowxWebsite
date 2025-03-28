"use client"

import { useRef, useState, useEffect } from "react"
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
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ParticleContainer } from "@/components/particle-container"
import { Product, Testimonial } from "../data"
import { products, productCategories, featuredProducts, testimonials } from "../data"
import { ContactForm } from "../contact/contact-form"

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
  }
  galleryImages: GalleryImage[]
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

  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section ref={ref} className="relative h-screen overflow-hidden">
        <ParticleContainer />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10"></div>
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/80"></div>
          <Image
            src={settings.heroImage}
            alt="Elite FabWorx metal fabrication"
            fill
            className="object-cover object-center opacity-40"
            priority
          />
        </motion.div>
        <div className="container relative z-20 h-full flex flex-col justify-center items-start px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="w-full text-center">
              <div className="flex flex-col md:flex-row items-center justify-center gap-2 mb-4">
                <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold tracking-tight text-white order-1">
                  <span className="text-orange-500 font-extrabold tracking-wider">ELITE</span>
                  <span className="font-light tracking-widest ml-1 md:ml-2">FABWORX</span>
                </h1>
                <Image
                  src="/logo.png"
                  alt="Elite FabWorx Logo"
                  width={150}
                  height={150}
                  className="rounded-full object-contain w-auto h-auto max-w-[150px] md:max-w-[225px] order-2 md:ml-4"
                  priority
                  quality={100}
                  unoptimized
                />
              </div>
              <p className="text-base sm:text-lg md:text-2xl mb-6 md:mb-8 text-zinc-300 mx-auto max-w-3xl font-light tracking-wide">
                {settings.heroTagline || "Precision metal fabrication for performance vehicles and 4WDs"}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-4 sm:px-6 py-2 h-auto" asChild>
                  <Link href="/services">
                    Our Services
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-orange-500 text-orange-400 hover:bg-orange-950/50 px-4 sm:px-6 py-2 h-auto" asChild>
                  <Link href="/catalog">
                    View Catalogue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-zinc-900">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="text-orange-500">Services</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              We offer a comprehensive range of metal fabrication services tailored for performance vehicles and 4WDs.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {settings.services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-zinc-800 border-zinc-700 overflow-hidden h-full group hover:border-orange-500/50 transition-colors border-0">
                  <div className="h-48 md:h-64 relative">
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      priority={index < 3}
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
                      <h3 className="text-base md:text-xl font-bold line-clamp-1">{service.title}</h3>
                    </div>
                    <p className="text-zinc-400 mb-3 md:mb-4 text-sm md:text-base line-clamp-3">{service.description}</p>
                    <Link
                      href={`/services/${service.slug}`}
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
              <Button variant="outline" className="border-orange-500 text-orange-400 hover:bg-orange-950/50">
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

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={`/catalog/${product.id}`} className="group transition-transform hover:-translate-y-1 duration-300">
                  <Card className="overflow-hidden border-zinc-800 bg-zinc-900 hover:border-orange-500/50 transition-all duration-300 h-full flex flex-col">
                    <div className="relative aspect-square">
                      <Image
                        src={product.image || "/placeholder.jpg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-3 md:p-4 flex flex-col flex-1">
                      <div className="mb-1 md:mb-2">
                        <span className="text-xs md:text-sm text-orange-400 font-medium block mb-1">{product.category}</span>
                        <h3 className="font-semibold text-sm md:text-lg line-clamp-2 group-hover:text-orange-400 transition-colors duration-300 min-h-[40px] md:min-h-[56px]">
                          {product.name}
                        </h3>
                      </div>
                      <div className="mt-auto text-right">
                        <p className="text-base md:text-xl font-bold text-orange-400">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/catalog">
              <Button variant="outline" className="border-orange-500 text-orange-400 hover:bg-orange-950/50">
                View All Products
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-zinc-900">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                About <span className="text-orange-500">Elite FabWorx</span>
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
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                Learn More About Us
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative h-[400px] lg:h-[500px]"
            >
              <Image
                src={settings.aboutImage || "/workshop.jpg"}
                alt="Elite FabWorx Workshop"
                fill
                className="object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-black">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Our <span className="text-orange-500">Gallery</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-zinc-400"
            >
              Browse through our portfolio of custom fabrication work and completed projects
            </motion.p>
          </div>

          <AnimatePresence mode="wait">
            <div key={randomGalleryImages.map(img => img.id).join('-')} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {randomGalleryImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <Card className="bg-zinc-800 border-zinc-700 overflow-hidden group hover:border-orange-500/50 transition-colors">
                    <div className="h-64 relative">
                      <Image
                        src={image.url}
                        alt={image.caption || 'Gallery image'}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-opacity"></div>
                    </div>
                    {image.caption && (
                      <CardContent className="p-4">
                        <p className="text-zinc-300">{image.caption}</p>
                        {image.category && (
                          <span className="text-sm text-orange-400 mt-2 inline-block">
                            {image.category}
                          </span>
                        )}
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          <div className="mt-12 text-center">
            <Link href="/gallery">
              <Button variant="outline" className="border-orange-500 text-orange-400 hover:bg-orange-950/50">
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
              Read our latest reviews from Facebook
            </p>
          </div>

          <TestimonialSlider />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-black relative">
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
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-800 py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-bold mb-4">
                <span className="text-orange-500">ELITE</span>
                <span className="font-light ml-2">FABWORX</span>
              </h3>
              <p className="text-zinc-400 mb-6">
                Precision metal fabrication for performance vehicles and 4WDs. Quality craftsmanship and exceptional service.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-zinc-400 hover:text-orange-500">
                  <Instagram className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-zinc-400 hover:text-orange-500">
                  <Facebook className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-zinc-400 hover:text-orange-500">
                  <Youtube className="h-6 w-6" />
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-zinc-400 hover:text-orange-500">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-zinc-400 hover:text-orange-500">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-zinc-400 hover:text-orange-500">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="text-zinc-400 hover:text-orange-500">
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-zinc-400 hover:text-orange-500">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2">
                <li className="text-zinc-400">
                  <Phone className="h-4 w-4 inline-block mr-2" />
                  {settings.contactInfo.phone}
                </li>
                <li className="text-zinc-400">
                  <Mail className="h-4 w-4 inline-block mr-2" />
                  {settings.contactInfo.email}
                </li>
                <li className="text-zinc-400">
                  <MapPin className="h-4 w-4 inline-block mr-2" />
                  {settings.contactInfo.location}
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-zinc-800 text-center text-zinc-400">
            <p>&copy; {new Date().getFullYear()} Elite FabWorx. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function TestimonialSlider() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials')
        if (!response.ok) throw new Error('Failed to fetch testimonials')
        const data = await response.json()
        setTestimonials(data)
      } catch (err) {
        setError('Failed to load reviews')
        console.error('Error fetching testimonials:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-zinc-400">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <Card className="bg-zinc-800 border-zinc-700 h-full">
            <CardContent className="p-3 md:p-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden mb-2 md:mb-4">
                  <Image
                    src={testimonial.avatar || "/placeholder-avatar.png"}
                    alt={testimonial.name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1 md:mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 md:h-4 md:w-4 text-orange-400 fill-orange-400"
                      />
                    ))}
                  </div>
                  <p className="text-zinc-300 italic mb-2 md:mb-4 text-xs md:text-base line-clamp-4 md:line-clamp-none">"{testimonial.content}"</p>
                  <div className="font-semibold text-white text-sm md:text-base">{testimonial.name}</div>
                  <div className="text-xs md:text-sm text-zinc-400">{testimonial.role}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
} 