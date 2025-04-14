import { XeroClient } from 'xero-node';
import { cookies } from 'next/headers';
import { Invoice } from 'xero-node/dist/gen/model/accounting/invoice';
import { Contact } from 'xero-node/dist/gen/model/accounting/contact';
import { LineItem } from 'xero-node/dist/gen/model/accounting/lineItem';
import { Phone } from 'xero-node/dist/gen/model/accounting/phone';

// Initialize Xero client
export const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID!,
  clientSecret: process.env.XERO_CLIENT_SECRET!,
  redirectUris: [process.env.XERO_REDIRECT_URI!],
  scopes: ['accounting.transactions', 'accounting.contacts', 'accounting.settings'],
});

// Helper function to create a Xero invoice
export const createXeroInvoice = async (order: any, type: 'online' | 'workshop' = 'online', credentials?: { tenantId: string, accessToken: string, refreshToken: string }) => {
  try {
    console.log('Starting Xero invoice creation:', {
      orderId: order.id,
      type,
      hasCredentials: !!credentials,
      customerEmail: order.customer.email,
      itemCount: order.items.length
    });

    let tenantId: string | undefined;
    let accessToken: string | undefined;
    let refreshToken: string | undefined;

    if (credentials) {
      // Use provided credentials (for webhook)
      tenantId = credentials.tenantId;
      accessToken = credentials.accessToken;
      refreshToken = credentials.refreshToken;
      console.log('Using provided credentials:', {
        hasTenantId: !!tenantId,
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken
      });
    } else {
      // Get Xero credentials from cookies (for browser requests)
      const cookieStore = cookies();
      tenantId = cookieStore.get('xero_tenant_id')?.value;
      accessToken = cookieStore.get('xero_access_token')?.value;
      refreshToken = cookieStore.get('xero_refresh_token')?.value;
      console.log('Using cookie credentials:', {
        hasTenantId: !!tenantId,
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken
      });
    }

    if (!tenantId || !accessToken || !refreshToken) {
      console.error('Missing Xero credentials:', {
        hasTenantId: !!tenantId,
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken
      });
      throw new Error('Missing Xero credentials');
    }

    // Set the access token
    console.log('Setting Xero token set...');
    await xero.setTokenSet({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 1800
    });

    // First check if contact exists
    console.log('Checking for existing contact...');
    const existingContacts = await xero.accountingApi.getContacts(tenantId, undefined, `EmailAddress="${order.customer.email}"`);
    console.log('Contact search results:', {
      found: existingContacts.body.contacts && existingContacts.body.contacts.length > 0,
      contactCount: existingContacts.body.contacts?.length || 0
    });
    
    let contact: Contact;
    if (existingContacts.body.contacts && existingContacts.body.contacts.length > 0) {
      // Use existing contact
      contact = existingContacts.body.contacts[0];
      console.log('Using existing contact:', {
        contactId: contact.contactID,
        name: contact.name
      });
      // Update contact details if needed
      contact = {
        ...contact,
        name: order.customer.name,
        phones: [{ phoneNumber: order.customer.phone, phoneType: Phone.PhoneTypeEnum.MOBILE }],
      };
    } else {
      // Create new contact
      console.log('Creating new contact...');
      contact = {
        name: order.customer.name,
        emailAddress: order.customer.email,
        phones: [{ phoneNumber: order.customer.phone, phoneType: Phone.PhoneTypeEnum.MOBILE }],
        contactStatus: Contact.ContactStatusEnum.ACTIVE,
      };
    }

    console.log('Preparing line items...');
    const lineItems: LineItem[] = order.items.map((item: any) => ({
      description: item.name,
      quantity: item.quantity,
      unitAmount: item.price,
      accountCode: '200', // Sales account code
      taxType: 'OUTPUT', // GST on income
      tracking: [
        {
          name: 'Sales Channel',
          option: type === 'online' ? 'Online Store' : 'Workshop'
        }
      ]
    }));

    const reference = type === 'online' 
      ? `WEB-${order.id}` 
      : `WS-${order.id}`;

    console.log('Creating invoice with reference:', reference);
    const invoice: Invoice = {
      type: Invoice.TypeEnum.ACCREC,
      contact,
      lineItems,
      status: Invoice.StatusEnum.AUTHORISED,
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // Due in 14 days
      reference,
      brandingThemeID: type === 'online' ? process.env.XERO_ONLINE_THEME_ID : process.env.XERO_WORKSHOP_THEME_ID,
    };

    console.log('Sending invoice to Xero API...');
    const response = await xero.accountingApi.createInvoices(tenantId, {
      invoices: [invoice]
    });
    console.log('Invoice created successfully:', {
      invoiceId: response.body.invoices?.[0]?.invoiceID,
      invoiceNumber: response.body.invoices?.[0]?.invoiceNumber
    });
    return response.body;
  } catch (error) {
    console.error('Error creating Xero invoice:', error);
    throw error;
  }
};

// Helper function to sync payment with Xero
export const syncPaymentToXero = async (payment: any, invoiceId: string, credentials?: { tenantId: string, accessToken: string, refreshToken: string }) => {
  try {
    let tenantId: string | undefined;
    let accessToken: string | undefined;
    let refreshToken: string | undefined;

    if (credentials) {
      // Use provided credentials (for webhook)
      tenantId = credentials.tenantId;
      accessToken = credentials.accessToken;
      refreshToken = credentials.refreshToken;
    } else {
      // Get Xero credentials from cookies (for browser requests)
      const cookieStore = cookies();
      tenantId = cookieStore.get('xero_tenant_id')?.value;
      accessToken = cookieStore.get('xero_access_token')?.value;
      refreshToken = cookieStore.get('xero_refresh_token')?.value;
    }

    if (!tenantId || !accessToken || !refreshToken) {
      throw new Error('Missing Xero credentials');
    }

    // Set the access token
    await xero.setTokenSet({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 1800
    });

    const xeroPayment = {
      invoice: { invoiceID: invoiceId },
      account: { code: '090' }, // Bank account code
      amount: payment.amount,
      date: new Date().toISOString(),
      reference: payment.id,
    };

    const response = await xero.accountingApi.createPayment(tenantId, xeroPayment);
    return response.body;
  } catch (error) {
    console.error('Error syncing payment to Xero:', error);
    throw error;
  }
}; 