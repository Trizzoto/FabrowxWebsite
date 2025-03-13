import { ContactForm } from "./contact-form"

export default function ContactPage() {
  return (
    <div className="bg-black min-h-screen">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/20 to-black/90"></div>
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-300">
                Get in Touch
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