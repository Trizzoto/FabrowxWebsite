import { NextResponse } from 'next/server';
import { saveStripeCredentials } from '@/lib/stripe-storage';

// This route is only for development/testing
export async function POST() {
  // Only allow in development environment
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({
      error: 'This endpoint is not available in production',
    }, { status: 403 });
  }

  try {
    // Create a mock Stripe connection
    await saveStripeCredentials({
      accountId: 'acct_mock_development',
      accessToken: 'sk_test_mock_development',
      refreshToken: 'rt_mock_development',
      expiresAt: Math.floor(Date.now() / 1000) + 24 * 60 * 60 * 30, // 30 days
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully established mock Stripe connection',
      accountId: 'acct_mock_development',
    });
  } catch (error) {
    console.error('Error creating mock Stripe connection:', error);

    return NextResponse.json({
      error: 'Failed to create mock Stripe connection',
    }, { status: 500 });
  }
} 