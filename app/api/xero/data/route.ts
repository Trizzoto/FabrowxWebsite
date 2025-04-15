import { NextResponse } from 'next/server';
import { xero } from '@/lib/xero-config';
import { cookies } from 'next/headers';
import { getValidToken } from '@/lib/xero-config';

export async function GET(request: Request) {
  try {
    console.log('Starting Xero data fetch...');
    
    // Get valid token and tenant ID
    const { accessToken, tenantId } = await getValidToken();
    if (!tenantId) {
      console.error('Missing Xero tenant ID');
      return NextResponse.json(
        { error: 'Not authenticated with Xero' },
        { status: 401 }
      );
    }

    // Set the access token
    console.log('Setting Xero token set...');
    await xero.setTokenSet({
      access_token: accessToken,
      expires_in: 1800
    });

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