
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArrowUpRight } from 'lucide-react';

const SignupForm = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setShowDialog(true);
      
      toast({
        title: "Success!",
        description: "Your account has been created.",
        duration: 5000,
      });
    }, 1000);
  };

  return (
    <section id="signup" className="py-16 md:py-24 bg-credify-navy/5 dark:bg-credify-navy/40 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-credify-navy dark:text-white mb-4">
            Start Fixing Your Credit Today
          </h2>
          <p className="text-xl text-credify-navy-light dark:text-white/70">
            Join thousands of members who are improving their credit scores with our AI-powered platform.
          </p>
        </div>

        <div className="max-w-md mx-auto bg-white dark:bg-credify-navy/60 rounded-xl shadow-soft p-6 md:p-8 border border-gray-100 dark:border-gray-700/30">
          <h3 className="text-xl font-semibold text-credify-navy dark:text-white mb-6 text-center">
            Create Your Free Account
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-credify-navy-light dark:text-white/70 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-credify-navy/40 border border-gray-200 dark:border-gray-700/50 rounded-lg focus:ring-2 focus:ring-credify-teal focus:border-transparent transition-colors"
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-credify-navy-light dark:text-white/70 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-credify-navy/40 border border-gray-200 dark:border-gray-700/50 rounded-lg focus:ring-2 focus:ring-credify-teal focus:border-transparent transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-credify-teal hover:bg-credify-teal-light text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 border-2 border-white/70 border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : null}
                {isSubmitting ? "Creating Account..." : "Join Free for 7 Days"}
              </button>
            </div>
            
            <p className="text-xs text-center text-credify-navy-light dark:text-white/70">
              No credit card required. Cancel anytime.
            </p>
          </form>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-center">Your Account is Ready!</DialogTitle>
            <DialogDescription className="text-center">
              Before we start fixing your credit, you'll need your credit reports.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 flex flex-col items-center">
            <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-center mb-2">Get Your Free Credit Reports</h3>
            <p className="text-sm text-center text-credify-navy-light dark:text-white/70 mb-6">
              Federal law allows you to get a free copy of your credit report from each of the three major credit bureaus once every 12 months.
            </p>
            <a 
              href="https://www.annualcreditreport.com/index.action" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-credify-teal hover:bg-credify-teal-light text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center mb-4 w-full"
            >
              Get Free Credit Reports
              <ArrowUpRight size={16} className="ml-2" />
            </a>
            <p className="text-xs text-center text-credify-navy-light dark:text-white/70">
              This will take you to the official Annual Credit Report website.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SignupForm;
