"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { useCart } from "@/contexts/cart-context"
import { ShoppingCart, Menu, X, User, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const { totalItems } = useCart()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/90 backdrop-blur-sm py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl md:text-2xl font-bold">
            <span className="text-blue-500">ELITE</span> FABWORX
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-blue-400 ${
              pathname === "/" ? "text-blue-500" : "text-zinc-400"
            }`}
          >
            Home
          </Link>
          <Link
            href="/shop"
            className={`text-sm font-medium transition-colors hover:text-blue-400 ${
              pathname.startsWith("/shop") ? "text-blue-500" : "text-zinc-400"
            }`}
          >
            Shop
          </Link>
          <Link
            href="/services"
            className={`text-sm font-medium transition-colors hover:text-blue-400 ${
              pathname.startsWith("/services") ? "text-blue-500" : "text-zinc-400"
            }`}
          >
            Services
          </Link>
          <Link
            href="/job-booking"
            className={`text-sm font-medium transition-colors hover:text-blue-400 ${
              pathname.startsWith("/job-booking") ? "text-blue-500" : "text-zinc-400"
            }`}
          >
            Book a Job
          </Link>
          <Link
            href="/track-order"
            className={`text-sm font-medium transition-colors hover:text-blue-400 ${
              pathname.startsWith("/track-order") ? "text-blue-500" : "text-zinc-400"
            }`}
          >
            Track Order
          </Link>
          <Link
            href="/contact"
            className={`text-sm font-medium transition-colors hover:text-blue-400 ${
              pathname.startsWith("/contact") ? "text-blue-500" : "text-zinc-400"
            }`}
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {/* Cart */}
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-6 w-6 text-zinc-400 hover:text-blue-400 transition-colors" />
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs min-w-[1.25rem] h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </Badge>
            )}
          </Link>

          {/* User Menu */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/orders">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/jobs">My Jobs</Link>
                </DropdownMenuItem>
                {session.user.isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Package className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/api/auth/signout">Sign Out</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800">
          <nav className="container px-4 py-4 flex flex-col">
            <Link
              href="/"
              className={`py-2 text-sm font-medium ${pathname === "/" ? "text-blue-500" : "text-zinc-400"}`}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className={`py-2 text-sm font-medium ${pathname.startsWith("/shop") ? "text-blue-500" : "text-zinc-400"}`}
            >
              Shop
            </Link>
            <Link
              href="/services"
              className={`py-2 text-sm font-medium ${
                pathname.startsWith("/services") ? "text-blue-500" : "text-zinc-400"
              }`}
            >
              Services
            </Link>
            <Link
              href="/job-booking"
              className={`py-2 text-sm font-medium ${
                pathname.startsWith("/job-booking") ? "text-blue-500" : "text-zinc-400"
              }`}
            >
              Book a Job
            </Link>
            <Link
              href="/track-order"
              className={`py-2 text-sm font-medium ${
                pathname.startsWith("/track-order") ? "text-blue-500" : "text-zinc-400"
              }`}
            >
              Track Order
            </Link>
            <Link
              href="/contact"
              className={`py-2 text-sm font-medium ${
                pathname.startsWith("/contact") ? "text-blue-500" : "text-zinc-400"
              }`}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

