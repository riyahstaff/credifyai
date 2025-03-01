
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import SubscriptionHeader from '@/components/subscription/SubscriptionHeader';
import PremiumPlanCard from '@/components/subscription/PremiumPlanCard';
import WhyPremiumCard from '@/components/subscription/WhyPremiumCard';
import SubscriptionFooter from '@/components/subscription/SubscriptionFooter';

const Subscription = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();

  const handleSubscribe = async () => {
    try {
      // In a real implementation, this would create a Paddle checkout session via Supabase
      // For now, we'll simulate the process with a toast notification
      
      toast({
        title: "Redirecting to payment...",
        description: "You'll be redirected to our secure payment processor.",
      });
      
      // Simulate a redirect to Paddle checkout
      // In production, you would use Supabase's Paddle extension to create a checkout URL
      setTimeout(() => {
        toast({
          title: "This is a demo",
          description: "In production, this would redirect to Paddle checkout. For now, we'll simulate a successful payment.",
        });
        
        // For testing purposes, let's redirect back to dispute letters after a delay
        setTimeout(() => {
          navigate('/dispute-letters');
        }, 2000);
      }, 1500);
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Error",
        description: "There was a problem processing your subscription request.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <SubscriptionHeader />
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <PremiumPlanCard onSubscribe={handleSubscribe} />
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
