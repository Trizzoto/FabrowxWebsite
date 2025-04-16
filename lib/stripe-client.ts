import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe client-side instance
export const getStripe = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  // Check for publish key in localStorage first
  const publishableKey = localStorage.getItem('stripe_publishable_key') || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  
  if (!publishableKey) {
    console.error('Stripe publishable key is not configured');
    throw new Error('Stripe publishable key is not configured');
  }
  
  return loadStripe(publishableKey);
}; 