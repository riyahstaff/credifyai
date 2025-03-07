
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/auth";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import UploadReport from "./pages/UploadReport";
import DisputeLetters from "./pages/DisputeLetters";
import Education from "./pages/Education";
import ArticleDetail from "./pages/ArticleDetail";
import VideoDetail from "./pages/VideoDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRoute from "./components/auth/PrivateRoute";
import Subscription from "./pages/Subscription";
import Pricing from "./pages/Pricing";
import DisputeAgent from "./components/ai/DisputeAgent";
import { useEffect } from "react";

// Debug component to help understand routing issues
const RouteLogger = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log("Current route:", {
      pathname: location.pathname,
      search: location.search,
      fullPath: location.pathname + location.search,
      testMode: new URLSearchParams(location.search).get('testMode')
    });
  }, [location]);
  
  return null;
};

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <RouteLogger />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/subscription" element={
                <PrivateRoute>
                  <Subscription />
                </PrivateRoute>
              } />
              
              {/* Protected Routes (require login) */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/upload-report" element={
                <PrivateRoute>
                  <UploadReport />
                </PrivateRoute>
              } />
              
              {/* Protected Premium Routes (require subscription) */}
              <Route path="/dispute-letters" element={
                <PrivateRoute requiresSubscription={true}>
                  <DisputeLetters />
                </PrivateRoute>
              } />
              
              {/* Public Routes */}
              <Route path="/education" element={<Education />} />
              <Route path="/education/articles/:slug" element={<ArticleDetail />} />
              <Route path="/education/videos/:slug" element={<VideoDetail />} />
              
              {/* Not Found Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            {/* Global DisputeAgent component that's always available */}
            <DisputeAgent onGenerateDispute={() => {}} />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
