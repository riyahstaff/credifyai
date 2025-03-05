
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import SubscriptionHeader from '@/components/subscription/SubscriptionHeader';
import PremiumPlanCard from '@/components/subscription/PremiumPlanCard';
import AdvancedPlanCard from '@/components/subscription/AdvancedPlanCard';
import WhyPremiumCard from '@/components/subscription/WhyPremiumCard';
import SubscriptionFooter from '@/components/subscription/SubscriptionFooter';
import { supabase } from '@/lib/supabase/client';

const Subscription = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, profile, updateSubscriptionStatus } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  
  // Check if we're in test mode
  const searchParams = new URLSearchParams(location.search);
  const testMode = searchParams.get('testMode') === 'true';
  
  // Get the redirect path from session storage on mount
  useEffect(() => {
    const returnPath = sessionStorage.getItem('returnToAfterSubscription');
    if (returnPath) {
      setRedirectPath(returnPath);
    }
    
    console.log("Subscription page - testMode:", testMode);
    
    // If in test mode, simulate having a subscription already
    if (testMode && user) {
      console.log("In test mode with user - activating test subscription");
      setTimeout(() => {
        // Auto-activate in test mode after a short delay
        handleSubscribe('premium');
      }, 500);
    }
  }, [testMode, user]);

  const handleSubscribe = async (plan: string) => {
    try {
      setIsProcessing(true);
      
      // In test mode, skip the actual subscription process
      if (testMode) {
        toast({
          title: "Test Mode Subscription",
          description: `Your ${plan === 'advanced' ? 'Advanced' : 'Premium'} subscription has been activated in test mode.`,
        });
        
        // Update the user's profile to indicate they have a subscription (in-memory only for test mode)
        if (updateSubscriptionStatus) {
          await updateSubscriptionStatus(true);
        }
        
        // Redirect after a short delay
        setTimeout(() => {
          // Clear the redirect path from session storage
          sessionStorage.removeItem('returnToAfterSubscription');
          
          // Navigate to the redirect path with test mode param or default to dispute letters
          if (redirectPath) {
            const newPath = redirectPath + 
              (redirectPath.includes('?') ? '&' : '?') + 
              'testMode=true';
            console.log("Redirecting to:", newPath);
            navigate(newPath);
          } else {
            navigate('/dispute-letters?testMode=true');
          }
        }, 1000);
        
        return;
      }
      
      // In a real implementation, this would create a checkout session via Supabase
      const subscriptionData = {
        user_id: user?.id,
        plan_type: plan,
        status: 'active',
        created_at: new Date().toISOString()
      };
      
      // Update the user's subscription status in Supabase
      const { error } = await supabase
        .from('subscriptions')
        .insert(subscriptionData);
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Update the user's profile to indicate they have a subscription
      await supabase
        .from('profiles')
        .update({ has_subscription: true })
        .eq('id', user?.id);
      
      // Also update the context
      if (updateSubscriptionStatus) {
        await updateSubscriptionStatus(true);
      }
      
      toast({
        title: "Subscription activated",
        description: `Your ${plan === 'advanced' ? 'Advanced' : 'Premium'} subscription has been activated successfully.`,
      });
      
      // Redirect to the stored path or dispute letters page
      setTimeout(() => {
        // Clear the redirect path from session storage
        sessionStorage.removeItem('returnToAfterSubscription');
        
        // Navigate to the redirect path or default to dispute letters
        if (redirectPath) {
          navigate(redirectPath);
        } else {
          navigate('/dispute-letters');
        }
      }, 1500);
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Error",
        description: "There was a problem processing your subscription request.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <SubscriptionHeader />
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <PremiumPlanCard onSubscribe={handleSubscribe} isProcessing={isProcessing} />
            <AdvancedPlanCard onSubscribe={handleSubscribe} isProcessing={isProcessing} />
            <WhyPremiumCard />
          </div>
          
          {redirectPath && (
            <div className="text-center mb-12 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800">
                Subscribe to continue to your generated dispute letters.
              </p>
            </div>
          )}
          
          {testMode && (
            <div className="text-center mb-12 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800">
                <strong>Test Mode Active:</strong> You can click any plan to get instant access without actual payment.
                {!isProcessing && <span className="block mt-2">Auto-activating test subscription in a moment...</span>}
              </p>
            </div>
          )}
          
          <SubscriptionFooter />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Subscription;
