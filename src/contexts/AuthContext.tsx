
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile, UserSession } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  signUpUser, 
  signInUser, 
  signOutUser,
  getSessionWithTimeout
} from '@/utils/auth/authUtils';
import { 
  fetchUserProfile,
  updateUserSubscription
} from '@/utils/auth/profileUtils';

type AuthContextType = {
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

const AuthContext = createContext<AuthContextType>({
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
  const [sessionError, setSessionError] = useState<Error | null>(null);
  const { toast } = useToast();

  const updateSubscriptionStatus = async (hasSubscription: boolean) => {
    if (user) {
      try {
        const { error, success } = await updateUserSubscription(user.id, hasSubscription);
          
        if (error) {
          throw error;
        }
        
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
    const initAuth = async () => {
      console.log("Initializing auth");
      setIsLoading(true);
      
      try {
        const { data, error } = await getSessionWithTimeout();
        
        if (error) {
          console.warn("Session error, but not logging out:", error);
          setSessionError(error as Error);
          // Don't reset session here to prevent logout on temporary errors
        } else {
          const session = data?.session;
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            const profile = await fetchUserProfile(session.user.id);
            setProfile(profile);
          }
        }
      } catch (error) {
        console.error('Error getting session:', error);
        setSessionError(error as Error);
        // Don't reset session here, just log the error
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
          
          if (_event === 'SIGNED_OUT') {
            setSession(null);
            setUser(null);
            setProfile(null);
          } else {
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
              const profile = await fetchUserProfile(session.user.id);
              setProfile(profile);
            }
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

  const handleSignUp = async (email: string, password: string, fullName: string) => {
    const result = await signUpUser(email, password, fullName);
    
    if (result.success) {
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
        duration: 5000,
      });
    }
    
    return result;
  };

  const handleSignIn = async (email: string, password: string) => {
    const result = await signInUser(email, password);
    
    if (result.success) {
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
        duration: 3000,
      });
    }
    
    return result;
  };

  const handleSignOut = async () => {
    const { error } = await signOutUser();
    
    if (!error) {
      toast({
        title: "Signed out",
        description: "You have been successfully logged out.",
        duration: 3000,
      });
    } else {
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
        signUp: handleSignUp,
        signIn: handleSignIn,
        signOut: handleSignOut,
        updateSubscriptionStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
