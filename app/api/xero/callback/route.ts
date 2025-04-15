import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { XeroClient } from 'xero-node';
import { cookies } from 'next/headers';
import { saveXeroCredentials } from '@/lib/xero-storage';

export async function GET(request: NextRequest) {
  try {
    console.log('Starting Xero callback...');
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const error_description = searchParams.get('error_description');
    
    console.log('Callback request details:', {
      hasCode: !!code,
      hasError: !!error,
      errorDescription: error_description,
      url: request.url,
      headers: {
        host: request.headers.get('host'),
        origin: request.headers.get('origin'),
        referer: request.headers.get('referer'),
        cookie: request.headers.get('cookie')
      }
    });

    if (error) {
      console.error('Xero returned an error:', {
        error,
        error_description,
        url: request.url
      });
      throw new Error(`Xero authentication failed: ${error_description || error}`);
    }

    if (!code) {
      console.error('No authorization code received:', {
        searchParams: Object.fromEntries(searchParams.entries()),
        url: request.url
      });
      throw new Error('No authorization code received');
    }

    // Initialize Xero client with credentials
    const xero = new XeroClient({
      clientId: process.env.XERO_CLIENT_ID!,
      clientSecret: process.env.XERO_CLIENT_SECRET!,
      redirectUris: [process.env.XERO_REDIRECT_URI || 'https://fabrowx-website.vercel.app/api/xero/callback'],
      grantType: 'authorization_code',
      scopes: [
        'offline_access',
        'openid',
        'profile',
        'email',
        'accounting.transactions',
        'accounting.contacts',
        'accounting.settings',
        'accounting.reports.read',
        'accounting.journals.read',
        'accounting.attachments',
        'accounting.settings.read',
        'accounting.contacts.read'
      ]
    });

    console.log('Getting token set from Xero...');
    let tokenSet;
    try {
      // Exchange the authorization code for tokens
      tokenSet = await xero.apiCallback(code);
      console.log('Token set received:', {
        hasAccessToken: !!tokenSet.access_token,
        hasRefreshToken: !!tokenSet.refresh_token,
        expiresIn: tokenSet.expires_in,
        scope: tokenSet.scope,
        tokenType: tokenSet.token_type,
        idToken: !!tokenSet.id_token
      });
    } catch (e: any) {
      console.error('Failed to get token set:', {
        error: e.message,
        stack: e.stack,
        name: e.name,
        code: e.code,
        response: e.response?.body
      });
      throw new Error(`Failed to get token set: ${e.message}`);
    }
    
    if (!tokenSet.access_token || !tokenSet.refresh_token || !tokenSet.expires_in) {
      console.error('Invalid token set received:', {
        hasAccessToken: !!tokenSet.access_token,
        hasRefreshToken: !!tokenSet.refresh_token,
        expiresIn: tokenSet.expires_in,
        scope: tokenSet.scope
      });
      throw new Error('Invalid token set received from Xero');
    }

    // Set the token set in the Xero client
    try {
      await xero.setTokenSet({
        access_token: tokenSet.access_token,
        refresh_token: tokenSet.refresh_token,
        expires_in: tokenSet.expires_in
      });
      console.log('Successfully set token set in Xero client');
    } catch (e: any) {
      console.error('Failed to set token set in Xero client:', {
        error: e.message,
        stack: e.stack,
        name: e.name
      });
      throw new Error(`Failed to set token set in Xero client: ${e.message}`);
    }

    console.log('Getting tenants...');
    let tenants;
    try {
      tenants = await xero.updateTenants(false);
      console.log('Tenants retrieved:', {
        count: tenants.length,
        firstTenantId: tenants[0]?.tenantId,
        tenantNames: tenants.map(t => t.tenantName)
      });
    } catch (e: any) {
      console.error('Failed to get tenants:', {
        error: e.message,
        stack: e.stack,
        name: e.name,
        code: e.code,
        response: e.response?.body
      });
      throw new Error(`Failed to get tenants: ${e.message}`);
    }

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

    try {
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
    } catch (e: any) {
      console.error('Failed to set cookies:', {
        error: e.message,
        stack: e.stack,
        name: e.name
      });
      throw new Error(`Failed to set cookies: ${e.message}`);
    }

    // Save credentials to storage
    console.log('Saving credentials to storage...');
    try {
      await saveXeroCredentials({
        tenantId: tenants[0]?.tenantId,
        accessToken: tokenSet.access_token,
        refreshToken: tokenSet.refresh_token,
        expiresAt: Date.now() + (tokenSet.expires_in * 1000)
      });
      console.log('Credentials saved to storage');
    } catch (e: any) {
      console.error('Failed to save credentials:', {
        error: e.message,
        stack: e.stack,
        name: e.name
      });
      throw new Error(`Failed to save credentials: ${e.message}`);
    }

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
    redirectUrl.searchParams.set('message', error.message || 'Failed to authenticate with Xero');
    return NextResponse.redirect(redirectUrl);
  }
} 