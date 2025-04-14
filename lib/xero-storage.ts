import fs from 'fs';
import path from 'path';

const CREDENTIALS_FILE = path.join(process.cwd(), 'xero-credentials.json');

interface XeroCredentials {
  tenantId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export function saveXeroCredentials(credentials: XeroCredentials) {
  fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2));
}

export function getXeroCredentials(): XeroCredentials | null {
  try {
    if (fs.existsSync(CREDENTIALS_FILE)) {
      const data = fs.readFileSync(CREDENTIALS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading Xero credentials:', error);
  }
  return null;
}

export function clearXeroCredentials() {
  try {
    if (fs.existsSync(CREDENTIALS_FILE)) {
      fs.unlinkSync(CREDENTIALS_FILE);
    }
  } catch (error) {
    console.error('Error clearing Xero credentials:', error);
  }
} 