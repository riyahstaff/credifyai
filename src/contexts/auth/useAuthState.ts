
import React, { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserProfile } from '@/utils/auth/profileUtils';
import { getSessionWithTimeout } from '@/utils/auth/authUtils';
import { AuthState, Profile } from './types';

export function useAuthState(): [
  AuthState, 
  (session: Session | null) => void,
  (user: User | null) => void,
  (profile: Profile | null) => void
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

  const setProfile = (profile: Profile | null) => {
    setState(prev => ({ ...prev, profile }));
  };

  useEffect(() => {
    let isActive = true;
    const retryDelay = 1000;
    
    // Add debug flag to help troubleshoot auth issues
    const DEBUG_AUTH = true;
    
    // Check if we're in a forced auth persistence situation
    const forceAuthPersistence = sessionStorage.getItem('forceAuthPersistence') === 'true';
    
    const initAuth = async (retry = 0) => {
      if (!isActive) return;
      
      if (DEBUG_AUTH) console.log("Initializing auth, retry attempt:", retry);
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        // For preview/demo environments, set up a demo user if no auth is available
        // This helps prevent infinite loading states in preview
        if (window.location.host.includes('lovableproject.com')) {
          if (DEBUG_AUTH) console.log("Preview environment detected - setting up demo mode");
          
          // Set test mode for preview environment
          sessionStorage.setItem('testModeSubscription', 'true');
          
          // After a short timeout to ensure the app can initialize properly
          setTimeout(() => {
            if (isActive && !state.user) {
              if (DEBUG_AUTH) console.log("No user detected in preview, setting demo state");
              setState(prev => ({
                ...prev,
                isLoading: false,
                // We're not setting a fake user here, just indicating we're done loading
              }));
            }
          }, 1500);
        }
        
        // If we're forcing auth persistence, try harder to maintain the session
        if (forceAuthPersistence) {
          if (DEBUG_AUTH) console.log("Forced auth persistence mode active");
          sessionStorage.removeItem('forceAuthPersistence');
          
          // Wait a bit longer for auth to initialize in this case
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        const { data, error } = await getSessionWithTimeout();
        
        if (error) {
          console.warn("Session error, but not logging out:", error);
          setState(prev => ({ ...prev, sessionError: error as Error }));
          
          // Limit retries to prevent infinite loading
          if (retry < 1 && error.message.includes('timeout')) {
            if (DEBUG_AUTH) console.log(`Retrying auth initialization in ${retryDelay * 2}ms`);
            setTimeout(() => initAuth(retry + 1), retryDelay * 2);
          } else {
            // If we've exhausted retries, still mark loading as complete to prevent infinite loading
            if (DEBUG_AUTH) console.log("Max auth retries reached, completing initialization");
            setState(prev => ({ ...prev, isLoading: false }));
          }
        } else {
          const session = data?.session;
          if (!isActive) return;
          
          setState(prev => ({ 
            ...prev, 
            session,
            user: session?.user ?? null,
            sessionError: null,  // Clear any previous errors
            isLoading: false     // Make sure to set loading to false
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
        setState(prev => ({ 
          ...prev, 
          sessionError: error as Error,
          isLoading: false  // Make sure to set loading to false even on error
        }));
        
        // Limit retries to prevent infinite loading
        if (retry < 1) {
          if (DEBUG_AUTH) console.log(`Retrying auth initialization in ${retryDelay * 2}ms`);
          setTimeout(() => initAuth(retry + 1), retryDelay * 2);
        } else {
          if (DEBUG_AUTH) console.log("Max auth retries reached, proceeding without authentication");
        }
      } finally {
        if (isActive) {
          if (DEBUG_AUTH) console.log("Auth initialization complete");
        }
      }
    };

    initAuth();

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (!isActive) return;
          
          if (DEBUG_AUTH) console.log("Auth state changed, event:", _event, "new session:", !!session);
          
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
