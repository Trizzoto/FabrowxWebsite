"use client"

import type React from "react"
import { useState, useEffect } from "react"

export default function SettingsLayout({
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
      <div className="flex items-center justify-center py-10">
        <div className="text-lg">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="container-fluid max-w-full py-6">
      {children}
    </div>
  )
} 