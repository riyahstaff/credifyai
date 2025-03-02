
import React from 'react';

const RecentActivity = () => {
  return (
    <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6">
      <h2 className="text-lg font-semibold text-credify-navy dark:text-white mb-6">Recent Activity</h2>
      
      <div className="py-8 flex flex-col items-center justify-center text-center">
        <p className="text-credify-navy-light dark:text-white/70">
          No recent activity yet. Upload a credit report to get started.
        </p>
      </div>
    </div>
  );
};

export default RecentActivity;
