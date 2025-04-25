import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import * as jose from 'jose'
import fs from 'fs/promises'
import path from 'path'

// In a real app, you would store these in environment variables and use a more secure method
const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "elite1234" // Default password
const JWT_SECRET = new TextEncoder().encode("elite-fabworx-secret-key-change-in-production")

// The path to our admin settings file
const ADMIN_SETTINGS_FILE = path.join(process.cwd(), 'data', 'admin-settings.json')

// Read the current admin password from the settings file
async function readPassword() {
  try {
    // Try to read from the admin settings file
    const data = await fs.readFile(ADMIN_SETTINGS_FILE, 'utf-8')
    const settings = JSON.parse(data)
    
    if (settings.password) {
      return settings.password
    }
  } catch (error) {
    // If file doesn't exist or other error, return the default
    console.error('Error reading admin settings file:', error)
  }
  
  // Return the default password if no file exists
  return ADMIN_PASSWORD
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body
    
    // Get the current password
    const currentPassword = await readPassword()

    // Validate credentials
    if (username === ADMIN_USERNAME && password === currentPassword) {
      // Create a JWT token
      const token = await new jose.SignJWT({ 
        username,
        role: "admin" 
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(JWT_SECRET)

      // Set the token in a cookie
      cookies().set({
        name: "admin_token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      })

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
} 