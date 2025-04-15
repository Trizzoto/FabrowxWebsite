import { XeroClient } from 'xero-node';
import { writeFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SCOPES = [
  'offline_access',
  'openid',
  'profile',
  'email',
  'accounting.transactions',
  'accounting.contacts',
  'accounting.settings'
];

async function setupXero() {
  try {
    // Initialize Xero client
    const xero = new XeroClient({
      clientId: process.env.XERO_CLIENT_ID!,
      clientSecret: process.env.XERO_CLIENT_SECRET!,
      redirectUris: [process.env.XERO_REDIRECT_URI || 'http://localhost:3000/api/xero/callback'],
      scopes: SCOPES,
      state: 'elite-fabworx'
    });

    // Get the consent URL
    const consentUrl = await xero.buildConsentUrl();
    console.log('\n1. Visit this URL in your browser to authorize the application:');
    console.log(consentUrl);
    console.log('\n2. After authorization, you will be redirected. Copy the full URL and paste it below.');

    // Read the redirect URL from stdin
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question('\nEnter the redirect URL: ', async (redirectUrl: string) => {
      try {
        // Extract the authorization code from the URL
        const url = new URL(redirectUrl);
        const code = url.searchParams.get('code');

        if (!code) {
          throw new Error('No authorization code found in redirect URL');
        }

        // Exchange the code for tokens
        const tokenSet = await xero.apiCallback(redirectUrl);
        
        // Get the tenant ID
        const tenants = await xero.updateTenants(false);
        const tenantId = tenants[0].tenantId;

        // Create the permanent tokens configuration
        const config = {
          XERO_TENANT_ID: tenantId,
          XERO_ACCESS_TOKEN: tokenSet.access_token,
          XERO_REFRESH_TOKEN: tokenSet.refresh_token,
          XERO_TOKEN_EXPIRY: Date.now() + (tokenSet.expires_in || 1800) * 1000
        };

        // Save to .env.local
        const envPath = join(process.cwd(), '.env.local');
        const envContent = Object.entries(config)
          .map(([key, value]) => `${key}=${value}`)
          .join('\n');

        writeFileSync(envPath, envContent, { flag: 'a' });

        console.log('\n✅ Xero permanent tokens have been set up successfully!');
        console.log('The tokens have been added to your .env.local file.');
        console.log('\nMake sure to add these environment variables to your production environment.');
      } catch (error) {
        console.error('Error setting up Xero tokens:', error);
      } finally {
        readline.close();
      }
    });
  } catch (error) {
    console.error('Error initializing Xero setup:', error);
  }
}

setupXero(); 