import Stripe from 'stripe';
import { getStripeCredentials } from './stripe-storage';

// Initialize Stripe with credentials that will be dynamically loaded
let stripeClient: Stripe | null = null;

// Get base URL for the application
export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // For server-side
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = process.env.VERCEL_URL || 'localhost:3000';
  return `${protocol}://${host}`;
};

// Initialize or get existing Stripe client
export const stripe = getOrCreateStripeClient();

function getOrCreateStripeClient(): Stripe {
  if (stripeClient) {
    return stripeClient;
  }
  
  // Try to get credentials from storage or env variables
  const credentials = getStripeCredentials();
  const secretKey = credentials?.accessToken || process.env.STRIPE_SECRET_KEY || '';
  
  if (!secretKey) {
    console.warn('Stripe secret key not found. Payment functions will fail.');
  }
  
  stripeClient = new Stripe(secretKey, {
    apiVersion: '2025-03-31.basil',
  });
  
  return stripeClient;
}

// Helper function to create a payment intent
export async function createPaymentIntent(amount: number, metadata: any = {}) {
  try {
    // Ensure we're using the latest credentials
    const credentials = getStripeCredentials();
    if (credentials?.accessToken) {
      stripeClient = new Stripe(credentials.accessToken, {
        apiVersion: '2025-03-31.basil',
      });
    }
    
    return stripe.paymentIntents.create({
      amount,
      currency: 'aud',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

// Helper function to format price for Stripe (converts dollars to cents)
export const formatStripePrice = (price: number) => {
  return Math.round(price * 100);
};

// Helper function to format price for display (converts cents to dollars)
export const formatDisplayPrice = (price: number) => {
  return (price / 100).toFixed(2);
}; 