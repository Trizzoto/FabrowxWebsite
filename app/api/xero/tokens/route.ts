import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getXeroCredentials } from '@/lib/xero-storage';

export async function GET() {
  try {
    // Get credentials from storage
    const credentials = getXeroCredentials();
    
    if (!credentials) {
      return NextResponse.json(
        { error: 'No Xero credentials found' },
        { status: 404 }
      );
    }

    // Return the credentials
    return NextResponse.json({
      tenantId: credentials.tenantId,
      accessToken: credentials.accessToken,
      refreshToken: credentials.refreshToken,
      expiresAt: credentials.expiresAt,
      // Calculate remaining time
      expiresIn: Math.floor((credentials.expiresAt - Date.now()) / 1000)
    });
  } catch (error) {
    console.error('Error retrieving Xero credentials:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve Xero credentials' },
      { status: 500 }
    );
  }
} 