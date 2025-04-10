
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import Dashboard from './pages/Dashboard';
import UploadReport from './pages/UploadReport';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './pages/Login';
import TemplateManagerPage from './pages/TemplateManager';
import DisputeLetters from './pages/DisputeLetters';
import LoadingIndicator from './components/dashboard/LoadingIndicator';
import Index from './pages/Index';

const App: React.FC = () => {
  useEffect(() => {
    // Log when App component mounts to verify initialization
    console.log('App component mounted');
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Toaster />
        <Suspense fallback={<LoadingIndicator />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Index />} /> {/* Ensure the Index route is properly defined */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/dispute-letters" element={<PrivateRoute><DisputeLetters /></PrivateRoute>} />
            <Route path="/upload-report" element={<PrivateRoute><UploadReport /></PrivateRoute>} />
            <Route path="/template-manager" element={<PrivateRoute><TemplateManagerPage /></PrivateRoute>} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
};

export default App;
