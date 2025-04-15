import { NextResponse } from 'next/server';
import { xero } from '@/lib/xero-config';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    // Get the URL parameters
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    // Check for errors
    if (error) {
      console.error('Xero OAuth error:', error);
      return NextResponse.redirect(new URL('/admin?error=xero_auth_failed', request.url));
    }

    // Validate state parameter
    if (state !== 'elite-fabworx') {
      console.error('Invalid state parameter:', state);
      return NextResponse.redirect(new URL('/admin?error=invalid_state', request.url));
    }

    // Check for authorization code
    if (!code) {
      console.error('No authorization code received');
      return NextResponse.redirect(new URL('/admin?error=no_code', request.url));
    }

    // Exchange the code for tokens
    const tokenSet = await xero.apiCallback(code);
    
    if (!tokenSet.access_token) {
      console.error('No access token received');
      return NextResponse.redirect(new URL('/admin?error=no_access_token', request.url));
    }
    
    // Store the tokens in cookies
    const cookieStore = cookies();
    cookieStore.set('xero_access_token', tokenSet.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenSet.expires_in || 1800
    });
    
    if (tokenSet.refresh_token) {
      cookieStore.set('xero_refresh_token', tokenSet.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });
    }

    // Get the tenant ID
    const tenants = await xero.updateTenants();
    if (!tenants || tenants.length === 0) {
      console.error('No Xero tenants found');
      return NextResponse.redirect(new URL('/admin?error=no_tenant', request.url));
    }

    // Store the tenant ID in a cookie
    cookieStore.set('xero_tenant_id', tenants[0].tenantId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    // Redirect to success page
    return NextResponse.redirect(new URL('/admin?success=xero_connected', request.url));
  } catch (error) {
    console.error('Error in Xero callback:', error);
    return NextResponse.redirect(new URL('/admin?error=xero_callback_failed', request.url));
  }
} 