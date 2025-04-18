import { Metadata } from 'next';
import { ContactForm } from './contact-form';
import { Mail, Phone, MapPin } from 'lucide-react';
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: 'Contact Us | Elite Fabworx',
  description: 'Get in touch with Elite Fabworx for all your metal fabrication needs. We\'re here to help with your custom projects.',
};

export default function ContactPage() {
  return (
    <div className="bg-black min-h-screen">
      <section className="relative py-20 overflow-hidden">
        {/* Hero Image */}
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/dz8iqfdvf/image/upload/v1741783803/lc03gne4mnc77za4awxa.jpg"
            alt="Elite FabWorx metal fabrication"
            fill
            className="object-cover object-center opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
        </div>
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Get in <span className="text-orange-500">Touch</span>
              </h1>
              <p className="text-lg text-zinc-300">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>
            <div className="bg-black/40 backdrop-blur-md border border-orange-500/30 rounded-lg p-6 md:p-8 shadow-2xl">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 