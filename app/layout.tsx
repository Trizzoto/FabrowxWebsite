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
    default: "Elite Fabworx | Custom Automotive Fabrication - Servicing Adelaide & Murray Bridge",
    template: "%s | Elite Fabworx"
  },
  description: "Elite Fabworx specializes in custom automotive fabrication, exhausts, roll cages, and 4x4 accessories. Based in Murray Bridge, proudly servicing Adelaide, The Bend Motorsport Park, and all of South Australia.",
  keywords: ["metal fabrication Adelaide", "custom exhaust Adelaide", "roll cage fabrication Adelaide", "4x4 fabrication Adelaide", "metal fabrication Murray Bridge", "4x4 fabrication South Australia", "The Bend Motorsport Park fabrication"],
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
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://elitefabworx.com.au',
    title: 'Elite Fabworx | Custom Automotive Fabrication - Servicing Adelaide & Murray Bridge',
    description: 'Elite Fabworx specializes in custom automotive fabrication, exhausts, roll cages, and 4x4 accessories. Based in Murray Bridge, proudly servicing Adelaide, The Bend Motorsport Park, and all of South Australia.',
    siteName: 'Elite Fabworx',
    images: [
      {
        url: '/Elitefabworx_Social.png',
        width: 1200,
        height: 630,
        alt: 'Elite Fabworx',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elite Fabworx | Custom Automotive Fabrication - Servicing Adelaide & Murray Bridge',
    description: 'Elite Fabworx specializes in custom automotive fabrication, exhausts, roll cages, and 4x4 accessories. Based in Murray Bridge, proudly servicing Adelaide, The Bend Motorsport Park, and all of South Australia.',
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