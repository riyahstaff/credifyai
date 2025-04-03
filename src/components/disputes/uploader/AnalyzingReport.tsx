
import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface AnalyzingReportProps {
  onAnalysisComplete: () => void;
  timeout?: number;
  testMode?: boolean;
}

const AnalyzingReport: React.FC<AnalyzingReportProps> = ({ 
  onAnalysisComplete,
  timeout = 8000,  // Reduced default timeout to 8 seconds
  testMode = false
}) => {
  const [progress, setProgress] = useState(10);
  const [stage, setStage] = useState('Starting analysis');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  
  // Use a shorter timeout for test mode
  const actualTimeout = testMode ? 3000 : timeout;
  
  // Simulate progress and update stages
  useEffect(() => {
    // Update progress using a variable increment for more realistic feedback
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        // Faster progress for better user experience
        // Even faster in test mode
        const increment = testMode ? 15 : (prev < 50 ? 8 : prev < 80 ? 5 : 2);
        const newProgress = Math.min(prev + increment, 90);
        return newProgress;
      });
      
      // Update time elapsed
      setTimeElapsed(prev => prev + 500);
    }, testMode ? 300 : 500); // Faster updates in test mode
    
    // Update stages based on progress
    const stageInterval = setInterval(() => {
      setStage(prevStage => {
        if (progress < 20) return 'Extracting text from report';
        if (progress < 40) return 'Analyzing account information';
        if (progress < 60) return 'Identifying potential issues';
        if (progress < 80) return 'Generating recommendations';
        return 'Finalizing analysis';
      });
    }, testMode ? 800 : 1500); // Faster stage updates in test mode
    
    // Show warning after 50% of timeout (but not in test mode)
    const warningTimeout = setTimeout(() => {
      if (progress < 80 && !isCompleted && !testMode) {
        setShowTimeoutWarning(true);
        console.log("Showing analysis timeout warning to user");
      }
    }, actualTimeout * 0.5);
    
    // Mark as complete after timeout
    // This ensures the analysis eventually "completes" even if there's a problem
    const timeoutId = setTimeout(() => {
      console.log("Analysis completion triggered by timeout");
      clearInterval(progressInterval);
      clearInterval(stageInterval);
      setIsCompleted(true);
      setProgress(100);
      setStage('Analysis complete');
      
      // Adding a slight delay before calling onAnalysisComplete
      setTimeout(() => {
        console.log("Calling onAnalysisComplete from timeout handler");
        onAnalysisComplete();
      }, 1000);
    }, actualTimeout);
    
    return () => {
      clearInterval(progressInterval);
      clearInterval(stageInterval);
      clearTimeout(timeoutId);
      clearTimeout(warningTimeout);
    };
  }, [onAnalysisComplete, progress, timeElapsed, actualTimeout, isCompleted, testMode]);
  
  // Effect for logging
  useEffect(() => {
    console.log(`Analysis progress: ${progress}%, Stage: ${stage}, Time elapsed: ${timeElapsed}ms, Test mode: ${testMode}`);
    
    // Debug test mode subscription when analyzing
    console.log("Test subscription status while analyzing:", 
      sessionStorage.getItem('testModeSubscription') || 'not set');
  }, [progress, stage, timeElapsed, testMode]);
  
  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-credify-navy dark:text-white mb-2">
          {isCompleted ? 'Analysis Complete' : 'Analyzing Your Credit Report'}
          {testMode && <span className="text-amber-500 text-sm ml-2">(Test Mode)</span>}
        </h3>
        <p className="text-credify-navy-light dark:text-white/70">
          {isCompleted 
            ? 'We\'ve finished analyzing your credit report and identified potential issues.' 
            : 'Please wait while we analyze your credit report to identify potential issues.'}
        </p>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
        <div 
          className="bg-credify-teal h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="flex items-center justify-center">
        <div className="text-sm text-credify-navy-light dark:text-white/70">
          {isCompleted ? (
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle size={18} />
              <span>Analysis complete</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-credify-teal rounded-full animate-pulse"></div>
              <span>{stage}...</span>
            </div>
          )}
        </div>
      </div>
      
      {testMode && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-300">Test Mode Active</h4>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                You're in test mode, so the analysis will complete quickly with sample data.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {showTimeoutWarning && !testMode && (
        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-amber-500 mt-0.5" size={18} />
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-300">Processing is taking longer than expected</h4>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                Your report is being processed but is taking longer than usual. The analysis will complete automatically in a few seconds.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyzingReport;
