
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

const ActiveDisputes = () => {
  return (
    <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-credify-navy dark:text-white">Active Disputes</h2>
      </div>
      
      <div className="py-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center mb-4">
          <FileText className="text-gray-400" size={24} />
        </div>
        <h3 className="text-lg font-medium text-credify-navy dark:text-white mb-2">No active disputes</h3>
        <p className="text-credify-navy-light dark:text-white/70 max-w-md mb-6">
          Upload your credit report to identify potential errors and generate dispute letters.
        </p>
        <Link to="/upload-report" className="btn-primary">
          Upload Credit Report
        </Link>
      </div>
    </div>
  );
};

export default ActiveDisputes;
