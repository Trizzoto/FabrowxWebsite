import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { xero } from '@/lib/xero-config';
import { cookies } from 'next/headers';
import { saveXeroCredentials } from '@/lib/xero-storage';

export async function GET(request: NextRequest) {
  try {
    console.log('Starting Xero callback...');
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    
    console.log('Callback request details:', {
      hasCode: !!code,
      url: request.url,
      headers: {
        host: request.headers.get('host'),
        origin: request.headers.get('origin'),
        referer: request.headers.get('referer'),
        cookie: request.headers.get('cookie')
      }
    });

    if (!code) {
      throw new Error('No authorization code received');
    }

    console.log('Getting token set from Xero...');
    const tokenSet = await xero.apiCallback(code);
    
    console.log('Token set received:', {
      hasAccessToken: !!tokenSet.access_token,
      hasRefreshToken: !!tokenSet.refresh_token,
      expiresIn: tokenSet.expires_in,
      scope: tokenSet.scope,
      tokenType: tokenSet.token_type,
      idToken: !!tokenSet.id_token
    });
    
    if (!tokenSet.access_token || !tokenSet.refresh_token || !tokenSet.expires_in) {
      throw new Error('Invalid token set received from Xero');
    }

    console.log('Getting tenants...');
    const tenants = await xero.updateTenants(false);
    console.log('Tenants retrieved:', {
      count: tenants.length,
      firstTenantId: tenants[0]?.tenantId,
      tenantNames: tenants.map(t => t.tenantName)
    });

    // Get the host from the request
    const host = request.headers.get('host') || '';
    console.log('Request host:', host);

    // Create response with cookies
    const response = NextResponse.redirect(new URL('/', request.url));

    // Common cookie options
    const cookieOptions = {
      secure: true,
      httpOnly: true,
      sameSite: 'lax' as const,
      path: '/',
      // Only set domain for production
      ...(host.includes('vercel.app') && { domain: 'fabrowx-website.vercel.app' })
    };

    console.log('Setting cookies with options:', cookieOptions);

    // Set the tokens in cookies
    response.cookies.set('xero_access_token', tokenSet.access_token, {
      ...cookieOptions,
      maxAge: 60 * 30 // 30 minutes
    });
    console.log('Set access token cookie');

    response.cookies.set('xero_refresh_token', tokenSet.refresh_token, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });
    console.log('Set refresh token cookie');

    // Store additional information
    const tokenInfo = JSON.stringify({
      expires_in: tokenSet.expires_in,
      scope: tokenSet.scope,
      token_type: tokenSet.token_type
    });
    response.cookies.set('xero_token_info', tokenInfo, cookieOptions);
    console.log('Set token info cookie');

    // Store the tenant ID in a cookie
    if (tenants[0]?.tenantId) {
      response.cookies.set('xero_tenant_id', tenants[0].tenantId, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });
      console.log('Set tenant ID cookie');
    }

    // Get tenant ID
    console.log('Setting token set in Xero client...');
    await xero.setTokenSet({
      access_token: tokenSet.access_token,
      refresh_token: tokenSet.refresh_token,
      expires_in: tokenSet.expires_in
    });
    console.log('Token set successfully set in Xero client');

    // Save credentials to storage
    console.log('Saving credentials to storage...');
    await saveXeroCredentials({
      tenantId: tenants[0]?.tenantId,
      accessToken: tokenSet.access_token,
      refreshToken: tokenSet.refresh_token,
      expiresAt: Date.now() + (tokenSet.expires_in * 1000)
    });
    console.log('Credentials saved to storage');

    // Redirect back to the admin dashboard using HTTPS
    const redirectUrl = new URL('/admin/xero', request.url);
    redirectUrl.protocol = 'https:';
    redirectUrl.host = 'fabrowx-website.vercel.app';
    console.log('Redirecting to:', redirectUrl.toString());
    return Response.redirect(redirectUrl.toString());
  } catch (error: any) {
    console.error('Error in Xero callback:', {
      error: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      response: error.response?.body
    });
    const redirectUrl = new URL('/error', request.url);
    redirectUrl.searchParams.set('message', 'Failed to authenticate with Xero');
    return NextResponse.redirect(redirectUrl);
  }
} 