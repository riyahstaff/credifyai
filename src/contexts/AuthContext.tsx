
import React, { createContext, useState, useContext, useEffect } from 'react';

// Define the shape of user and profile objects
interface User {
  id: string;
  email: string;
}

interface Profile {
  full_name?: string;
  has_subscription: boolean;
}

// Define the shape of the context
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  logout: async () => {}
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
          full_name: 'Demo User',
          has_subscription: true,
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

  // Value object that will be provided to consumers
  const value = {
    user,
    profile,
    isLoading,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
