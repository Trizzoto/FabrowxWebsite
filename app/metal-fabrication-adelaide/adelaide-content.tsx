"use client"

import { motion } from "framer-motion"
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Clock, Phone, Star, CheckCircle, ChevronRight, Wrench, Cog, Car, Truck, Shield, Settings } from 'lucide-react'

function getCloudinaryUrl(url: string, width: number) {
  return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
}

const getIcon = (iconName: string) => {
  const icons: { [key: string]: JSX.Element } = {
    Wrench: <Wrench className="h-6 w-6 text-orange-400" />,
    Cog: <Cog className="h-6 w-6 text-orange-400" />,
    Car: <Car className="h-6 w-6 text-orange-400" />,
    Truck: <Truck className="h-6 w-6 text-orange-400" />,
    Shield: <Shield className="h-6 w-6 text-orange-400" />,
    Settings: <Settings className="h-6 w-6 text-orange-400" />,
  }
  return icons[iconName] || <Wrench className="h-6 w-6 text-orange-400" />
}

const adelaideServices = [
  {
    title: "Custom Fabrication",
    description: "Specialized metal fabrication solutions for Adelaide's diverse automotive needs, from vintage restorations to modern performance builds",
    image: "https://res.cloudinary.com/dz8iqfdvf/image/upload/v1741819492/elite-fabworx/service-1/tbypybcrwyihe5wxezsp.jpg",
    icon: "Wrench",
    offerings: [
      "Custom brackets and mounting solutions",
      "Adelaide Hills vehicle modifications", 
      "Vintage car restoration fabrication"
    ]
  },
  {
    title: "Performance Exhausts",
    description: "High-performance exhaust systems engineered for Adelaide driving conditions, from city streets to the Adelaide Hills",
    image: "https://res.cloudinary.com/dz8iqfdvf/image/upload/v1741818971/elite-fabworx/service-2/lftf9v2h31iynhtg7ygm.jpg",
    icon: "Car",
    offerings: [
      "Stainless steel performance systems",
      "Cat-back and turbo-back exhausts",
      "Sound tuning for Adelaide suburbs"
    ]
  },
  {
    title: "4WD Modifications", 
    description: "Heavy-duty 4WD accessories for Adelaide's outdoor enthusiasts exploring the Flinders Ranges and outback South Australia",
    image: "https://res.cloudinary.com/dz8iqfdvf/image/upload/v1741819120/elite-fabworx/service-3/o4foeuvqxofrmcykqz7y.jpg",
    icon: "Truck",
    offerings: [
      "Bull bars and rock sliders",
      "Roof racks for camping gear",
      "Underbody protection systems"
    ]
  },
  {
    title: "Exhaust Systems",
    description: "Complete exhaust solutions for Adelaide metro vehicles, focusing on performance, efficiency, and compliance",
    image: "https://res.cloudinary.com/dz8iqfdvf/image/upload/v1741784167/elite-fabworx/service-4/gnogoariquz6t2rmahkc.jpg",
    icon: "Cog", 
    offerings: [
      "Complete system replacements",
      "High-flow catalytic converters",
      "Compliance-friendly modifications"
    ]
  },
  {
    title: "Roll Cages",
    description: "CAMS-approved safety equipment for Adelaide motorsport competitors at The Bend Motorsport Park and beyond",
    image: "https://res.cloudinary.com/dz8iqfdvf/image/upload/v1741784065/elite-fabworx/service-5/soe5h9ayegtuffwakj3u.jpg",
    icon: "Shield",
    offerings: [
      "The Bend Motorsport Park spec cages",
      "Street-legal roll protection",
      "Rally and circuit racing applications"
    ]
  },
  {
    title: "Prototyping",
    description: "Innovative design and development services for Adelaide's engineering and automotive sectors",
    image: "https://res.cloudinary.com/dz8iqfdvf/image/upload/v1741784060/elite-fabworx/service-6/dmgofbnih4qztwkzndup.jpg",
    icon: "Settings",
    offerings: [
      "Concept to production development",
      "Rapid prototype fabrication", 
      "Engineering consultation services"
    ]
  }
]

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }
    checkIsMobile()
  }, [])

  return isMobile
}

const CallButton = () => {
  const isMobile = useIsMobile()
  
  return (
    <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
      <Link href={isMobile ? "tel:0499638046" : "/contact-us"}>
        <Phone className="w-5 h-5 mr-2" />
        Call 0499 638 046
      </Link>
    </Button>
  )
}

export function AdelaideContent() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={"https://res.cloudinary.com/dz8iqfdvf/image/upload/v1741783803/lc03gne4mnc77za4awxa.jpg".includes('cloudinary')
              ? getCloudinaryUrl("https://res.cloudinary.com/dz8iqfdvf/image/upload/v1741783803/lc03gne4mnc77za4awxa.jpg", 1200)
              : "https://res.cloudinary.com/dz8iqfdvf/image/upload/v1741783803/lc03gne4mnc77za4awxa.jpg"}
            alt="Professional metal fabrication workshop serving Adelaide - Elite Fabworx"
            fill
            className="object-cover object-center opacity-40"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
        </div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col items-center justify-center text-center min-h-[40vh]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
                <span className="text-orange-500 font-extrabold tracking-wider">ELITE</span>
                <span className="font-bold tracking-widest ml-1 md:ml-2">FABWORX</span>
              </h1>
              <h2 className="text-xl sm:text-2xl md:text-3xl text-orange-500 font-light tracking-wider mb-6">
                Metal Fabrication Adelaide
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl mb-8 text-zinc-300 max-w-3xl mx-auto font-light tracking-wide">
                Elite Fabworx brings expert <strong>custom metal fabrication in Adelaide</strong> from our state-of-the-art Murray Bridge workshop. We specialize in precision TIG welding, custom exhaust systems, and heavy-duty 4WD accessories for Adelaide drivers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700 px-6 py-3 h-auto text-base">
                  <Link href="https://g.co/kgs/32EzYiv" target="_blank" rel="noopener noreferrer">Visit Our Workshop</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-orange-500 text-orange-400 hover:bg-orange-950/20 px-6 py-3 h-auto text-base">
                  <Link href="/gallery">View Our Work</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services for Adelaide Section */}
      <section className="py-20 bg-zinc-900">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-orange-500">
              Our Adelaide Metal Fabrication Services
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Comprehensive metal fabrication solutions delivered to Adelaide from our Murray Bridge workshop.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {adelaideServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-zinc-800 border-zinc-700 overflow-hidden h-full hover:border-orange-500/50 transition-colors shadow-lg">
                  <div className="relative h-64">
                    <Image
                      src={service.image && service.image.includes('cloudinary')
                        ? getCloudinaryUrl(service.image, 800)
                        : service.image || "/placeholder.svg"}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
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
                        {service.offerings?.map((offering, idx) => (
                          <li key={idx} className="flex items-center text-zinc-400">
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

      {/* Why Choose Us for Adelaide Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-8 text-orange-500">
                Why Adelaide Drivers Choose Elite Fabworx
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Convenient Location</h3>
                    <p className="text-gray-300">
                      Just 45 minutes from Adelaide CBD via the Dukes Highway. Easy access for all Adelaide metro customers.
                    </p>
                    <p className="text-orange-400 text-sm mt-2">
                      <strong>Note:</strong> We share a workshop with Pedal This Performance and Conversions
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Fast Turnaround</h3>
                    <p className="text-gray-300">
                      Most custom fabrication projects completed within 1-2 weeks. Rush jobs available for Adelaide motorsport events.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Star className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Quality Guarantee</h3>
                    <p className="text-gray-300">
                      All work backed by our quality guarantee. We use only premium materials and certified welding techniques.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Image
                src="https://res.cloudinary.com/dz8iqfdvf/image/upload/v1748006515/fabrication_workshop_in_Adelaide_g8tchk.jpg"
                alt="Custom fabrication work for Adelaide customer"
                width={500}
                height={400}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Process Section */}
      <section className="py-16 px-4 bg-zinc-900">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center text-orange-500">
            Our Process for Adelaide Customers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-4">Free Consultation</h3>
              <p className="text-gray-300">
                Initial consultation to discuss your project requirements. We can arrange to meet in Adelaide or at our workshop.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-4">Custom Design</h3>
              <p className="text-gray-300">
                We create detailed designs and provide transparent pricing. No hidden costs, clear timelines.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-4">Expert Fabrication</h3>
              <p className="text-gray-300">
                Precision fabrication using certified TIG welding and premium materials. Progress updates throughout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center text-orange-500">
            What Adelaide Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-zinc-900 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "Fantastic work on my 79 Series exhaust system. The team at Elite Fabworx really knows their stuff when it comes to <strong>metal fabrication in Adelaide</strong>. Quality is top-notch!"
              </p>
              <p className="text-orange-400 font-semibold">- Mark S., Adelaide Hills</p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "Needed a roll cage for The Bend. Elite Fabworx delivered exactly what I needed, on time and within budget. Highly recommend for any Adelaide motorsport fabrication."
              </p>
              <p className="text-orange-400 font-semibold">- Sarah M., Adelaide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 px-4 bg-zinc-900">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6 text-orange-500">
            Ready for Expert Metal Fabrication in Adelaide?
          </h2>
          <p className="text-xl mb-8 text-zinc-300">
            From custom exhausts to roll cages, we deliver quality fabrication for Adelaide drivers. Get your free quote today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CallButton />
            <Button asChild size="lg" variant="outline" className="border-orange-500 text-orange-400 hover:bg-orange-950/20">
              <Link href="https://g.co/kgs/32EzYiv" target="_blank" rel="noopener noreferrer">Get Directions</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 