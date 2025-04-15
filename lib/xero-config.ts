import { XeroClient } from 'xero-node';

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
    // Check if we have a tenant ID
    if (!process.env.XERO_TENANT_ID) {
      throw new Error('XERO_TENANT_ID is not set');
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
        scope: tokenSet.scope
      });
    } catch (e) {
      console.error('Token refresh failed:', e);
      // If refresh fails, we need to re-authenticate
      throw new Error('Authentication required. Please visit /api/xero/auth to connect to Xero.');
    }
    
    if (!tokenSet.access_token) {
      throw new Error('No access token received from Xero');
    }

    return {
      accessToken: tokenSet.access_token,
      tenantId: process.env.XERO_TENANT_ID
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
  url.searchParams.set('scope', scopes.join(' '));
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('state', 'random-state');
  return url.toString();
};

export { xero };

// Check required environment variables
if (!process.env.XERO_CLIENT_ID || !process.env.XERO_CLIENT_SECRET) {
  throw new Error('Missing required Xero credentials in environment variables');
} 