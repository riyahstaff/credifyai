
import { supabase, Profile } from '@/lib/supabase/client';

/**
 * Fetches a user's profile from the database
 */
export const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    console.log("Fetching user profile for:", userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    console.log("Profile data fetched:", data);
    return data as Profile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

/**
 * Updates a user's subscription status in the database
 */
export const updateUserSubscription = async (userId: string, hasSubscription: boolean) => {
  try {
    // Update the subscription status in the database
    const { error } = await supabase
      .from('profiles')
      .update({ has_subscription: hasSubscription })
      .eq('id', userId);
      
    if (error) {
      throw error;
    }
    
    return { error: null, success: true };
  } catch (error) {
    console.error('Error updating subscription status:', error);
    return { error, success: false };
  }
};
