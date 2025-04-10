
import { createContext, useContext } from 'react';
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
  updateSubscriptionStatus: async () => {},
  logout: async () => {}, // Add missing logout function in default context
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setSession, setUser, setProfile] = useAuthState();
  const { handleSignUp, handleSignIn, handleSignOut } = useAuthActions();
  const { updateSubscriptionStatus: updateSubscription } = useSubscription();

  const { session, user, profile, isLoading } = state;

  const updateSubscriptionStatus = async (hasSubscription: boolean) => {
    await updateSubscription(user, profile, setProfile, hasSubscription);
  };
  
  // Create an additional simple logout function
  const logout = async () => {
    console.log("Logout requested");
    await handleSignOut();
    
    // For immediate UI feedback, clear auth state locally
    setUser(null);
    setSession(null);
    setProfile(null);
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
        logout, // Add logout to the provider value
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
