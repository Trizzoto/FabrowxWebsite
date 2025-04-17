import { XeroClient } from 'xero-node';
import { cookies } from 'next/headers';
import { saveXeroCredentials, getXeroCredentials } from './xero-storage';

// Initialize Xero client with OAuth 2.0
export const xero = new XeroClient({
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
    console.log('Getting valid Xero token...');
    
    // First try to get credentials from storage
    const storedCredentials = getXeroCredentials();
    
    if (storedCredentials && 
        storedCredentials.accessToken && 
        storedCredentials.refreshToken && 
        storedCredentials.tenantId) {
      
      console.log('Found stored credentials, checking expiry...');
      
      // Check if the token is expired
      const isExpired = storedCredentials.expiresAt < Date.now();
      
      if (isExpired) {
        console.log('Token is expired, refreshing...');
        
        // Set the current token set for refresh
        await xero.setTokenSet({
          access_token: storedCredentials.accessToken,
          refresh_token: storedCredentials.refreshToken,
          expires_in: -1 // Force refresh
        });
        
        // Refresh the token
        const newTokenSet = await xero.refreshToken();
        
        if (!newTokenSet.access_token || !newTokenSet.refresh_token) {
          console.error('Token refresh failed - no tokens returned');
          throw new Error('Authentication required. Please visit /api/xero/auth to connect to Xero.');
        }
        
        // Calculate expiry time (current time + expires_in seconds)
        const expiresAt = Date.now() + (newTokenSet.expires_in || 1800) * 1000;
        
        // Save the new tokens
        await saveXeroCredentials({
          tenantId: storedCredentials.tenantId,
          accessToken: newTokenSet.access_token,
          refreshToken: newTokenSet.refresh_token,
          expiresAt
        });
        
        console.log('Token refreshed successfully');
        
        return {
          accessToken: newTokenSet.access_token,
          refreshToken: newTokenSet.refresh_token,
          tenantId: storedCredentials.tenantId,
          expiresAt
        };
      }
      
      console.log('Using existing valid token');
      
      return {
        accessToken: storedCredentials.accessToken,
        refreshToken: storedCredentials.refreshToken,
        tenantId: storedCredentials.tenantId,
        expiresAt: storedCredentials.expiresAt
      };
    }
    
    // Fallback to cookies
    console.log('No stored credentials, checking cookies...');
    const cookieStore = cookies();
    const accessToken = cookieStore.get('xero_access_token')?.value;
    const refreshToken = cookieStore.get('xero_refresh_token')?.value;
    const tenantId = cookieStore.get('xero_tenant_id')?.value;
    
    if (!accessToken || !refreshToken || !tenantId) {
      console.error('No valid Xero credentials found');
      throw new Error('Authentication required. Please visit /api/xero/auth to connect to Xero.');
    }
    
    console.log('Using credentials from cookies');
    
    return {
      accessToken,
      refreshToken,
      tenantId,
      expiresAt: Date.now() + 1800 * 1000 // Assume 30 minutes validity
    };
  } catch (error) {
    console.error('Error getting valid token:', error);
    throw error;
  }
}

// Get the Xero authorization URL
export const getXeroAuthUrl = async () => {
  return xero.buildConsentUrl();
};

// Check required environment variables
if (!process.env.XERO_CLIENT_ID || !process.env.XERO_CLIENT_SECRET) {
  throw new Error('Missing required Xero credentials in environment variables');
}

export async function getXeroConnectUrl(): Promise<string> {
  return xero.buildConsentUrl();
}

export async function getXeroClient(): Promise<XeroClient> {
  // Get valid token
  const token = await getValidToken();
  
  // Set the token in the client
  await xero.setTokenSet({
    access_token: token.accessToken,
    refresh_token: token.refreshToken,
    expires_in: Math.floor((token.expiresAt - Date.now()) / 1000)
  });
  
  return xero;
}

export async function refreshXeroToken() {
  const token = await getValidToken();
  return {
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
    expiresAt: token.expiresAt
  };
}

export async function disconnectXero() {
  // Clear credentials from storage and cookies
  const cookieStore = cookies();
  cookieStore.delete('xero_access_token');
  cookieStore.delete('xero_refresh_token');
  cookieStore.delete('xero_tenant_id');
  return { success: true };
}

export async function isXeroConnected(): Promise<boolean> {
  try {
    await getValidToken();
    return true;
  } catch (error) {
    return false;
  }
} 