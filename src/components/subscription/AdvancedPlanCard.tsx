
import React from 'react';
import { Check } from 'lucide-react';

interface AdvancedPlanCardProps {
  onSubscribe: (plan: string) => void;
  isProcessing?: boolean;
}

const AdvancedPlanCard: React.FC<AdvancedPlanCardProps> = ({ onSubscribe, isProcessing = false }) => {
  return (
    <div className="bg-credify-navy dark:bg-credify-navy/60 rounded-xl shadow-lg border border-credify-navy-light/20 dark:border-credify-teal/20 p-6 flex flex-col h-full text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-16 -top-16 w-32 h-32 bg-credify-teal/20 rounded-full"></div>
      <div className="absolute -left-16 -bottom-16 w-40 h-40 bg-credify-teal/10 rounded-full"></div>
      
      <div className="mb-6 relative z-10">
        <span className="inline-block bg-credify-teal/20 text-credify-teal px-3 py-1 rounded-full text-sm font-medium mb-2">
          Best Value
        </span>
        <h3 className="text-xl font-bold">Advanced Plan</h3>
        <div className="mt-2">
          <span className="text-3xl font-bold">$39.99</span>
          <span className="text-white/70">/month</span>
        </div>
      </div>
      
      <ul className="space-y-3 mb-8 flex-grow relative z-10">
        <li className="flex items-start">
          <Check className="text-credify-teal mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
          <span className="text-white/80">Everything in Premium</span>
        </li>
        <li className="flex items-start">
          <Check className="text-credify-teal mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
          <span className="text-white/80">Priority dispute processing</span>
        </li>
        <li className="flex items-start">
          <Check className="text-credify-teal mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
          <span className="text-white/80">1-on-1 credit strategy call</span>
        </li>
        <li className="flex items-start">
          <Check className="text-credify-teal mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
          <span className="text-white/80">Custom legal argument creation</span>
        </li>
        <li className="flex items-start">
          <Check className="text-credify-teal mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
          <span className="text-white/80">Priority email & chat support</span>
        </li>
      </ul>
      
      <button 
        onClick={() => onSubscribe('advanced')}
        disabled={isProcessing}
        className={`btn-secondary w-full relative z-10 ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isProcessing ? (
          <>
            <span className="inline-block h-4 w-4 border-2 border-credify-navy/30 border-t-credify-navy rounded-full animate-spin mr-2"></span>
            Processing...
          </>
        ) : (
          'Get Advanced'
        )}
      </button>
    </div>
  );
};

export default AdvancedPlanCard;
