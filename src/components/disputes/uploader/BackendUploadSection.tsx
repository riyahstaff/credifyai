
import React from 'react';
import CreditReportBackendUploader from './CreditReportBackendUploader';

interface BackendUploadSectionProps {
  onUploadSuccess: (reportId: string) => void;
  testMode?: boolean;
}

const BackendUploadSection: React.FC<BackendUploadSectionProps> = ({
  onUploadSuccess,
  testMode = false
}) => {
  return (
    <div className="mb-8">
      <div className="border-b border-gray-200 dark:border-gray-700/30 pb-4 mb-6">
        <h3 className="text-xl font-semibold text-credify-navy dark:text-white">
          Upload to Cloud Storage
          {testMode && <span className="text-amber-500 text-sm ml-2">(Test Mode)</span>}
        </h3>
        <p className="text-credify-navy-light dark:text-white/70 text-sm mt-1">
          Upload your credit report to our secure cloud storage for advanced processing and automated dispute letter generation.
        </p>
      </div>
      
      <CreditReportBackendUploader
        onSuccess={onUploadSuccess}
        testMode={testMode}
      />
      
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/20 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Enhanced Features with Cloud Processing</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>More accurate issue detection with advanced AI</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Permanent storage of your reports and letters</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Automated follow-up and tracking for disputes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Better personalization of dispute letters</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BackendUploadSection;
