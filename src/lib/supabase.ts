
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables injected by Lovable
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error('Supabase credentials missing. Make sure you have connected your Supabase project.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
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
