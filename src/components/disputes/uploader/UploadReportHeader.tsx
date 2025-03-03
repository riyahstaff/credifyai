
import React from 'react';

const UploadReportHeader: React.FC = () => {
  return (
    <div className="mb-10 text-center">
      <h1 className="text-3xl font-bold text-credify-navy dark:text-white mb-4">Upload Your Credit Report</h1>
      <p className="text-lg text-credify-navy-light dark:text-white/70 max-w-2xl mx-auto">
        Our AI will analyze your credit report to identify errors, inaccuracies, and potential FCRA violations that can be disputed.
      </p>
    </div>
  );
};

export default UploadReportHeader;
