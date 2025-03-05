
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { CreditReportAccount, CreditReportData } from '@/utils/creditReportParser';
import { useReportStorage } from './useReportStorage';
import { forceNavigateToLetters } from '@/components/disputes/uploader/utils/bureauUtils';

export const useDisputeGeneration = (testMode: boolean = false) => {
  const [letterGenerated, setLetterGenerated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { storeForDispute } = useReportStorage();
  
  // Handle dispute generation
  const handleDisputeGeneration = (reportData: CreditReportData | null, account?: CreditReportAccount) => {
    // Validate we have report data
    if (!reportData) {
      toast({
        title: "Missing Data",
        description: "No report data available for dispute generation",
        variant: "destructive"
      });
      return;
    }
    
    // Store data for dispute
    const stored = storeForDispute(reportData, account);
    
    if (stored) {
      console.log("Data stored for dispute generation");
      setLetterGenerated(true);
      
      // Navigate to dispute letters page with delay
      setTimeout(() => {
        forceNavigateToLetters(navigate, testMode);
      }, 500);
    } else {
      console.error("Failed to store data for dispute");
      toast({
        title: "Error",
        description: "Failed to store data for dispute generation",
        variant: "destructive"
      });
    }
  };
  
  // Continue to letters page
  const handleContinueToLetters = () => {
    toast({
      title: "Navigating to Letters",
      description: "Taking you to your dispute letters",
    });
    
    setTimeout(() => {
      forceNavigateToLetters(navigate, testMode);
    }, 300);
  };
  
  return {
    letterGenerated,
    handleDisputeGeneration,
    handleContinueToLetters
  };
};
