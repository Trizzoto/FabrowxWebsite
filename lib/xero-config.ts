import { XeroClient } from 'xero-node';

if (!process.env.XERO_CLIENT_ID || !process.env.XERO_CLIENT_SECRET || !process.env.XERO_REDIRECT_URI) {
  throw new Error('Missing required Xero credentials in environment variables');
}

export const xeroClient = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID,
  clientSecret: process.env.XERO_CLIENT_SECRET,
  redirectUris: [process.env.XERO_REDIRECT_URI],
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