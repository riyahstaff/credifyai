
import React, { createContext, useState, useContext, useEffect } from 'react';

// Define the shape of user and profile objects
interface User {
  id: string;
  email: string;
}

// Make sure Profile matches what's expected in other components
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  has_subscription: boolean;
  created_at?: string;
}

// Define the shape of the context with all required methods
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; success: boolean }>;
  signOut: () => Promise<void>;
  updateSubscriptionStatus: (hasSubscription: boolean) => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  logout: async () => {},
  signIn: async () => ({ error: null, success: false }),
  signOut: async () => {},
  updateSubscriptionStatus: async () => {}
});

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock user data for demo purposes
  useEffect(() => {
    // Simulate async auth check
    const checkAuth = async () => {
      try {
        // Mock authenticated user
        setUser({
          id: '123',
          email: 'user@example.com',
        });
        
        setProfile({
          id: '123',
          email: 'user@example.com',
          full_name: 'Demo User',
          has_subscription: true,
          created_at: new Date().toISOString()
        });
      } catch (error) {
        console.error('Auth error:', error);
        setUser(null);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      // In a real app, this would call your auth service
      setUser({
        id: '123',
        email,
      });
      
      setProfile({
        id: '123',
        email: email,
        full_name: 'Demo User',
        has_subscription: true,
        created_at: new Date().toISOString()
      });
      
      return { error: null, success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { error: error as Error, success: false };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // In a real app, you would call your auth service here
      setUser(null);
      setProfile(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Alias for logout to maintain compatibility
  const signOut = async () => {
    return logout();
  };

  // Update subscription status
  const updateSubscriptionStatus = async (hasSubscription: boolean) => {
    if (profile) {
      setProfile({
        ...profile,
        has_subscription: hasSubscription
      });
    }
  };

  // Value object that will be provided to consumers
  const value = {
    user,
    profile,
    isLoading,
    logout,
    signIn,
    signOut,
    updateSubscriptionStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
