"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, Wrench } from "lucide-react"
import Image from "next/image"

export default function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="flex flex-col h-full bg-black border-r border-zinc-800">
      <div className="flex h-20 items-center border-b border-zinc-800 px-4">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <Image
            src="/logo.png"
            alt="Elite FabWorx Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <span className="text-orange-500 font-extrabold tracking-wider">ELITE</span>
            <span className="font-light tracking-widest ml-1">FABWORX</span>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-2 text-sm font-medium gap-1">
          <Link
            href="/admin"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              isActive("/admin") 
                ? "bg-orange-500/20 text-orange-400 border-l-2 border-orange-500" 
                : "text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>

          <Link
            href="/admin/products"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              pathname.startsWith("/admin/products")
                ? "bg-orange-500/20 text-orange-400 border-l-2 border-orange-500"
                : "text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10"
            }`}
          >
            <Package className="h-4 w-4" />
            Products
          </Link>

          <Link
            href="/admin/orders"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              pathname.startsWith("/admin/orders")
                ? "bg-orange-500/20 text-orange-400 border-l-2 border-orange-500"
                : "text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10"
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            Orders
          </Link>

          <Link
            href="/admin/customers"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              pathname.startsWith("/admin/customers")
                ? "bg-orange-500/20 text-orange-400 border-l-2 border-orange-500"
                : "text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10"
            }`}
          >
            <Users className="h-4 w-4" />
            Customers
          </Link>

          <Link
            href="/admin/settings"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              pathname.startsWith("/admin/settings")
                ? "bg-orange-500/20 text-orange-400 border-l-2 border-orange-500"
                : "text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10"
            }`}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-zinc-800">
        <div className="text-xs text-zinc-500 text-center">Elite FabWorx Admin v1.0</div>
      </div>
    </div>
  )
}

