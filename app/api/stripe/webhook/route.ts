import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { syncPaymentToXero } from '@/lib/xero';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature')!;

  try {
    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Handle successful payments
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      
      // Get the Xero invoice ID from metadata or your database
      const invoiceId = paymentIntent.metadata.xero_invoice_id;
      
      if (invoiceId) {
        // Sync the payment with Xero
        await syncPaymentToXero({
          id: paymentIntent.id,
          amount: paymentIntent.amount / 100, // Convert cents to dollars
        }, invoiceId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
} 