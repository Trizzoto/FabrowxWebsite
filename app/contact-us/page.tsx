"use client"

import { useState, useEffect } from "react"
import { Metadata } from 'next'
import Image from "next/image"
import Link from "next/link"
import { Mail, MapPin, Phone, Instagram, Facebook, Youtube } from "lucide-react"
import { ContactForm } from '../contact/contact-form'

interface Settings {
  contactInfo: {
    phone: string
    email: string
    location: string
  }
  socialLinks?: {
    facebook?: string
    youtube?: string
    instagram?: string
  }
}

export default function ContactPage() {
  const [settings, setSettings] = useState<Settings>({
    contactInfo: {
      phone: "",
      email: "",
      location: ""
    }
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        if (!response.ok) throw new Error('Failed to fetch settings')
        const data = await response.json()
        setSettings(data)
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }

    fetchSettings()
  }, [])

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/dz8iqfdvf/image/upload/v1741783803/lc03gne4mnc77za4awxa.jpg"
            alt="Contact Elite FabWorx"
            fill
            className="object-cover object-center opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
        </div>
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-orange-500">Contact</span> Us
            </h1>
            <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
              Get in touch with us for all your metal fabrication needs. We're here to help bring your vision to life.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 relative z-10">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Phone */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <a href={`tel:${settings.contactInfo.phone}`} className="text-zinc-400 hover:text-orange-400 transition-colors">
                {settings.contactInfo.phone}
              </a>
            </div>

            {/* Email */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <a href={`mailto:${settings.contactInfo.email}`} className="text-zinc-400 hover:text-orange-400 transition-colors">
                {settings.contactInfo.email}
              </a>
            </div>

            {/* Location */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Location</h3>
              <p className="text-zinc-400">
                {settings.contactInfo.location}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Links Section */}
      <section className="py-16 bg-zinc-900/30">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">
              Connect With Us
            </h2>
            <div className="flex justify-center gap-8">
              {settings.socialLinks?.facebook && (
                <a 
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="w-16 h-16 rounded-full bg-zinc-800 group-hover:bg-orange-500/20 flex items-center justify-center transition-colors">
                    <Facebook className="h-8 w-8 text-zinc-400 group-hover:text-orange-400 transition-colors" />
                  </div>
                  <span className="block mt-2 text-sm text-zinc-400 group-hover:text-orange-400 transition-colors">Facebook</span>
                </a>
              )}
              {settings.socialLinks?.instagram && (
                <a 
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="w-16 h-16 rounded-full bg-zinc-800 group-hover:bg-orange-500/20 flex items-center justify-center transition-colors">
                    <Instagram className="h-8 w-8 text-zinc-400 group-hover:text-orange-400 transition-colors" />
                  </div>
                  <span className="block mt-2 text-sm text-zinc-400 group-hover:text-orange-400 transition-colors">Instagram</span>
                </a>
              )}
              {settings.socialLinks?.youtube && (
                <a 
                  href={settings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="w-16 h-16 rounded-full bg-zinc-800 group-hover:bg-orange-500/20 flex items-center justify-center transition-colors">
                    <Youtube className="h-8 w-8 text-zinc-400 group-hover:text-orange-400 transition-colors" />
                  </div>
                  <span className="block mt-2 text-sm text-zinc-400 group-hover:text-orange-400 transition-colors">YouTube</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Send Us a <span className="text-orange-500">Message</span>
              </h2>
              <p className="text-zinc-400">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6 md:p-8 shadow-2xl">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 