
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
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
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
