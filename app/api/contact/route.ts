import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the contact submission interface
interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied';
}

// Path to the contact submissions file
const contactFilePath = path.join(process.cwd(), 'app/data/contact-submissions.json');

// Ensure the file exists
function ensureContactFileExists() {
  if (!fs.existsSync(contactFilePath)) {
    fs.writeFileSync(contactFilePath, JSON.stringify([]));
  }
}

// GET handler to retrieve all contact submissions
export async function GET() {
  try {
    ensureContactFileExists();
    const fileContent = fs.readFileSync(contactFilePath, 'utf8');
    const submissions = JSON.parse(fileContent);
    
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error reading contact submissions:', error);
    return NextResponse.json({ error: 'Failed to retrieve contact submissions' }, { status: 500 });
  }
}

// POST handler to add a new contact submission
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, title, message } = body;
    
    // Validate required fields
    if (!name || !email || !title || !message) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required' },
        { status: 400 }
      );
    }
    
    // Create a new submission
    const newSubmission: ContactSubmission = {
      id: Date.now().toString(),
      name,
      email,
      phone: phone || '',
      title,
      message,
      date: new Date().toISOString(),
      status: 'new'
    };
    
    // Read existing submissions
    ensureContactFileExists();
    const fileContent = fs.readFileSync(contactFilePath, 'utf8');
    const submissions = JSON.parse(fileContent);
    
    // Add the new submission
    submissions.unshift(newSubmission);
    
    // Write back to file
    fs.writeFileSync(contactFilePath, JSON.stringify(submissions, null, 2));
    
    return NextResponse.json({ success: true, submission: newSubmission });
  } catch (error) {
    console.error('Error saving contact submission:', error);
    return NextResponse.json(
      { error: 'Failed to save contact submission' },
      { status: 500 }
    );
  }
}

// PATCH handler to update a submission's status
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    
    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID and status are required' },
        { status: 400 }
      );
    }
    
    // Read existing submissions
    ensureContactFileExists();
    const fileContent = fs.readFileSync(contactFilePath, 'utf8');
    const submissions = JSON.parse(fileContent);
    
    // Find and update the submission
    const submissionIndex = submissions.findIndex((s: ContactSubmission) => s.id === id);
    if (submissionIndex === -1) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }
    
    submissions[submissionIndex].status = status;
    
    // Write back to file
    fs.writeFileSync(contactFilePath, JSON.stringify(submissions, null, 2));
    
    return NextResponse.json({ success: true, submission: submissions[submissionIndex] });
  } catch (error) {
    console.error('Error updating contact submission:', error);
    return NextResponse.json(
      { error: 'Failed to update contact submission' },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a submission
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }
    
    // Read existing submissions
    ensureContactFileExists();
    const fileContent = fs.readFileSync(contactFilePath, 'utf8');
    const submissions = JSON.parse(fileContent);
    
    // Filter out the submission to delete
    const updatedSubmissions = submissions.filter((s: ContactSubmission) => s.id !== id);
    
    if (updatedSubmissions.length === submissions.length) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }
    
    // Write back to file
    fs.writeFileSync(contactFilePath, JSON.stringify(updatedSubmissions, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact submission:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact submission' },
      { status: 500 }
    );
  }
} 