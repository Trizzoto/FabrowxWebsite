"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import {
  Wrench,
  Cog,
  Car,
  Truck,
  Shield,
  ChevronRight,
  Clock,
  CheckCircle,
  Settings,
  Zap,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Script from "next/script"
import { useRouter } from "next/navigation"

interface Service {
  title: string
  description: string
  image: string
  icon: string
  slug: string
  offerings?: string[]
}

interface ServicesContentProps {
  services: Service[]
}

const benefits = [
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Quick Turnaround",
    description: "Fast and efficient service without compromising on quality"
  },
  {
    icon: <CheckCircle className="h-6 w-6" />,
    title: "Quality Guaranteed",
    description: "Premium materials and expert craftsmanship"
  },
  {
    icon: <Wrench className="h-6 w-6" />,
    title: "Custom Solutions",
    description: "Tailored fabrication to meet your specific needs"
  },
  {
    icon: <Settings className="h-6 w-6" />,
    title: "Expert Team",
    description: "Skilled professionals with years of experience"
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Modern Equipment",
    description: "State-of-the-art tools and machinery"
  }
]

export function ServicesContent({ services }: ServicesContentProps) {
  const router = useRouter()

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench':
        return <Wrench className="h-6 w-6" />
      case 'Cog':
        return <Cog className="h-6 w-6" />
      case 'Car':
        return <Car className="h-6 w-6" />
      case 'Truck':
        return <Truck className="h-6 w-6" />
      case 'Shield':
        return <Shield className="h-6 w-6" />
      default:
        return <Wrench className="h-6 w-6" />
    }
  }

  // Define JSON-LD structured data for SEO
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Metal Fabrication",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Elite FabWorx",
      "url": "https://www.elitefabworx.com",
      "logo": "https://www.elitefabworx.com/logo.png",
      "telephone": "+1234567890",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Main St",
        "addressLocality": "City",
        "addressRegion": "State",
        "postalCode": "12345",
        "addressCountry": "US"
      }
    },
    "areaServed": "United States",
    "description": "Expert metal fabrication services for performance vehicles and 4WDs."
  };

  return (
    <main className="bg-black min-h-screen" role="main">
      {/* Home Button */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          className="border-orange-500/30 bg-black/20 backdrop-blur-sm hover:bg-black/40 hover:border-orange-500/50 transition-all duration-300"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Home
        </Button>
      </div>

      {/* Hero Section */}
      <div className="relative h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10"></div>
        <Image
          src="https://res.cloudinary.com/dz8iqfdvf/image/upload/v1741783803/lc03gne4mnc77za4awxa.jpg"
          alt="Services header"
          fill
          className="object-cover object-center"
        />
        <div className="relative z-20 container h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-7xl font-bold mb-4">
            <span className="text-orange-500 font-extrabold tracking-wider">OUR</span>
            <span className="font-light tracking-widest ml-2">SERVICES</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 max-w-2xl font-light tracking-wide">
            Expert metal fabrication services for performance vehicles and 4WDs.
            From custom builds to repairs, we've got you covered.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <section className="py-20 bg-zinc-900">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-zinc-800 border-zinc-700 overflow-hidden h-full hover:border-orange-500/50 transition-colors shadow-lg">
                  <div className="relative h-64">
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                          {getIcon(service.icon)}
                        </div>
                        <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-zinc-300 mb-6">{service.description}</p>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">What we offer:</h4>
                      <ul className="space-y-2">
                        {service.offerings?.map((offering, index) => (
                          <li key={index} className="flex items-center text-zinc-400">
                            <CheckCircle className="h-5 w-5 text-orange-500 mr-2" />
                            {offering}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button className="w-full mt-6 bg-orange-600 hover:bg-orange-700" asChild>
                      <Link href="/contact">
                        Get a Quote
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services Message */}
      <section className="py-10 bg-zinc-900">
        <div className="container px-4 md:px-6">
          <div className="text-center">
            <p className="text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto">
              <span className="text-orange-500 font-semibold">And more</span> Discuss it with us and see how we can help with your specific project needs.
            </p>
            <Button className="mt-6 bg-orange-600 hover:bg-orange-700" asChild>
              <Link href="/contact">
                Contact Us
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-black">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-orange-500">ELITE</span> <span className="font-bold">FABWORX</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              We pride ourselves on delivering exceptional service and quality workmanship
              for all your metal fabrication needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-zinc-800/50 rounded-lg p-6 hover:bg-zinc-800 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-4">
                  <div className="text-orange-400">{benefit.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-zinc-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-zinc-400 mb-8">
              Contact us today to discuss your requirements and get a free quote.
              We're here to bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700" asChild>
                <Link href="/contact">
                  Get in Touch
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-orange-500 text-orange-400 hover:bg-orange-950/50" asChild>
                <Link href="/gallery">
                  View Our Work
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* JSON-LD structured data for SEO */}
      <Script
        id="services-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
    </main>
  )
} 