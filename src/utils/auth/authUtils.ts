
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

    if (data?.user) {
      // Create the user's profile in the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: email.toLowerCase(),
            full_name: fullName,
          },
        ]);

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        return { error: profileError, success: false };
      }

      console.log('Profile created successfully');
      return { error: null, success: true };
    }

    return { error: new Error('User creation failed'), success: false };
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
 * Sign out the current user
 */
export const signOutUser = async () => {
  try {
    await supabase.auth.signOut();
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
