import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// GET endpoint to check if API keys are set in environment variables
export async function GET() {
  try {
    const cookieStore = cookies();
    const devPublishableKey = cookieStore.get('dev_stripe_publishable_key')?.value;
    const devSecretKey = cookieStore.get('dev_stripe_secret_key')?.value;
    
    const hasSecretKey = !!(process.env.STRIPE_SECRET_KEY || devSecretKey);
    const hasPublishableKey = !!(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || devPublishableKey);
    
    const publishableKeyValue = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || devPublishableKey || '';
    
    return NextResponse.json({
      keysConfigured: hasSecretKey && hasPublishableKey,
      secretKey: hasSecretKey ? 'Set (hidden)' : 'Not set',
      publishableKey: hasPublishableKey ? publishableKeyValue.substring(0, 8) + '...' : 'Not set',
      isDev: !!devSecretKey,
    });
  } catch (error) {
    console.error('Error checking Stripe API keys:', error);
    return NextResponse.json(
      { error: 'Failed to check Stripe API keys' },
      { status: 500 }
    );
  }
}

// This is for development only - in production, API keys should be set in environment variables
export async function POST(request: NextRequest) {
  // Only allow in development environment
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({
      error: 'This endpoint is not available in production',
    }, { status: 403 });
  }
  
  try {
    const body = await request.json();
    const { publishableKey, secretKey } = body;
    
    // Validate the keys
    if (!publishableKey || !secretKey) {
      return NextResponse.json({
        error: 'Both publishable and secret keys are required',
      }, { status: 400 });
    }
    
    // For development purposes only, store keys in cookies
    // In production, use environment variables
    const cookieStore = cookies();
    
    cookieStore.set('dev_stripe_publishable_key', publishableKey, {
      httpOnly: true,
      secure: false, // Development only
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    
    cookieStore.set('dev_stripe_secret_key', secretKey, {
      httpOnly: true,
      secure: false, // Development only
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    
    // Important: We can't modify process.env at runtime!
    // The client-side code will need to look for these cookies too
    
    return NextResponse.json({
      success: true,
      message: 'Stripe API keys have been set for development',
    });
  } catch (error) {
    console.error('Error setting Stripe API keys:', error);
    return NextResponse.json({
      error: 'Failed to set Stripe API keys',
    }, { status: 500 });
  }
} 