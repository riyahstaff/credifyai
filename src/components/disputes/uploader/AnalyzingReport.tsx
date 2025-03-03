
import React, { useEffect, useState } from 'react';
import AnalysisProgress from './AnalysisProgress';

interface AnalyzingReportProps {
  steps?: Array<{
    name: string;
    progress: number;
    isComplete: boolean;
  }>;
  onAnalysisComplete?: () => void;
}

const AnalyzingReport: React.FC<AnalyzingReportProps> = ({ 
  steps: initialSteps,
  onAnalysisComplete 
}) => {
  const [steps, setSteps] = useState<Array<{
    name: string;
    progress: number;
    isComplete: boolean;
  }>>(initialSteps || [
    { name: 'Scanning personal information', progress: 0, isComplete: false },
    { name: 'Analyzing account information', progress: 0, isComplete: false },
    { name: 'Checking for FCRA violations', progress: 0, isComplete: false },
    { name: 'Preparing recommendations', progress: 0, isComplete: false },
  ]);

  useEffect(() => {
    let mounted = true;
    
    // Simulate progress for each step
    const updateSteps = async () => {
      // Update first step
      if (mounted) {
        setSteps(prev => prev.map((step, i) => 
          i === 0 ? { ...step, progress: 100, isComplete: true } : step
        ));
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update second step
      if (mounted) {
        setSteps(prev => prev.map((step, i) => 
          i === 1 ? { ...step, progress: 100, isComplete: true } : step
        ));
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update third step
      if (mounted) {
        setSteps(prev => prev.map((step, i) => 
          i === 2 ? { ...step, progress: 100, isComplete: true } : step
        ));
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update fourth step
      if (mounted) {
        setSteps(prev => prev.map((step, i) => 
          i === 3 ? { ...step, progress: 100, isComplete: true } : step
        ));
      }
      
      // Notify parent that analysis is complete
      if (mounted && onAnalysisComplete) {
        await new Promise(resolve => setTimeout(resolve, 500));
        onAnalysisComplete();
      }
    };
    
    updateSteps();
    
    return () => {
      mounted = false;
    };
  }, [onAnalysisComplete]);
  
  return (
    <div className="text-center p-8">
      <div className="w-20 h-20 rounded-full border-4 border-t-credify-teal border-r-credify-teal/40 border-b-credify-teal/10 border-l-credify-teal/40 animate-spin mx-auto mb-6"></div>
      
      <h3 className="text-xl font-semibold text-credify-navy dark:text-white mb-2">
        Analyzing Your Credit Report
      </h3>
      
      <p className="text-credify-navy-light dark:text-white/70 mb-8 max-w-md mx-auto">
        Our AI is carefully scanning your report for errors, inaccuracies, and potential FCRA violations.
      </p>
      
      <AnalysisProgress steps={steps} />
    </div>
  );
};

export default AnalyzingReport;
