
import React from 'react';
import { Link } from 'react-router-dom';
import { FileUp, FileCheck, Brain } from 'lucide-react';

const QuickActions = () => {
  return (
    <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6">
      <h2 className="text-lg font-semibold text-credify-navy dark:text-white mb-6">Quick Actions</h2>
      
      <div className="space-y-3">
        <Link to="/upload-report" className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 rounded-lg transition-colors">
          <div className="w-10 h-10 rounded-full bg-credify-teal/10 flex items-center justify-center">
            <FileUp className="text-credify-teal" size={18} />
          </div>
          <span className="font-medium text-credify-navy dark:text-white">Upload New Report</span>
        </Link>
        
        <Link to="/dispute-letters/new" className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 rounded-lg transition-colors">
          <div className="w-10 h-10 rounded-full bg-credify-teal/10 flex items-center justify-center">
            <FileCheck className="text-credify-teal" size={18} />
          </div>
          <span className="font-medium text-credify-navy dark:text-white">Create New Letter</span>
        </Link>
        
        <Link to="/education" className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 rounded-lg transition-colors">
          <div className="w-10 h-10 rounded-full bg-credify-teal/10 flex items-center justify-center">
            <Brain className="text-credify-teal" size={18} />
          </div>
          <span className="font-medium text-credify-navy dark:text-white">Credit Education</span>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;
