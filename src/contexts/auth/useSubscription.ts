
// This file is being kept for backward compatibility
// Subscription model has been removed in favor of per-letter payments

import { useToast } from '@/hooks/use-toast';

export function useSubscription() {
  const { toast } = useToast();

  // This function is kept for backward compatibility but no longer performs subscription updates
  const updateSubscriptionStatus = async (hasSubscription: boolean): Promise<{ success: boolean }> => {
    console.log("Subscription functionality has been removed in favor of per-letter payments");
    return { success: true };
  };

  return { updateSubscriptionStatus };
}
