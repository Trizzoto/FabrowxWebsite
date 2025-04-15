import { NextResponse } from 'next/server';
import { xero, getValidToken } from '@/lib/xero-config';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { XeroClient } from 'xero-node';

interface XeroJwtPayload extends jwt.JwtPayload {
  scope?: string[];
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Log environment variables state
    console.log('Environment variables check:', {
      hasClientId: !!process.env.XERO_CLIENT_ID,
      hasClientSecret: !!process.env.XERO_CLIENT_SECRET,
      hasTenantId: !!process.env.XERO_TENANT_ID
    });

    // Check cookie state
    const cookieStore = cookies();
    const cookieState = {
      hasAccessToken: !!cookieStore.get('xero_access_token'),
      hasRefreshToken: !!cookieStore.get('xero_refresh_token'),
      hasTenantId: !!cookieStore.get('xero_tenant_id'),
      hasExpiry: !!cookieStore.get('xero_token_expiry'),
      currentTime: new Date().toISOString()
    };
    console.log('Cookie state:', cookieState);
    
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
    const decodedToken = jwt.decode(accessToken) as XeroJwtPayload;
    
    if (!decodedToken) {
      throw new Error('Failed to decode JWT token');
    }

    // Log token details
    console.log('Token details:', {
      hasScope: !!decodedToken.scope,
      scopePreview: decodedToken.scope?.join(', ') || 'No scopes',
      accessTokenLength: accessToken.length,
      accessTokenPreview: accessToken.substring(0, 10) + '...'
    });

    // Check if we have the required scope
    if (!decodedToken.scope || !decodedToken.scope.includes('accounting.contacts')) {
      console.error('Missing required scope:', {
        requiredScope: 'accounting.contacts',
        currentScopes: decodedToken.scope
      });
      throw new Error('Token does not have the required scope: accounting.contacts');
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

    // Initialize Xero client
    const xero = new XeroClient();
    await xero.setTokenSet({
      access_token: accessToken,
      expires_in: 1800
    });

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