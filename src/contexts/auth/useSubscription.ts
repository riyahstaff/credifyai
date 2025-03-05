
import { useToast } from '@/hooks/use-toast';
import { updateUserSubscription } from '@/utils/auth/profileUtils';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/lib/supabase/client';

export function useSubscription() {
  const { toast } = useToast();

  const updateSubscriptionStatus = async (
    user: User | null, 
    profile: Profile | null, 
    setProfile: (profile: Profile) => void, 
    hasSubscription: boolean
  ) => {
    if (user) {
      try {
        const { error, success } = await updateUserSubscription(user.id, hasSubscription);
          
        if (error) {
          throw error;
        }
        
        if (profile) {
          setProfile({
            ...profile,
            has_subscription: hasSubscription
          });
        }
        
        toast({
          title: hasSubscription ? "Subscription activated" : "Subscription deactivated",
          description: hasSubscription ? "You now have full access to all features." : "Your premium features have been deactivated.",
        });
      } catch (error) {
        console.error('Error updating subscription status:', error);
        toast({
          title: "Error",
          description: "Failed to update subscription status.",
          variant: "destructive",
        });
      }
    }
  };

  return { updateSubscriptionStatus };
}
