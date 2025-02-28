
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile, UserSession } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

// Adding interface for test user
interface TestUser {
  email: string;
  name: string;
  isTestUser: boolean;
}

const AuthContext = createContext<{
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isTestMode: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ 
    error: Error | null; 
    success: boolean;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    success: boolean;
  }>;
  signOut: () => Promise<void>;
}>({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  isTestMode: false,
  signUp: async () => ({ error: null, success: false }),
  signIn: async () => ({ error: null, success: false }),
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTestMode, setIsTestMode] = useState(false);
  const { toast } = useToast();

  // Fetch the user's profile when they sign in
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data as Profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Check for test user in localStorage
  const checkForTestUser = () => {
    const testUserData = localStorage.getItem('test_user');
    if (testUserData) {
      try {
        const testUser = JSON.parse(testUserData) as TestUser;
        
        // Create a mock user object
        const mockUser = {
          id: 'test-user-id',
          email: testUser.email,
          user_metadata: {
            full_name: testUser.name
          }
        } as unknown as User;
        
        // Create a mock profile
        const mockProfile = {
          id: 'test-user-id',
          email: testUser.email,
          full_name: testUser.name,
          created_at: new Date().toISOString()
        } as Profile;
        
        setUser(mockUser);
        setProfile(mockProfile);
        setIsTestMode(true);
        return true;
      } catch (error) {
        console.error('Error parsing test user data:', error);
        localStorage.removeItem('test_user');
      }
    }
    return false;
  };

  useEffect(() => {
    // Check active sessions and sets the user
    const initAuth = async () => {
      setIsLoading(true);
      
      // First check if there's a test user
      if (checkForTestUser()) {
        setIsLoading(false);
        return;
      }
      
      // Check for Supabase connection issues
      const hasDatabaseIssue = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;
      setIsTestMode(hasDatabaseIssue);
      
      if (hasDatabaseIssue) {
        console.warn('Running in test mode due to missing Supabase credentials.');
        setIsLoading(false);
        return;
      }
      
      try {
        const { data } = await supabase.auth.getSession();
        const session = data?.session;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          setProfile(profile);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Only set up subscription if not in test mode
    if (!isTestMode) {
      try {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
              const profile = await fetchUserProfile(session.user.id);
              setProfile(profile);
            } else {
              setProfile(null);
            }
            
            setIsLoading(false);
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error setting up auth subscription:', error);
        setIsLoading(false);
        return () => {};
      }
    }
  }, []);

  // Sign up a new user and create their profile
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // If in test mode, simulate success
      if (isTestMode) {
        return { error: null, success: true };
      }
      
      // Create the user in Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { error, success: false };
      }

      if (data?.user) {
        // Create the user's profile in the profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: email.toLowerCase(),
              full_name: fullName,
            },
          ]);

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          return { error: profileError, success: false };
        }

        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
          duration: 5000,
        });

        return { error: null, success: true };
      }

      return { error: new Error('User creation failed'), success: false };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: error as Error, success: false };
    }
  };

  // Sign in an existing user
  const signIn = async (email: string, password: string) => {
    try {
      // If in test mode, simulate success
      if (isTestMode) {
        localStorage.setItem('test_user', JSON.stringify({
          email,
          name: email.split('@')[0], // Simple name from email
          isTestUser: true
        }));
        
        // Reload the page to trigger the test user check
        window.location.reload();
        
        return { error: null, success: true };
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error, success: false };
      }

      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
        duration: 3000,
      });

      return { error: null, success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as Error, success: false };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      // If in test mode, just clear localStorage
      if (isTestMode) {
        localStorage.removeItem('test_user');
        setUser(null);
        setProfile(null);
        
        toast({
          title: "Signed out",
          description: "You have been successfully logged out.",
          duration: 3000,
        });
        
        return;
      }
      
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully logged out.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        isTestMode,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
