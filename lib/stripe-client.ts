import { loadStripe } from '@stripe/stripe-js';

// Helper to get cookie by name
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : undefined;
}

// Initialize Stripe client-side instance
export const getStripe = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  // Check for the dev cookie first, then fall back to env variable
  const devPublishableKey = getCookie('dev_stripe_publishable_key');
  const publishableKey = devPublishableKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  
  if (!publishableKey) {
    console.error('Stripe publishable key is not configured');
    throw new Error('Stripe publishable key is not configured');
  }
  
  return loadStripe(publishableKey);
}; 