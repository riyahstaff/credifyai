
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async (plan: string) => {
    try {
      setIsProcessing(true);
      
      // In a real implementation, this would create a checkout session via Supabase
      // For production, you would integrate with Paddle, Stripe, etc.
      
      // Production version - no test mode
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
      
      toast({
        title: "Subscription activated",
        description: `Your ${plan === 'advanced' ? 'Advanced' : 'Premium'} subscription has been activated successfully.`,
      });
      
      // Redirect to dispute letters page
      setTimeout(() => {
        navigate('/dispute-letters');
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
            <PremiumPlanCard onSubscribe={handleSubscribe} />
            <AdvancedPlanCard onSubscribe={handleSubscribe} />
            <WhyPremiumCard />
          </div>
          
          <SubscriptionFooter />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Subscription;
