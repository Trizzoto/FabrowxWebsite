import { NextResponse } from 'next/server';
import { xero, getValidToken } from '@/lib/xero-config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Get valid token and tenant ID
    const { accessToken, tenantId } = await getValidToken();
    if (!tenantId) {
      throw new Error('Missing Xero tenant ID');
    }

    // Set the access token
    await xero.setTokenSet({
      access_token: accessToken,
      expires_in: 1800
    });

    // Try to list contacts
    const contacts = await xero.accountingApi.getContacts(tenantId);

    return NextResponse.json({
      success: true,
      contactCount: contacts.body.contacts?.length || 0,
      tenantId,
      hasAccessToken: !!accessToken
    });
  } catch (error) {
    console.error('Error testing Xero connection:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 