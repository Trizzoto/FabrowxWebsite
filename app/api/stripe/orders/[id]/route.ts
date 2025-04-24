import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

// Disable Next.js cache for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await request.json();

    // Update the payment intent metadata with the new status
    await stripe.paymentIntents.update(id, {
      metadata: {
        order_status: status
      }
    });

    return new NextResponse(JSON.stringify({ success: true }), {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to update order status' }), {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  }
} 