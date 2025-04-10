
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '@/contexts/auth';
import { ArrowRight, Check, FileText } from 'lucide-react';

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/upload-report');
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
              Simple Pay-Per-Letter Pricing
            </h1>
            <p className="text-credify-navy-light dark:text-white/70 max-w-2xl mx-auto">
              Sign up for free and only pay when you generate dispute letters. No monthly fees or subscriptions.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Free Account */}
              <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <FileText className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-credify-navy dark:text-white">
                      Free Account
                    </h3>
                    <p className="text-credify-navy-light dark:text-white/70">
                      Full access to credit monitoring tools
                    </p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-baseline mb-1">
                    <span className="text-3xl font-bold text-credify-navy dark:text-white">$0</span>
                    <span className="text-credify-navy-light dark:text-white/70 ml-1">/forever</span>
                  </div>
                  <p className="text-credify-navy-light dark:text-white/70 text-sm">
                    No credit card required to sign up
                  </p>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <Check className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                    <span className="text-credify-navy dark:text-white">
                      <strong>Free credit score monitoring</strong> with alerts
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
                      <strong>Credit advice</strong> and educational resources
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handleGetStarted}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <span>Sign Up Free</span>
                  <ArrowRight size={18} />
                </button>
              </div>
              
              {/* Per-Letter Pricing */}
              <div className="bg-credify-navy dark:bg-credify-navy/60 rounded-xl shadow-lg border border-credify-navy-light/20 dark:border-credify-teal/20 p-6 md:p-8 text-white relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute -right-16 -top-16 w-32 h-32 bg-credify-teal/20 rounded-full"></div>
                <div className="absolute -left-16 -bottom-16 w-40 h-40 bg-credify-teal/10 rounded-full"></div>
                
                <div className="mb-6 relative z-10">
                  <span className="inline-block bg-credify-teal/20 text-credify-teal px-3 py-1 rounded-full text-sm font-medium mb-2">
                    Pay Per Letter
                  </span>
                  <h3 className="text-xl font-bold">AI Dispute Letters</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$19.99</span>
                    <span className="text-white/70">/letter</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8 flex-grow relative z-10">
                  <li className="flex items-start">
                    <Check className="text-credify-teal mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80"><strong>AI-powered dispute letter generator</strong> with proven templates</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-credify-teal mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80"><strong>Pay only for the letters you need</strong> - no subscription required</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-credify-teal mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80"><strong>FCRA compliance</strong> with legal citations in every letter</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-credify-teal mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80"><strong>All bureau formats</strong> for Equifax, Experian, and TransUnion</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-credify-teal mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80"><strong>Additional data furnisher disputes</strong> for comprehensive coverage</span>
                  </li>
                </ul>
                
                <button 
                  onClick={handleGetStarted}
                  className="w-full bg-credify-teal hover:bg-credify-teal-light text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 relative z-10"
                >
                  <span>Get Started</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <h3 className="text-xl font-bold text-credify-navy dark:text-white mb-4">
                Frequently Asked Questions
              </h3>
              <div className="max-w-3xl mx-auto text-left grid gap-6">
                <div className="bg-white dark:bg-credify-navy/20 rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-credify-navy dark:text-white mb-2">How does the pay-per-letter model work?</h4>
                  <p className="text-credify-navy-light dark:text-white/70">
                    Sign up for free and use all monitoring tools at no cost. When you're ready to send a dispute letter, you'll pay a one-time fee of $19.99 per letter with no ongoing subscription.
                  </p>
                </div>
                <div className="bg-white dark:bg-credify-navy/20 rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-credify-navy dark:text-white mb-2">What payment methods do you accept?</h4>
                  <p className="text-credify-navy-light dark:text-white/70">
                    We accept all major credit cards, including Visa, Mastercard, American Express, and Discover. All payments are securely processed.
                  </p>
                </div>
                <div className="bg-white dark:bg-credify-navy/20 rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-credify-navy dark:text-white mb-2">Is my information secure?</h4>
                  <p className="text-credify-navy-light dark:text-white/70">
                    Yes, we use bank-level encryption to secure your data. We never share your personal information with third parties without your consent.
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
