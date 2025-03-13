"use client"

import type React from "react"
import Image from "next/image"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { Toaster } from "@/components/ui/toaster"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] bg-black text-white">
      <AdminSidebar />
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-zinc-800 bg-black/95 px-6 backdrop-blur">
          <h1 className="text-xl font-semibold">
            <span className="text-orange-500">Admin</span> Dashboard
          </h1>
        </header>
        <main className="flex-1 p-6 bg-zinc-950/50">{children}</main>
      </div>
      <Toaster />
    </div>
  )
}

