import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { createXeroInvoice, syncPaymentToXero } from '@/lib/xero';
import { xero } from '@/lib/xero';
import { getXeroCredentials } from '@/lib/xero-storage';

export async function GET() {
  return NextResponse.json({ status: 'Webhook endpoint is reachable' });
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
      return NextResponse.json(
        { error: 'No signature header' },
        { status: 400 }
      );
    }

    console.log('Webhook signature:', {
      signatureLength: signature.length,
      signaturePreview: signature.substring(0, 20) + '...'
    });

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    console.log('Verifying webhook signature with secret:', webhookSecret.substring(0, 10) + '...');
    
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    console.log('Webhook event:', {
      type: event.type,
      id: event.id,
      object: event.data.object.object
    });

    // Handle successful payments
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        metadata: paymentIntent.metadata,
      });
      
      try {
        // Get Xero credentials from storage
        console.log('Getting Xero credentials from storage...');
        const credentials = getXeroCredentials();
        
        if (!credentials) {
          console.error('Missing Xero credentials in storage');
          // Still return 200 as the webhook was processed
          return NextResponse.json({ 
            received: true,
            warning: 'Xero integration skipped - missing credentials'
          });
        }

        if (Date.now() > credentials.expiresAt) {
          console.error('Xero credentials have expired');
          return NextResponse.json({ 
            received: true,
            warning: 'Xero integration skipped - expired credentials'
          });
        }

        // Set the access token
        await xero.setTokenSet({
          access_token: credentials.accessToken,
          refresh_token: credentials.refreshToken,
          expires_in: Math.floor((credentials.expiresAt - Date.now()) / 1000)
        });

        // Create order object from payment metadata
        const order = {
          id: paymentIntent.id,
          customer: {
            name: paymentIntent.metadata.customer_name,
            email: paymentIntent.metadata.customer_email,
            phone: paymentIntent.metadata.customer_phone,
          },
          items: JSON.parse(paymentIntent.metadata.items || '[]'),
        };

        // Create Xero invoice
        const xeroInvoice = await createXeroInvoice(order, 'online', credentials);
        
        // Sync payment to Xero
        if (xeroInvoice.invoices?.[0]?.invoiceID) {
          await syncPaymentToXero(
            {
              id: paymentIntent.id,
              amount: paymentIntent.amount / 100,
            },
            xeroInvoice.invoices[0].invoiceID,
            credentials
          );
        }

        return NextResponse.json({
          received: true,
          xero: {
            invoiceId: xeroInvoice.invoices?.[0]?.invoiceID,
            invoiceNumber: xeroInvoice.invoices?.[0]?.invoiceNumber
          }
        });
      } catch (error) {
        console.error('Error processing Xero integration:', error);
        // Return 200 as we still processed the webhook
        return NextResponse.json({
          received: true,
          warning: 'Xero integration failed but webhook was processed'
        });
      }
    }

    // For other event types
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler failed:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed', details: error.message },
      { status: 500 }
    );
  }
} 