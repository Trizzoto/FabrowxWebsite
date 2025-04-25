"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { Toaster } from "@/components/ui/toaster"

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="flex items-center justify-center h-screen">
          <div className="text-2xl">Loading...</div>
        </div>
        <Toaster />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {children}
      <Toaster />
    </div>
  )
} 