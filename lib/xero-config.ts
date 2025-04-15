import { XeroClient } from 'xero-node';
import { cookies } from 'next/headers';

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
    const cookieStore = cookies();
    const accessToken = cookieStore.get('xero_access_token')?.value;
    const refreshToken = cookieStore.get('xero_refresh_token')?.value;
    const tenantId = cookieStore.get('xero_tenant_id')?.value;

    if (!accessToken || !refreshToken || !tenantId) {
      throw new Error('Authentication required. Please visit /api/xero/auth to connect to Xero.');
    }

    // Set the current token set
    await xero.setTokenSet({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 1800
    });

    // Try to refresh the token
    try {
      const newTokenSet = await xero.refreshToken();
      
      if (!newTokenSet.access_token) {
        throw new Error('No access token received from refresh');
      }
      
      // Update cookies with new tokens
      cookieStore.set('xero_access_token', newTokenSet.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: newTokenSet.expires_in || 1800
      });
      
      if (newTokenSet.refresh_token) {
        cookieStore.set('xero_refresh_token', newTokenSet.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30 // 30 days
        });
      }
      
      return {
        accessToken: newTokenSet.access_token,
        tenantId
      };
    } catch (refreshError) {
      console.error('Error refreshing token:', refreshError);
      throw new Error('Authentication required. Please visit /api/xero/auth to connect to Xero.');
    }
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