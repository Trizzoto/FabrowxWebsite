import { NextResponse } from 'next/server';
import { getXeroAuthUrl } from '@/lib/xero-config';

export async function GET() {
  try {
    const authUrl = await getXeroAuthUrl();
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Error getting Xero auth URL:', error);
    return NextResponse.json({ 
      error: 'Failed to get Xero authorization URL',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 