
import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import LoadingIndicator from '@/components/dashboard/LoadingIndicator';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardContent from '@/components/dashboard/DashboardContent';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

const Dashboard = () => {
  const { profile, isLoading, user } = useAuth();

  // If auth is still loading, show a loading indicator
  if (isLoading) {
    return <LoadingIndicator />;
  }

  // Generate a user display name
  const userName = profile?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Dashboard Header with Credit Score */}
          <DashboardHeader userName={userName} />
          
          {/* Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <DashboardContent />
            
            {/* Sidebar */}
            <DashboardSidebar hasSubscription={!!profile?.has_subscription} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
