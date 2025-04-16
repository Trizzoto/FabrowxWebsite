import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isStripeConnected } from '@/lib/stripe-config';

export async function GET() {
  try {
    const connectionStatus = await isStripeConnected();
    
    return NextResponse.json({
      connected: connectionStatus.connected,
      method: connectionStatus.method,
      accountId: connectionStatus.accountId 
        ? (connectionStatus.method === 'direct' 
            ? 'Direct API Keys' 
            : connectionStatus.accountId.slice(0, 5) + '...')
        : null,
      development: process.env.NODE_ENV !== 'production',
    });
  } catch (error) {
    console.error('Error checking Stripe connection status:', error);
    
    return NextResponse.json({
      connected: false,
      error: 'Failed to check connection status',
      development: process.env.NODE_ENV !== 'production',
      setup_tips: [
        "Set STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY for direct integration",
        "Or set STRIPE_CLIENT_ID for OAuth Connect integration",
        "For testing/development, use the 'Development Mode' button or '/admin/stripe-keys'",
        "Visit the Stripe dashboard to get your API keys or client_id"
      ]
    }, { status: 500 });
  }
} 