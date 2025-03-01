
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Shield, Check, CreditCard, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
          
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-credify-navy dark:text-white mb-4">
              Upgrade to Premium Access
            </h1>
            <p className="text-credify-navy-light dark:text-white/70 max-w-2xl mx-auto">
              Unlock our AI-powered dispute letter generator and advanced credit repair tools to improve your credit score faster.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-credify-teal/10 rounded-full flex items-center justify-center">
                  <Shield className="text-credify-teal" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-credify-navy dark:text-white">
                    Premium Access
                  </h3>
                  <p className="text-credify-navy-light dark:text-white/70">
                    Everything you need to fix your credit
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline mb-1">
                  <span className="text-3xl font-bold text-credify-navy dark:text-white">$19.99</span>
                  <span className="text-credify-navy-light dark:text-white/70 ml-1">/month</span>
                </div>
                <p className="text-credify-navy-light dark:text-white/70 text-sm">
                  Cancel anytime, no long-term contracts
                </p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Check className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                  <span className="text-credify-navy dark:text-white">
                    <strong>AI-powered dispute letter generator</strong> with proven templates
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                  <span className="text-credify-navy dark:text-white">
                    <strong>Credit report analysis</strong> to identify all disputable items
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                  <span className="text-credify-navy dark:text-white">
                    <strong>CLEO AI assistant</strong> for personalized credit repair guidance
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                  <span className="text-credify-navy dark:text-white">
                    <strong>Unlimited disputes</strong> across all three credit bureaus
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                  <span className="text-credify-navy dark:text-white">
                    <strong>FCRA compliance</strong> with legal citations in every letter
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleSubscribe}
                className="w-full bg-credify-teal hover:bg-credify-teal-dark text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard size={18} />
                <span>Subscribe Now</span>
              </button>
            </div>
            
            <div className="bg-credify-navy-light/5 dark:bg-credify-navy/40 rounded-xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-credify-navy dark:text-white mb-6">
                Why Credify Premium?
              </h3>
              
              <div className="space-y-6 mb-8">
                <div>
                  <h4 className="font-semibold text-credify-navy dark:text-white mb-2">
                    AI-Powered Credit Improvement
                  </h4>
                  <p className="text-credify-navy-light dark:text-white/70">
                    Our advanced AI analyzes your credit report and identifies the most impactful items to dispute, helping you prioritize what will increase your score fastest.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-credify-navy dark:text-white mb-2">
                    Legally Sound Dispute Letters
                  </h4>
                  <p className="text-credify-navy-light dark:text-white/70">
                    Every letter is crafted with precise legal language and relevant FCRA citations, proven to get results with credit bureaus and creditors.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-credify-navy dark:text-white mb-2">
                    24/7 AI Credit Assistant
                  </h4>
                  <p className="text-credify-navy-light dark:text-white/70">
                    Get instant answers to your credit repair questions and personalized guidance from our AI credit expert, CLEO.
                  </p>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700/30">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-credify-navy dark:text-white">
                      Average credit score improvement
                    </span>
                    <span className="font-bold text-credify-teal">
                      +53 points
                    </span>
                  </div>
                  <p className="text-credify-navy-light dark:text-white/70 text-sm mt-1">
                    Based on users who used our platform for 90+ days
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full border border-credify-navy/20 dark:border-white/20 bg-white dark:bg-credify-navy/60 hover:bg-gray-50 dark:hover:bg-credify-navy/80 text-credify-navy dark:text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span>View Dashboard</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-credify-navy-light dark:text-white/70 text-sm">
              Your subscription helps us provide you with the best tools and services to improve your credit. 
              By subscribing, you agree to our terms and conditions.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Subscription;
