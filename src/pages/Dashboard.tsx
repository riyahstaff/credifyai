
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
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { profile, isLoading, user } = useAuth();
  const [authTimeout, setAuthTimeout] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Add a state to force a demo view after a certain timeout
  const [forceDemo, setForceDemo] = useState(false);

  useEffect(() => {
    // Mark auth as checked immediately if we have a user or explicit loading is false
    if (!isLoading || user) {
      setAuthChecked(true);
    }
    
    console.log("Dashboard auth state:", { user, isLoading, profile, authChecked });
    
    // Very short timeout (2 seconds) to show dashboard even if auth is slow
    const timeoutId = setTimeout(() => {
      console.log("Auth timeout check triggered");
      if (!authChecked) {
        console.log("Auth timeout occurred, showing dashboard in demo mode");
        setAuthTimeout(true);
        setAuthChecked(true);
        setForceDemo(true);
        
        toast({
          title: "Loading dashboard",
          description: "Showing preview mode while we connect to services.",
          duration: 3000,
        });
      }
    }, 2000); // Reduced from 3000 to 2000ms for faster response
    
    // Force demo mode after 5 seconds no matter what
    const forceDemoId = setTimeout(() => {
      if (!user) {
        console.log("Forcing demo mode after extended wait");
        setForceDemo(true);
        setAuthChecked(true);
        
        toast({
          title: "Preview Mode Active",
          description: "Viewing dashboard in demo mode for preview.",
          duration: 3000,
        });
      }
    }, 5000);
    
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(forceDemoId);
    };
  }, [isLoading, toast, user, profile, authChecked]);

  // If still in initial loading state and not forcing demo, show a loading indicator
  if (!authChecked && !forceDemo) {
    console.log("Showing loading indicator");
    return <LoadingIndicator />;
  }

  // Dashboard view with or without authentication
  const userName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const isAuthenticated = !!user;

  console.log("Rendering dashboard with auth state:", { isAuthenticated, userName, authTimeout, forceDemo });

  // Enable test mode for previews
  if (window.location.host.includes('lovableproject.com') && !sessionStorage.getItem('testModeSubscription')) {
    sessionStorage.setItem('testModeSubscription', 'true');
  }

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
            <DashboardSidebar hasSubscription={!!profile?.has_subscription || forceDemo} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
