
import { User, Session } from '@supabase/supabase-js';
import { Profile } from '@/lib/supabase/client';

export type AuthContextType = {
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
  updateSubscriptionStatus: (hasSubscription: boolean) => Promise<void>;
};

export type AuthProviderProps = {
  children: React.ReactNode;
};

export type AuthState = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  sessionError: Error | null;
};
