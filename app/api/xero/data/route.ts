import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Xero integration temporarily disabled',
    status: 'maintenance'
  }, { status: 503 });
}

export async function POST() {
  return NextResponse.json({ 
    message: 'Xero integration temporarily disabled',
    status: 'maintenance'
  }, { status: 503 });
} 