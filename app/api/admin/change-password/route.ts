import { NextResponse } from "next/server"
import * as jose from 'jose'
import fs from 'fs/promises'
import path from 'path'

// In a real app, these would be stored securely
const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "elite1234"
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

// Save the new password to the settings file
async function savePassword(newPassword: string) {
  try {
    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data')
    try {
      await fs.access(dataDir)
    } catch (error) {
      await fs.mkdir(dataDir, { recursive: true })
    }
    
    // Read existing settings or create new ones
    let settings = { password: newPassword }
    try {
      const data = await fs.readFile(ADMIN_SETTINGS_FILE, 'utf-8')
      settings = { ...JSON.parse(data), password: newPassword }
    } catch (error) {
      // File doesn't exist yet, which is fine
    }

    // Write the updated settings
    await fs.writeFile(ADMIN_SETTINGS_FILE, JSON.stringify(settings, null, 2))
    return true
  } catch (error) {
    console.error('Error saving admin settings:', error)
    return false
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { currentPassword, newPassword } = body

    // Basic validation
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      )
    }

    // Check the current password
    const storedPassword = await readPassword()
    
    if (currentPassword !== storedPassword) {
      return NextResponse.json(
        { success: false, error: "Current password is incorrect" },
        { status: 401 }
      )
    }

    // Save the new password
    const success = await savePassword(newPassword)
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Failed to update password" },
        { status: 500 }
      )
    }

    // Return success response
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Password change error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
} 