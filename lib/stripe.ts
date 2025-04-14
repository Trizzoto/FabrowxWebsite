import Stripe from 'stripe';

// Initialize Stripe with your secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
  typescript: true,
});

// Helper function to get base URL
export const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  return 'https://fabrowx-website.vercel.app';
};

// Helper function to create a payment intent
export const createPaymentIntent = async (amount: number, metadata: any) => {
  return stripe.paymentIntents.create({
    amount,
    currency: 'aud',
    automatic_payment_methods: {
      enabled: true,
    },
    metadata
  });
};

// Helper function to format price for Stripe (converts dollars to cents)
export const formatStripePrice = (price: number) => {
  return Math.round(price * 100);
};

// Helper function to format price for display (converts cents to dollars)
export const formatDisplayPrice = (price: number) => {
  return (price / 100).toFixed(2);
}; 