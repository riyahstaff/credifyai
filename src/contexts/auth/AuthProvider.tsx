
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
  
  // Create a simple logout function
  const logout = async () => {
    console.log("Logout requested");
    await handleSignOut();
    
    // For immediate UI feedback, clear auth state locally
    setUser(null);
    setSession(null);
    setProfile(null);
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
