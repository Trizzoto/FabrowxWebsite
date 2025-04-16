import { NextRequest, NextResponse } from 'next/server';
import { getStripeConnectUrl } from '@/lib/stripe-config';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
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
    
    return NextResponse.json({
      error: 'Failed to start Stripe authentication',
    }, { status: 500 });
  }
} 