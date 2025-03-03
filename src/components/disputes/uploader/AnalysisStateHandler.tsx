
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditReportData, CreditReportAccount } from '@/utils/creditReportParser';
import AnalyzingReport from './AnalyzingReport';
import ReportAnalysisResults from './ReportAnalysisResults';
import UploadConfirmation from './UploadConfirmation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface AnalysisStateHandlerProps {
  fileUploaded: boolean;
  analyzing: boolean;
  analyzed: boolean;
  fileName: string;
  fileSize: string;
  reportData: CreditReportData | null;
  uploadedFile: File | null;
  issues: Array<{
    type: string;
    title: string;
    description: string;
    impact: 'High Impact' | 'Critical Impact' | 'Medium Impact';
    impactColor: string;
    account?: CreditReportAccount;
    laws: string[];
  }>;
  letterGenerated: boolean;
  analysisError: string | null;
  onResetUpload: () => void;
  onStartAnalysis: () => void;
  onGenerateDispute: (account?: CreditReportAccount) => void;
  onAnalysisComplete: () => Promise<void>;
}

const AnalysisStateHandler: React.FC<AnalysisStateHandlerProps> = ({
  fileUploaded,
  analyzing,
  analyzed,
  fileName,
  fileSize,
  reportData,
  uploadedFile,
  issues,
  letterGenerated,
  analysisError,
  onResetUpload,
  onStartAnalysis,
  onGenerateDispute,
  onAnalysisComplete
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();

  // Add an effect to check for a pending letter and navigate accordingly
  useEffect(() => {
    // Only proceed if we have a logged-in user
    if (!user) {
      console.log("User not logged in, not checking for letters");
      return;
    }
    
    // Check if user has an active subscription for navigation
    const hasSubscription = profile?.has_subscription === true;
    
    // Check if we have generated letters
    const checkForGeneratedLetters = () => {
      console.log("Checking for generated letters, letterGenerated:", letterGenerated);
      
      if (letterGenerated) {
        console.log("Letters generated flag is true, checking subscription status");
        
        if (!hasSubscription) {
          console.log("User does not have subscription, will navigate to subscription page");
          
          // Store intended destination to return after subscription
          sessionStorage.setItem('returnToAfterSubscription', '/dispute-letters');
          
          // Add short delay before navigation
          setTimeout(() => {
            navigate('/subscription');
          }, 300);
          
          return;
        }
        
        console.log("User has subscription, navigating to dispute-letters page");
        
        // Check if we have letters in session storage
        const pendingLetter = sessionStorage.getItem('pendingDisputeLetter');
        const generatedLetters = sessionStorage.getItem('generatedDisputeLetters');
        
        if (pendingLetter || generatedLetters) {
          console.log("Found letters in session storage, navigating to letters page");
          
          // Short delay to ensure everything is ready
          setTimeout(() => {
            navigate('/dispute-letters');
          }, 300);
        } else {
          console.log("No letters found in session storage despite letterGenerated flag");
        }
      }
    };
    
    // Run the check immediately and then set a short timeout as fallback
    checkForGeneratedLetters();
    const timer = setTimeout(checkForGeneratedLetters, 1000);
    
    return () => clearTimeout(timer);
  }, [letterGenerated, navigate, user, profile]);

  // Add debug logging to track state changes
  console.log("AnalysisStateHandler state:", { fileUploaded, analyzing, analyzed, letterGenerated, issuesCount: issues.length });

  // Ensure we have a valid upload before proceeding
  if (!fileUploaded) {
    return null;
  }

  // Show analyzing state
  if (analyzing) {
    return <AnalyzingReport onAnalysisComplete={onAnalysisComplete} />;
  }

  // Show analyzed state
  if (analyzed) {
    // If letterGenerated is true, immediately show a view while navigation happens
    if (letterGenerated) {
      console.log("Dispute letter generated, preparing navigation");
      
      // Get user subscription status
      const hasSubscription = profile?.has_subscription === true;
      
      // If user doesn't have subscription, show subscription message
      if (!hasSubscription) {
        return (
          <div className="text-center p-8">
            <div className="w-16 h-16 rounded-full border-4 border-t-credify-teal border-r-credify-teal/30 border-b-credify-teal/10 border-l-credify-teal/30 animate-spin mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-credify-navy dark:text-white mb-2">
              Dispute Letters Generated Successfully
            </h3>
            <p className="text-credify-navy-light dark:text-white/70 mb-8">
              A subscription is required to access your dispute letters. You'll be redirected to subscribe.
            </p>
            <button 
              onClick={() => navigate('/subscription')}
              className="btn-primary"
            >
              Continue to Subscription
            </button>
          </div>
        );
      }
      
      // Show loading state for users with subscriptions
      return (
        <div className="text-center p-8">
          <div className="w-16 h-16 rounded-full border-4 border-t-credify-teal border-r-credify-teal/30 border-b-credify-teal/10 border-l-credify-teal/30 animate-spin mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-credify-navy dark:text-white mb-2">
            Dispute Letters Generated
          </h3>
          <p className="text-credify-navy-light dark:text-white/70 mb-8">
            Your dispute letters have been generated and are ready to review.
          </p>
          <button 
            onClick={() => navigate('/dispute-letters')}
            className="btn-primary"
          >
            View Generated Letters
          </button>
        </div>
      );
    }
    
    // Force-display at least the 5 mandatory issues if none were found
    const displayIssues = issues.length > 0 ? issues : [
      {
        type: 'fcra',
        title: 'FCRA Verification Rights',
        description: 'Under the FCRA, you have the right to dispute any information in your credit report that you believe is inaccurate or incomplete.',
        impact: 'High Impact' as const,
        impactColor: 'orange',
        laws: ['FCRA § 611']
      },
      {
        type: 'account_verification',
        title: 'Account Verification Required',
        description: 'All accounts on your report must be fully verified by creditors with complete records when disputed.',
        impact: 'High Impact' as const,
        impactColor: 'orange',
        laws: ['FCRA § 611', 'FCRA § 623']
      },
      {
        type: 'potential_errors',
        title: 'Potential Reporting Errors',
        description: 'Credit reports often contain errors that can negatively impact your score. These may include incorrect balances, payment history, or account status.',
        impact: 'Critical Impact' as const,
        impactColor: 'red',
        laws: ['FCRA § 611']
      },
      {
        type: 'inquiry_verification',
        title: 'Inquiry Verification',
        description: 'Hard inquiries must be authorized by you. Unauthorized inquiries violate the FCRA and can be disputed.',
        impact: 'Medium Impact' as const,
        impactColor: 'yellow',
        laws: ['FCRA § 604', 'FCRA § 611']
      },
      {
        type: 'outdated_information',
        title: 'Outdated Negative Information',
        description: 'Most negative information must be removed after 7 years. Your report might contain outdated items that should be removed.',
        impact: 'High Impact' as const,
        impactColor: 'orange',
        laws: ['FCRA § 605']
      }
    ];
    
    // Show results with the guaranteed issues
    return (
      <div>
        <ReportAnalysisResults 
          issues={displayIssues}
          reportData={reportData}
          onResetUpload={onResetUpload}
          onGenerateDispute={onGenerateDispute}
        />
      </div>
    );
  }

  // Default to upload confirmation
  return (
    <UploadConfirmation
      fileName={fileName}
      fileSize={fileSize}
      onRemoveFile={onResetUpload}
      onStartAnalysis={onStartAnalysis}
    />
  );
};

export default AnalysisStateHandler;
