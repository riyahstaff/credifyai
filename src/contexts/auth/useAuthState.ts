
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
    
    // When setting a new session, persist it to localStorage
    if (session) {
      try {
        // Save a flag in localStorage that we have a valid session
        localStorage.setItem('hasAuthSession', 'true');
        localStorage.setItem('lastAuthTime', Date.now().toString());
      } catch (e) {
        console.error('Error saving auth session flag:', e);
      }
    }
  };

  const setUser = (user: User | null) => {
    setState(prev => ({ ...prev, user }));
  };

  const setProfile = (profile: Profile) => {
    setState(prev => ({ ...prev, profile }));
  };

  useEffect(() => {
    let isActive = true;
    const retryDelay = 1000;
    
    // Check if we're in a forced auth persistence situation
    const forceAuthPersistence = sessionStorage.getItem('forceAuthPersistence') === 'true';
    
    const initAuth = async (retry = 0) => {
      if (!isActive) return;
      
      console.log("Initializing auth");
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        // If we're forcing auth persistence, try harder to maintain the session
        if (forceAuthPersistence) {
          console.log("Forced auth persistence mode active");
          sessionStorage.removeItem('forceAuthPersistence');
          
          // Wait a bit longer for auth to initialize in this case
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        const { data, error } = await getSessionWithTimeout();
        
        if (error) {
          console.warn("Session error, but not logging out:", error);
          setState(prev => ({ ...prev, sessionError: error as Error }));
          
          // Retry with exponential backoff if this is a timeout error
          if (retry < 3 && error.message.includes('timeout')) {
            console.log(`Retrying auth initialization in ${retryDelay * (retry + 1)}ms`);
            setTimeout(() => initAuth(retry + 1), retryDelay * (retry + 1));
          }
        } else {
          const session = data?.session;
          if (!isActive) return;
          
          setState(prev => ({ 
            ...prev, 
            session,
            user: session?.user ?? null,
            sessionError: null  // Clear any previous errors
          }));
          
          if (session?.user) {
            // Save auth status to localStorage for persistence
            localStorage.setItem('hasAuthSession', 'true');
            localStorage.setItem('lastAuthTime', Date.now().toString());
            
            const profile = await fetchUserProfile(session.user.id);
            if (!isActive) return;
            setState(prev => ({ ...prev, profile }));
          }
        }
      } catch (error) {
        console.error('Error getting session:', error);
        setState(prev => ({ ...prev, sessionError: error as Error }));
        
        // Retry on network errors or timeouts
        if (retry < 3) {
          console.log(`Retrying auth initialization in ${retryDelay * (retry + 1)}ms`);
          setTimeout(() => initAuth(retry + 1), retryDelay * (retry + 1));
        }
      } finally {
        if (isActive) {
          console.log("Auth initialization complete");
          setState(prev => ({ ...prev, isLoading: false }));
        }
      }
    };

    initAuth();

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (!isActive) return;
          
          console.log("Auth state changed, new session:", !!session);
          
          if (_event === 'SIGNED_OUT') {
            setState({
              session: null,
              user: null,
              profile: null,
              isLoading: false,
              sessionError: null
            });
            
            // Clear auth persistence flags
            localStorage.removeItem('hasAuthSession');
            localStorage.removeItem('lastAuthTime');
          } else {
            setState(prev => ({
              ...prev,
              session,
              user: session?.user ?? null,
              isLoading: false,
              sessionError: null  // Clear any previous errors
            }));
            
            if (session?.user) {
              // Update auth status in localStorage
              localStorage.setItem('hasAuthSession', 'true');
              localStorage.setItem('lastAuthTime', Date.now().toString());
              
              const profile = await fetchUserProfile(session.user.id);
              if (!isActive) return;
              setState(prev => ({ ...prev, profile }));
            }
          }
        }
      );

      return () => {
        isActive = false;
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up auth subscription:', error);
      if (isActive) {
        setState(prev => ({ ...prev, isLoading: false }));
      }
      return () => {
        isActive = false;
      };
    }
  }, []);

  return [state, setSession, setUser, setProfile];
}
