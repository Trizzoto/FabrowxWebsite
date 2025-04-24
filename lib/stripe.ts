import Stripe from 'stripe';
import { cookies } from 'next/headers';

// Initialize Stripe with direct API key
let stripeClient: Stripe | null = null;

// Get base URL for the application
export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // For server-side
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return `${protocol}://${host}`;
};

// Initialize or get existing Stripe client
export const stripe = getOrCreateStripeClient();

function getOrCreateStripeClient(): Stripe {
  if (stripeClient) {
    return stripeClient;
  }
  
  // Check for dev cookies first (server-side)
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