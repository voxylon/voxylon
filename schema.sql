-- Migration script for Supabase
-- Run this in your Supabase SQL Editor to set up the registrations table

-- Create the registrations table
CREATE TABLE IF NOT EXISTS registrations (
  address TEXT PRIMARY KEY,
  validator_key TEXT UNIQUE NOT NULL,
  signature TEXT NOT NULL
);

-- Create index on validator_key for faster lookups
CREATE INDEX IF NOT EXISTS idx_registrations_validator_key 
  ON registrations(LOWER(validator_key));

-- Enable Row Level Security (RLS)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous read access to count and individual registrations
CREATE POLICY "Allow public read access"
  ON registrations
  FOR SELECT
  USING (true);

-- Policy: Allow public insert (the application will validate signatures)
CREATE POLICY "Allow public insert"
  ON registrations
  FOR INSERT
  WITH CHECK (true);

-- Note: Updates and deletes are not allowed by default (no policies created)
