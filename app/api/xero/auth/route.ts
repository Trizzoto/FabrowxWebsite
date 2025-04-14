import { NextResponse } from 'next/server';
import { xeroClient } from '@/lib/xero-config';

export async function GET(request: Request) {
  try {
    // Get the consent URL from Xero
    const consentUrl = await xeroClient.buildConsentUrl();
    
    // Ensure the redirect_uri matches our environment variable
    const finalUrl = new URL(consentUrl);
    finalUrl.searchParams.set('redirect_uri', process.env.XERO_REDIRECT_URI!);
    
    // Log the URL for debugging
    console.log('Generated Xero consent URL:', finalUrl.toString());
    
    // Return the URL directly
    return NextResponse.redirect(finalUrl);
  } catch (error) {
    console.error('Error generating Xero auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate authentication URL' },
      { status: 500 }
    );
  }
} 