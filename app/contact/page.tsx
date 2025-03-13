import { ContactForm } from "./contact-form"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  return (
    <div className="bg-black min-h-screen">
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          className="border-orange-500/30 bg-black/20 backdrop-blur-sm hover:bg-black/40 hover:border-orange-500/50 transition-all duration-300"
          asChild
        >
          <Link href="/services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Link>
        </Button>
      </div>

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
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  )
} 