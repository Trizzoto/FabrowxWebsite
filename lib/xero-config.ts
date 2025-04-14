import { XeroClient } from 'xero-node';

// Initialize Xero client with permanent access using client credentials
const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID!,
  clientSecret: process.env.XERO_CLIENT_SECRET!,
  redirectUris: [process.env.XERO_REDIRECT_URI || 'https://fabrowx-website.vercel.app/api/xero/callback'],
  scopes: [
    'offline_access',
    'openid',
    'profile',
    'email',
    'accounting.transactions',
    'accounting.contacts',
    'accounting.settings',
    'accounting.reports.read',
    'accounting.journals.read',
    'accounting.attachments',
    'accounting.taxcodes',
    'accounting.taxrates',
    'accounting.currencies',
    'accounting.accounts',
    'accounting.banktransactions',
    'accounting.banktransfers',
    'accounting.bills',
    'accounting.creditnotes',
    'accounting.invoices',
    'accounting.items',
    'accounting.payments',
    'accounting.purchaseorders',
    'accounting.quotes',
    'accounting.receipts',
    'accounting.reports',
    'accounting.taxrates',
    'accounting.trackingcategories',
    'accounting.users',
    'accounting.organisation',
    'accounting.budgets',
    'accounting.batchpayments',
    'accounting.overpayments',
    'accounting.prepayments',
    'accounting.reports.tenninety',
    'accounting.reports.cashflow',
    'accounting.reports.profitandloss',
    'accounting.reports.balancesheet',
    'accounting.reports.trialbalance',
    'accounting.reports.agedpayables',
    'accounting.reports.agedreceivables',
    'accounting.reports.bankstatement',
    'accounting.reports.tax',
    'accounting.reports.trueup',
    'accounting.reports.gst',
    'accounting.reports.payroll',
    'accounting.reports.financial',
    'accounting.reports.budget',
    'accounting.reports.forecast',
    'accounting.reports.cashflow',
    'accounting.reports.profitandloss',
    'accounting.reports.balancesheet',
    'accounting.reports.trialbalance',
    'accounting.reports.agedpayables',
    'accounting.reports.agedreceivables',
    'accounting.reports.bankstatement',
    'accounting.reports.tax',
    'accounting.reports.trueup',
    'accounting.reports.gst',
    'accounting.reports.payroll',
    'accounting.reports.financial',
    'accounting.reports.budget',
    'accounting.reports.forecast'
  ]
});

// Function to get a valid token
export async function getValidToken() {
  try {
    // Check if we have a tenant ID
    if (!process.env.XERO_TENANT_ID) {
      throw new Error('XERO_TENANT_ID is not set');
    }

    // Get client credentials token
    const tokenSet = await xero.getClientCredentialsToken();
    
    return {
      accessToken: tokenSet.access_token,
      tenantId: process.env.XERO_TENANT_ID
    };
  } catch (error) {
    console.error('Error getting Xero token:', error);
    throw error;
  }
}

export { xero };

// Check required environment variables
if (!process.env.XERO_CLIENT_ID || !process.env.XERO_CLIENT_SECRET) {
  throw new Error('Missing required Xero credentials in environment variables');
}

// OAuth2 client for web authentication (if needed)
export const xeroClient = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID,
  clientSecret: process.env.XERO_CLIENT_SECRET,
  redirectUris: [process.env.XERO_REDIRECT_URI || 'https://fabrowx-website.vercel.app/api/xero/callback'],
  scopes: [
    'offline_access',
    'accounting.transactions',
    'accounting.contacts',
    'accounting.settings',
    'openid',
    'profile',
    'email'
  ],
  state: 'elite-fabworx',
  grantType: 'authorization_code'
});

export const getXeroAuthUrl = () => {
  return xeroClient.buildConsentUrl();
}; 