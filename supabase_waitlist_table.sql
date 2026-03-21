-- Run this in your Supabase SQL editor (once)
CREATE TABLE IF NOT EXISTS waitlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text,
  email text UNIQUE NOT NULL,
  position integer NOT NULL,
  early_access boolean DEFAULT false,
  joined_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow insert from anon (the API will use service key anyway)
CREATE POLICY "Anyone can join waitlist"
  ON waitlist FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only service role can read
CREATE POLICY "Service role reads waitlist"
  ON waitlist FOR SELECT
  TO service_role
  USING (true);
