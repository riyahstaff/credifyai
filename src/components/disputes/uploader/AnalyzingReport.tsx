
import React, { useEffect, useState } from 'react';
import { CircleCheck, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress'; // Correct import for Progress

interface AnalyzingReportProps {
  onAnalysisComplete?: () => void;
}

const AnalyzingReport: React.FC<AnalyzingReportProps> = ({ onAnalysisComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('Scanning document');

  useEffect(() => {
    const simulateProgress = () => {
      const interval = setInterval(() => {
        setProgress(prevProgress => {
          const nextProgress = prevProgress + 1;
          
          // Update the stage message based on progress
          if (nextProgress === 30) {
            setStage('Extracting account information');
          } else if (nextProgress === 60) {
            setStage('Analyzing for discrepancies');
          } else if (nextProgress === 85) {
            setStage('Preparing dispute recommendations');
          } else if (nextProgress >= 99) {
            clearInterval(interval);
            
            // Ensure onAnalysisComplete is called when progress completes
            if (onAnalysisComplete) {
              setTimeout(() => {
                onAnalysisComplete();
              }, 500);
            }
            return 100;
          }
          
          return nextProgress;
        });
      }, 100);
      
      return () => clearInterval(interval);
    };
    
    const simulation = simulateProgress();
    
    // Cleanup
    return () => {
      simulation();
    };
  }, [onAnalysisComplete]);

  return (
    <div className="text-center py-6">
      <div className="flex justify-center mb-6">
        {progress < 100 ? (
          <Loader2 className="h-12 w-12 animate-spin text-credify-teal" />
        ) : (
          <CircleCheck className="h-12 w-12 text-green-500" />
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-credify-navy dark:text-white mb-2">
        {progress < 100 ? "Analyzing Your Credit Report" : "Analysis Complete"}
      </h3>
      
      <p className="text-credify-navy-light dark:text-white/70 mb-6">
        {progress < 100 ? stage : "Ready to view results"}
      </p>
      
      <div className="w-full max-w-md mx-auto mb-4">
        <Progress value={progress} className="h-2" />
      </div>
      
      <p className="text-sm text-credify-navy-light dark:text-white/60">
        {progress < 100 ? `${progress}% complete` : "100% complete"}
      </p>
    </div>
  );
};

export default AnalyzingReport;
