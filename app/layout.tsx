import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import "./styles/instagram.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/contexts/cart-context"
import { Toaster } from "@/components/ui/toaster"
import ClientLayout from "@/components/client-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Metal Fabrication Adelaide & Murray Bridge | Elite Fabworx",
    template: "%s | Elite Fabworx"
  },
  description: "Professional metal fabrication in Adelaide & Murray Bridge. Custom 4WD parts, exhaust systems, roll cages & motorsport fabrication. Expert TIG welding. Get a quote today!",
  keywords: ["metal fabrication Adelaide", "metal fabrication Murray Bridge", "custom exhaust Adelaide", "roll cage fabrication Adelaide", "4x4 fabrication Adelaide", "TIG welding Adelaide", "motorsport fabrication SA", "The Bend Motorsport Park fabrication"],
  authors: [{ name: "Elite Fabworx" }],
  creator: "Elite Fabworx",
  publisher: "Elite Fabworx",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://elitefabworx.com.au'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon2.ico',
    shortcut: '/favicon2.ico',
    apple: '/favicon2.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://elitefabworx.com.au',
    title: 'Metal Fabrication Adelaide & Murray Bridge | Elite Fabworx',
    description: 'Professional metal fabrication in Adelaide & Murray Bridge. Custom 4WD parts, exhaust systems, roll cages & motorsport fabrication. Expert TIG welding. Get a quote today!',
    siteName: 'Elite Fabworx',
    images: [
      {
        url: '/Elitefabworx_Social.png',
        width: 1200,
        height: 630,
        alt: 'Elite Fabworx - Metal Fabrication Adelaide & Murray Bridge',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Metal Fabrication Adelaide & Murray Bridge | Elite Fabworx',
    description: 'Professional metal fabrication in Adelaide & Murray Bridge. Custom 4WD parts, exhaust systems, roll cages & motorsport fabrication. Expert TIG welding. Get a quote today!',
    creator: '@elitefabworx',
    images: ['/Elitefabworx_Social.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon2.ico" />
        <link rel="shortcut icon" href="/favicon2.ico" />
        <link rel="apple-touch-icon" href="/favicon2.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoBodyShop",
              "name": "Elite Fabworx",
              "image": "https://elitefabworx.com.au/Elitefabworx_Social.png",
              "url": "https://elitefabworx.com.au",
              "telephone": "+61-499-638-046",
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Murray Bridge",
                "addressRegion": "SA",
                "postalCode": "5253",
                "addressCountry": "AU"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -35.1193,
                "longitude": 139.2747
              },
              "areaServed": ["Adelaide SA", "Murray Bridge SA", "South Australia"],
              "sameAs": [
                "https://www.facebook.com/ELITEFABWORX",
                "https://www.instagram.com/elitefabworx"
              ],
              "serviceOffered": [
                {
                  "@type": "Service",
                  "name": "Metal Fabrication",
                  "description": "Custom metal fabrication services including TIG welding"
                },
                {
                  "@type": "Service", 
                  "name": "Custom Exhaust Systems",
                  "description": "Performance exhaust systems for cars and 4WD vehicles"
                },
                {
                  "@type": "Service",
                  "name": "Roll Cage Fabrication", 
                  "description": "Safety roll cages for motorsport and 4WD applications"
                },
                {
                  "@type": "Service",
                  "name": "4WD Accessories",
                  "description": "Custom 4WD sliders, bull bars and accessories"
                }
              ]
            })
          }}
        />
      </head>
      <body
        className={`min-h-screen bg-black font-sans antialiased ${inter.className}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <ClientLayout>{children}</ClientLayout>
          </CartProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}