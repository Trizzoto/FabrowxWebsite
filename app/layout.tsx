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
    default: "Elite FabWorx | Custom Automotive Fabrication Adelaide & Tailem Bend",
    template: "%s | Elite FabWorx"
  },
  description: "Custom metal fabrication, exhausts, roll cages, 4x4 accessories, and chassis upgrades — servicing Adelaide and Tailem Bend, South Australia.",
  keywords: ["metal fabrication Adelaide", "custom exhaust Adelaide", "roll cage fabrication Adelaide", "4x4 fabrication Adelaide", "metal fabrication Tailem Bend", "custom exhaust Tailem Bend", "roll cage fabrication Tailem Bend", "4x4 fabrication Tailem Bend"],
  authors: [{ name: "Elite FabWorx" }],
  creator: "Elite FabWorx",
  publisher: "Elite FabWorx",
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
    title: 'Elite FabWorx | Custom Automotive Fabrication Adelaide & Tailem Bend',
    description: 'Custom metal fabrication, exhausts, roll cages, 4x4 accessories, and chassis upgrades — servicing Adelaide and Tailem Bend, South Australia.',
    siteName: 'Elite FabWorx',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elite FabWorx | Custom Automotive Fabrication Adelaide & Tailem Bend',
    description: 'Custom metal fabrication, exhausts, roll cages, 4x4 accessories, and chassis upgrades — servicing Adelaide and Tailem Bend, South Australia.',
    creator: '@elitefabworx',
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