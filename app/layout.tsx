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