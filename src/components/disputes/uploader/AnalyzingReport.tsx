
import React, { useEffect, useState, useRef } from 'react';
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
  
  const [animationComplete, setAnimationComplete] = useState(false);
  const isMounted = useRef(true);
  const timeoutIds = useRef<NodeJS.Timeout[]>([]);
  const callbackTriggered = useRef(false);

  // Function to trigger the callback safely
  const triggerCallback = () => {
    if (isMounted.current && !callbackTriggered.current && onAnalysisComplete) {
      console.log("Triggering analysis complete callback from AnalyzingReport");
      callbackTriggered.current = true;
      onAnalysisComplete();
    }
  };

  useEffect(() => {
    isMounted.current = true;
    callbackTriggered.current = false;
    
    // First update step 1 to 100%
    setSteps(prev => prev.map((step, idx) => 
      idx === 0 ? { ...step, progress: 100, isComplete: true } : step
    ));
    
    // After 300ms update step 2 to 100%
    const timeout1 = setTimeout(() => {
      if (!isMounted.current) return;
      setSteps(prev => prev.map((step, idx) => 
        idx <= 1 ? { ...step, progress: 100, isComplete: true } : step
      ));
    }, 300);
    
    // After 600ms update step 3 to 100%
    const timeout2 = setTimeout(() => {
      if (!isMounted.current) return;
      setSteps(prev => prev.map((step, idx) => 
        idx <= 2 ? { ...step, progress: 100, isComplete: true } : step
      ));
    }, 600);
    
    // After 900ms update step 4 to 100% and set animationComplete
    const timeout3 = setTimeout(() => {
      if (!isMounted.current) return;
      setSteps(prev => prev.map(step => ({ ...step, progress: 100, isComplete: true })));
      setAnimationComplete(true);
    }, 900);
    
    // After 1000ms trigger the callback
    const callbackTimeout = setTimeout(() => {
      triggerCallback();
    }, 1000);
    
    // Store all timeouts for cleanup
    timeoutIds.current = [timeout1, timeout2, timeout3, callbackTimeout];
    
    // Cleanup function
    return () => {
      console.log("AnalyzingReport unmounting");
      isMounted.current = false;
      
      // Clear all timeouts
      timeoutIds.current.forEach(id => clearTimeout(id));
      timeoutIds.current = [];
      
      // Final chance to trigger the callback if not already done
      triggerCallback();
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
