import { Metadata } from 'next';
import { ContactForm } from './contact-form';
import { Mail, Phone, MapPin } from 'lucide-react';
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: 'Contact Us | Metal Fabrication Services in Adelaide & Tailem Bend',
  description: 'Contact Elite Fabworx for custom automotive fabrication services in Adelaide and Tailem Bend. Specialists in exhausts, roll cages, and 4x4 accessories.',
  keywords: ['metal fabrication Adelaide', 'custom exhaust Adelaide', 'roll cage fabrication Adelaide', '4x4 fabrication Adelaide', 'metal fabrication Tailem Bend'],
};

function getCloudinaryUrl(url: string, width: number) {
  return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
}

export default function ContactPage() {
  return (
    <div className="bg-black min-h-screen">
      <section className="relative py-20 overflow-hidden">
        {/* Hero Image */}
        <div className="absolute inset-0">
          <Image
            src={"https://res.cloudinary.com/dz8iqfdvf/image/upload/v1741783803/lc03gne4mnc77za4awxa.jpg".includes('cloudinary')
              ? getCloudinaryUrl("https://res.cloudinary.com/dz8iqfdvf/image/upload/v1741783803/lc03gne4mnc77za4awxa.jpg", 1200)
              : "https://res.cloudinary.com/dz8iqfdvf/image/upload/v1741783803/lc03gne4mnc77za4awxa.jpg"}
            alt="Elite FabWorx metal fabrication"
            fill
            className="object-cover object-center opacity-40"
            priority
            sizes="100vw"
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