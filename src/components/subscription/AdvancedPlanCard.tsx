
import React from 'react';
import { Check, CreditCard, Database } from 'lucide-react';

interface AdvancedPlanCardProps {
  onSubscribe: (plan: string) => void;
}

const AdvancedPlanCard = ({ onSubscribe }: AdvancedPlanCardProps) => {
  return (
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
        onClick={() => onSubscribe('advanced')}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        <CreditCard size={18} />
        <span>Subscribe Now</span>
      </button>
    </div>
  );
};

export default AdvancedPlanCard;
