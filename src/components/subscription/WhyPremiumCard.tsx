
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WhyPremiumCard = () => {
  const navigate = useNavigate();
  
  return (
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
  );
};

export default WhyPremiumCard;
