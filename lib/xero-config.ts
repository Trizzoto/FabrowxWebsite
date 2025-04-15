import { XeroClient } from 'xero-node';
import { getXeroCredentials } from './xero-storage';

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
export async function getValidToken() {
  try {
    console.log('Getting stored credentials...');
    const credentials = getXeroCredentials();
    
    if (!credentials) {
      console.log('No stored credentials found');
      throw new Error('Authentication required. Please visit /api/xero/auth to connect to Xero.');
    }

    console.log('Credentials found:', {
      hasTenantId: !!credentials.tenantId,
      hasAccessToken: !!credentials.accessToken,
      hasRefreshToken: !!credentials.refreshToken,
      expiresAt: credentials.expiresAt,
      currentTime: Date.now()
    });

    // Set the current token set
    await xero.setTokenSet({
      access_token: credentials.accessToken,
      refresh_token: credentials.refreshToken,
      expires_in: Math.floor((credentials.expiresAt - Date.now()) / 1000)
    });

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
        scope: tokenSet.scope
      });
    } catch (e) {
      console.error('Token refresh failed:', e);
      throw new Error('Authentication required. Please visit /api/xero/auth to connect to Xero.');
    }
    
    if (!tokenSet.access_token) {
      throw new Error('No access token received from Xero');
    }

    return {
      accessToken: tokenSet.access_token,
      tenantId: credentials.tenantId
    };
  } catch (error) {
    console.error('Error getting Xero token:', error);
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