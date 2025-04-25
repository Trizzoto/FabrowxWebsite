import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import * as jose from 'jose'

// Using the same JWT_SECRET as in the login route
const JWT_SECRET = new TextEncoder().encode("elite-fabworx-secret-key-change-in-production")

export async function middleware(request: NextRequest) {
  // Check if the request is for the admin area
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Always allow access to the login page
    if (request.nextUrl.pathname === "/admin/login") {
      // If we already have a valid token, redirect to the admin dashboard
      try {
        const token = request.cookies.get("admin_token")?.value
        if (token) {
          await jose.jwtVerify(token, JWT_SECRET)
          return NextResponse.redirect(new URL("/admin", request.url))
        }
      } catch (error) {
        // Token is invalid, continue to login page and clear the token
        const response = NextResponse.next()
        response.cookies.delete("admin_token")
        return response
      }
      
      return NextResponse.next()
    }

    // For any other admin routes, verify the token
    const token = request.cookies.get("admin_token")?.value

    if (!token) {
      // Redirect to login if no token is present
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    try {
      // Verify the token
      await jose.jwtVerify(token, JWT_SECRET)
      
      // If verification is successful, proceed to the requested admin page
      return NextResponse.next()
    } catch (error) {
      // If token verification fails, redirect to login
      console.error("Token verification failed:", error)
      
      // Clear the invalid token
      const response = NextResponse.redirect(new URL("/admin/login", request.url))
      response.cookies.delete("admin_token")
      
      return response
    }
  }

  // For non-admin routes, proceed normally
  return NextResponse.next()
}

// Configure the middleware to only run for admin routes
export const config = {
  matcher: "/admin/:path*",
} 