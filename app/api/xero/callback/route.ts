import { NextResponse } from 'next/server';
import { xero } from '@/lib/xero-config';
import { cookies } from 'next/headers';
import { saveXeroCredentials } from '@/lib/xero-storage';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const scope = url.searchParams.get('scope');
    const session_state = url.searchParams.get('session_state');
    
    console.log('Received callback with:', { 
      code: code ? 'present' : 'missing',
      scope,
      session_state,
      url: url.toString()
    });
    
    if (!code) {
      console.error('No authorization code received');
      return NextResponse.json(
        { error: 'No authorization code received' },
        { status: 400 }
      );
    }

    try {
      // Get token set from Xero
      console.log('Attempting to exchange code for tokens...');
      
      // Exchange the code for tokens using the OAuth2 flow
      const response = await fetch('https://identity.xero.com/connect/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${process.env.XERO_CLIENT_ID}:${process.env.XERO_CLIENT_SECRET}`).toString('base64')}`
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: process.env.XERO_REDIRECT_URI || 'https://fabrowx-website.vercel.app/api/xero/callback'
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Token exchange failed:', errorData);
        throw new Error(`Token exchange failed: ${response.status} ${response.statusText}`);
      }

      const tokenSet = await response.json();
      
      console.log('Token exchange response:', {
        hasAccessToken: !!tokenSet.access_token,
        hasRefreshToken: !!tokenSet.refresh_token,
        expiresIn: tokenSet.expires_in,
        tokenType: tokenSet.token_type,
        idToken: !!tokenSet.id_token,
        scope: tokenSet.scope
      });

      // Set the tokens in cookies
      const cookieStore = cookies();
      cookieStore.set('xero_access_token', tokenSet.access_token, {
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 30 // 30 minutes
      });
      
      cookieStore.set('xero_refresh_token', tokenSet.refresh_token, {
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });

      // Get tenant ID
      await xero.setTokenSet({
        access_token: tokenSet.access_token,
        refresh_token: tokenSet.refresh_token,
        expires_in: tokenSet.expires_in
      });

      const tenants = await xero.updateTenants(false);
      if (!tenants || tenants.length === 0) {
        throw new Error('No Xero tenants found');
      }

      // Store the tenant ID in a cookie
      cookieStore.set('xero_tenant_id', tenants[0].tenantId, {
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });

      // Save credentials to storage
      await saveXeroCredentials({
        tenantId: tenants[0].tenantId,
        accessToken: tokenSet.access_token,
        refreshToken: tokenSet.refresh_token,
        expiresAt: Date.now() + (tokenSet.expires_in * 1000)
      });

      // Redirect back to the admin dashboard using HTTPS
      const redirectUrl = new URL('/admin/xero', request.url);
      redirectUrl.protocol = 'https:';
      redirectUrl.host = 'fabrowx-website.vercel.app';
      console.log('Redirecting to:', redirectUrl.toString());
      return Response.redirect(redirectUrl.toString());
    } catch (error) {
      console.error('Error in Xero callback:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in Xero callback:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate with Xero' },
      { status: 500 }
    );
  }
} 