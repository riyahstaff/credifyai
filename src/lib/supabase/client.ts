
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables or use provided values
const supabaseUrl = 'https://nnpsiyuwlovbngqzyxlg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ucHNpeXV3bG92Ym5ncXp5eGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMDE0ODEsImV4cCI6MjA1OTU3NzQ4MX0.dMuHGHCxHsX4ujAoxP4k3GNKuTFFEI5SfT50xWGmmts';

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
