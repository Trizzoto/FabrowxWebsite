import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { createXeroInvoice, syncPaymentToXero } from '@/lib/xero';

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
      
      // Log Xero environment variables with more detail
      console.log('Xero environment check:', {
        hasClientId: !!process.env.XERO_CLIENT_ID,
        hasClientSecret: !!process.env.XERO_CLIENT_SECRET,
        hasRedirectUri: !!process.env.XERO_REDIRECT_URI,
        hasTenantId: !!process.env.XERO_TENANT_ID,
        hasAccessToken: !!process.env.XERO_ACCESS_TOKEN,
        hasRefreshToken: !!process.env.XERO_REFRESH_TOKEN,
        hasScopes: !!process.env.XERO_SCOPES,
        redirectUri: process.env.XERO_REDIRECT_URI
      });
      
      // Add check for token before trying to create invoice
      try {
        // First check if we can get a valid token
        console.log('Checking for valid Xero token before creating invoice');
        const { getValidToken } = await import('@/lib/xero-config');
        try {
          const tokenCheck = await getValidToken();
          console.log('Valid Xero token available:', {
            hasToken: !!tokenCheck.accessToken,
            expiresIn: tokenCheck.expiresAt ? Math.floor((tokenCheck.expiresAt - Date.now()) / 1000) : 0
          });
        } catch (tokenError) {
          console.error('Error getting valid Xero token:', tokenError);
          // Continue anyway to see detailed errors
        }

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

        console.log('Creating Xero invoice with data:', JSON.stringify(order));

        // Add retry logic for Xero invoice creation
        let xeroInvoice: any = null;
        let retryCount = 0;
        const maxRetries = 3;
        
        while (retryCount < maxRetries) {
          try {
            // Create Xero invoice with retry
            console.log(`Xero invoice creation attempt ${retryCount + 1}/${maxRetries}`);
            xeroInvoice = await createXeroInvoice(order, 'online');
            console.log('Xero invoice creation response:', JSON.stringify(xeroInvoice));
            break; // Success, exit the loop
          } catch (invoiceError) {
            retryCount++;
            console.error(`Xero invoice creation attempt ${retryCount} failed:`, invoiceError);
            
            if (retryCount >= maxRetries) {
              console.error('All Xero invoice creation attempts failed');
              throw invoiceError; // Re-throw the error after all retries fail
            }
            
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
          }
        }
        
        if (xeroInvoice && xeroInvoice.invoices?.[0]?.invoiceID) {
          // Record the payment in Xero
          console.log('Recording payment in Xero for invoice:', xeroInvoice.invoices[0].invoiceID);
          const xeroPayment = await syncPaymentToXero(paymentIntent, xeroInvoice.invoices[0].invoiceID);
          console.log('Xero payment response:', JSON.stringify(xeroPayment));
          
          return new NextResponse(JSON.stringify({
            received: true,
            xero: {
              invoiceId: xeroInvoice.invoices[0].invoiceID,
              invoiceNumber: xeroInvoice.invoices[0].invoiceNumber,
              paymentId: xeroPayment.payments?.[0]?.paymentID
            }
          }), {
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0',
            }
          });
        } else {
          throw new Error('Failed to create Xero invoice: No invoice ID returned');
        }
      } catch (error) {
        console.error('Error processing Xero integration:', error);
        console.error('Error details:', error instanceof Error ? error.stack : 'No stack trace available');
        return new NextResponse(JSON.stringify({
          received: true,
          warning: 'Xero integration failed but webhook was processed',
          error: error instanceof Error ? error.message : 'Unknown error'
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