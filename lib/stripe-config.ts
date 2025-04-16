import Stripe from 'stripe';
import { getStripeCredentials, saveStripeCredentials } from './stripe-storage';

// Initialize Stripe client
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16', // Use latest API version
});

// Get a valid token or throw an error if not available
export async function getValidToken() {
  console.log('Getting valid Stripe token...');
  
  try {
    // First try to get credentials from storage
    const storedCredentials = getStripeCredentials();
    
    if (storedCredentials) {
      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      
      if (storedCredentials.expiresAt > now) {
        // Return existing credentials
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
    
    // Fallback to env variable if no stored credentials
    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_ACCOUNT_ID) {
      return {
        accountId: process.env.STRIPE_ACCOUNT_ID,
        accessToken: process.env.STRIPE_SECRET_KEY,
      };
    }
    
    throw new Error('Authentication required. Please connect your Stripe account.');
  } catch (error) {
    console.error('Error getting valid Stripe token:', error);
    throw new Error('Authentication required. Please connect your Stripe account.');
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
    const credentials = getStripeCredentials();
    return !!credentials?.accountId && !!credentials?.accessToken;
  } catch (error) {
    console.error('Error checking Stripe connection:', error);
    return false;
  }
} 