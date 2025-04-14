import { NextResponse } from 'next/server';
import { xero } from '@/lib/xero';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    console.log('Starting Xero data fetch...');
    const cookieStore = cookies();
    let accessToken = cookieStore.get('xero_access_token')?.value;
    const refreshToken = cookieStore.get('xero_refresh_token')?.value;
    const tenantId = cookieStore.get('xero_tenant_id')?.value;

    console.log('Checking Xero credentials:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      hasTenantId: !!tenantId
    });

    if (!refreshToken || !tenantId) {
      console.error('Missing required Xero credentials');
      return NextResponse.json(
        { error: 'Not authenticated with Xero' },
        { status: 401 }
      );
    }

    // If we don't have an access token but have a refresh token, try to refresh
    if (!accessToken && refreshToken) {
      console.log('Access token missing, attempting to refresh...');
      try {
        const response = await fetch('https://identity.xero.com/connect/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${process.env.XERO_CLIENT_ID}:${process.env.XERO_CLIENT_SECRET}`).toString('base64')}`
          },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
          })
        });

        if (!response.ok) {
          throw new Error(`Token refresh failed: ${response.status} ${response.statusText}`);
        }

        const tokenSet = await response.json();
        accessToken = tokenSet.access_token;

        // Update the access token cookie
        cookieStore.set('xero_access_token', tokenSet.access_token, {
          secure: true,
          httpOnly: true,
          sameSite: 'lax',
          maxAge: 60 * 30 // 30 minutes
        });

        console.log('Successfully refreshed access token');
      } catch (error) {
        console.error('Error refreshing token:', error);
        return NextResponse.json(
          { error: 'Failed to refresh Xero authentication' },
          { status: 401 }
        );
      }
    }

    // Set the access token
    console.log('Setting Xero token set...');
    await xero.setTokenSet({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 1800
    });

    // Get the connected tenants
    console.log('Getting connected tenants...');
    const tenants = await xero.updateTenants(false);
    if (!tenants || tenants.length === 0) {
      console.error('No Xero tenants found');
      return NextResponse.json(
        { error: 'No Xero tenants found' },
        { status: 401 }
      );
    }

    // Fetch contacts (customers)
    console.log('Fetching contacts...');
    const contactsResponse = await xero.accountingApi.getContacts(tenantId);
    const contacts = contactsResponse.body.contacts || [];
    console.log('Found contacts:', contacts.length);

    // Fetch invoices (orders)
    console.log('Fetching invoices...');
    const invoicesResponse = await xero.accountingApi.getInvoices(tenantId);
    const invoices = invoicesResponse.body.invoices || [];
    console.log('Found invoices:', invoices.length);

    // Format the data for the admin interface
    console.log('Formatting customers...');
    const formattedCustomers = contacts.map(contact => ({
      id: contact.contactID,
      name: contact.name,
      email: contact.emailAddress,
      phone: contact.phones?.[0]?.phoneNumber || '',
      address: contact.addresses?.[0]?.addressLine1 || '',
      city: contact.addresses?.[0]?.city || '',
      state: contact.addresses?.[0]?.region || '',
      postcode: contact.addresses?.[0]?.postalCode || '',
      country: contact.addresses?.[0]?.country || '',
      status: contact.contactStatus,
      lastUpdated: contact.updatedDateUTC,
    }));

    console.log('Formatting orders...');
    const formattedOrders = invoices.map(invoice => {
      // Determine if it's an online or workshop order
      const isOnline = invoice.reference?.startsWith('WEB-');
      const isWorkshop = invoice.reference?.startsWith('WS-');
      const type = isOnline ? 'online' : isWorkshop ? 'workshop' : 'other';
      
      // Calculate total amount
      const total = invoice.lineItems?.reduce((sum, item) => 
        sum + ((item.quantity || 0) * (item.unitAmount || 0)), 0) || 0;
      
      const order = {
        id: invoice.invoiceID,
        reference: invoice.invoiceNumber,
        customer: invoice.contact?.name || 'Unknown',
        email: invoice.contact?.emailAddress || '',
        date: invoice.date,
        dueDate: invoice.dueDate,
        status: invoice.status,
        type,
        total,
        items: invoice.lineItems?.map(item => ({
          name: item.description || '',
          quantity: item.quantity || 0,
          price: item.unitAmount || 0,
        })) || [],
      };

      console.log('Formatted order:', {
        id: order.id,
        reference: order.reference,
        type: order.type,
        status: order.status
      });

      return order;
    });

    console.log('Returning formatted data:', {
      customerCount: formattedCustomers.length,
      orderCount: formattedOrders.length
    });

    return NextResponse.json({
      customers: formattedCustomers,
      orders: formattedOrders,
    });
  } catch (error) {
    console.error('Error fetching Xero data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Xero' },
      { status: 500 }
    );
  }
} 