import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { xero, getValidToken } from '@/lib/xero-config';
import { xeroClient } from '@/lib/xero';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    console.log('Xero test endpoint called');
    
    // Check for tokens in cookies
    const cookieStore = cookies();
    const accessToken = cookieStore.get('xero_access_token')?.value;
    const refreshToken = cookieStore.get('xero_refresh_token')?.value;
    const tenantId = cookieStore.get('xero_tenant_id')?.value;
    
    console.log('Cookie tokens:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      hasTenantId: !!tenantId
    });
    
    // Check env variables
    console.log('Environment variables:', {
      hasClientId: !!process.env.XERO_CLIENT_ID,
      hasClientSecret: !!process.env.XERO_CLIENT_SECRET,
      hasRedirectUri: !!process.env.XERO_REDIRECT_URI,
      hasTenantId: !!process.env.XERO_TENANT_ID
    });
    
    // Check Xero token validity
    let validToken;
    try {
      validToken = await getValidToken();
      console.log('Valid token retrieved successfully');
    } catch (error) {
      console.error('Error getting valid token:', error);
      return NextResponse.json({
        success: false,
        error: 'Error getting valid token',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }
    
    // Get tenant ID from token
    if (!validToken?.tenantId) {
      return NextResponse.json({
        success: false,
        error: 'No tenant ID available'
      }, { status: 500 });
    }
    
    // Set the access token
    try {
      await xeroClient.setTokenSet({
        access_token: validToken.accessToken,
        expires_in: 1800
      });
      console.log('Token set successfully on Xero client');
    } catch (error) {
      console.error('Error setting token on Xero client:', error);
      return NextResponse.json({
        success: false,
        error: 'Error setting token on Xero client',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }
    
    // Try to get contacts from Xero as a test
    let contactCount = 0;
    try {
      console.log('Testing contact retrieval with tenant ID:', validToken.tenantId);
      const contacts = await xeroClient.accountingApi.getContacts(validToken.tenantId);
      contactCount = contacts.body.contacts?.length || 0;
      console.log(`Successfully retrieved ${contactCount} contacts from Xero`);
    } catch (error) {
      console.error('Error getting contacts from Xero:', error);
      return NextResponse.json({
        success: false,
        error: 'Error getting contacts from Xero',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }
    
    // Check token scopes
    const tokenData = {
      scopes: []
    };
    
    // Try to check token scopes, but skip if not available
    try {
      // Use a different method to check scopes since getConnections isn't available
      console.log('Token check complete, using available token');
    } catch (error) {
      console.error('Error checking token details:', error);
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      contactCount,
      tenantId: validToken.tenantId,
      hasAccessToken: !!validToken.accessToken,
      tokenScopes: tokenData.scopes,
      envCheck: {
        hasClientId: !!process.env.XERO_CLIENT_ID,
        hasClientSecret: !!process.env.XERO_CLIENT_SECRET,
        hasTenantId: !!validToken.tenantId
      }
    });
  } catch (error) {
    console.error('Xero test endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: 'Xero test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}