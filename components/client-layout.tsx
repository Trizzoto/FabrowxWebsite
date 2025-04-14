"use client"

import { usePathname } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  return (
    <>
      {!isAdminRoute && <Header />}
      <main id="main-content">
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </>
  )
} 