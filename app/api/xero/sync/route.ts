import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { xero, getValidToken } from '@/lib/xero-config';

export async function POST() {
  try {
    // Get valid token instead of using cookies directly
    const { accessToken, refreshToken, tenantId } = await getValidToken();
    
    if (!accessToken || !refreshToken || !tenantId) {
      return NextResponse.json(
        { error: 'Not authenticated with Xero' },
        { status: 401 }
      );
    }

    // Use xero instead of xeroClient
    await xero.setTokenSet({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 1800
    });

    // No need to get tenants, we already have tenantId from getValidToken
    
    // Get all contacts
    const contacts = await xero.accountingApi.getContacts(tenantId);

    // Get recent invoices
    const invoices = await xero.accountingApi.getInvoices(tenantId);

    // You can add more sync operations here

    return NextResponse.json({
      message: 'Sync completed successfully',
      summary: {
        contacts: contacts.body.contacts?.length || 0,
        invoices: invoices.body.invoices?.length || 0
      }
    });
  } catch (error) {
    console.error('Error syncing with Xero:', error);
    return NextResponse.json(
      { error: 'Failed to sync with Xero' },
      { status: 500 }
    );
  }
} 