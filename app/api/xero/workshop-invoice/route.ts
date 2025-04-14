import { NextResponse } from 'next/server';
import { createXeroInvoice } from '@/lib/xero';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, items, orderId } = body;

    // Validate required fields
    if (!customer?.name || !customer?.email || !items?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create workshop invoice
    const order = {
      id: orderId || new Date().getTime().toString(),
      customer,
      items: items.map((item: any) => ({
        name: item.description,
        quantity: item.quantity,
        price: item.unitAmount,
      })),
    };

    const xeroInvoice = await createXeroInvoice(order, 'workshop');

    return NextResponse.json({
      success: true,
      invoiceId: xeroInvoice.invoices?.[0]?.invoiceID,
      invoiceNumber: xeroInvoice.invoices?.[0]?.invoiceNumber,
    });
  } catch (error) {
    console.error('Error creating workshop invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create workshop invoice' },
      { status: 500 }
    );
  }
} 