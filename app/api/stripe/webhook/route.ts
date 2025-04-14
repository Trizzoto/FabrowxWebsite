import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { createXeroInvoice, syncPaymentToXero } from '@/lib/xero';
import { xero } from '@/lib/xero';
import { getXeroCredentials } from '@/lib/xero-storage';

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
          return new NextResponse(JSON.stringify({ 
            received: true,
            warning: 'Xero integration skipped - missing credentials'
          }), {
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0',
            }
          });
        }

        if (Date.now() > credentials.expiresAt) {
          console.error('Xero credentials have expired');
          return new NextResponse(JSON.stringify({ 
            received: true,
            warning: 'Xero integration skipped - expired credentials'
          }), {
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0',
            }
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

        return new NextResponse(JSON.stringify({
          received: true,
          xero: {
            invoiceId: xeroInvoice.invoices?.[0]?.invoiceID,
            invoiceNumber: xeroInvoice.invoices?.[0]?.invoiceNumber
          }
        }), {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          }
        });
      } catch (error) {
        console.error('Error processing Xero integration:', error);
        return new NextResponse(JSON.stringify({
          received: true,
          warning: 'Xero integration failed but webhook was processed'
        }), {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          }
        });
      }
    }

    // For other event types
    return new NextResponse(JSON.stringify({ received: true }), {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (err) {
    console.error('Webhook handler failed:', err);
    const error = err as Error;
    return new NextResponse(JSON.stringify({ 
      received: true,
      error: 'Webhook handler failed',
      details: error?.message || 'Unknown error'
    }), {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  }
} 