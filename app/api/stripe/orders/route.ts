import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET() {
  try {
    // Fetch payment intents
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100,
      expand: ['data.customer']
    });

    // Transform payment intents into orders
    const orders = paymentIntents.data
      .filter(pi => pi.status === 'succeeded' && pi.metadata?.items) // Only include successful payments with items
      .map(pi => ({
        id: pi.id,
        status: pi.status,
        amount: pi.amount,
        customer: {
          name: pi.metadata.customer_name,
          email: pi.metadata.customer_email,
          phone: pi.metadata.customer_phone,
        },
        items: JSON.parse(pi.metadata.items || '[]'),
        created: new Date(pi.created * 1000).toISOString(),
      }));

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching Stripe orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
} 