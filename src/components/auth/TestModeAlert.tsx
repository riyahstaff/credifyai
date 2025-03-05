
import React from 'react';

const TestModeAlert = () => {
  return (
    <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-md">
      <p className="text-amber-800 dark:text-amber-300 text-sm font-medium">
        ⚠️ Test Mode Active
      </p>
      <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
        You'll be redirected to dashboard with premium features enabled after login.
      </p>
    </div>
  );
};

export default TestModeAlert;
