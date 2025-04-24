-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- Enable Row Level Security (RLS)
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow anonymous users to read settings
CREATE POLICY "Allow anonymous read" ON settings
  FOR SELECT TO anon
  USING (true);

-- Allow authenticated users to read and write settings
CREATE POLICY "Allow authenticated read" ON settings
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated write" ON settings
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default settings if they don't exist
INSERT INTO settings (key, value)
VALUES ('site_settings', '{
  "siteName": "Elite Fabworx",
  "contactEmail": "info@elitefabworx.com.au",
  "phone": "+61 123 456 789",
  "address": "123 Business Street, Sydney NSW 2000",
  "socialMedia": {
    "facebook": "https://facebook.com/elitefabworx",
    "instagram": "https://instagram.com/elitefabworx",
    "linkedin": "https://linkedin.com/company/elitefabworx"
  }
}'::jsonb)
ON CONFLICT (key) DO NOTHING; 