import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { xero } from '@/lib/xero-config';
import { saveXeroCredentials } from '@/lib/xero-storage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    // Extract the authorization code from the URL
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    
    // Get the stored return URL
    const cookieStore = cookies();
    const returnUrl = cookieStore.get('xero_auth_return_url')?.value || '/admin/customers';
    
    if (!code) {
      console.error('No authorization code received');
      
      // Create HTML response for error
      const htmlResponse = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Xero Authentication Error</title>
            <meta http-equiv="refresh" content="5;url=${returnUrl}" />
            <style>
              body { font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; text-align: center; }
              .error { color: #e53e3e; margin-bottom: 20px; }
              .message { margin-bottom: 30px; }
              a { color: #3182ce; text-decoration: none; }
              a:hover { text-decoration: underline; }
            </style>
          </head>
          <body>
            <h1 class="error">Authentication Error</h1>
            <p class="message">No authorization code received from Xero.</p>
            <p>Redirecting to <a href="${returnUrl}">${returnUrl}</a> in 5 seconds...</p>
          </body>
        </html>
      `;
      
      return new NextResponse(htmlResponse, {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }
    
    // Exchange the code for tokens
    console.log('Exchanging code for tokens...');
    const tokenSet = await xero.apiCallback(request.url);
    
    if (!tokenSet.access_token || !tokenSet.refresh_token) {
      throw new Error('Invalid token response from Xero');
    }
    
    // Get the connected tenants
    console.log('Getting connected tenants...');
    const tenants = await xero.updateTenants(false);
    
    if (!tenants || tenants.length === 0) {
      throw new Error('No Xero organizations found');
    }
    
    // Use the first tenant
    const tenantId = tenants[0].tenantId;
    
    // Calculate expiry time (current time + expires_in seconds)
    const expiresAt = Date.now() + (tokenSet.expires_in || 1800) * 1000;
    
    // Save tokens using the storage mechanism
    await saveXeroCredentials({
      tenantId,
      accessToken: tokenSet.access_token,
      refreshToken: tokenSet.refresh_token,
      expiresAt
    });
    
    // Also set cookies for backward compatibility
    cookieStore.set('xero_tenant_id', tenantId, {
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });
    
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
    
    // Create HTML response for success
    const htmlResponse = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Xero Authentication Success</title>
          <meta http-equiv="refresh" content="3;url=${returnUrl}" />
          <style>
            body { font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; text-align: center; }
            .success { color: #38a169; margin-bottom: 20px; }
            .message { margin-bottom: 30px; }
            a { color: #3182ce; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <h1 class="success">Authentication Successful</h1>
          <p class="message">You have successfully connected to Xero!</p>
          <p>Redirecting to <a href="${returnUrl}">${returnUrl}</a> in 3 seconds...</p>
        </body>
      </html>
    `;
    
    return new NextResponse(htmlResponse, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error in Xero callback:', error);
    
    // Get the stored return URL
    const cookieStore = cookies();
    const returnUrl = cookieStore.get('xero_auth_return_url')?.value || '/admin/customers';
    
    // Create HTML response for error
    const htmlResponse = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Xero Authentication Error</title>
          <meta http-equiv="refresh" content="5;url=${returnUrl}" />
          <style>
            body { font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; text-align: center; }
            .error { color: #e53e3e; margin-bottom: 20px; }
            .message { margin-bottom: 30px; }
            a { color: #3182ce; text-decoration: none; }
            a:hover { text-decoration: underline; }
            .details { font-family: monospace; background: #f7fafc; padding: 15px; text-align: left; overflow-x: auto; }
          </style>
        </head>
        <body>
          <h1 class="error">Authentication Error</h1>
          <p class="message">There was a problem connecting to Xero.</p>
          <div class="details">${error instanceof Error ? error.message : 'Unknown error'}</div>
          <p>Redirecting to <a href="${returnUrl}">${returnUrl}</a> in 5 seconds...</p>
        </body>
      </html>
    `;
    
    return new NextResponse(htmlResponse, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }
} 