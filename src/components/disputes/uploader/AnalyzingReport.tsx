
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
  
  // Add state to track if animation is complete
  const [animationComplete, setAnimationComplete] = useState(false);
  // Use ref to track mounted state
  const isMounted = useRef(true);
  // Use ref to store timeout IDs
  const timeoutIds = useRef<NodeJS.Timeout[]>([]);
  // Track if callback was already triggered
  const callbackTriggered = useRef(false);

  useEffect(() => {
    // Set mounted flag to true when component mounts
    isMounted.current = true;
    callbackTriggered.current = false;
    
    // Simulate progress for each step
    const updateSteps = () => {
      // Update first step immediately
      setSteps(prev => prev.map((step, i) => 
        i === 0 ? { ...step, progress: 100, isComplete: true } : step
      ));
      
      // Setup timeouts for each subsequent step - shorter timeouts
      const timeout1 = setTimeout(() => {
        if (isMounted.current) {
          // Update second step
          setSteps(prev => prev.map((step, i) => 
            i === 1 ? { ...step, progress: 100, isComplete: true } : step
          ));
        }
      }, 800);
      timeoutIds.current.push(timeout1);
      
      const timeout2 = setTimeout(() => {
        if (isMounted.current) {
          // Update third step
          setSteps(prev => prev.map((step, i) => 
            i === 2 ? { ...step, progress: 100, isComplete: true } : step
          ));
        }
      }, 1600);
      timeoutIds.current.push(timeout2);
      
      const timeout3 = setTimeout(() => {
        if (isMounted.current) {
          // Update fourth step
          setSteps(prev => prev.map((step, i) => 
            i === 3 ? { ...step, progress: 100, isComplete: true } : step
          ));
        }
      }, 2400);
      timeoutIds.current.push(timeout3);
      
      // Mark animation as complete and call the callback after all steps
      const completionTimeout = setTimeout(() => {
        if (isMounted.current && !callbackTriggered.current) {
          console.log("Analysis animation complete, triggering callback");
          setAnimationComplete(true);
          callbackTriggered.current = true;
          
          // Notify parent that analysis animation is complete
          if (onAnalysisComplete) {
            onAnalysisComplete();
          }
        }
      }, 3000);
      timeoutIds.current.push(completionTimeout);
    };
    
    // Start the animation
    updateSteps();
    
    // Safety timeout to ensure callback is triggered even if animation gets stuck
    const safetyTimeout = setTimeout(() => {
      if (isMounted.current && !callbackTriggered.current) {
        console.log("Safety timeout triggered - forcing analysis completion");
        setAnimationComplete(true);
        callbackTriggered.current = true;
        
        if (onAnalysisComplete) {
          onAnalysisComplete();
        }
      }
    }, 5000);
    timeoutIds.current.push(safetyTimeout);
    
    // Cleanup function to clear all timeouts and update mounted state
    return () => {
      isMounted.current = false;
      // Clear all timeouts if component unmounts
      timeoutIds.current.forEach(id => clearTimeout(id));
      timeoutIds.current = [];
      
      // Make sure we trigger the callback if component unmounts before animation completes
      if (!callbackTriggered.current && onAnalysisComplete) {
        console.log("Component unmounting - triggering callback");
        callbackTriggered.current = true;
        onAnalysisComplete();
      }
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
