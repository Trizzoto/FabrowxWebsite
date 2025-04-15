import fs from 'fs';
import path from 'path';

interface XeroCredentials {
  tenantId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt?: number;
}

const TOKENS_FILE = path.join(process.cwd(), 'xero-tokens.json');

export function saveXeroCredentials(credentials: XeroCredentials) {
  try {
    // Save to file
    fs.writeFileSync(TOKENS_FILE, JSON.stringify(credentials, null, 2));
    console.log('Xero credentials saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving Xero credentials:', error);
    return false;
  }
}

export function getXeroCredentials(): XeroCredentials | null {
  try {
    // Check if file exists
    if (!fs.existsSync(TOKENS_FILE)) {
      // If no file exists, try to use environment variables
      const envCredentials = {
        tenantId: process.env.XERO_TENANT_ID,
        accessToken: process.env.XERO_ACCESS_TOKEN,
        refreshToken: process.env.XERO_REFRESH_TOKEN,
        expiresAt: process.env.XERO_TOKEN_EXPIRY ? parseInt(process.env.XERO_TOKEN_EXPIRY) : undefined
      };

      // If we have the minimum required credentials in env vars, use those
      if (envCredentials.tenantId && envCredentials.accessToken && envCredentials.refreshToken) {
        return envCredentials as XeroCredentials;
      }

      return null;
    }

    // Read from file
    const data = fs.readFileSync(TOKENS_FILE, 'utf8');
    return JSON.parse(data) as XeroCredentials;
  } catch (error) {
    console.error('Error reading Xero credentials:', error);
    return null;
  }
}

export function clearXeroCredentials() {
  try {
    if (fs.existsSync(TOKENS_FILE)) {
      fs.unlinkSync(TOKENS_FILE);
    }
    return true;
  } catch (error) {
    console.error('Error clearing Xero credentials:', error);
    return false;
  }
} 