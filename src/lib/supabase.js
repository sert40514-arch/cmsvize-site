import { createClient } from '@supabase/supabase-js';

// Hardcoded for debugging to bypass environment variable issues
const supabaseUrl = 'https://rjxlauvvtllvbmtoyghl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqeGxhdXZ2dGxseWJtdG95Z2hsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNjE1MzAsImV4cCI6MjA5MjYzNzUzMH0.WbHRw4GCkl1DD5OI-FbGc3lRtEW41s4rLdZQznxxQ4w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
