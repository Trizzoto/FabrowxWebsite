import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { orderNumber, customerInfo, items, total, date } = data;

    // Create a PDF document
    const doc = new PDFDocument({ margin: 50 });

    // Create a buffer to store the PDF
    const chunks: any[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    
    // Promise to handle PDF generation completion
    const pdfPromise = new Promise((resolve) => {
      doc.on('end', () => {
        const result = Buffer.concat(chunks);
        resolve(result);
      });
    });

    // Add company logo and header
    doc
      .fontSize(20)
      .text('Elite Fabworx', { align: 'right' })
      .fontSize(10)
      .text('ABN: YOUR-ABN-HERE', { align: 'right' })
      .moveDown();

    // Add invoice details
    doc
      .fontSize(16)
      .text('INVOICE', { align: 'center' })
      .moveDown()
      .fontSize(12)
      .text(`Invoice Number: ${orderNumber}`)
      .text(`Date: ${new Date(date).toLocaleDateString()}`)
      .moveDown();

    // Add customer details
    doc
      .text('Bill To:')
      .text(customerInfo.name)
      .text(customerInfo.email)
      .text(customerInfo.phone)
      .text(`${customerInfo.address.street}`)
      .text(`${customerInfo.address.city}, ${customerInfo.address.state} ${customerInfo.address.postcode}`)
      .text(customerInfo.address.country)
      .moveDown();

    // Add items table
    doc
      .fontSize(12)
      .text('Items:', { underline: true })
      .moveDown();

    // Table headers
    const tableTop = doc.y;
    doc
      .text('Description', 50, tableTop)
      .text('Quantity', 300, tableTop)
      .text('Price', 400, tableTop)
      .text('Amount', 500, tableTop)
      .moveDown();

    // Table content
    let tableY = doc.y;
    items.forEach((item: any) => {
      doc
        .text(item.name, 50, tableY)
        .text(item.quantity.toString(), 300, tableY)
        .text(`$${item.price.toFixed(2)}`, 400, tableY)
        .text(`$${(item.price * item.quantity).toFixed(2)}`, 500, tableY);
      tableY += 20;
    });

    // Add total
    doc
      .moveDown()
      .text('', 350)
      .text(`Subtotal: $${total.toFixed(2)}`, { align: 'right' })
      .text(`Shipping: Free`, { align: 'right' })
      .text(`Total: $${total.toFixed(2)}`, { align: 'right' });

    // Add footer
    doc
      .moveDown()
      .fontSize(10)
      .text('Thank you for your business!', { align: 'center' })
      .text('Elite Fabworx - Your Performance Vehicle Specialist', { align: 'center' });

    // Finalize the PDF
    doc.end();

    // Wait for PDF generation to complete
    const pdfBuffer = await pdfPromise;

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