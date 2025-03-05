
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile } from '@/lib/supabase/client';
import { fetchUserProfile } from '@/utils/auth/profileUtils';
import { getSessionWithTimeout } from '@/utils/auth/authUtils';
import { AuthState } from './types';

export function useAuthState(): [
  AuthState, 
  (session: Session | null) => void,
  (user: User | null) => void,
  (profile: Profile) => void
] {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    profile: null,
    isLoading: true,
    sessionError: null
  });

  const setSession = (session: Session | null) => {
    setState(prev => ({ ...prev, session }));
  };

  const setUser = (user: User | null) => {
    setState(prev => ({ ...prev, user }));
  };

  const setProfile = (profile: Profile) => {
    setState(prev => ({ ...prev, profile }));
  };

  useEffect(() => {
    const initAuth = async () => {
      console.log("Initializing auth");
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        const { data, error } = await getSessionWithTimeout();
        
        if (error) {
          console.warn("Session error, but not logging out:", error);
          setState(prev => ({ ...prev, sessionError: error as Error }));
          // Don't reset session here to prevent logout on temporary errors
        } else {
          const session = data?.session;
          setState(prev => ({ 
            ...prev, 
            session,
            user: session?.user ?? null
          }));
          
          if (session?.user) {
            const profile = await fetchUserProfile(session.user.id);
            setState(prev => ({ ...prev, profile }));
          }
        }
      } catch (error) {
        console.error('Error getting session:', error);
        setState(prev => ({ ...prev, sessionError: error as Error }));
        // Don't reset session here, just log the error
      } finally {
        console.log("Auth initialization complete");
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          console.log("Auth state changed, new session:", !!session);
          
          if (_event === 'SIGNED_OUT') {
            setState({
              session: null,
              user: null,
              profile: null,
              isLoading: false,
              sessionError: null
            });
          } else {
            setState(prev => ({
              ...prev,
              session,
              user: session?.user ?? null,
              isLoading: false
            }));
            
            if (session?.user) {
              const profile = await fetchUserProfile(session.user.id);
              setState(prev => ({ ...prev, profile }));
            }
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up auth subscription:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      return () => {};
    }
  }, []);

  return [state, setSession, setUser, setProfile];
}
