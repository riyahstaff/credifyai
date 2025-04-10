
import React from 'react';
import ActiveDisputes from './ActiveDisputes';
import AiInsights from './AiInsights';

const DashboardContent = () => {
  return (
    <div className="lg:col-span-2 space-y-8">
      <ActiveDisputes />
      <AiInsights />
    </div>
  );
};

export default DashboardContent;
