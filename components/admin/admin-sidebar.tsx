"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, Wrench } from "lucide-react"

export default function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800">
      <div className="flex h-14 items-center border-b border-zinc-800 px-4">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <Wrench className="h-6 w-6 text-blue-500" />
          <span>Elite FabWorx Admin</span>
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          <Link
            href="/admin"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              isActive("/admin") ? "bg-zinc-800 text-zinc-50" : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>

          <Link
            href="/admin/products"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              pathname.startsWith("/admin/products")
                ? "bg-zinc-800 text-zinc-50"
                : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900"
            }`}
          >
            <Package className="h-4 w-4" />
            Products
          </Link>

          <Link
            href="/admin/orders"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              pathname.startsWith("/admin/orders")
                ? "bg-zinc-800 text-zinc-50"
                : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900"
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            Orders
          </Link>

          <Link
            href="/admin/customers"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              pathname.startsWith("/admin/customers")
                ? "bg-zinc-800 text-zinc-50"
                : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900"
            }`}
          >
            <Users className="h-4 w-4" />
            Customers
          </Link>

          <Link
            href="/admin/settings"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              pathname.startsWith("/admin/settings")
                ? "bg-zinc-800 text-zinc-50"
                : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900"
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

