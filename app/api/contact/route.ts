import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { sendContactNotification } from '@/lib/email';

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

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'elitefabworx';
const collectionName = 'contactSubmissions';

// Helper function to get the database connection
async function getDb() {
  try {
    await client.connect();
    return client.db(dbName);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

// GET handler to retrieve all contact submissions
export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection(collectionName);
    const submissions = await collection.find({}).toArray();
    
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
    
    const db = await getDb();
    const collection = db.collection(collectionName);
    await collection.insertOne(newSubmission);
    
    // Send email notification
    try {
      await sendContactNotification({
        name,
        email,
        phone: phone || undefined,
        title,
        message,
        submissionId: newSubmission.id,
        date: newSubmission.date,
      });
      console.log('Contact notification email sent successfully');
    } catch (emailError) {
      console.error('Failed to send contact notification email:', emailError);
      // Don't fail the contact submission if email fails
      // Just log the error for monitoring
    }
    
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
    
    const db = await getDb();
    const collection = db.collection(collectionName);
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: { status } },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, submission: result });
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
    
    const db = await getDb();
    const collection = db.collection(collectionName);
    const result = await collection.deleteOne({ id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact submission:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact submission' },
      { status: 500 }
    );
  }
} 