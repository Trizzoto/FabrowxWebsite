import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import "./styles/instagram.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/contexts/cart-context"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Elite FabWorx - Performance Metal Fabrication",
  description: "Precision metal fabrication for performance vehicles and 4WDs",
  generator: 'v0.dev',
  metadataBase: new URL('https://elitefabworx.com')
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen bg-black text-white ${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="elite-fabworx-theme"
          disableTransitionOnChange
        >
          <CartProvider>
            <main id="main-content">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}