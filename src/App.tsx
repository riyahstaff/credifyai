
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import Dashboard from './pages/Dashboard';
import UploadReport from './pages/UploadReport';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './pages/Login';
import TemplateManagerPage from './pages/TemplateManager';
import DisputeLetters from './pages/DisputeLetters';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Toaster />
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* Removed missing routes for Register, ForgotPassword, ResetPassword */}
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/dispute-letters" element={<PrivateRoute><DisputeLetters /></PrivateRoute>} />
          <Route path="/upload-report" element={<PrivateRoute><UploadReport /></PrivateRoute>} />
          <Route path="/template-manager" element={<PrivateRoute><TemplateManagerPage /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
