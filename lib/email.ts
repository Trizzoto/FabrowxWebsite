import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  title: string;
  message: string;
  submissionId: string;
  date: string;
}

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  isPickup: boolean;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    variant?: string;
  }>;
  total: number;
  paymentIntentId: string;
  date: string;
}

// Create transporter
function createTransporter(): nodemailer.Transporter {
  const config: EmailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true' || false,
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  };

  return nodemailer.createTransport(config);
}

// Send contact form notification
export async function sendContactNotification(data: ContactEmailData): Promise<void> {
  try {
    // Small delay to avoid appearing as automated spam
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const transporter = createTransporter();
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              line-height: 1.6;
              color: #2d3748;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0;
              padding: 20px;
            }
            .email-wrapper {
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            }
            .header {
              background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
              color: #ffffff;
              padding: 40px 32px;
              text-align: center;
              position: relative;
            }
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, #4299e1 0%, #667eea 50%, #9f7aea 100%);
            }
            .brand {
              font-size: 28px;
              font-weight: 700;
              letter-spacing: 2px;
              margin-bottom: 8px;
              background: linear-gradient(135deg, #4299e1 0%, #667eea 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
            .subtitle {
              font-size: 16px;
              opacity: 0.8;
              font-weight: 300;
            }
            .content {
              padding: 40px 32px;
            }
            .section {
              margin-bottom: 32px;
            }
            .section-title {
              font-size: 20px;
              font-weight: 600;
              color: #1a202c;
              margin-bottom: 20px;
              padding-bottom: 8px;
              border-bottom: 2px solid #e2e8f0;
              position: relative;
            }
            .section-title::after {
              content: '';
              position: absolute;
              bottom: -2px;
              left: 0;
              width: 60px;
              height: 2px;
              background: linear-gradient(90deg, #4299e1, #667eea);
            }
            .info-card {
              background: #f7fafc;
              border-radius: 12px;
              padding: 24px;
              border: 1px solid #e2e8f0;
              position: relative;
            }
            .info-card::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 4px;
              height: 100%;
              background: linear-gradient(180deg, #4299e1, #667eea);
              border-radius: 2px 0 0 2px;
            }
            .info-row {
              display: flex;
              align-items: center;
              margin-bottom: 16px;
              padding: 8px 0;
            }
            .info-row:last-child {
              margin-bottom: 0;
            }
            .label {
              font-weight: 600;
              color: #4a5568;
              min-width: 100px;
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .value {
              color: #1a202c;
              font-weight: 500;
              flex: 1;
            }
            .value a {
              color: #4299e1;
              text-decoration: none;
              transition: color 0.2s;
            }
            .value a:hover {
              color: #3182ce;
            }
            .message-container {
              background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
              border-radius: 12px;
              padding: 24px;
              border: 1px solid #e2e8f0;
              position: relative;
            }
            .message-container::before {
              content: '"';
              position: absolute;
              top: 16px;
              left: 20px;
              font-size: 48px;
              color: #cbd5e0;
              font-family: Georgia, serif;
              line-height: 1;
            }
            .message-text {
              margin-left: 40px;
              font-size: 16px;
              line-height: 1.7;
              color: #2d3748;
            }
            .cta-container {
              background: linear-gradient(135deg, #cc5500 0%, #e6590a 100%);
              color: white;
              padding: 24px;
              border-radius: 12px;
              text-align: center;
            }
            .cta-text {
              margin-bottom: 16px;
              opacity: 0.95;
            }
            .cta-button {
              display: inline-block;
              background: rgba(255, 255, 255, 0.9);
              color: black;
              padding: 12px 24px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: 600;
              border: 1px solid rgba(255, 255, 255, 0.3);
              transition: all 0.2s;
            }
            .cta-button:hover {
              background: rgba(255, 255, 255, 1);
              transform: translateY(-1px);
              color: black;
            }
            .footer {
              background: #f7fafc;
              padding: 24px 32px;
              text-align: center;
              border-top: 1px solid #e2e8f0;
            }
            .footer-brand {
              font-weight: 700;
              color: #1a202c;
              margin-bottom: 4px;
            }
            .footer-text {
              font-size: 13px;
              color: #718096;
            }
            .date-badge {
              background: linear-gradient(135deg, #4299e1 0%, #667eea 100%);
              color: white;
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              display: inline-block;
            }
            @media (max-width: 600px) {
              .email-wrapper { margin: 10px; }
              .header { padding: 32px 24px; }
              .content { padding: 32px 24px; }
              .info-card { padding: 20px; }
              .info-row { flex-direction: column; align-items: flex-start; }
              .label { margin-bottom: 4px; }
              .message-container::before { display: none; }
              .message-text { margin-left: 0; }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="header">
              <div class="brand">ELITE FABWORX</div>
              <div class="subtitle">Website Enquiry Notification</div>
            </div>
            
            <div class="content">
              <div class="section">
                <h2 class="section-title">Customer Information</h2>
                <div class="info-card">
                  <div class="info-row">
                    <span class="label">Name</span>
                    <span class="value">${data.name}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Email</span>
                    <span class="value"><a href="mailto:${data.email}">${data.email}</a></span>
                  </div>
                  ${data.phone ? `
                  <div class="info-row">
                    <span class="label">Phone</span>
                    <span class="value"><a href="tel:${data.phone}">${data.phone}</a></span>
                  </div>
                  ` : ''}
                  <div class="info-row">
                    <span class="label">Subject</span>
                    <span class="value">${data.title}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Received</span>
                    <span class="value">
                      <span class="date-badge">
                        ${new Date(data.date).toLocaleString('en-AU', { 
                          timeZone: 'Australia/Adelaide',
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div class="section">
                <h2 class="section-title">Customer Message</h2>
                <div class="message-container">
                  <div class="message-text">
                    ${data.message.replace(/\n/g, '<br>')}
                  </div>
                </div>
              </div>

              <div class="cta-container">
                <div class="cta-text">Ready to respond to ${data.name}?</div>
                <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.title)}" class="cta-button">
                  Reply to Customer
                </a>
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-brand">Elite Fabworx</div>
              <div class="footer-text">Enquiry ID: ${data.submissionId}</div>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: `"Elite Fabworx" <${process.env.SMTP_USER}>`,
      to: 'elitefabworx@outlook.com',
      replyTo: data.email,
      subject: `Website Enquiry: ${data.title} - ${data.name}`,
      html: htmlContent,
      headers: {
        'X-Priority': '3',
        'X-Mailer': 'Elite Fabworx Website',
        'List-Unsubscribe': '<mailto:noreply@elitefabworx.com.au>',
        'Message-ID': `<${data.submissionId}@elitefabworx.com.au>`,
        'X-Entity-Ref-ID': data.submissionId,
      },
      text: `New Enquiry - Elite Fabworx

Customer Details:
Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
Subject: ${data.title}
Date: ${new Date(data.date).toLocaleString('en-AU', { timeZone: 'Australia/Adelaide' })}

Message:
${data.message}

Reply directly to this email to respond to the customer.`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Contact notification email sent successfully');
  } catch (error) {
    console.error('Error sending contact notification email:', error);
    throw error;
  }
}

// Send order notification
export async function sendOrderNotification(data: OrderEmailData): Promise<void> {
  try {
    const transporter = createTransporter();
    
    const itemsHtml = data.items.map(item => `
      <div class="order-item">
        <div class="item-info">
          <div class="item-name">${item.name}</div>
          ${item.variant ? `<div class="item-variant">${item.variant}</div>` : ''}
        </div>
        <div class="item-qty">×${item.quantity}</div>
        <div class="item-total">$${(item.price * item.quantity).toFixed(2)}</div>
      </div>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              line-height: 1.6;
              color: #2d3748;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0;
              padding: 20px;
            }
            .email-wrapper {
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            }
            .header {
              background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
              color: #ffffff;
              padding: 40px 32px;
              text-align: center;
              position: relative;
            }
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, #4299e1 0%, #667eea 50%, #9f7aea 100%);
            }
            .brand {
              font-size: 28px;
              font-weight: 700;
              letter-spacing: 2px;
              margin-bottom: 8px;
              background: linear-gradient(135deg, #4299e1 0%, #667eea 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
            .subtitle {
              font-size: 16px;
              opacity: 0.8;
              font-weight: 300;
            }
            .order-badge {
              background: linear-gradient(135deg, #4299e1 0%, #667eea 100%);
              color: white;
              padding: 8px 16px;
              border-radius: 20px;
              font-weight: 600;
              margin-top: 12px;
              display: inline-block;
              font-size: 14px;
            }
            .content {
              padding: 40px 32px;
            }
            .section {
              margin-bottom: 32px;
            }
            .section-title {
              font-size: 20px;
              font-weight: 600;
              color: #1a202c;
              margin-bottom: 20px;
              padding-bottom: 8px;
              border-bottom: 2px solid #e2e8f0;
              position: relative;
            }
            .section-title::after {
              content: '';
              position: absolute;
              bottom: -2px;
              left: 0;
              width: 60px;
              height: 2px;
              background: linear-gradient(90deg, #4299e1, #667eea);
            }
            .info-card {
              background: #f7fafc;
              border-radius: 12px;
              padding: 24px;
              border: 1px solid #e2e8f0;
              position: relative;
            }
            .info-card::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 4px;
              height: 100%;
              background: linear-gradient(180deg, #4299e1, #667eea);
              border-radius: 2px 0 0 2px;
            }
            .info-row {
              display: flex;
              align-items: center;
              margin-bottom: 16px;
              padding: 8px 0;
            }
            .info-row:last-child {
              margin-bottom: 0;
            }
            .label {
              font-weight: 600;
              color: #4a5568;
              min-width: 120px;
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .value {
              color: #1a202c;
              font-weight: 500;
              flex: 1;
            }
            .value a {
              color: #4299e1;
              text-decoration: none;
              transition: color 0.2s;
            }
            .value a:hover {
              color: #3182ce;
            }
            .notice {
              padding: 16px 20px;
              border-radius: 12px;
              margin: 16px 0;
              font-weight: 500;
              position: relative;
              border-left: 4px solid;
            }
            .pickup-notice {
              background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%);
              color: #22543d;
              border-left-color: #38a169;
            }
            .shipping-notice {
              background: linear-gradient(135deg, #ebf8ff 0%, #e6fffa 100%);
              color: #2a4365;
              border-left-color: #4299e1;
            }
            .items-container {
              background: #ffffff;
              border-radius: 12px;
              border: 1px solid #e2e8f0;
              overflow: hidden;
            }
            .order-item {
              display: flex;
              align-items: center;
              padding: 20px 24px;
              border-bottom: 1px solid #f7fafc;
              transition: background 0.2s;
            }
            .order-item:hover {
              background: #f7fafc;
            }
            .order-item:last-child {
              border-bottom: none;
            }
            .item-info {
              flex: 1;
            }
            .item-name {
              font-weight: 600;
              color: #1a202c;
              margin-bottom: 4px;
            }
            .item-variant {
              font-size: 14px;
              color: #718096;
            }
            .item-qty {
              font-weight: 600;
              color: #4a5568;
              margin: 0 24px;
              min-width: 50px;
              text-align: center;
              background: #edf2f7;
              padding: 6px 12px;
              border-radius: 8px;
              font-size: 14px;
            }
            .item-total {
              font-weight: 700;
              color: #1a202c;
              min-width: 80px;
              text-align: right;
              font-size: 16px;
            }
            .total-summary {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 24px;
              margin-top: 1px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .total-label {
              font-size: 18px;
              font-weight: 600;
              letter-spacing: 0.5px;
            }
            .total-amount {
              font-size: 28px;
              font-weight: 700;
            }
            .next-steps {
              background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
              border-radius: 12px;
              padding: 24px;
              border: 1px solid #e2e8f0;
            }
            .next-steps h3 {
              color: #1a202c;
              margin-bottom: 16px;
              font-size: 18px;
            }
            .steps-list {
              list-style: none;
              margin: 0;
              padding: 0;
            }
            .steps-list li {
              padding: 8px 0;
              padding-left: 28px;
              position: relative;
              color: #2d3748;
            }
            .steps-list li::before {
              content: "✓";
              position: absolute;
              left: 0;
              top: 8px;
              color: #38a169;
              font-weight: bold;
              font-size: 16px;
            }
            .footer {
              background: #f7fafc;
              padding: 24px 32px;
              text-align: center;
              border-top: 1px solid #e2e8f0;
            }
            .footer-brand {
              font-weight: 700;
              color: #1a202c;
              margin-bottom: 4px;
            }
            .footer-text {
              font-size: 13px;
              color: #718096;
            }
            @media (max-width: 600px) {
              .email-wrapper { margin: 10px; }
              .header { padding: 32px 24px; }
              .content { padding: 32px 24px; }
              .info-card { padding: 20px; }
              .info-row { flex-direction: column; align-items: flex-start; }
              .label { margin-bottom: 4px; }
              .order-item { flex-direction: column; text-align: left; padding: 16px; }
              .item-qty, .item-total { margin: 8px 0; align-self: flex-start; }
              .total-summary { flex-direction: column; text-align: center; }
              .total-label { margin-bottom: 8px; }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="header">
              <div class="brand">ELITE FABWORX</div>
              <div class="subtitle">New Order Notification</div>
              <div class="order-badge">#${data.orderNumber}</div>
            </div>
            
            <div class="content">
              <div class="section">
                <h2 class="section-title">Order Summary</h2>
                <div class="info-card">
                  <div class="info-row">
                    <span class="label">Order Number</span>
                    <span class="value">#${data.orderNumber}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Payment ID</span>
                    <span class="value">${data.paymentIntentId}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Order Date</span>
                    <span class="value">
                      ${new Date(data.date).toLocaleString('en-AU', { 
                        timeZone: 'Australia/Adelaide',
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div class="section">
                <h2 class="section-title">Customer Details</h2>
                <div class="info-card">
                  <div class="info-row">
                    <span class="label">Name</span>
                    <span class="value">${data.customerName}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Email</span>
                    <span class="value"><a href="mailto:${data.customerEmail}">${data.customerEmail}</a></span>
                  </div>
                  <div class="info-row">
                    <span class="label">Phone</span>
                    <span class="value"><a href="tel:${data.customerPhone}">${data.customerPhone}</a></span>
                  </div>
                  <div class="info-row">
                    <span class="label">Delivery Method</span>
                    <span class="value">${data.isPickup ? 'Workshop Pickup' : 'Shipping'}</span>
                  </div>
                  ${!data.isPickup && data.customerAddress ? `
                  <div class="info-row">
                    <span class="label">Shipping Address</span>
                    <span class="value">${data.customerAddress}</span>
                  </div>
                  ` : ''}
                </div>
                
                ${data.isPickup ? `
                <div class="pickup-notice notice">
                  <strong>🏪 PICKUP ORDER</strong><br>
                  Customer will collect from Murray Bridge workshop. Please prepare order for pickup.
                </div>
                ` : `
                <div class="shipping-notice notice">
                  <strong>🚚 SHIPPING REQUIRED</strong><br>
                  This order needs to be shipped to the customer address above.
                </div>
                `}
              </div>

              <div class="section">
                <h2 class="section-title">Order Items</h2>
                <div class="items-container">
                  ${itemsHtml}
                  <div class="total-summary">
                    <div class="total-label">TOTAL (inc. GST)</div>
                    <div class="total-amount">$${data.total.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              <div class="section">
                <div class="next-steps">
                  <h3>Next Steps</h3>
                  <ul class="steps-list">
                    <li>Payment has been successfully processed</li>
                    <li>Customer confirmation sent automatically</li>
                    <li>Process and prepare the order items</li>
                    <li>Contact customer if any questions arise</li>
                    ${data.isPickup 
                      ? '<li>Notify customer when order is ready for pickup</li>' 
                      : '<li>Arrange shipping and provide tracking information</li>'
                    }
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-brand">Elite Fabworx</div>
              <div class="footer-text">Secure payment processed via Stripe</div>
            </div>
          </div>
        </body>
      </html>
    `;

    const itemsText = data.items.map(item => 
      `${item.name}${item.variant ? ` (${item.variant})` : ''} - Qty: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const textContent = `New Order - Elite Fabworx

Order #${data.orderNumber}
Payment ID: ${data.paymentIntentId}
Date: ${new Date(data.date).toLocaleString('en-AU', { timeZone: 'Australia/Adelaide' })}

Customer:
${data.customerName}
${data.customerEmail}
${data.customerPhone}
Delivery: ${data.isPickup ? 'Pickup from Murray Bridge' : 'Shipping'}
${!data.isPickup && data.customerAddress ? `Address: ${data.customerAddress}` : ''}

Items:
${itemsText}

TOTAL: $${data.total.toFixed(2)}

Payment processed successfully. ${data.isPickup ? 'Customer will pickup from workshop.' : 'Arrange shipping.'}`;

    const mailOptions = {
      from: `"Elite Fabworx Store" <${process.env.SMTP_USER}>`,
      to: 'elitefabworx@outlook.com',
      replyTo: data.customerEmail,
      subject: `New Order #${data.orderNumber} - $${data.total.toFixed(2)} - ${data.customerName}`,
      html: htmlContent,
      text: textContent,
    };

    await transporter.sendMail(mailOptions);
    console.log('Order notification email sent successfully');
  } catch (error) {
    console.error('Error sending order notification email:', error);
    throw error;
  }
} 