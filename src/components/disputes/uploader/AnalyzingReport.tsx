
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
  
  // Add state to track if animation is complete
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    let mounted = true;
    let timeoutIds: number[] = [];
    
    // Simulate progress for each step
    const updateSteps = async () => {
      try {
        // Update first step
        if (mounted) {
          setSteps(prev => prev.map((step, i) => 
            i === 0 ? { ...step, progress: 100, isComplete: true } : step
          ));
        }
        
        // Add each timeout ID to our array so we can clear them if component unmounts
        const timeout1 = setTimeout(() => {
          if (mounted) {
            // Update second step
            setSteps(prev => prev.map((step, i) => 
              i === 1 ? { ...step, progress: 100, isComplete: true } : step
            ));
          }
        }, 1000);
        timeoutIds.push(timeout1);
        
        const timeout2 = setTimeout(() => {
          if (mounted) {
            // Update third step
            setSteps(prev => prev.map((step, i) => 
              i === 2 ? { ...step, progress: 100, isComplete: true } : step
            ));
          }
        }, 2500);
        timeoutIds.push(timeout2);
        
        const timeout3 = setTimeout(() => {
          if (mounted) {
            // Update fourth step
            setSteps(prev => prev.map((step, i) => 
              i === 3 ? { ...step, progress: 100, isComplete: true } : step
            ));
          }
        }, 3500);
        timeoutIds.push(timeout3);
        
        // Mark animation as complete and call the callback after all steps
        const completionTimeout = setTimeout(() => {
          if (mounted) {
            console.log("Analysis animation complete, triggering callback");
            setAnimationComplete(true);
            
            // Notify parent that analysis animation is complete
            if (onAnalysisComplete) {
              onAnalysisComplete();
            }
          }
        }, 4000);
        timeoutIds.push(completionTimeout);
      } catch (error) {
        console.error("Error in analysis progress animation:", error);
        // If there's an error, still try to complete the analysis
        if (mounted && onAnalysisComplete) {
          onAnalysisComplete();
        }
      }
    };
    
    updateSteps();
    
    return () => {
      mounted = false;
      // Clear all timeouts if component unmounts
      timeoutIds.forEach(id => clearTimeout(id));
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
