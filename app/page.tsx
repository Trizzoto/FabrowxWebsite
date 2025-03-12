"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
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
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ParticleContainer } from "@/components/particle-container"

export default function Home() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section ref={ref} className="relative h-screen overflow-hidden">
        <ParticleContainer />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10"></div>
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/80"></div>
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gKlIX1RnqoHi6QB745twxRV5LBhg61.png"
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
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-white">
                <span className="text-blue-500">ELITE</span> FABWORX
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-zinc-300 mx-auto max-w-3xl">
                Precision metal fabrication for performance vehicles and 4WDs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Our Services
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-950/50">
                  View Catalogue
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
              Our <span className="text-blue-500">Services</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              We offer a comprehensive range of metal fabrication services tailored for performance vehicles and 4WDs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-zinc-800 border-zinc-700 overflow-hidden h-full">
                  <div className="h-48 relative">
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-800/90 to-transparent"></div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                        {service.icon}
                      </div>
                      <h3 className="text-xl font-bold">{service.title}</h3>
                    </div>
                    <p className="text-zinc-400 mb-4">{service.description}</p>
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-blue-400 hover:text-blue-300 inline-flex items-center"
                    >
                      Learn more
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.2),transparent_40%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_70%,rgba(59,130,246,0.2),transparent_40%)]"></div>
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured <span className="text-blue-500">Products</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Browse our selection of custom-fabricated performance parts for your vehicle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                  <div className="h-48 relative">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-1">{product.name}</h3>
                    <p className="text-zinc-500 text-sm mb-2">{product.category}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-400 font-semibold">${product.price}</span>
                      <Button size="sm" variant="ghost" className="text-zinc-400 hover:text-white hover:bg-blue-600">
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-950/50">
              View Full Catalogue
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-zinc-900">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                About <span className="text-blue-500">Elite FabWorx</span>
              </h2>
              <p className="text-zinc-400 mb-4">
                Founded in 2010, Elite FabWorx has established itself as a premier metal fabrication shop specializing
                in high-performance automotive components and 4WD modifications.
              </p>
              <p className="text-zinc-400 mb-6">
                Our team of skilled fabricators and engineers combine traditional craftsmanship with cutting-edge
                technology to deliver exceptional quality and performance.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                    <Shield className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Quality Assured</h4>
                    <p className="text-sm text-zinc-500">100% satisfaction</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                    <Award className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Award Winning</h4>
                    <p className="text-sm text-zinc-500">Industry recognized</p>
                  </div>
                </div>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Learn More About Us</Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video rounded-lg overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-rD6gLiohsmuiKpJWETlWAsG6YGWk5x.png"
                  alt="Elite FabWorx 4WD modifications"
                  width={800}
                  height={600}
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 rounded-lg overflow-hidden border-4 border-zinc-900">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gKlIX1RnqoHi6QB745twxRV5LBhg61.png"
                  alt="Elite FabWorx branding"
                  width={200}
                  height={200}
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-black">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="text-blue-500">Gallery</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Take a look at some of our recent projects and custom fabrications.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="aspect-square relative rounded-lg overflow-hidden cursor-pointer"
              >
                <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-sm font-medium">{image.alt}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-950/50">
              View Full Gallery
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-zinc-900">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Client <span className="text-blue-500">Testimonials</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our clients have to say.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-zinc-800 border-zinc-700 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                        <Image
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-zinc-500">{testimonial.vehicle}</p>
                      </div>
                    </div>
                    <p className="text-zinc-400 italic mb-4">"{testimonial.quote}"</p>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-black relative">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.2),transparent_40%)]"></div>
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Get In <span className="text-blue-500">Touch</span>
              </h2>
              <p className="text-zinc-400 mb-8">
                Have a project in mind or need a custom fabrication solution? Contact us today to discuss your
                requirements.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4 mt-1">
                    <MapPin className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Our Location</h4>
                    <p className="text-zinc-400">123 Fabrication Way, Industrial District</p>
                    <p className="text-zinc-400">Brisbane, QLD 4000</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4 mt-1">
                    <Phone className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Phone</h4>
                    <p className="text-zinc-400">(07) 1234 5678</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4 mt-1">
                    <Mail className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <p className="text-zinc-400">info@elitefabworx.com.au</p>
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="font-semibold mb-3">Follow Us</h4>
                  <div className="flex space-x-4">
                    <Link
                      href="#"
                      className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      <Facebook className="h-5 w-5" />
                    </Link>
                    <Link
                      href="#"
                      className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      <Instagram className="h-5 w-5" />
                    </Link>
                    <Link
                      href="#"
                      className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      <Youtube className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6">Send Us a Message</h3>
                  <form className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Your name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Your email"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </label>
                      <input
                        id="subject"
                        type="text"
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Subject"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your message"
                      ></textarea>
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-800 py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                  <Wrench className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold">Elite FabWorx</h3>
              </div>
              <p className="text-zinc-400 mb-4">Precision metal fabrication for performance vehicles and 4WDs.</p>
              <div className="flex space-x-4">
                <Link href="#" className="text-zinc-500 hover:text-blue-400">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-zinc-500 hover:text-blue-400">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-zinc-500 hover:text-blue-400">
                  <Youtube className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-zinc-400 hover:text-blue-400">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-zinc-400 hover:text-blue-400">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-zinc-400 hover:text-blue-400">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-zinc-400 hover:text-blue-400">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-zinc-400 hover:text-blue-400">
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-zinc-400 hover:text-blue-400">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-zinc-400 hover:text-blue-400">
                    Custom Fabrication
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-zinc-400 hover:text-blue-400">
                    Performance Upgrades
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-zinc-400 hover:text-blue-400">
                    4WD Modifications
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-zinc-400 hover:text-blue-400">
                    Exhaust Systems
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-zinc-400 hover:text-blue-400">
                    Roll Cages
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-3">
                <li className="flex">
                  <MapPin className="h-5 w-5 text-blue-400 mr-2 shrink-0" />
                  <span className="text-zinc-400">123 Fabrication Way, Industrial District, Brisbane, QLD 4000</span>
                </li>
                <li className="flex">
                  <Phone className="h-5 w-5 text-blue-400 mr-2 shrink-0" />
                  <span className="text-zinc-400">(07) 1234 5678</span>
                </li>
                <li className="flex">
                  <Mail className="h-5 w-5 text-blue-400 mr-2 shrink-0" />
                  <span className="text-zinc-400">info@elitefabworx.com.au</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-zinc-500 text-sm">
              &copy; {new Date().getFullYear()} Elite FabWorx. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="text-zinc-500 hover:text-blue-400 text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="text-zinc-500 hover:text-blue-400 text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Data
const services = [
  {
    title: "Custom Fabrication",
    description:
      "Bespoke metal fabrication solutions tailored to your specific requirements and vehicle specifications.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gKlIX1RnqoHi6QB745twxRV5LBhg61.png",
    icon: <Wrench className="h-5 w-5 text-blue-400" />,
    slug: "custom-fabrication",
  },
  {
    title: "Performance Upgrades",
    description: "Enhance your vehicle's performance with our expertly crafted upgrades and modifications.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-nusbLTFm2veKAWoXvCpnjNnx2duleH.png",
    icon: <Cog className="h-5 w-5 text-blue-400" />,
    slug: "performance-upgrades",
  },
  {
    title: "4WD Modifications",
    description: "Specialized modifications for off-road vehicles to improve capability and durability.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-rD6gLiohsmuiKpJWETlWAsG6YGWk5x.png",
    icon: <Truck className="h-5 w-5 text-blue-400" />,
    slug: "4wd-modifications",
  },
  {
    title: "Exhaust Systems",
    description: "Custom exhaust systems designed for optimal flow, performance, and sound.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-O6uyXI2qKZ2CwTXjc9Z4xBQyd4B1wD.png",
    icon: <Car className="h-5 w-5 text-blue-400" />,
    slug: "exhaust-systems",
  },
  {
    title: "Roll Cages",
    description: "Safety-certified roll cages and chassis reinforcements for race and performance vehicles.",
    image: "/placeholder.svg?height=300&width=400",
    icon: <Shield className="h-5 w-5 text-blue-400" />,
    slug: "roll-cages",
  },
  {
    title: "Prototyping",
    description: "Rapid prototyping services to bring your ideas to life with precision and expertise.",
    image: "/placeholder.svg?height=300&width=400",
    icon: <Cog className="h-5 w-5 text-blue-400" />,
    slug: "prototyping",
  },
]

const products = [
  {
    name: "Performance Exhaust Header",
    category: "Exhaust Systems",
    price: 899,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-O6uyXI2qKZ2CwTXjc9Z4xBQyd4B1wD.png",
  },
  {
    name: "4WD Snorkel Kit",
    category: "4WD Accessories",
    price: 349,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Roll Cage Kit",
    category: "Safety Equipment",
    price: 1299,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Intercooler Upgrade",
    category: "Performance Parts",
    price: 749,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Custom Intake Manifold",
    category: "Engine Components",
    price: 1199,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Chassis Brace Kit",
    category: "Chassis Components",
    price: 599,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Turbo Manifold",
    category: "Forced Induction",
    price: 899,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Rock Sliders",
    category: "4WD Protection",
    price: 649,
    image: "/placeholder.svg?height=300&width=300",
  },
]

const galleryImages = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-O6uyXI2qKZ2CwTXjc9Z4xBQyd4B1wD.png",
    alt: "Custom exhaust fabrication",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-nusbLTFm2veKAWoXvCpnjNnx2duleH.png",
    alt: "Performance exhaust headers",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-rD6gLiohsmuiKpJWETlWAsG6YGWk5x.png",
    alt: "4WD canopy fabrication",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gKlIX1RnqoHi6QB745twxRV5LBhg61.png",
    alt: "Elite FabWorx metal branding",
  },
  {
    src: "/placeholder.svg?height=400&width=400",
    alt: "Custom intercooler piping",
  },
  {
    src: "/placeholder.svg?height=400&width=400",
    alt: "Race car chassis work",
  },
  {
    src: "/placeholder.svg?height=400&width=400",
    alt: "Turbo system installation",
  },
  {
    src: "/placeholder.svg?height=400&width=400",
    alt: "Custom fuel cell",
  },
]

const testimonials = [
  {
    name: "John Smith",
    vehicle: "Toyota Landcruiser",
    quote:
      "Elite FabWorx transformed my 4WD with their custom fabrication work. The quality and attention to detail is outstanding.",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Sarah Johnson",
    vehicle: "Mitsubishi Evo X",
    quote:
      "The performance upgrades they installed on my Evo have made a huge difference. Couldn't be happier with the results.",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Mike Williams",
    vehicle: "Ford Ranger",
    quote: "Their 4WD modifications are top-notch. My Ranger is now capable of handling any terrain I throw at it.",
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

