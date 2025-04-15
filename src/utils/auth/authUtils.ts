
import { supabase } from '@/lib/supabase/client';

/**
 * Sign up a new user with email, password and name
 */
export const signUpUser = async (email: string, password: string, fullName: string) => {
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

    // We no longer need to manually create a profile since it's handled by the database trigger
    return { error: null, success: true };
  } catch (error) {
    console.error('Sign up error:', error);
    return { error: error as Error, success: false };
  }
};

/**
 * Sign in a user with email and password
 */
export const signInUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error, success: false };
    }

    return { error: null, success: true };
  } catch (error) {
    console.error('Sign in error:', error);
    return { error: error as Error, success: false };
  }
};

/**
 * Sign out the current user with aggressive cleanup
 */
export const signOutUser = async () => {
  try {
    console.log('Starting forceful signout process...');
    
    // Clear absolutely everything from browser storage
    sessionStorage.clear();
    
    // Clear specific localStorage items that might contain auth data
    try {
      localStorage.removeItem('userProfile');
      localStorage.removeItem('userName');
      localStorage.removeItem('sb-frfeyttlztydgwahjjsw-auth-token');
      localStorage.removeItem('hasAuthSession');
      localStorage.removeItem('lastAuthTime');
      localStorage.removeItem('supabase.auth.token');
      
      // Try to clear all auth-related items
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('supabase') || key.includes('sb-'))) {
          keysToRemove.push(key);
        }
      }
      
      // Remove all matched keys
      keysToRemove.forEach(key => {
        console.log(`Removing localStorage key: ${key}`);
        localStorage.removeItem(key);
      });
    } catch (e) {
      console.error("Error clearing localStorage:", e);
    }
    
    console.log('Storage cleared, signing out from Supabase...');
    
    // Sign out from Supabase with global scope to sign out from all windows/tabs
    const { error } = await supabase.auth.signOut({
      scope: 'global'
    });
    
    if (error) {
      console.error('Supabase sign out error:', error);
      return { error };
    }
    
    console.log('Successfully signed out from Supabase');
    
    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error };
  }
};

/**
 * Get the current session with a timeout for mobile performance
 */
export const getSessionWithTimeout = async (timeoutMs = 8000) => {
  try {
    // Use longer timeout to prevent premature timeouts
    const sessionPromise = supabase.auth.getSession();
    
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Auth session fetch timeout')), timeoutMs);
    });
    
    // Race the session fetch against the timeout
    const result = await Promise.race([
      sessionPromise,
      timeoutPromise.then(() => {
        console.warn("Session fetch timed out, continuing with cached session");
        // Instead of returning null, try to get from localStorage as fallback
        try {
          const cachedSession = localStorage.getItem('sb-frfeyttlztydgwahjjsw-auth-token');
          return cachedSession ? { data: { session: JSON.parse(cachedSession) } } : { data: { session: null } };
        } catch (err) {
          console.warn('Failed to get cached session', err);
          return { data: { session: null } };
        }
      })
    ]);
    
    return { data: result.data, error: null };
  } catch (error) {
    console.error('Error getting session:', error);
    // Don't immediately fail - give a chance to recover
    return { data: { session: null }, error };
  }
};
