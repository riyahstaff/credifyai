
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
          Pay Per Letter
        </span>
        <h3 className="text-xl font-bold">Dispute Letter</h3>
        <div className="mt-2">
          <span className="text-3xl font-bold">$19.99</span>
          <span className="text-white/70">/letter</span>
        </div>
      </div>
      
      <ul className="space-y-3 mb-8 flex-grow relative z-10">
        <li className="flex items-start">
          <Check className="text-credify-teal mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
          <span className="text-white/80">AI-powered dispute letter generator with proven templates</span>
        </li>
        <li className="flex items-start">
          <Check className="text-credify-teal mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
          <span className="text-white/80">Pay only for the letters you need - no subscription</span>
        </li>
        <li className="flex items-start">
          <Check className="text-credify-teal mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
          <span className="text-white/80">FCRA compliance with legal citations in every letter</span>
        </li>
        <li className="flex items-start">
          <Check className="text-credify-teal mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
          <span className="text-white/80">Equifax, Experian, and TransUnion compatible formats</span>
        </li>
        <li className="flex items-start">
          <Check className="text-credify-teal mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
          <span className="text-white/80">Data furnisher disputes available (same price)</span>
        </li>
      </ul>
      
      <button 
        onClick={() => window.location.href = '/upload-report'}
        disabled={isProcessing}
        className={`btn-secondary w-full relative z-10 ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isProcessing ? (
          <>
            <span className="inline-block h-4 w-4 border-2 border-credify-navy/30 border-t-credify-navy rounded-full animate-spin mr-2"></span>
            Processing...
          </>
        ) : (
          'Upload Credit Report'
        )}
      </button>
    </div>
  );
};

export default AdvancedPlanCard;
