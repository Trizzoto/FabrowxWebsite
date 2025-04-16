import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { clearStripeCredentials } from '@/lib/stripe-storage';

export async function POST() {
  try {
    const cookieStore = cookies();
    
    // Clear Stripe tokens from cookies
    cookieStore.delete('stripe_access_token');
    cookieStore.delete('stripe_refresh_token');
    cookieStore.delete('stripe_account_id');
    cookieStore.delete('stripe_expires_at');
    
    // Also clear from the API
    clearStripeCredentials();
    
    return NextResponse.json({
      success: true,
      message: 'Successfully disconnected from Stripe'
    });
  } catch (error) {
    console.error('Error disconnecting from Stripe:', error);
    
    return NextResponse.json({
      error: 'Failed to disconnect from Stripe'
    }, { status: 500 });
  }
} 