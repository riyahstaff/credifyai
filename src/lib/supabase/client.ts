
import { createClient } from '@supabase/supabase-js';

// Use the correct Supabase credentials that match the integrations client
const supabaseUrl = 'https://frfeyttlztydgwahjjsw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyZmV5dHRsenR5ZGd3YWhqanN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3MTM5NTIsImV4cCI6MjA1NjI4OTk1Mn0.oQ60NfU_HD9wyqDoGrx763wfIvFWg5CpMixKYvOW1QY';

// Since we have hardcoded credentials, we should not show any error
// Only show error if we're trying to use env variables but they're missing
const hasMissingCredentials = false;

if (hasMissingCredentials) {
  console.error('Supabase credentials missing. To connect this app to Supabase:');
  console.error('1. Make sure you have connected your Supabase project in the Lovable interface');
  console.error('2. Or set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables');
}

// Create and export the supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User session and profile types
export type Profile = {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  has_subscription?: boolean; // Add this property with optional flag
}

// User session context
export type UserSession = {
  user: {
    id: string;
    email: string;
  } | null;
  profile: Profile | null;
  isLoading: boolean;
}

// Application routes
export const APP_ROUTES = {
  DASHBOARD: '/dashboard',
  DISPUTE_LETTERS: '/dispute-letters',
  CREATE_DISPUTE: '/dispute-letters?view=generator', // Updated to use query parameter instead of a new route
  UPLOAD_REPORT: '/upload-report',
  EDUCATION: '/education',
  LOGIN: '/login',
  SIGNUP: '/signup'
};
