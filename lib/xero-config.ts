import { XeroClient } from 'xero-node';
import { getXeroCredentials } from './xero-storage';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// Initialize Xero client with OAuth 2.0
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

// Function to get a valid token
// This function handles token validation, refresh, and cookie management
export async function getValidToken(): Promise<{ accessToken?: string; tenantId?: string }> {
  try {
    console.log('Starting getValidToken...');
    const cookieStore = cookies();
    const accessToken = cookieStore.get('xero_access_token')?.value;
    const refreshToken = cookieStore.get('xero_refresh_token')?.value;
    const tenantId = cookieStore.get('xero_tenant_id')?.value;
    const tokenInfo = cookieStore.get('xero_token_info')?.value;

    console.log('Cookie check:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      hasTenantId: !!tenantId,
      hasTokenInfo: !!tokenInfo,
      cookieDomain: process.env.VERCEL_URL ? `.${process.env.VERCEL_URL}` : 'localhost',
      allCookies: Array.from(cookieStore.getAll()).map(c => c.name)
    });

    if (!accessToken || !refreshToken) {
      console.log('No tokens found in cookies. Details:', {
        accessTokenLength: accessToken?.length,
        refreshTokenLength: refreshToken?.length,
        tenantId,
        tokenInfo
      });
      return {};
    }

    // Check if access token is expired or about to expire
    const decodedToken = jwt.decode(accessToken) as { exp?: number; scope?: string[] };
    const tokenExpiration = decodedToken?.exp || 0;
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = tokenExpiration - currentTime;

    console.log('Token status:', {
      currentTime,
      tokenExpiration,
      timeUntilExpiry,
      needsRefresh: timeUntilExpiry < 300, // 5 minutes buffer
      tokenScopes: decodedToken?.scope,
      tokenPreview: accessToken.substring(0, 20) + '...',
      refreshTokenPreview: refreshToken.substring(0, 20) + '...'
    });

    // Set the current token set
    const expiresIn = Math.floor((tokenExpiration - currentTime));
    console.log('Setting initial token set:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      expiresIn,
      accessTokenPreview: accessToken.substring(0, 20) + '...',
      refreshTokenPreview: refreshToken.substring(0, 20) + '...'
    });

    try {
      await xero.setTokenSet({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: expiresIn
      });
      console.log('Successfully set initial token set');
    } catch (e: any) {
      console.error('Failed to set initial token set:', {
        error: e.message,
        stack: e.stack,
        name: e.name
      });
      throw e;
    }

    // For OAuth 2.0, we need to handle token refresh
    let tokenSet;
    try {
      // Try to refresh the token
      console.log('Attempting to refresh token...');
      tokenSet = await xero.refreshToken();
      console.log('Token refresh successful:', {
        hasAccessToken: !!tokenSet.access_token,
        hasRefreshToken: !!tokenSet.refresh_token,
        expiresIn: tokenSet.expires_in,
        scope: tokenSet.scope,
        accessTokenPreview: tokenSet.access_token?.substring(0, 20) + '...',
        refreshTokenPreview: tokenSet.refresh_token?.substring(0, 20) + '...',
        tokenType: tokenSet.token_type,
        idToken: !!tokenSet.id_token
      });
    } catch (e: any) {
      console.error('Token refresh failed:', {
        error: e.message,
        stack: e.stack,
        name: e.name,
        code: e.code,
        response: e.response?.body
      });
      throw new Error('Authentication required. Please visit /api/xero/auth to connect to Xero.');
    }
    
    if (!tokenSet.access_token) {
      console.error('No access token received in token refresh response:', {
        tokenSet: {
          hasAccessToken: !!tokenSet.access_token,
          hasRefreshToken: !!tokenSet.refresh_token,
          expiresIn: tokenSet.expires_in,
          scope: tokenSet.scope
        }
      });
      throw new Error('No access token received from Xero');
    }

    return {
      accessToken: tokenSet.access_token,
      tenantId: tenantId
    };
  } catch (error: any) {
    console.error('Error getting Xero token:', {
      error: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      response: error.response?.body
    });
    throw error;
  }
}

// Get the authorization URL with explicit scope parameter
export const getXeroAuthUrl = async () => {
  const scopes = [
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
  ];
  
  const baseUrl = await xero.buildConsentUrl();
  const url = new URL(baseUrl);
  
  // Properly encode the scopes
  const encodedScopes = scopes.join(' ');
  url.searchParams.set('scope', encodedScopes);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('state', Date.now().toString());
  
  // Ensure the redirect URI is properly encoded
  url.searchParams.set('redirect_uri', process.env.XERO_REDIRECT_URI || 'https://fabrowx-website.vercel.app/api/xero/callback');
  
  return url.toString();
};

export { xero };

// Check required environment variables
if (!process.env.XERO_CLIENT_ID || !process.env.XERO_CLIENT_SECRET) {
  throw new Error('Missing required Xero credentials in environment variables');
} 