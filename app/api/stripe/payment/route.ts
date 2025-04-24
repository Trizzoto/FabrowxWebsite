import { NextResponse } from 'next/server';
import { stripe, createPaymentIntent, getBaseUrl } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, items, customer } = body;

    // Convert amount to cents for Stripe
    const amountInCents = Math.round(amount * 100);

    // Format the full address
    const fullAddress = customer.address ? 
      `${customer.address.street}, ${customer.address.city}, ${customer.address.state} ${customer.address.postcode}, ${customer.address.country}` : 
      '';

    // Create metadata for the payment intent
    const metadata = {
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      customer_address: fullAddress,
      items: JSON.stringify(items)
    };

    // Create payment intent with amount in cents
    const paymentIntent = await createPaymentIntent(amountInCents, metadata);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      successUrl: `${getBaseUrl()}/payment/success`
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
} 