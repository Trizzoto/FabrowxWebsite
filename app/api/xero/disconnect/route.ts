import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { clearXeroCredentials } from '@/lib/xero-storage';

export async function POST() {
  try {
    const cookieStore = cookies();
    
    // Clear Xero tokens from cookies
    cookieStore.delete('xero_access_token');
    cookieStore.delete('xero_refresh_token');
    cookieStore.delete('xero_tenant_id');

    // Clear stored credentials
    clearXeroCredentials();

    return NextResponse.json({ 
      success: true,
      message: 'Successfully disconnected from Xero'
    });
  } catch (error) {
    console.error('Error disconnecting from Xero:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect from Xero' },
      { status: 500 }
    );
  }
} 