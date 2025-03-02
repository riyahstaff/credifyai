
import React from 'react';
import { FileText } from 'lucide-react';

interface TemplatesTabContentProps {
  onUseTemplate: () => void;
}

const TemplatesTabContent: React.FC<TemplatesTabContentProps> = ({ onUseTemplate }) => {
  return (
    <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-4 md:p-6">
      <h2 className="text-xl font-bold text-credify-navy dark:text-white mb-6">Letter Templates</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Template Card */}
        <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-5 hover:shadow-md transition-all card-hover">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-credify-teal/10">
              <FileText size={24} className="text-credify-teal" />
            </div>
            <h3 className="text-lg font-semibold text-credify-navy dark:text-white">
              Standard Dispute Letter
            </h3>
          </div>
          
          <p className="text-credify-navy-light dark:text-white/70 mb-4">
            General-purpose dispute letter for addressing a wide range of credit report errors.
          </p>
          
          <div className="flex justify-end">
            <button
              onClick={onUseTemplate}
              className="text-credify-teal hover:text-credify-teal-dark dark:hover:text-credify-teal-light font-medium transition-colors"
            >
              Use Template →
            </button>
          </div>
        </div>
        
        {/* Template Card */}
        <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-5 hover:shadow-md transition-all card-hover">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-credify-teal/10">
              <FileText size={24} className="text-credify-teal" />
            </div>
            <h3 className="text-lg font-semibold text-credify-navy dark:text-white">
              Debt Verification
            </h3>
          </div>
          
          <p className="text-credify-navy-light dark:text-white/70 mb-4">
            Request debt validation and verification for accounts reported to credit bureaus.
          </p>
          
          <div className="flex justify-end">
            <button
              onClick={onUseTemplate}
              className="text-credify-teal hover:text-credify-teal-dark dark:hover:text-credify-teal-light font-medium transition-colors"
            >
              Use Template →
            </button>
          </div>
        </div>
        
        {/* Template Card */}
        <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-5 hover:shadow-md transition-all card-hover">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-credify-teal/10">
              <FileText size={24} className="text-credify-teal" />
            </div>
            <h3 className="text-lg font-semibold text-credify-navy dark:text-white">
              Fraud Alert Letter
            </h3>
          </div>
          
          <p className="text-credify-navy-light dark:text-white/70 mb-4">
            Dispute fraudulent accounts or inquiries that appear on your credit report.
          </p>
          
          <div className="flex justify-end">
            <button
              onClick={onUseTemplate}
              className="text-credify-teal hover:text-credify-teal-dark dark:hover:text-credify-teal-light font-medium transition-colors"
            >
              Use Template →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesTabContent;
