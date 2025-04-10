
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, FileText, CheckCircle } from 'lucide-react';

const Subscription = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleContinue = () => {
    // No payment needed for account creation, just redirect to dashboard
    navigate('/dashboard');
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="mb-8">
            <button 
              onClick={handleGoBack}
              className="flex items-center text-credify-navy-light dark:text-white/70 hover:text-credify-navy dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="mr-2" size={18} />
              Back
            </button>
          </div>
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-credify-navy dark:text-white mb-2">
              Account Created Successfully
            </h1>
            <p className="text-credify-navy-light dark:text-white/70 max-w-lg mx-auto">
              Your free account has been created. You now have access to credit monitoring tools and can generate dispute letters as needed.
            </p>
          </div>
          
          <div className="bg-white dark:bg-credify-navy/30 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6 md:p-8 mb-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="text-blue-500" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-credify-navy dark:text-white">
                  Pay-Per-Letter Model
                </h3>
                <p className="text-credify-navy-light dark:text-white/70">
                  Only pay when you need to send dispute letters
                </p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                <span className="text-credify-navy dark:text-white">
                  <strong>Free account access</strong> with no monthly fees
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                <span className="text-credify-navy dark:text-white">
                  <strong>$19.99 per dispute letter</strong> - only pay for what you need
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                <span className="text-credify-navy dark:text-white">
                  <strong>AI-powered dispute letter generator</strong> with proven templates
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                <span className="text-credify-navy dark:text-white">
                  <strong>Free credit monitoring</strong> and report analysis
                </span>
              </div>
            </div>
            
            <button 
              onClick={handleContinue}
              className="w-full bg-credify-teal hover:bg-credify-teal-dark text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <span>Continue to Dashboard</span>
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-credify-navy-light dark:text-white/70">
              Need help? Contact our support team at support@credify.ai
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Subscription;
