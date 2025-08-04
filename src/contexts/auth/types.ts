
import { User, Session } from '@supabase/supabase-js';

// Use a flexible profile type to avoid import conflicts
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  has_subscription?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  sessionError: Error | null;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{
    error: Error | null;
    success: boolean;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    success: boolean;
  }>;
  signOut: () => Promise<void>;
  updateSubscriptionStatus: (hasSubscription: boolean) => Promise<{ success: boolean }>;
  logout: () => Promise<void>; // Added this
}
