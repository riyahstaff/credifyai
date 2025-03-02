
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

interface AccountSummaryProps {
  hasSubscription: boolean;
}

const AccountSummary = ({ hasSubscription }: AccountSummaryProps) => {
  return (
    <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6">
      <div className="flex items-center gap-2 mb-6">
        <User className="text-credify-teal" size={20} />
        <h2 className="text-lg font-semibold text-credify-navy dark:text-white">Account Summary</h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-credify-navy-light dark:text-white/70">Plan</span>
          <span className="font-medium text-credify-navy dark:text-white">
            {hasSubscription ? 'Premium' : 'Free'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-credify-navy-light dark:text-white/70">Reports Analyzed</span>
          <span className="font-medium text-credify-navy dark:text-white">0</span>
        </div>
        <div className="flex justify-between">
          <span className="text-credify-navy-light dark:text-white/70">Letters Generated</span>
          <span className="font-medium text-credify-navy dark:text-white">0</span>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700/30">
        <Link to="/account" className="text-credify-teal hover:text-credify-teal-dark dark:hover:text-credify-teal-light font-medium text-sm transition-colors">
          Manage Account →
        </Link>
      </div>
    </div>
  );
};

export default AccountSummary;
