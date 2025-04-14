import { XeroClient } from 'xero-node';
import { cookies } from 'next/headers';
import { Invoice } from 'xero-node/dist/gen/model/accounting/invoice';
import { Contact } from 'xero-node/dist/gen/model/accounting/contact';
import { LineItem } from 'xero-node/dist/gen/model/accounting/lineItem';
import { Phone } from 'xero-node/dist/gen/model/accounting/phone';
import { saveXeroCredentials } from '@/lib/xero-storage';
import { xero, getValidToken } from './xero-config';

// Initialize Xero client
export const xeroClient = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID!,
  clientSecret: process.env.XERO_CLIENT_SECRET!,
  redirectUris: [process.env.XERO_REDIRECT_URI!],
  scopes: ['accounting.transactions', 'accounting.contacts', 'accounting.settings'],
});

// Helper function to refresh tokens if needed
async function ensureValidToken(credentials: { tenantId: string, accessToken: string, refreshToken: string, expiresAt?: number }) {
  try {
    // Check if token is expired or will expire in the next 5 minutes
    const isExpired = !credentials.expiresAt || Date.now() >= (credentials.expiresAt - 5 * 60 * 1000);
    
    if (isExpired) {
      console.log('Token expired or expiring soon, refreshing...');
      
      // Set the current token set
      await xeroClient.setTokenSet({
        access_token: credentials.accessToken,
        refresh_token: credentials.refreshToken,
        expires_in: credentials.expiresAt ? Math.floor((credentials.expiresAt - Date.now()) / 1000) : 1800
      });
      
      // Refresh the token
      const newTokenSet = await xeroClient.refreshToken();
      
      if (!newTokenSet.access_token || !newTokenSet.refresh_token || !newTokenSet.expires_in) {
        throw new Error('Invalid token set received from Xero');
      }
      
      // Calculate new expiry
      const expiresAt = Date.now() + (newTokenSet.expires_in * 1000);
      
      // Save the new credentials
      await saveXeroCredentials({
        tenantId: credentials.tenantId,
        accessToken: newTokenSet.access_token,
        refreshToken: newTokenSet.refresh_token,
        expiresAt
      });
      
      // Update the credentials object
      credentials.accessToken = newTokenSet.access_token;
      credentials.refreshToken = newTokenSet.refresh_token;
      credentials.expiresAt = expiresAt;
      
      console.log('Token refreshed successfully');
    }
    
    return credentials;
  } catch (error) {
    console.error('Error refreshing Xero token:', error);
    throw error;
  }
}

// Helper function to create a Xero invoice
export const createXeroInvoice = async (order: any, type: 'online' | 'workshop' = 'online') => {
  try {
    console.log('Starting Xero invoice creation:', {
      orderId: order.id,
      type,
      customerEmail: order.customer.email,
      itemCount: order.items.length
    });

    // Get valid token and tenant ID
    const { accessToken, tenantId } = await getValidToken();
    if (!tenantId) {
      throw new Error('Missing Xero tenant ID');
    }

    // Set the access token
    console.log('Setting Xero token...');
    await xeroClient.setTokenSet({
      access_token: accessToken,
      expires_in: 1800
    });

    // First check if contact exists
    console.log('Checking for existing contact...');
    const existingContacts = await xeroClient.accountingApi.getContacts(tenantId, undefined, `EmailAddress="${order.customer.email}"`);
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
    const response = await xeroClient.accountingApi.createInvoices(tenantId, {
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
export const syncPaymentToXero = async (payment: any, invoiceId: string) => {
  try {
    // Get valid token and tenant ID
    const { accessToken, tenantId } = await getValidToken();
    if (!tenantId) {
      throw new Error('Missing Xero tenant ID');
    }

    // Set the access token
    await xeroClient.setTokenSet({
      access_token: accessToken,
      expires_in: 1800
    });

    const xeroPayment = {
      invoice: { invoiceID: invoiceId },
      account: { code: '090' }, // Bank account code
      amount: payment.amount,
      date: new Date().toISOString(),
      reference: payment.id,
    };

    const response = await xeroClient.accountingApi.createPayment(tenantId, xeroPayment);
    return response.body;
  } catch (error) {
    console.error('Error syncing payment to Xero:', error);
    throw error;
  }
}; 