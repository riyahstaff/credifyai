
import React from 'react';
import { FileUp, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FCRAComplianceSectionProps {
  showUploadReportButton?: boolean;
  hideCreateButton?: boolean;
  onUploadReport?: () => void;
  onCreateLetter?: () => void;
}

const FCRAComplianceSection: React.FC<FCRAComplianceSectionProps> = ({
  showUploadReportButton = false,
  hideCreateButton = false,
  onUploadReport,
  onCreateLetter
}) => {
  const navigate = useNavigate();
  
  const handleUploadReport = () => {
    if (onUploadReport) {
      onUploadReport();
    } else {
      navigate('/upload-report');
    }
  };

  return (
    <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/30 p-5 mt-8">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
          <Info size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-credify-navy dark:text-white mb-1">
            CLEO AI Credit Report Analysis
          </h3>
          <p className="text-credify-navy-light dark:text-white/70 mb-4">
            CLEO uses advanced AI to scan your credit reports, identify potential FCRA violations, and automatically generate customized dispute letters targeting specific issues. Upload your credit report to leverage deep analysis capabilities powered by state-of-the-art AI technology.
          </p>
          
          <div className="flex gap-3 mt-4">
            {showUploadReportButton && (
              <button
                onClick={handleUploadReport}
                className="btn-primary-sm flex items-center gap-1.5"
              >
                <FileUp size={16} />
                <span>Upload Credit Report</span>
              </button>
            )}
            
            {!hideCreateButton && onCreateLetter && (
              <button
                onClick={onCreateLetter}
                className="btn-outline-sm"
              >
                Create Manual Letter
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FCRAComplianceSection;
