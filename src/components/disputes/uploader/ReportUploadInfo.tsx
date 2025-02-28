
import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, FileText, FileCheck } from 'lucide-react';

const ReportUploadInfo: React.FC = () => {
  return (
    <>
      {/* What to Expect Section */}
      <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6 md:p-8 mb-8">
        <h2 className="text-xl font-semibold text-credify-navy dark:text-white mb-6">
          What to Expect
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-credify-teal/10 flex items-center justify-center mb-4">
              <Brain className="text-credify-teal" size={24} />
            </div>
            <h3 className="font-medium text-credify-navy dark:text-white mb-2">AI Analysis</h3>
            <p className="text-sm text-credify-navy-light dark:text-white/70">
              Our AI scans your report for errors, duplicate accounts, inaccurate balances, and other issues.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-credify-teal/10 flex items-center justify-center mb-4">
              <FileText className="text-credify-teal" size={24} />
            </div>
            <h3 className="font-medium text-credify-navy dark:text-white mb-2">Error Identification</h3>
            <p className="text-sm text-credify-navy-light dark:text-white/70">
              We'll identify potential errors and categorize them by impact level and relevant legal codes.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-credify-teal/10 flex items-center justify-center mb-4">
              <FileCheck className="text-credify-teal" size={24} />
            </div>
            <h3 className="font-medium text-credify-navy dark:text-white mb-2">Dispute Generation</h3>
            <p className="text-sm text-credify-navy-light dark:text-white/70">
              Generate customized dispute letters citing specific FCRA violations and legal requirements.
            </p>
          </div>
        </div>
      </div>
      
      {/* Supported Credit Reports */}
      <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6 md:p-8">
        <h2 className="text-xl font-semibold text-credify-navy dark:text-white mb-6">
          Supported Credit Reports
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-lg border border-gray-100 dark:border-gray-700/30">
            <h3 className="font-medium text-credify-navy dark:text-white mb-2">Experian</h3>
            <p className="text-sm text-credify-navy-light dark:text-white/70">
              Upload PDF or CSV report formats from Experian's consumer portal.
            </p>
          </div>
          
          <div className="p-4 rounded-lg border border-gray-100 dark:border-gray-700/30">
            <h3 className="font-medium text-credify-navy dark:text-white mb-2">Equifax</h3>
            <p className="text-sm text-credify-navy-light dark:text-white/70">
              Upload PDF or CSV report formats from Equifax's consumer portal.
            </p>
          </div>
          
          <div className="p-4 rounded-lg border border-gray-100 dark:border-gray-700/30">
            <h3 className="font-medium text-credify-navy dark:text-white mb-2">TransUnion</h3>
            <p className="text-sm text-credify-navy-light dark:text-white/70">
              Upload PDF or CSV report formats from TransUnion's consumer portal.
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-credify-navy-light dark:text-white/70 mb-4">
            We also support reports from Annual Credit Report, Credit Karma, and other major providers.
          </p>
          <Link to="/education/getting-reports" className="text-credify-teal hover:text-credify-teal-dark dark:hover:text-credify-teal-light font-medium text-sm transition-colors">
            Learn how to get your free credit reports →
          </Link>
        </div>
      </div>
    </>
  );
};

export default ReportUploadInfo;
