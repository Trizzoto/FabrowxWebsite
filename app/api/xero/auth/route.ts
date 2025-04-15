import { NextResponse } from 'next/server';
import { getXeroAuthUrl } from '@/lib/xero-config';

export async function GET(request: Request) {
  try {
    // Get the return URL from the query string
    const url = new URL(request.url);
    const returnUrl = url.searchParams.get('returnUrl') || '/admin/customers';
    
    // Get the auth URL (this is not a Promise)
    const authUrl = getXeroAuthUrl();
    
    // Create a response with cookies and redirect
    const response = NextResponse.redirect(authUrl);
    
    // Set a cookie to store the return URL
    response.cookies.set('xero_auth_return_url', returnUrl, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10 // 10 minutes
    });
    
    return response;
  } catch (error) {
    console.error('Error starting Xero authentication:', error);
    return new NextResponse(
      JSON.stringify({
        error: 'Failed to start Xero authentication',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 