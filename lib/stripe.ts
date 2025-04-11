import Stripe from 'stripe';

// Initialize Stripe server-side instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

// Helper function to format price for Stripe (converts dollars to cents)
export const formatStripePrice = (price: number) => {
  return Math.round(price * 100);
};

// Helper function to format price for display (converts cents to dollars)
export const formatDisplayPrice = (price: number) => {
  return (price / 100).toFixed(2);
}; 