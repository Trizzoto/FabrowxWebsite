import { cookies } from 'next/headers';

interface XeroCredentials {
  tenantId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export function saveXeroCredentials(credentials: XeroCredentials) {
  const cookieStore = cookies();
  
  cookieStore.set('xero_tenant_id', credentials.tenantId, {
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30 // 30 days
  });
  
  cookieStore.set('xero_access_token', credentials.accessToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 30 // 30 minutes
  });
  
  cookieStore.set('xero_refresh_token', credentials.refreshToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30 // 30 days
  });
  
  cookieStore.set('xero_expires_at', credentials.expiresAt.toString(), {
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30 // 30 days
  });
}

export function getXeroCredentials(): XeroCredentials | null {
  try {
    // First try to get from cookies
    const cookieStore = cookies();
    const tenantId = cookieStore.get('xero_tenant_id')?.value;
    const accessToken = cookieStore.get('xero_access_token')?.value;
    const refreshToken = cookieStore.get('xero_refresh_token')?.value;
    const expiresAt = cookieStore.get('xero_expires_at')?.value;
    
    // If cookies are available, use them
    if (tenantId && accessToken && refreshToken && expiresAt) {
      return {
        tenantId,
        accessToken,
        refreshToken,
        expiresAt: parseInt(expiresAt, 10)
      };
    }
    
    // Fallback to environment variables (for webhook context)
    const envTenantId = process.env.XERO_TENANT_ID;
    const envAccessToken = process.env.XERO_ACCESS_TOKEN;
    const envRefreshToken = process.env.XERO_REFRESH_TOKEN;
    const envExpiresAt = process.env.XERO_EXPIRES_AT;
    
    if (!envTenantId || !envAccessToken || !envRefreshToken || !envExpiresAt) {
      return null;
    }
    
    return {
      tenantId: envTenantId,
      accessToken: envAccessToken,
      refreshToken: envRefreshToken,
      expiresAt: parseInt(envExpiresAt, 10)
    };
  } catch (error) {
    console.error('Error reading Xero credentials:', error);
    return null;
  }
}

export function clearXeroCredentials() {
  try {
    const cookieStore = cookies();
    cookieStore.delete('xero_tenant_id');
    cookieStore.delete('xero_access_token');
    cookieStore.delete('xero_refresh_token');
    cookieStore.delete('xero_expires_at');
  } catch (error) {
    console.error('Error clearing Xero credentials:', error);
  }
} 