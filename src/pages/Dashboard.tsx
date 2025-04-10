
import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '@/contexts/auth';
import LoadingIndicator from '@/components/dashboard/LoadingIndicator';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardContent from '@/components/dashboard/DashboardContent';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { profile, isLoading, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If loading is complete and no user is found, redirect to login
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [isLoading, user, navigate]);

  // Show loading indicator while auth state is being checked
  if (isLoading) {
    return <LoadingIndicator />;
  }

  // If no user or profile, this shouldn't render due to the useEffect redirect
  // but we'll add this check as a fallback
  if (!user) {
    return null;
  }

  // Get user's name from profile or email
  const userName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const hasSubscription = !!profile?.has_subscription;

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
            <DashboardSidebar hasSubscription={hasSubscription} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
