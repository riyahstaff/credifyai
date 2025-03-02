
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables injected by Lovable
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Check for missing credentials with a helpful error message
const hasMissingCredentials = !import.meta.env.VITE_SUPABASE_URL || 
                             !import.meta.env.VITE_SUPABASE_ANON_KEY ||
                             supabaseUrl === 'https://placeholder-url.supabase.co' ||
                             supabaseAnonKey === 'placeholder-key';

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
  CREATE_DISPUTE: '/dispute-letters/new',
  UPLOAD_REPORT: '/upload-report',
  EDUCATION: '/education',
  LOGIN: '/login',
  SIGNUP: '/signup'
};
