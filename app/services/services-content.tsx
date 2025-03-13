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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface Service {
  title: string
  description: string
  image: string
  icon: string
  slug: string
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

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/20 to-black/90"></div>
        <div className="container relative z-10 px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-300"
            >
              Our Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-zinc-300 mb-8"
            >
              Expert metal fabrication services for performance vehicles and 4WDs.
              From custom builds to repairs, we've got you covered.
            </motion.p>
          </div>
        </div>
      </section>

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
                <Card className="bg-zinc-800 border-zinc-700 overflow-hidden h-full hover:border-orange-500/50 transition-colors">
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
                        <li className="flex items-center text-zinc-400">
                          <CheckCircle className="h-5 w-5 text-orange-500 mr-2" />
                          Custom fabrication and design
                        </li>
                        <li className="flex items-center text-zinc-400">
                          <CheckCircle className="h-5 w-5 text-orange-500 mr-2" />
                          Professional installation
                        </li>
                        <li className="flex items-center text-zinc-400">
                          <CheckCircle className="h-5 w-5 text-orange-500 mr-2" />
                          Quality materials
                        </li>
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

      {/* Benefits Section */}
      <section className="py-20 bg-black">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-orange-500">Elite FabWorx</span>
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
    </div>
  )
} 