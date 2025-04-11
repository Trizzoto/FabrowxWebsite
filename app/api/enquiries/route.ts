import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

// Define the Enquiry interface
interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'in-progress' | 'completed';
  createdAt: string;
}

const ENQUIRIES_FILE = path.join(process.cwd(), 'app/data/enquiries.json');

// Helper function to read enquiries from file
function readEnquiries(): Enquiry[] {
  try {
    if (!fs.existsSync(ENQUIRIES_FILE)) {
      fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(ENQUIRIES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading enquiries:', error);
    return [];
  }
}

// Helper function to write enquiries to file
function writeEnquiries(enquiries: Enquiry[]): void {
  try {
    fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(enquiries, null, 2));
  } catch (error) {
    console.error('Error writing enquiries:', error);
  }
}

// Helper function to send email notification
async function sendEmailNotification(enquiry: Enquiry) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `New Enquiry from ${enquiry.name}`,
    html: `
      <h2>New Enquiry Received</h2>
      <p><strong>Name:</strong> ${enquiry.name}</p>
      <p><strong>Email:</strong> ${enquiry.email}</p>
      ${enquiry.phone ? `<p><strong>Phone:</strong> ${enquiry.phone}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${enquiry.message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

// GET handler to fetch all enquiries
export async function GET() {
  const enquiries = readEnquiries();
  return NextResponse.json(enquiries);
}

// POST handler to create a new enquiry
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Create new enquiry
    const newEnquiry: Enquiry = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      message,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    // Read existing enquiries and add new one
    const enquiries = readEnquiries();
    enquiries.push(newEnquiry);
    writeEnquiries(enquiries);

    // Send email notification
    await sendEmailNotification(newEnquiry);

    return NextResponse.json(newEnquiry, { status: 201 });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to create enquiry' },
      { status: 500 }
    );
  }
} 