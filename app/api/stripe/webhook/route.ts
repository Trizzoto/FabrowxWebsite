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
  console.log('Webhook received');
  const body = await request.text();
  const signature = headers().get('stripe-signature')!;

  console.log('Webhook signature:', {
    hasSignature: !!signature,
    signatureLength: signature?.length
  });

  try {
    // Verify webhook signature
    console.log('Verifying webhook signature...');
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

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
        customer: paymentIntent.customer
      });
      
      try {
        // Get Xero credentials from storage
        console.log('Getting Xero credentials from storage...');
        const credentials = getXeroCredentials();
        console.log('Retrieved Xero credentials:', {
          hasCredentials: !!credentials,
          hasTenantId: !!credentials?.tenantId,
          hasAccessToken: !!credentials?.accessToken,
          hasRefreshToken: !!credentials?.refreshToken,
          expiresAt: credentials?.expiresAt
        });

        if (!credentials) {
          console.error('Missing Xero credentials in storage');
          return NextResponse.json({ received: true });
        }

        // Check if credentials are expired
        if (Date.now() > credentials.expiresAt) {
          console.error('Xero credentials have expired');
          return NextResponse.json({ received: true });
        }

        // Set the access token
        console.log('Setting Xero token set...');
        await xero.setTokenSet({
          access_token: credentials.accessToken,
          refresh_token: credentials.refreshToken,
          expires_in: Math.floor((credentials.expiresAt - Date.now()) / 1000)
        });

        // Create order object from payment metadata
        console.log('Creating order object from payment metadata...');
        const order = {
          id: paymentIntent.id,
          customer: {
            name: paymentIntent.metadata.customer_name,
            email: paymentIntent.metadata.customer_email,
            phone: paymentIntent.metadata.customer_phone,
          },
          items: JSON.parse(paymentIntent.metadata.items),
        };

        console.log('Order object created:', {
          id: order.id,
          customerName: order.customer.name,
          customerEmail: order.customer.email,
          itemCount: order.items.length
        });

        // Create Xero invoice
        console.log('Creating Xero invoice...');
        const xeroInvoice = await createXeroInvoice(order, 'online', {
          tenantId: credentials.tenantId,
          accessToken: credentials.accessToken,
          refreshToken: credentials.refreshToken
        });
        
        console.log('Created Xero invoice:', {
          invoiceId: xeroInvoice.invoices?.[0]?.invoiceID,
          invoiceNumber: xeroInvoice.invoices?.[0]?.invoiceNumber
        });

        // Sync payment to Xero
        if (xeroInvoice.invoices?.[0]?.invoiceID) {
          console.log('Syncing payment to Xero...');
          await syncPaymentToXero({
            id: paymentIntent.id,
            amount: paymentIntent.amount / 100, // Convert cents to dollars
          }, xeroInvoice.invoices[0].invoiceID, {
            tenantId: credentials.tenantId,
            accessToken: credentials.accessToken,
            refreshToken: credentials.refreshToken
          });
          console.log('Payment synced to Xero');
        }

        console.log('Successfully created and paid Xero invoice:', xeroInvoice.invoices?.[0]?.invoiceID);
      } catch (error) {
        console.error('Error processing Xero integration:', error);
        // Don't throw here - we still want to acknowledge the webhook
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