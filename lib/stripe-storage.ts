import 'server-only';
import { cookies } from 'next/headers';

interface StripeCredentials {
  accountId: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number; // Unix timestamp
}

export function saveStripeCredentials(credentials: StripeCredentials) {
  try {
    const cookieStore = cookies();
    
    cookieStore.set('stripe_account_id', credentials.accountId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    
    cookieStore.set('stripe_access_token', credentials.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    
    if (credentials.refreshToken) {
      cookieStore.set('stripe_refresh_token', credentials.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }
    
    cookieStore.set('stripe_expires_at', credentials.expiresAt.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  } catch (error) {
    console.error('Error saving Stripe credentials:', error);
  }
}

export function getStripeCredentials(): StripeCredentials | null {
  try {
    const cookieStore = cookies();
    
    const accountId = cookieStore.get('stripe_account_id')?.value;
    const accessToken = cookieStore.get('stripe_access_token')?.value;
    const refreshToken = cookieStore.get('stripe_refresh_token')?.value;
    const expiresAt = cookieStore.get('stripe_expires_at')?.value;
    
    if (!accountId || !accessToken || !expiresAt) {
      // Fall back to env variables if cookies not set
      const envAccountId = process.env.STRIPE_ACCOUNT_ID;
      const envAccessToken = process.env.STRIPE_SECRET_KEY;
      const envExpiresAt = process.env.STRIPE_EXPIRES_AT || '0';
      
      if (envAccountId && envAccessToken) {
        return {
          accountId: envAccountId,
          accessToken: envAccessToken,
          expiresAt: parseInt(envExpiresAt),
        };
      }
      
      return null;
    }
    
    return {
      accountId,
      accessToken,
      refreshToken,
      expiresAt: parseInt(expiresAt),
    };
  } catch (error) {
    console.error('Error reading Stripe credentials:', error);
    return null;
  }
}

export function clearStripeCredentials() {
  try {
    const cookieStore = cookies();
    cookieStore.delete('stripe_account_id');
    cookieStore.delete('stripe_access_token');
    cookieStore.delete('stripe_refresh_token');
    cookieStore.delete('stripe_expires_at');
  } catch (error) {
    console.error('Error clearing Stripe credentials:', error);
  }
} 