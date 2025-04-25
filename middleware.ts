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
          // Verify the token is valid
          await jose.jwtVerify(token, JWT_SECRET)
          // If verification successful, redirect to admin dashboard
          return NextResponse.redirect(new URL("/admin", request.url))
        }
      } catch (error) {
        // Token is invalid, clear it and continue to login page
        const response = NextResponse.next()
        response.cookies.delete("admin_token")
        return response
      }
      
      // No token found, proceed to login page
      return NextResponse.next()
    }

    // For any other admin routes, verify the token
    const token = request.cookies.get("admin_token")?.value

    if (!token) {
      // No token found, redirect to login
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

  // For API routes for admin operations, also check authentication
  if (request.nextUrl.pathname.startsWith("/api/admin") && 
      !request.nextUrl.pathname.includes("/login")) {
    
    const token = request.cookies.get("admin_token")?.value

    if (!token) {
      // No token found, return unauthorized
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
      // Verify the token
      await jose.jwtVerify(token, JWT_SECRET)
      
      // Token valid, proceed with API request
      return NextResponse.next()
    } catch (error) {
      // Token invalid, return unauthorized
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  // For non-admin routes, proceed normally
  return NextResponse.next()
}

// Configure the middleware to run for admin routes and admin API routes
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
} 