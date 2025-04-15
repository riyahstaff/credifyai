
import { createContext, useContext, useEffect } from 'react';
import { AuthContextType, AuthProviderProps } from './types';
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';
import { useSubscription } from './useSubscription';

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  signUp: async () => ({ error: null, success: false }),
  signIn: async () => ({ error: null, success: false }),
  signOut: async () => {},
  logout: async () => {},
  updateSubscriptionStatus: async () => ({ success: true }),
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setSession, setUser, setProfile] = useAuthState();
  const { handleSignUp, handleSignIn, handleSignOut } = useAuthActions();
  const { updateSubscriptionStatus: handleUpdateSubscription } = useSubscription();

  const { session, user, profile, isLoading } = state;
  
  // Create a more forceful logout function
  const logout = async () => {
    console.log("CRITICAL: Logout requested - performing full cleanup");
    
    try {
      // Mark document for immediate logout redirection
      document.body.classList.add('logging-out');
      
      // Start a force redirect timer immediately for best UX
      const forceTimer = setTimeout(() => {
        console.log("CRITICAL: Force logout timer triggered");
        window.location.replace('/');
      }, 300);
      
      // Clear all React state
      setUser(null);
      setSession(null);
      setProfile(null);
      
      // Clear all storage
      sessionStorage.clear();
      
      // Clear specific localStorage items that might persist
      localStorage.removeItem('userProfile');
      localStorage.removeItem('userName');
      localStorage.removeItem('sb-frfeyttlztydgwahjjsw-auth-token');
      localStorage.removeItem('hasAuthSession');
      localStorage.removeItem('lastAuthTime');
      localStorage.removeItem('supabase.auth.token');
      
      // Call the sign out function
      await handleSignOut();
      
      // Clear the timer if we got here fast enough
      clearTimeout(forceTimer);
      
      // Use window.location.replace for a complete page refresh and cache clearing
      console.log("CRITICAL: Forcing clean navigation to home page");
      window.location.replace('/');
    } catch (error) {
      console.error("CRITICAL: Error during logout:", error);
      // Still force navigation even on error
      window.location.replace('/');
    }
  };

  // Store profile data in localStorage for letter generation
  useEffect(() => {
    if (profile) {
      console.log("Storing user profile data in localStorage:", profile);
      localStorage.setItem('userProfile', JSON.stringify(profile));
      
      if (profile.full_name) {
        localStorage.setItem('userName', profile.full_name);
      }
    }
  }, [profile]);

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
        logout,
        updateSubscriptionStatus: handleUpdateSubscription,
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
