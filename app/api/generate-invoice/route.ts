import { NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { orderNumber, customerInfo, items, total, date } = data;

    // Create a new PDF document
    const doc = new jsPDF();
    
    // Set initial y position
    let y = 20;
    
    // Add company header
    doc.setFontSize(20);
    doc.text('Elite Fabworx', doc.internal.pageSize.width - 20, y, { align: 'right' });
    y += 10;
    doc.setFontSize(10);
    doc.text('ABN: YOUR-ABN-HERE', doc.internal.pageSize.width - 20, y, { align: 'right' });
    y += 20;

    // Add invoice details
    doc.setFontSize(16);
    doc.text('INVOICE', doc.internal.pageSize.width / 2, y, { align: 'center' });
    y += 10;
    doc.setFontSize(12);
    doc.text(`Invoice Number: ${orderNumber}`, 20, y);
    y += 7;
    doc.text(`Date: ${new Date(date).toLocaleDateString()}`, 20, y);
    y += 15;

    // Add customer details
    doc.text('Bill To:', 20, y);
    y += 7;
    doc.text(customerInfo.name, 20, y);
    y += 7;
    doc.text(customerInfo.email, 20, y);
    y += 7;
    doc.text(customerInfo.phone, 20, y);
    y += 7;
    doc.text(customerInfo.address.street, 20, y);
    y += 7;
    doc.text(`${customerInfo.address.city}, ${customerInfo.address.state} ${customerInfo.address.postcode}`, 20, y);
    y += 7;
    doc.text(customerInfo.address.country, 20, y);
    y += 15;

    // Add items table
    doc.setFontSize(12);
    doc.text('Items:', 20, y);
    y += 10;

    // Table headers
    const columns = ['Description', 'Quantity', 'Price', 'Amount'];
    const columnPositions = [20, 120, 150, 180];
    
    columns.forEach((column, index) => {
      doc.text(column, columnPositions[index], y);
    });
    y += 7;

    // Table content
    items.forEach((item: any) => {
      doc.text(item.name, columnPositions[0], y);
      doc.text(item.quantity.toString(), columnPositions[1], y);
      doc.text(`$${item.price.toFixed(2)}`, columnPositions[2], y);
      doc.text(`$${(item.price * item.quantity).toFixed(2)}`, columnPositions[3], y);
      y += 7;
    });

    y += 10;

    // Add totals
    doc.text(`Subtotal: $${total.toFixed(2)}`, doc.internal.pageSize.width - 20, y, { align: 'right' });
    y += 7;
    doc.text('Shipping: Free', doc.internal.pageSize.width - 20, y, { align: 'right' });
    y += 7;
    doc.text(`Total: $${total.toFixed(2)}`, doc.internal.pageSize.width - 20, y, { align: 'right' });
    y += 20;

    // Add footer
    doc.setFontSize(10);
    doc.text('Thank you for your business!', doc.internal.pageSize.width / 2, y, { align: 'center' });
    y += 7;
    doc.text('Elite Fabworx - Your Performance Vehicle Specialist', doc.internal.pageSize.width / 2, y, { align: 'center' });

    // Get the PDF as an array buffer
    const pdfBuffer = doc.output('arraybuffer');

    // Return the PDF as a response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${orderNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
} 