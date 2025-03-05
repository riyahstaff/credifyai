
import React from 'react';
import { Check } from 'lucide-react';

interface PremiumPlanCardProps {
  onSubscribe: (plan: string) => void;
  isProcessing?: boolean;
}

const PremiumPlanCard: React.FC<PremiumPlanCardProps> = ({ onSubscribe, isProcessing = false }) => {
  return (
    <div className="bg-white dark:bg-credify-navy/30 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700/30 p-6 flex flex-col h-full">
      <div className="mb-6">
        <span className="inline-block bg-credify-teal/10 text-credify-teal px-3 py-1 rounded-full text-sm font-medium mb-2">
          Most Popular
        </span>
        <h3 className="text-xl font-bold text-credify-navy dark:text-white">Premium Access</h3>
        <div className="mt-2">
          <span className="text-3xl font-bold text-credify-navy dark:text-white">$34.99</span>
          <span className="text-credify-navy-light dark:text-white/70">/month</span>
        </div>
      </div>
      
      <ul className="space-y-3 mb-8 flex-grow">
        <li className="flex items-start">
          <Check className="text-credify-teal mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
          <span className="text-credify-navy-light dark:text-white/80">AI-powered dispute letter generator with proven templates</span>
        </li>
        <li className="flex items-start">
          <Check className="text-credify-teal mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
          <span className="text-credify-navy-light dark:text-white/80">Credit report analysis to identify all disputable items</span>
        </li>
        <li className="flex items-start">
          <Check className="text-credify-teal mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
          <span className="text-credify-navy-light dark:text-white/80">CLEO AI assistant for personalized credit repair guidance</span>
        </li>
        <li className="flex items-start">
          <Check className="text-credify-teal mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
          <span className="text-credify-navy-light dark:text-white/80">Unlimited disputes across all three credit bureaus</span>
        </li>
        <li className="flex items-start">
          <Check className="text-credify-teal mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
          <span className="text-credify-navy-light dark:text-white/80">FCRA compliance with legal citations in every letter</span>
        </li>
      </ul>
      
      <button 
        onClick={() => onSubscribe('premium')}
        disabled={isProcessing}
        className={`btn-primary w-full ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isProcessing ? (
          <>
            <span className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
            Processing...
          </>
        ) : (
          'Get Premium'
        )}
      </button>
    </div>
  );
};

export default PremiumPlanCard;
