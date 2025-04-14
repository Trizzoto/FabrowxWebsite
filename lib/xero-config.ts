import { XeroClient } from 'xero-node';

// Initialize Xero client for permanent access
export const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID!,
  clientSecret: process.env.XERO_CLIENT_SECRET!,
  grantType: 'client_credentials', // Use client credentials for permanent access
  scopes: ['accounting.transactions', 'accounting.contacts', 'accounting.settings']
});

// Helper function to get permanent access token
export async function getPermanentToken() {
  try {
    const tokenSet = await xero.getClientCredentialsToken();
    return {
      accessToken: tokenSet.access_token,
      expiresIn: tokenSet.expires_in,
      tenantId: process.env.XERO_TENANT_ID
    };
  } catch (error) {
    console.error('Error getting permanent Xero token:', error);
    throw error;
  }
}

// Helper function to ensure we have a valid token
export async function getValidToken() {
  try {
    const tokenSet = await xero.getClientCredentialsToken();
    
    if (!tokenSet.access_token) {
      throw new Error('Failed to get Xero access token');
    }
    
    await xero.setTokenSet({
      access_token: tokenSet.access_token,
      expires_in: tokenSet.expires_in || 1800
    });
    
    if (!process.env.XERO_TENANT_ID) {
      throw new Error('Missing XERO_TENANT_ID in environment variables');
    }
    
    return {
      accessToken: tokenSet.access_token,
      expiresIn: tokenSet.expires_in,
      tenantId: process.env.XERO_TENANT_ID
    };
  } catch (error) {
    console.error('Error refreshing Xero token:', error);
    throw error;
  }
}

// Check required environment variables
if (!process.env.XERO_CLIENT_ID || !process.env.XERO_CLIENT_SECRET) {
  throw new Error('Missing required Xero credentials in environment variables');
}

// OAuth2 client for web authentication (if needed)
export const xeroClient = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID,
  clientSecret: process.env.XERO_CLIENT_SECRET,
  redirectUris: [process.env.XERO_REDIRECT_URI || 'https://fabrowx-website.vercel.app/api/xero/callback'],
  scopes: [
    'offline_access',
    'accounting.transactions',
    'accounting.contacts',
    'accounting.settings',
    'openid',
    'profile',
    'email'
  ],
  state: 'elite-fabworx',
  grantType: 'authorization_code'
});

export const getXeroAuthUrl = () => {
  return xeroClient.buildConsentUrl();
}; 