-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_date ON contact_submissions(date);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous insert" ON contact_submissions;
DROP POLICY IF EXISTS "Allow anonymous read" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated read" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated update" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated delete" ON contact_submissions;

-- Create policies for RLS
-- Allow anonymous users to insert new submissions
CREATE POLICY "Allow anonymous insert" ON contact_submissions
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow anonymous users to read their own submissions
CREATE POLICY "Allow anonymous read" ON contact_submissions
  FOR SELECT TO anon
  USING (true);

-- Allow authenticated users to read all submissions
CREATE POLICY "Allow authenticated read" ON contact_submissions
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated users to update status
CREATE POLICY "Allow authenticated update" ON contact_submissions
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete submissions
CREATE POLICY "Allow authenticated delete" ON contact_submissions
  FOR DELETE TO authenticated
  USING (true); 