"use client"

import { motion } from "framer-motion"
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Clock, Phone, Star, Award, CheckCircle, ChevronRight, Wrench, Cog, Car, Truck, Shield, Settings } from 'lucide-react'

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

const services = [
  {
    title: "Custom Fabrication",
    description: "Local metal fabrication solutions for Murray Bridge's rural and agricultural needs, from farm equipment modifications to custom mounting solutions",
    image: "https://res.cloudinary.com/dz8iqfdvf/image/upload/v1741819492/elite-fabworx/service-1/tbypybcrwyihe5wxezsp.jpg",
    icon: "Wrench",
    offerings: [
      "Agricultural equipment modifications",
      "Farm vehicle custom solutions",
      "Local business fabrication needs"
    ]
  },
  {
    title: "Performance Exhausts",
    description: "Custom exhaust systems for Murray Bridge drivers. Perfect for both daily driving and weekend river runs along the Murray",
    image: "https://res.cloudinary.com/dz8iqfdvf/image/upload/v1741818971/elite-fabworx/service-2/lftf9v2h31iynhtg7ygm.jpg",
    icon: "Car",
    offerings: [
      "Stainless steel construction", 
      "Performance gains for country driving",
      "Custom sound tuning for rural areas"
    ]
  },
  {
    title: "4WD Modifications", 
    description: "Robust 4WD accessories built for the Mallee region's tough conditions. Sliders, bars, and custom mounting solutions",
    image: "https://res.cloudinary.com/dz8iqfdvf/image/upload/v1741819120/elite-fabworx/service-3/o4foeuvqxofrmcykqz7y.jpg",
    icon: "Truck",
    offerings: [
      "Mallee-tested durability",
      "Custom fit for farm work",
      "Murray River recreation accessories"
    ]
  },
  {
    title: "Exhaust Systems",
    description: "Complete exhaust solutions for Murray Bridge vehicles, from farm utilities to family cars, built to handle country conditions",
    image: "https://res.cloudinary.com/dz8iqfdvf/image/upload/v1741784167/elite-fabworx/service-4/gnogoariquz6t2rmahkc.jpg",
    icon: "Cog",
    offerings: [
      "Complete system replacements",
      "Heavy-duty for farm vehicles",
      "Local fitting and service"
    ]
  },
  {
    title: "Roll Cages",
    description: "Safety-first roll cage fabrication for The Bend Motorsport Park (just 20 minutes away) and local rally competitors",
    image: "https://res.cloudinary.com/dz8iqfdvf/image/upload/v1741784065/elite-fabworx/service-5/soe5h9ayegtuffwakj3u.jpg",
    icon: "Shield",
    offerings: [
      "CAMS approved designs",
      "The Bend Motorsport Park proximity",
      "Fast local turnaround"
    ]
  },
  {
    title: "Prototyping",
    description: "In-house design and development services for local Murray Bridge innovators and agricultural equipment manufacturers",
    image: "https://res.cloudinary.com/dz8iqfdvf/image/upload/v1741784060/elite-fabworx/service-6/dmgofbnih4qztwkzndup.jpg",
    icon: "Settings",
    offerings: [
      "Agricultural innovation support",
      "Local business prototyping",
      "Farm equipment development"
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

const benefits = [
  {
    icon: <MapPin className="h-6 w-6" />,
    title: "Right in Town",
    description: "Located in the heart of Murray Bridge. No need to travel to Adelaide - quality fabrication is right on your doorstep."
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Quick Local Service", 
    description: "Same-day quotes and rapid turnaround for urgent jobs. We understand the needs of local businesses and farmers."
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Community Focused",
    description: "Proudly supporting local motorsport, farming, and 4WD communities. We know what works in our unique environment."
  }
]

const testimonials = [
  {
    name: "Tom R., Murray Bridge",
    content: "Finally, professional metal fabrication in Murray Bridge! No more trips to Adelaide. The team did an amazing job on my farm utility modifications.",
    rating: 5
  },
  {
    name: "Jenny K., Murray Bridge", 
    content: "Elite Fabworx built my rally car's roll cage for The Bend events. Top quality work and they understand what local drivers need. Highly recommend!",
    rating: 5
  }
]

export function MurrayBridgeContent() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={"https://res.cloudinary.com/dz8iqfdvf/image/upload/v1741783803/lc03gne4mnc77za4awxa.jpg".includes('cloudinary')
              ? getCloudinaryUrl("https://res.cloudinary.com/dz8iqfdvf/image/upload/v1741783803/lc03gne4mnc77za4awxa.jpg", 1200)
              : "https://res.cloudinary.com/dz8iqfdvf/image/upload/v1741783803/lc03gne4mnc77za4awxa.jpg"}
            alt="Professional metal fabrication workshop in Murray Bridge - Elite Fabworx"
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
                Metal Fabrication Murray Bridge
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl mb-8 text-zinc-300 max-w-3xl mx-auto font-light tracking-wide">
                Elite Fabworx is your local <strong>metal fabrication workshop in Murray Bridge</strong>. We're a family-owned business specializing in precision TIG welding, custom automotive fabrication, and heavy-duty 4WD accessories for the Murray Bridge community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700 px-6 py-3 h-auto text-base">
                  <Link href="https://g.co/kgs/32EzYiv" target="_blank" rel="noopener noreferrer">Visit Our Workshop</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-orange-500 text-orange-400 hover:bg-orange-950/20 px-6 py-3 h-auto text-base">
                  <Link href="/gallery">See Local Projects</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Local Services Section */}
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
              Murray Bridge Metal Fabrication Services
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Expert local fabrication services designed for the unique needs of Murray Bridge and surrounding communities.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
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
                        Get Quote
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

      {/* Local Advantages Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-orange-500">
                Your Local Murray Bridge Fabrication Experts
              </h2>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mt-1 flex-shrink-0">
                      <div className="text-orange-400">{benefit.icon}</div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-gray-300">{benefit.description}</p>
                      {benefit.title === "Right in Town" && (
                        <p className="text-orange-400 text-sm mt-2">
                          <strong>Note:</strong> We share a workshop with Pedal This Performance and Conversions
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Image
                src="https://res.cloudinary.com/dz8iqfdvf/image/upload/v1748006514/fabrication_workshop_in_Murray_Bridge_pfnovy.jpg"
                alt="Custom metal fabrication project in Murray Bridge workshop"
                width={500}
                height={400}
                className="rounded-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing & Local Info Section */}
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
              Why Choose Local Murray Bridge Fabrication?
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Supporting our local community with competitive pricing and personalized service.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="bg-zinc-800 border-zinc-700 h-full">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-orange-400">Competitive Local Pricing</h3>
                  <ul className="space-y-4 text-gray-300">
                    {[
                      "No Adelaide workshop overheads - savings passed to you",
                      "Free consultation and quotes for Murray Bridge residents", 
                      "Flexible payment options for local customers",
                      "Rush jobs at standard rates for local emergencies"
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-zinc-800 border-zinc-700 h-full">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-orange-400">Easy Directions</h3>
                  <div className="text-gray-300 space-y-3">
                    <p><strong>From Murray Bridge CBD:</strong> Just 5 minutes drive via Bridge Street</p>
                    <p><strong>From The Bend Motorsport Park:</strong> 20 minutes via Old Princes Highway</p>
                    <p><strong>From Tailem Bend:</strong> 15 minutes via Dukes Highway</p>
                    <p className="text-orange-400 font-semibold">
                      Plenty of parking available for vehicles and trailers
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Local Testimonials Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-orange-500">
              What Murray Bridge Locals Say
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Real feedback from our local community members and customers.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-zinc-800 border-zinc-700 h-full hover:border-orange-500/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-4">
                      "{testimonial.content}"
                    </p>
                    <p className="text-orange-400 font-semibold">- {testimonial.name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Community Section */}
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
              Proud to Serve Our Murray Bridge Community
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Supporting local industries and recreational activities with specialized fabrication solutions.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Local Motorsport",
                description: "Supporting drivers at The Bend Motorsport Park with safety equipment and performance modifications."
              },
              {
                title: "Rural & Farming", 
                description: "Custom solutions for agricultural vehicles and machinery. Built tough for Mallee conditions."
              },
              {
                title: "River Recreation",
                description: "4WD accessories and boat trailer modifications for Murray River adventures and camping."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-zinc-800 border-zinc-700 h-full hover:border-orange-500/30 transition-colors">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold mb-4 text-orange-400">{item.title}</h3>
                    <p className="text-gray-300">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto max-w-4xl text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-orange-500">
              Visit Your Local Murray Bridge Metal Fabrication Workshop
            </h2>
            <p className="text-xl mb-8 text-zinc-300 max-w-2xl mx-auto">
              Drop by for a coffee and chat about your project. We're your neighbors and we're here to help with all your fabrication needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CallButton />
              <Button asChild size="lg" variant="outline" className="border-orange-500 text-orange-400 hover:bg-orange-950/20">
                <Link href="https://g.co/kgs/32EzYiv" target="_blank" rel="noopener noreferrer">Get Directions</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 