
import React from 'react';
import AccountSummary from './AccountSummary';
import QuickActions from './QuickActions';
import RecentActivity from './RecentActivity';

interface DashboardSidebarProps {
  hasSubscription: boolean;
}

const DashboardSidebar = ({ hasSubscription }: DashboardSidebarProps) => {
  return (
    <div className="space-y-8">
      <AccountSummary hasSubscription={hasSubscription} />
      <QuickActions />
      <RecentActivity />
    </div>
  );
};

export default DashboardSidebar;
