import { XeroClient } from 'xero-node';

// Initialize Xero client
export const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID!,
  clientSecret: process.env.XERO_CLIENT_SECRET!,
  redirectUris: [process.env.XERO_REDIRECT_URI!],
  scopes: ['accounting.transactions', 'accounting.contacts', 'accounting.settings'],
});

// Helper function to create a Xero invoice
export const createXeroInvoice = async (order: any) => {
  try {
    const contact = {
      name: order.customer.name,
      emailAddress: order.customer.email,
      phones: [{ phoneNumber: order.customer.phone, phoneType: 'MOBILE' }],
    };

    const lineItems = order.items.map((item: any) => ({
      description: item.name,
      quantity: item.quantity,
      unitAmount: item.price,
      accountCode: '200', // Sales account code
      taxType: 'OUTPUT', // GST on income
    }));

    const invoice = {
      type: 'ACCREC',
      contact,
      lineItems,
      status: 'AUTHORISED',
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // Due in 14 days
      reference: order.id,
    };

    const response = await xero.accountingApi.createInvoice(process.env.XERO_TENANT_ID!, invoice);
    return response.body;
  } catch (error) {
    console.error('Error creating Xero invoice:', error);
    throw error;
  }
};

// Helper function to sync payment with Xero
export const syncPaymentToXero = async (payment: any, invoiceId: string) => {
  try {
    const xeroPayment = {
      invoice: { invoiceID: invoiceId },
      account: { code: '090' }, // Bank account code
      amount: payment.amount,
      date: new Date().toISOString(),
      reference: payment.id,
    };

    const response = await xero.accountingApi.createPayment(process.env.XERO_TENANT_ID!, xeroPayment);
    return response.body;
  } catch (error) {
    console.error('Error syncing payment to Xero:', error);
    throw error;
  }
}; 