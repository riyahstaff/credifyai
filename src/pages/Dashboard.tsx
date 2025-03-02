
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import LoadingIndicator from '@/components/dashboard/LoadingIndicator';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardContent from '@/components/dashboard/DashboardContent';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const Dashboard = () => {
  const { profile, isLoading, user } = useAuth();
  const [authTimeout, setAuthTimeout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if auth is taking too long (10 seconds)
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setAuthTimeout(true);
      }
    }, 10000);
    
    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  useEffect(() => {
    // Force re-render to ensure auth state is correctly reflected
    const timer = setTimeout(() => {
      console.log("Dashboard checking auth state:", { user, isLoading, profile });
    }, 500);
    
    return () => clearTimeout(timer);
  }, [user, isLoading, profile]);

  // If auth is still loading and hasn't timed out, show a loading indicator
  if (isLoading && !authTimeout) {
    return <LoadingIndicator />;
  }

  // If auth has timed out or there's an issue, show dashboard with warning
  const userName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const isAuthenticated = !!user;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {!isAuthenticated && (
            <Alert variant="destructive" className="mb-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Authentication Issue</AlertTitle>
              <AlertDescription>
                <p className="mb-2">You're viewing the dashboard in demo mode because we couldn't authenticate you. This could be due to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>You haven't logged in yet</li>
                  <li>Authentication service connection issues</li>
                  <li>Preview environment limitations</li>
                </ul>
                <p className="mt-3 font-medium">
                  <a href="/login" className="text-red-100 underline">Log in</a> for full access, or continue exploring in demo mode.
                </p>
              </AlertDescription>
            </Alert>
          )}
          
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
