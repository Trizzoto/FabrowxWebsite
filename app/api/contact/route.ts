import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

// GET handler to retrieve all contact submissions
export async function GET() {
  try {
    const { data: submissions, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    
    return NextResponse.json(submissions || []);
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
    const newSubmission = {
      name,
      email,
      phone: phone || '',
      title,
      message,
      date: new Date().toISOString(),
      status: 'new'
    };
    
    // Insert into Supabase
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([newSubmission])
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ success: true, submission: data });
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
    
    // Update in Supabase
    const { data, error } = await supabase
      .from('contact_submissions')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ success: true, submission: data });
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
    
    // Delete from Supabase
    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact submission:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact submission' },
      { status: 500 }
    );
  }
} 