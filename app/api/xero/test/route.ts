import { NextResponse } from 'next/server';
import { xero, getValidToken } from '@/lib/xero-config';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    console.log('Starting Xero test with environment variables:', {
      hasClientId: !!process.env.XERO_CLIENT_ID,
      hasClientSecret: !!process.env.XERO_CLIENT_SECRET,
      hasTenantId: !!process.env.XERO_TENANT_ID,
      clientIdPreview: process.env.XERO_CLIENT_ID?.substring(0, 8),
      tenantId: process.env.XERO_TENANT_ID
    });

    // Get valid token and tenant ID
    console.log('Getting valid token...');
    const { accessToken, tenantId } = await getValidToken();
    
    if (!accessToken) {
      throw new Error('Failed to get access token from Xero');
    }
    
    // Decode the JWT token to check scopes
    const decodedToken = jwt.decode(accessToken);
    console.log('Token details:', {
      decodedToken,
      scope: decodedToken?.scope,
      hasAccountingContacts: decodedToken?.scope?.includes('accounting.contacts'),
      tokenPreview: accessToken?.substring(0, 20) + '...',
      tokenLength: accessToken?.length
    });
    
    if (!decodedToken?.scope?.includes('accounting.contacts')) {
      console.error('Token missing required accounting.contacts scope');
      throw new Error('Token missing required accounting.contacts scope. Please reconnect to Xero with the correct scopes.');
    }

    console.log('Got token response:', {
      hasAccessToken: !!accessToken,
      hasTenantId: !!tenantId,
      accessTokenPreview: accessToken?.substring(0, 20),
      tenantId,
      tokenScopes: decodedToken?.scope
    });

    if (!tenantId) {
      throw new Error('Missing Xero tenant ID');
    }

    // Set the access token
    console.log('Setting token set...');
    await xero.setTokenSet({
      access_token: accessToken,
      expires_in: 1800
    });
    console.log('Token set successfully');

    // Try to list contacts
    console.log('Listing contacts...');
    const contacts = await xero.accountingApi.getContacts(tenantId);
    console.log('Got contacts response:', {
      hasContacts: !!contacts.body.contacts,
      contactCount: contacts.body.contacts?.length || 0
    });

    return NextResponse.json({
      success: true,
      contactCount: contacts.body.contacts?.length || 0,
      tenantId,
      hasAccessToken: !!accessToken,
      tokenScopes: decodedToken?.scope,
      envCheck: {
        hasClientId: !!process.env.XERO_CLIENT_ID,
        hasClientSecret: !!process.env.XERO_CLIENT_SECRET,
        hasTenantId: !!process.env.XERO_TENANT_ID
      }
    });
  } catch (error) {
    console.error('Error testing Xero connection:', error);
    const errorDetail = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause
    } : error;
    console.error('Detailed error:', JSON.stringify(errorDetail, null, 2));
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorDetail,
      envCheck: {
        hasClientId: !!process.env.XERO_CLIENT_ID,
        hasClientSecret: !!process.env.XERO_CLIENT_SECRET,
        hasTenantId: !!process.env.XERO_TENANT_ID
      }
    }, { status: 500 });
  }
} 