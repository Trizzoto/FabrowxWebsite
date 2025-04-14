import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

// Disable Next.js cache for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Fetch payment intents with expanded customer data and most recent first
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100,
      expand: ['data.customer'],
      created: {
        // Get orders from the last 30 days
        gte: Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60)
      }
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
      }))
      // Sort by creation date, newest first
      .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

    // Add cache control headers
    return new NextResponse(JSON.stringify({ orders }), {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error) {
    console.error('Error fetching Stripe orders:', error);
    // Still return an empty array rather than an error
    return new NextResponse(JSON.stringify({ orders: [] }), {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  }
} 