"use client"

import Link from "next/link"
import { Mail, MapPin, Phone, Instagram, Facebook, Youtube } from "lucide-react"
import { useEffect, useState } from "react"

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

export default function Footer() {
  const [settings, setSettings] = useState<Settings>({
    contactInfo: {
      phone: "",
      email: "",
      location: ""
    }
  })

  useEffect(() => {
    // Fetch settings when component mounts
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
              {settings.socialLinks?.instagram && (
                <Link href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-orange-500" aria-label="Follow us on Instagram">
                  <Instagram className="h-6 w-6" />
                </Link>
              )}
              {settings.socialLinks?.facebook && (
                <Link href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-orange-500" aria-label="Follow us on Facebook">
                  <Facebook className="h-6 w-6" />
                </Link>
              )}
              {settings.socialLinks?.youtube && (
                <Link href={settings.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-orange-500" aria-label="Subscribe to our YouTube channel">
                  <Youtube className="h-6 w-6" />
                </Link>
              )}
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
                <Link href="/catalogue" className="text-zinc-400 hover:text-orange-500">
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
  )
}

