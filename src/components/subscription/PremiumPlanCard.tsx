
import React from 'react';
import { Check, CreditCard, Shield } from 'lucide-react';

interface PremiumPlanCardProps {
  onSubscribe: () => void;
}

const PremiumPlanCard = ({ onSubscribe }: PremiumPlanCardProps) => {
  return (
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
        onClick={onSubscribe}
        className="w-full bg-credify-teal hover:bg-credify-teal-dark text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        <CreditCard size={18} />
        <span>Subscribe Now</span>
      </button>
    </div>
  );
};

export default PremiumPlanCard;
