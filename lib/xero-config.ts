import { XeroClient } from 'xero-node';

// Initialize Xero client with OAuth 2.0
const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID!,
  clientSecret: process.env.XERO_CLIENT_SECRET!,
  redirectUris: [process.env.XERO_REDIRECT_URI || 'https://fabrowx-website.vercel.app/api/xero/callback'],
  scopes: [
    'offline_access',
    'openid',
    'profile',
    'email',
    'accounting.transactions',
    'accounting.contacts',
    'accounting.settings'
  ],
  state: 'elite-fabworx'
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
      tokenSet = await xero.refreshToken();
    } catch (e) {
      // If refresh fails, we need to re-authenticate
      throw new Error('Authentication required. Please visit /api/xero/auth to connect to Xero.');
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

export { xero };

// Check required environment variables
if (!process.env.XERO_CLIENT_ID || !process.env.XERO_CLIENT_SECRET) {
  throw new Error('Missing required Xero credentials in environment variables');
}

// Get the authorization URL
export const getXeroAuthUrl = () => {
  return xero.buildConsentUrl();
}; 