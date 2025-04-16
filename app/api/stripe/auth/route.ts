import { NextRequest, NextResponse } from 'next/server';
import { getStripeConnectUrl } from '@/lib/stripe-config';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Check if STRIPE_CLIENT_ID exists
    if (!process.env.STRIPE_CLIENT_ID) {
      console.error('STRIPE_CLIENT_ID is not configured. This is required for Stripe Connect OAuth.');
      return NextResponse.json({
        error: 'Stripe Client ID is not configured',
        hint: 'Please add STRIPE_CLIENT_ID to your environment variables',
        developer_note: 'For testing without Stripe, use a mock account setup instead'
      }, { status: 500 });
    }

    // Get return URL from query params
    const searchParams = request.nextUrl.searchParams;
    const returnUrl = searchParams.get('returnUrl') || '/admin/stripe';
    
    // Get Stripe OAuth URL
    const authUrl = getStripeConnectUrl();
    
    // Store the return URL in a cookie
    const cookieStore = cookies();
    cookieStore.set('stripe_auth_return_url', returnUrl, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10, // 10 minutes
    });
    
    // Redirect to Stripe OAuth page
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Error starting Stripe authentication:', error);
    
    // More detailed error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json({
      error: 'Failed to start Stripe authentication',
      message: errorMessage,
      suggestion: 'Check your Stripe configuration in environment variables'
    }, { status: 500 });
  }
} 