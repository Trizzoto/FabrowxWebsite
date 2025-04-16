import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { saveStripeCredentials } from '@/lib/stripe-storage';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const returnUrl = cookieStore.get('stripe_auth_return_url')?.value || '/admin/stripe';
    
    // Get the authorization code from the URL query params
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    
    if (!code) {
      // No code received, show error page
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>Stripe Authentication Error</title>
            <meta http-equiv="refresh" content="5;url=${returnUrl}" />
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; padding: 30px; max-width: 650px; margin: 0 auto; }
              .container { background: #f8fafc; border-radius: 5px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
              .message { margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Authentication Error</h1>
              <p class="message">No authorization code received from Stripe.</p>
              <p>Redirecting back to the application in 5 seconds...</p>
              <p><a href="${returnUrl}">Click here if you're not redirected automatically</a></p>
            </div>
          </body>
        </html>`,
        { headers: { 'content-type': 'text/html' } }
      );
    }
    
    // Exchange the authorization code for an access token
    const clientId = process.env.STRIPE_CLIENT_ID;
    const secretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!clientId || !secretKey) {
      throw new Error('Stripe credentials not configured');
    }
    
    // Make API request to Stripe to exchange code for token
    const response = await fetch('https://connect.stripe.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_secret: secretKey,
        grant_type: 'authorization_code',
        code,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok || !data.access_token || !data.stripe_user_id) {
      throw new Error('Failed to exchange code for token');
    }
    
    // Save the credentials
    await saveStripeCredentials({
      accountId: data.stripe_user_id,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Math.floor(Date.now() / 1000) + (data.expires_in || 31536000), // Default to 1 year
    });
    
    // Show success page with redirect
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Stripe Authentication Success</title>
          <meta http-equiv="refresh" content="3;url=${returnUrl}" />
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; padding: 30px; max-width: 650px; margin: 0 auto; }
            .container { background: #f8fafc; border-radius: 5px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .message { margin-bottom: 20px; color: #16a34a; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Authentication Success</h1>
            <p class="message">You have successfully connected to Stripe!</p>
            <p>Redirecting back to the application in 3 seconds...</p>
            <p><a href="${returnUrl}">Click here if you're not redirected automatically</a></p>
          </div>
        </body>
      </html>`,
      { headers: { 'content-type': 'text/html' } }
    );
  } catch (error) {
    console.error('Error in Stripe callback:', error);
    
    // Get the return URL
    const cookieStore = cookies();
    const returnUrl = cookieStore.get('stripe_auth_return_url')?.value || '/admin/stripe';
    
    // Show error page with redirect
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Stripe Authentication Error</title>
          <meta http-equiv="refresh" content="5;url=${returnUrl}" />
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; padding: 30px; max-width: 650px; margin: 0 auto; }
            .container { background: #f8fafc; border-radius: 5px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .message { margin-bottom: 20px; color: #ef4444; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Authentication Error</h1>
            <p class="message">There was a problem connecting to Stripe.</p>
            <p>Redirecting back to the application in 5 seconds...</p>
            <p><a href="${returnUrl}">Click here if you're not redirected automatically</a></p>
          </div>
        </body>
      </html>`,
      { headers: { 'content-type': 'text/html' } }
    );
  }
} 