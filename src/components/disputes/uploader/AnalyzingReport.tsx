
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
      console.log("Triggering analysis complete callback");
      callbackTriggered.current = true;
      onAnalysisComplete();
    }
  };

  useEffect(() => {
    isMounted.current = true;
    callbackTriggered.current = false;
    
    // Immediately call the callback - this ensures it happens regardless of animation
    const immediateCallback = setTimeout(() => {
      triggerCallback();
    }, 50);
    timeoutIds.current.push(immediateCallback);
    
    const updateSteps = () => {
      // Update first step immediately
      setSteps(prev => prev.map((step, i) => 
        i === 0 ? { ...step, progress: 100, isComplete: true } : step
      ));
      
      // Setup timeouts for subsequent steps - with very short intervals for faster progression
      const timeout1 = setTimeout(() => {
        if (isMounted.current) {
          setSteps(prev => prev.map((step, i) => 
            i === 1 ? { ...step, progress: 100, isComplete: true } : step
          ));
        }
      }, 100);
      timeoutIds.current.push(timeout1);
      
      const timeout2 = setTimeout(() => {
        if (isMounted.current) {
          setSteps(prev => prev.map((step, i) => 
            i === 2 ? { ...step, progress: 100, isComplete: true } : step
          ));
        }
      }, 200);
      timeoutIds.current.push(timeout2);
      
      const timeout3 = setTimeout(() => {
        if (isMounted.current) {
          setSteps(prev => prev.map((step, i) => 
            i === 3 ? { ...step, progress: 100, isComplete: true } : step
          ));
          setAnimationComplete(true);
        }
      }, 300);
      timeoutIds.current.push(timeout3);
    };
    
    // Start the animation
    updateSteps();
    
    // Safety timeout to ensure callback is triggered even if animation gets stuck
    const safetyTimeout = setTimeout(() => {
      console.log("Safety timeout triggered for analysis");
      triggerCallback();
    }, 1500);
    timeoutIds.current.push(safetyTimeout);
    
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
