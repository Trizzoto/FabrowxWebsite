import { NextRequest } from 'next/server';
import { xero } from '@/lib/xero-config';
import { saveXeroCredentials } from '@/lib/xero-storage';

export async function GET(request: NextRequest) {
  try {
    // Get the authorization code from the URL
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    
    if (!code) {
      console.error('No authorization code received from Xero');
      return Response.json({ error: 'No authorization code received' }, { status: 400 });
    }
    
    console.log('Received Xero authorization code, exchanging for tokens...');
    
    // Exchange the code for tokens
    const tokenSet = await xero.apiCallback(request.nextUrl.href);
    
    if (!tokenSet.access_token || !tokenSet.refresh_token) {
      console.error('Token exchange failed - no tokens returned');
      return Response.json({ error: 'Failed to exchange authorization code for tokens' }, { status: 500 });
    }
    
    // Get the tenant ID (organization)
    const tenants = await xero.updateTenants(false);
    
    if (!tenants || tenants.length === 0) {
      console.error('No Xero organizations found');
      return Response.json({ error: 'No Xero organizations found' }, { status: 500 });
    }
    
    const tenantId = tenants[0].tenantId;
    
    // Calculate expiry time (current time + expires_in seconds)
    const expiresAt = Date.now() + (tokenSet.expires_in || 1800) * 1000;
    
    // Save the tokens
    await saveXeroCredentials({
      tenantId,
      accessToken: tokenSet.access_token,
      refreshToken: tokenSet.refresh_token,
      expiresAt
    });
    
    console.log('Xero connection successful');
    
    // Redirect to admin page with success message
    return Response.redirect(new URL('/admin?xero=connected', request.url));
    
  } catch (error) {
    console.error('Error in Xero callback:', error);
    return Response.json({ error: 'Failed to connect to Xero' }, { status: 500 });
  }
} 