
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '@/contexts/auth';
import { ArrowRight, Check, Shield, Database } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/subscription');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-credify-navy dark:text-white mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-credify-navy-light dark:text-white/70 max-w-2xl mx-auto">
              Choose the plan that fits your credit repair needs. Both options include our powerful AI tools to help improve your credit score.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="monthly" className="w-full mb-8">
              <TabsList className="grid w-[200px] grid-cols-2 mx-auto">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="annual" disabled>Annual</TabsTrigger>
              </TabsList>
              
              <TabsContent value="monthly" className="mt-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Premium Plan */}
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
                        <span className="text-3xl font-bold text-credify-navy dark:text-white">$34.99</span>
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
                      onClick={handleGetStarted}
                      className="w-full bg-credify-teal hover:bg-credify-teal-dark text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Get Started</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                  
                  {/* Advanced Plan */}
                  <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6 md:p-8 relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-credify-teal to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                    
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <Database className="text-blue-500" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-credify-navy dark:text-white">
                          Advanced Access
                        </h3>
                        <p className="text-credify-navy-light dark:text-white/70">
                          Complete credit reporting control
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-baseline mb-1">
                        <span className="text-3xl font-bold text-credify-navy dark:text-white">$49.98</span>
                        <span className="text-credify-navy-light dark:text-white/70 ml-1">/month</span>
                      </div>
                      <p className="text-credify-navy-light dark:text-white/70 text-sm">
                        Includes Premium + Data Furnisher Disputes
                      </p>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-3">
                        <Check className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                        <span className="text-credify-navy dark:text-white">
                          <strong>All Premium features</strong> including AI dispute letter generator
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                        <span className="text-credify-navy dark:text-white">
                          <strong>Data furnisher disputes</strong> for Innovis, Lexis Nexis, CoreLogic, and more
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                        <span className="text-credify-navy dark:text-white">
                          <strong>Advanced Metro 2 compliance</strong> analysis with CDIA standards
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                        <span className="text-credify-navy dark:text-white">
                          <strong>Credit freeze automation</strong> across all reporting agencies
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                        <span className="text-credify-navy dark:text-white">
                          <strong>e-OSCAR platform</strong> dispute preparation assistance
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleGetStarted}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Get Started</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-12 text-center">
              <h3 className="text-xl font-bold text-credify-navy dark:text-white mb-4">
                Frequently Asked Questions
              </h3>
              <div className="max-w-3xl mx-auto text-left grid gap-6">
                <div className="bg-white dark:bg-credify-navy/20 rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-credify-navy dark:text-white mb-2">How do the subscription plans work?</h4>
                  <p className="text-credify-navy-light dark:text-white/70">
                    Both plans provide full access to our AI credit repair tools. You'll be billed monthly and can cancel at any time. The Advanced plan adds specialized dispute capabilities for secondary data furnishers.
                  </p>
                </div>
                <div className="bg-white dark:bg-credify-navy/20 rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-credify-navy dark:text-white mb-2">Can I upgrade or downgrade my plan?</h4>
                  <p className="text-credify-navy-light dark:text-white/70">
                    Yes, you can switch between Premium and Advanced plans at any time. Changes will take effect at the start of your next billing cycle.
                  </p>
                </div>
                <div className="bg-white dark:bg-credify-navy/20 rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-credify-navy dark:text-white mb-2">What payment methods do you accept?</h4>
                  <p className="text-credify-navy-light dark:text-white/70">
                    We accept all major credit cards, including Visa, Mastercard, American Express, and Discover. All payments are securely processed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;
