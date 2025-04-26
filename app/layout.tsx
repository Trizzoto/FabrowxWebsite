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
    default: "Elite FabWorx - Performance Metal Fabrication",
    template: "%s | Elite FabWorx"
  },
  description: "Precision metal fabrication for performance vehicles and 4WDs. Custom fabrication, welding, and metalwork services in Australia.",
  keywords: ["metal fabrication", "performance vehicles", "4WD", "custom fabrication", "welding", "Australia"],
  authors: [{ name: "Elite FabWorx" }],
  creator: "Elite FabWorx",
  publisher: "Elite FabWorx",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://elitefabworx.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://elitefabworx.com',
    title: 'Elite FabWorx - Performance Metal Fabrication',
    description: 'Precision metal fabrication for performance vehicles and 4WDs. Custom fabrication, welding, and metalwork services in Australia.',
    siteName: 'Elite FabWorx',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elite FabWorx - Performance Metal Fabrication',
    description: 'Precision metal fabrication for performance vehicles and 4WDs. Custom fabrication, welding, and metalwork services in Australia.',
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