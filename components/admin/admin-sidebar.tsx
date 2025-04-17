"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, Menu, X, Mail, Receipt, CreditCard } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin"
    }
    return pathname.startsWith(path)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/contact", label: "Contact Submissions", icon: Mail },
    { href: "/admin/stripe-keys", label: "Stripe Integration", icon: CreditCard },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Menu className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/80 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-40 w-64 transform ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col h-full bg-black border-r border-zinc-800`}>
        <div className="flex h-16 sm:h-20 items-center border-b border-zinc-800 px-4">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="text-orange-500 font-extrabold tracking-wider">ELITE</span>
              <span className="font-light tracking-widest sm:ml-1">FABWORX</span>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-2 text-sm font-medium gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                    isActive(item.href)
                      ? "bg-orange-500/20 text-orange-400 border-l-2 border-orange-500"
                      : "text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-zinc-800">
          <div className="text-xs text-zinc-500 text-center">Elite FabWorx Admin v1.0</div>
        </div>
      </div>
    </>
  )
}

