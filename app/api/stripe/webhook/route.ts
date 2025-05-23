import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { sendOrderNotification } from '@/lib/email';

// Disable Next.js cache for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  return new NextResponse(JSON.stringify({ status: 'Webhook endpoint is reachable' }), {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  });
}

export async function POST(request: Request) {
  try {
    console.log('Webhook received:', {
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries())
    });
    
    const body = await request.text();
    
    // Log only the first part of the body to avoid sensitive data
    console.log('Webhook body preview:', body.substring(0, 100) + '...');
    
    const signature = headers().get('stripe-signature');
    if (!signature) {
      console.error('No stripe-signature header found');
      return new NextResponse(JSON.stringify({ 
        received: true,
        error: 'No signature header'
      }), {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
    }

    console.log('Webhook signature:', {
      signatureLength: signature.length,
      signaturePreview: signature.substring(0, 20) + '...'
    });

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured');
      return new NextResponse(JSON.stringify({ 
        received: true,
        error: 'Webhook secret not configured'
      }), {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
    }

    console.log('Verifying webhook signature with secret:', webhookSecret.substring(0, 10) + '...');
    
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
      
      // Log verification success
      console.log('✅ Webhook signature verified successfully');
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new NextResponse(JSON.stringify({ 
        received: true,
        error: 'Webhook signature verification failed'
      }), {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
    }

    console.log('Webhook event:', {
      type: event.type,
      id: event.id,
      object: event.data.object.object
    });
    
    // Log event type check
    console.log(`Event type check: '${event.type}' === 'payment_intent.succeeded' is ${event.type === 'payment_intent.succeeded'}`);

    // Handle successful payments
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        metadata: paymentIntent.metadata,
      });
      
      // Send order notification email
      try {
        if (paymentIntent.metadata?.items) {
          const orderNumber = `WEB-${paymentIntent.id.slice(0, 8).toUpperCase()}`;
          const items = JSON.parse(paymentIntent.metadata.items);
          
          // Format items for email
          const emailItems = items.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            variant: item.variant?.options || undefined,
          }));

          const orderData = {
            orderNumber,
            customerName: paymentIntent.metadata.customer_name || 'Unknown',
            customerEmail: paymentIntent.metadata.customer_email || '',
            customerPhone: paymentIntent.metadata.customer_phone || '',
            customerAddress: paymentIntent.metadata.customer_address || undefined,
            isPickup: paymentIntent.metadata.is_pickup === 'true',
            items: emailItems,
            total: paymentIntent.amount / 100, // Convert from cents
            paymentIntentId: paymentIntent.id,
            date: new Date(paymentIntent.created * 1000).toISOString(),
          };

          await sendOrderNotification(orderData);
          console.log('Order notification email sent successfully');
        }
      } catch (emailError) {
        console.error('Failed to send order notification email:', emailError);
        // Don't fail the webhook if email fails
      }
      
      return new NextResponse(JSON.stringify({
        received: true,
        payment: {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          status: paymentIntent.status
        }
      }), {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
    }

    // Return success for other event types
    return new NextResponse(JSON.stringify({ received: true }), {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse(JSON.stringify({ 
      received: true,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  }
} 