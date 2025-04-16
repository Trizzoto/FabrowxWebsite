import Stripe from 'stripe';
import { getStripeCredentials, saveStripeCredentials } from './stripe-storage';
import { cookies } from 'next/headers';

// Get the secret key with fallbacks
function getSecretKey(): string {
  let secretKey = process.env.STRIPE_SECRET_KEY || '';
  
  try {
    // This will only work in a server component or API route
    const cookieStore = cookies();
    const devSecretKey = cookieStore.get('dev_stripe_secret_key')?.value;
    
    if (devSecretKey) {
      secretKey = devSecretKey;
    }
  } catch (e) {
    // If cookies() fails (client component), just use the env var
  }
  
  return secretKey;
}

// Initialize Stripe client with direct API key first, falling back to OAuth credentials
const stripeSecretKey = getSecretKey();
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-03-31.basil', // Match version used in other files
});

// Get a valid token or throw an error if not available
export async function getValidToken() {
  console.log('Getting valid Stripe token...');
  
  try {
    // First, check if we have a direct API key configured
    const secretKey = getSecretKey();
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (secretKey) {
      console.log('Using direct API keys for Stripe');
      return {
        accountId: process.env.STRIPE_ACCOUNT_ID || 'direct_integration',
        accessToken: secretKey,
      };
    }
    
    // Fall back to OAuth credentials from storage
    const storedCredentials = getStripeCredentials();
    
    if (storedCredentials) {
      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      
      if (storedCredentials.expiresAt > now) {
        // Return existing credentials
        console.log('Using stored OAuth credentials for Stripe');
        return {
          accountId: storedCredentials.accountId,
          accessToken: storedCredentials.accessToken,
        };
      }
      
      // Token expired, try to refresh if we have a refresh token
      if (storedCredentials.refreshToken) {
        // TODO: Implement token refresh when needed
        // For Stripe Connect, refresh tokens may not be needed for standard integration
      }
    }
    
    throw new Error('Stripe is not configured. Please set up API keys or connect your Stripe account.');
  } catch (error) {
    console.error('Error getting valid Stripe token:', error);
    throw new Error('Stripe is not configured. Please set up API keys or connect your Stripe account.');
  }
}

// Function to get the Stripe Connect URL
export function getStripeConnectUrl() {
  const clientId = process.env.STRIPE_CLIENT_ID;
  if (!clientId) {
    throw new Error('STRIPE_CLIENT_ID is not configured');
  }
  
  // Get the current URL for the redirect
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const redirectUri = `${baseUrl}/api/stripe/callback`;
  
  // Construct the OAuth URL
  return `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=read_write&redirect_uri=${encodeURIComponent(redirectUri)}`;
}

// Check if Stripe is connected
export async function isStripeConnected() {
  try {
    // Check for direct API keys first
    const secretKey = getSecretKey();
    
    if (secretKey) {
      return {
        connected: true,
        method: 'direct',
        accountId: process.env.STRIPE_ACCOUNT_ID || 'direct_integration',
      };
    }
    
    // Fall back to OAuth connection check
    const credentials = getStripeCredentials();
    return { 
      connected: !!credentials,
      method: credentials ? 'oauth' : 'none',
      accountId: credentials?.accountId,
    };
  } catch (error) {
    console.error('Error checking Stripe connection:', error);
    return { connected: false, method: 'none' };
  }
} 