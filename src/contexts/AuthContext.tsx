import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile, UserSession } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<{
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
}>({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  signUp: async () => ({ error: null, success: false }),
  signIn: async () => ({ error: null, success: false }),
  signOut: async () => {},
  updateSubscriptionStatus: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch the user's profile when they sign in
  const fetchUserProfile = async (userId: string) => {
    // Check if we've already fetched this profile
    if (profile && profile.id === userId) {
      return profile;
    }
    
    try {
      console.log("Fetching user profile for:", userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      console.log("Profile data fetched:", data);
      return data as Profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Update user's subscription status
  const updateSubscriptionStatus = async (hasSubscription: boolean) => {
    if (user) {
      try {
        // Update the subscription status in the database
        const { error } = await supabase
          .from('profiles')
          .update({ has_subscription: hasSubscription })
          .eq('id', user.id);
          
        if (error) {
          throw error;
        }
        
        // Update the profile state
        if (profile) {
          setProfile({
            ...profile,
            has_subscription: hasSubscription
          });
        }
        
        toast({
          title: hasSubscription ? "Subscription activated" : "Subscription deactivated",
          description: hasSubscription ? "You now have full access to all features." : "Your premium features have been deactivated.",
        });
      } catch (error) {
        console.error('Error updating subscription status:', error);
        toast({
          title: "Error",
          description: "Failed to update subscription status.",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user - optimized for mobile
    const initAuth = async () => {
      console.log("Initializing auth");
      setIsLoading(true);
      
      try {
        // Use shorter timeout for getSession operation
        const sessionPromise = supabase.auth.getSession();
        
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Auth session fetch timeout')), 2500);
        });
        
        // Race the session fetch against the timeout
        const { data } = await Promise.race([
          sessionPromise,
          timeoutPromise.then(() => {
            console.warn("Session fetch timed out, continuing without session");
            return { data: { session: null } };
          })
        ]) as { data: { session: Session | null } };
        
        const session = data?.session;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          setProfile(profile);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        // For mobile, don't let errors keep us in loading state
        setSession(null);
        setUser(null);
      } finally {
        console.log("Auth initialization complete");
        setIsLoading(false);
      }
    };

    initAuth();

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          console.log("Auth state changed, new session:", !!session);
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
  }, []);

  // Sign up a new user and create their profile
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('Signing up with:', { email, fullName });
      
      // Create the user in Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error('Signup error:', error);
        return { error, success: false };
      }

      console.log('Signup successful, user data:', data);

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

        console.log('Profile created successfully');

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
        signUp,
        signIn,
        signOut,
        updateSubscriptionStatus,
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
