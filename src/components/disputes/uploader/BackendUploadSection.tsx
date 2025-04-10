
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import CreditReportBackendUploader from './CreditReportBackendUploader';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

interface BackendUploadSectionProps {
  onUploadSuccess: (reportId: string) => void;
  testMode?: boolean;
}

const BackendUploadSection: React.FC<BackendUploadSectionProps> = ({ 
  onUploadSuccess,
  testMode = false
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleUploadSuccess = (reportId: string) => {
    console.log("Backend upload successful with report ID:", reportId);
    
    // Set flag to indicate we're using the backend
    sessionStorage.setItem('usingBackendProcessor', 'true');
    
    // Call the onUploadSuccess callback
    onUploadSuccess(reportId);
    
    // Show success message
    toast({
      title: "Upload successful",
      description: "Your credit report has been uploaded and is being processed.",
      duration: 3000,
    });
    
    // Navigate to dispute letters page after a delay
    setTimeout(() => {
      navigate('/dispute-letters' + (testMode ? '?testMode=true' : ''));
    }, 3000);
  };

  // Check if user is logged in
  if (!user && !testMode) {
    return (
      <div className="mb-8 p-6 border-2 border-dashed border-gray-200 dark:border-gray-700/50 rounded-lg text-center">
        <h4 className="text-lg font-medium text-credify-navy dark:text-white mb-2">
          Login Required
        </h4>
        <p className="text-credify-navy-light dark:text-white/70 text-sm mb-4">
          You need to login to use our cloud processing service.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-credify-teal text-white rounded-md"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="border-b border-gray-200 dark:border-gray-700/30 pb-4 mb-6">
        <h3 className="text-xl font-semibold text-credify-navy dark:text-white">
          Upload to Cloud
          {testMode && <span className="text-amber-500 text-sm ml-2">(Test Mode)</span>}
        </h3>
        <p className="text-credify-navy-light dark:text-white/70 text-sm mt-1">
          Upload your credit report to our secure cloud for processing.
        </p>
      </div>
      
      <CreditReportBackendUploader
        onSuccess={handleUploadSuccess}
        testMode={testMode}
      />
    </div>
  );
};

export default BackendUploadSection;
