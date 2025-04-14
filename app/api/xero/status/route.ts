import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('xero_access_token');
  const refreshToken = cookieStore.get('xero_refresh_token');

  return NextResponse.json({
    connected: !!(accessToken && refreshToken)
  });
} 