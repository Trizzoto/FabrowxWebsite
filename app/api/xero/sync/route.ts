import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { xeroClient } from '@/lib/xero-config';

export async function POST() {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('xero_access_token')?.value;
    const refreshToken = cookieStore.get('xero_refresh_token')?.value;

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: 'Not authenticated with Xero' },
        { status: 401 }
      );
    }

    // Set the access token
    await xeroClient.setTokenSet({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 1800
    });

    // Get the connected tenants
    const tenants = await xeroClient.updateTenants(false);
    
    if (!tenants || tenants.length === 0) {
      return NextResponse.json(
        { error: 'No Xero organizations found' },
        { status: 400 }
      );
    }

    // Use the first tenant
    const tenantId = tenants[0].tenantId;

    // Get all contacts
    const contacts = await xeroClient.accountingApi.getContacts(tenantId);

    // Get recent invoices
    const invoices = await xeroClient.accountingApi.getInvoices(tenantId);

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