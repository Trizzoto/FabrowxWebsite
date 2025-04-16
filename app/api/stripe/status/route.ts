import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    
    const accessToken = cookieStore.get('stripe_access_token');
    const accountId = cookieStore.get('stripe_account_id');
    
    const connected = !!(accessToken?.value && accountId?.value);
    
    return NextResponse.json({
      connected,
      accountId: accountId?.value ? accountId.value.slice(0, 5) + '...' : null,
      development: process.env.NODE_ENV !== 'production',
    });
  } catch (error) {
    console.error('Error checking Stripe connection status:', error);
    
    return NextResponse.json({
      connected: false,
      error: 'Failed to check connection status',
      development: process.env.NODE_ENV !== 'production',
      setup_tips: [
        "Ensure STRIPE_CLIENT_ID is set in your environment variables",
        "For testing/development, use the 'Development Mode' button",
        "Visit the Stripe Connect dashboard to get your client_id"
      ]
    }, { status: 500 });
  }
} 