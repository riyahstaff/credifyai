
import React, { useState, useEffect, useRef } from 'react';
import { ProgressBar } from '@/components/ui/progress';

interface AnalysisStep {
  name: string;
  progress: number;
  isComplete: boolean;
}

interface AnalyzingReportProps {
  onAnalysisComplete?: () => void;
  steps?: AnalysisStep[];
}

const AnalyzingReport: React.FC<AnalyzingReportProps> = ({ 
  onAnalysisComplete,
  steps: initialSteps
}) => {
  // Use default steps if none provided
  const defaultSteps: AnalysisStep[] = [
    { name: 'Scanning personal information', progress: 0, isComplete: false },
    { name: 'Analyzing account information', progress: 0, isComplete: false },
    { name: 'Checking for FCRA violations', progress: 0, isComplete: false },
    { name: 'Preparing recommendations', progress: 0, isComplete: false }
  ];
  
  const [steps, setSteps] = useState<AnalysisStep[]>(initialSteps || defaultSteps);
  const callbackTriggered = useRef(false);
  const timeoutsRef = useRef<number[]>([]);

  // Function to update step progress
  const updateStepProgress = (index: number, progress: number, isComplete: boolean = false) => {
    setSteps(prevSteps => {
      const newSteps = [...prevSteps];
      newSteps[index] = {
        ...newSteps[index],
        progress,
        isComplete
      };
      return newSteps;
    });
  };
  
  // Function to trigger completion callback
  const triggerCallback = () => {
    if (onAnalysisComplete && !callbackTriggered.current) {
      console.log("Triggering analysis complete callback from AnalyzingReport");
      callbackTriggered.current = true;
      onAnalysisComplete();
    }
  };

  // Effect to animate the progress bars
  useEffect(() => {
    // Clear any existing timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    
    // Call the completion callback immediately to prevent hanging
    // This ensures the analysis process continues even if animations are slow
    triggerCallback();
    
    // Animate each step (just for visual effect)
    steps.forEach((step, index) => {
      const animateStep = (progress: number) => {
        if (progress <= 100) {
          updateStepProgress(index, progress, progress === 100);
          
          const timeout = window.setTimeout(() => {
            animateStep(progress + 5);
          }, 100);
          
          timeoutsRef.current.push(timeout);
        }
      };
      
      // Stagger the start of each animation
      const startTimeout = window.setTimeout(() => {
        animateStep(0);
      }, index * 500);
      
      timeoutsRef.current.push(startTimeout);
    });
    
    // Make sure to call completion again after all animations complete
    const finalTimeout = window.setTimeout(() => {
      triggerCallback();
    }, steps.length * 500 + 2000);
    
    timeoutsRef.current.push(finalTimeout);
    
    // Cleanup function
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      // Ensure callback is triggered if component unmounts
      triggerCallback();
    };
  }, []);
  
  // Backup timeout to ensure analysis completes even if something goes wrong
  useEffect(() => {
    const backupTimeout = window.setTimeout(() => {
      console.log("Backup timeout ensuring analysis completes");
      triggerCallback();
    }, 5000); // 5 second backup

    return () => clearTimeout(backupTimeout);
  }, []);

  return (
    <div className="text-center p-4">
      <h3 className="text-xl font-semibold mb-2 text-credify-navy dark:text-white">
        Analyzing Your Credit Report
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Our AI is carefully scanning your report for errors, inaccuracies, and potential FCRA violations.
      </p>
      
      <div className="space-y-6 max-w-lg mx-auto">
        {steps.map((step, index) => (
          <div key={index} className="text-left">
            <div className="flex justify-between mb-1">
              <span className={`text-sm font-medium ${step.isComplete ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                {step.name}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {step.progress}%
              </span>
            </div>
            <ProgressBar value={step.progress} className={step.isComplete ? 'bg-green-500' : undefined} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyzingReport;
