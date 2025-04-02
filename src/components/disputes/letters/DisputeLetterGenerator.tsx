import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { generateEnhancedDisputeLetter } from '@/lib/supabase/letterGenerator';
import { CreditReportData } from '@/utils/creditReport/types';

interface Letter {
  id: number;
  title: string;
  recipient: string;
  createdAt: string;
  status: string;
  bureaus: string[];
  laws: string[];
  content: string;
  resolvedAt?: string;
}

interface DisputeLetterGeneratorProps {
  onAddNewLetter: (newLetter: Letter) => void;
  saveLetter: (disputeData: any) => Promise<boolean>;
}

/**
 * Custom hook for dispute letter generation
 */
export const useDisputeLetterGenerator = ({ 
  onAddNewLetter,
  saveLetter
}: DisputeLetterGeneratorProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const location = useLocation();
  
  // Check if we're in test mode
  const searchParams = new URLSearchParams(location.search);
  const testMode = searchParams.get('testMode') === 'true';

  // Log test mode status
  useEffect(() => {
    if (testMode) {
      console.log("DisputeLetterGenerator: Test mode active");
    }
  }, [testMode]);

  const handleGenerateDispute = async (disputeData: any) => {
    setIsGenerating(true);
    console.log('Generating dispute with full data:', {
      accountName: disputeData.accountName,
      accountNumber: disputeData.accountNumber,
      bureau: disputeData.bureau,
      errorType: disputeData.errorType,
      hasActualAccount: !!disputeData.actualAccountInfo
    });
    
    try {
      // First check if we have report data in session storage
      let creditReportData: CreditReportData | null = null;
      const storedReportData = sessionStorage.getItem('creditReportData');
      let rawReportText = '';
      const lastReportText = sessionStorage.getItem('lastReportText');
      
      if (lastReportText) {
        rawReportText = lastReportText;
        console.log("Found stored raw report text, length:", rawReportText.length);
      }
      
      if (storedReportData) {
        try {
          creditReportData = JSON.parse(storedReportData) as CreditReportData;
          console.log("Found stored credit report data:", 
            creditReportData ? {
              personalInfo: creditReportData.personalInfo,
              accountsCount: creditReportData.accounts?.length,
              bureausDetected: Object.entries(creditReportData.bureaus)
                .filter(([_, present]) => present)
                .map(([bureau]) => bureau)
                .join(', ')
            } : "No report data"
          );
        } catch (e) {
          console.error("Error parsing stored credit report data:", e);
        }
      }
      
      // Extract user info from storage or dispute data
      const userInfo = {
        name: localStorage.getItem('userName') || localStorage.getItem('name') || "[YOUR NAME]",
        address: localStorage.getItem('userAddress') || "[YOUR ADDRESS]",
        city: localStorage.getItem('userCity') || "[CITY]",
        state: localStorage.getItem('userState') || "[STATE]",
        zip: localStorage.getItem('userZip') || "[ZIP]"
      };
      
      console.log("User info for letter:", userInfo);
      console.log("Account info for letter:", disputeData.actualAccountInfo || disputeData);
      
      // Get actual account info from the dispute data
      const actualAccountInfo = disputeData.actualAccountInfo || {};
      
      // Clean up account name and format it consistently
      const accountName = actualAccountInfo.name || disputeData.accountName || "Unknown Account";
      const formattedAccountName = accountName.toUpperCase();
      
      // Format account number with proper masking
      const rawAccountNumber = actualAccountInfo.number || disputeData.accountNumber || "";
      let accountNumber = rawAccountNumber;
      
      if (rawAccountNumber) {
        if (rawAccountNumber.length > 4 && !rawAccountNumber.includes('xx-xxxx-')) {
          accountNumber = `xx-xxxx-${rawAccountNumber.slice(-4)}`;
        } else if (!rawAccountNumber.includes('xx-xxxx-')) {
          accountNumber = `xx-xxxx-${rawAccountNumber}`;
        }
      } else {
        // If no account number, create a placeholder
        accountNumber = "xx-xxxx-1000";
      }
      
      // Try to find actual report data relevant to this account
      let relevantReportText = '';
      
      if (rawReportText && formattedAccountName && formattedAccountName !== "UNKNOWN ACCOUNT") {
        // Create a regex to find text around the account name
        const accountNamePattern = new RegExp(`([^]*?${formattedAccountName}[^]*?)(?=\\n\\n|$)`, 'i');
        const match = rawReportText.match(accountNamePattern);
        
        if (match && match[1]) {
          relevantReportText = match[1];
          console.log(`Found relevant report text for ${formattedAccountName}, length: ${relevantReportText.length}`);
        }
      }
      
      // If letterContent is not provided, generate it
      if (!disputeData.letterContent) {
        // Generate letter content with detailed account information
        console.log("Generating enhanced dispute letter with real report data");
        
        disputeData.letterContent = await generateEnhancedDisputeLetter(
          disputeData.errorType,
          {
            accountName: formattedAccountName,
            accountNumber: accountNumber,
            errorDescription: disputeData.explanation,
            bureau: disputeData.bureau
          },
          userInfo,
          creditReportData // Pass the credit report data to enhance the letter
        );
        
        // Make sure the letter has the correct format for the account section
        if (disputeData.letterContent) {
          const accountSection = `
DISPUTED ITEM(S):
Account Name: ${formattedAccountName}
Account Number: ${accountNumber}
Reason for Dispute: ${disputeData.errorType}
`;
          
          // Replace any existing account section with our properly formatted one
          disputeData.letterContent = disputeData.letterContent.replace(
            /DISPUTED ITEM\(S\):[\s\S]*?(?=\n\nUnder)/,
            accountSection
          );
        }
      }
      
      // Ensure the letter has the correct dispute reason
      let letterTitle = disputeData.errorType;
      
      // Add the account name to the title if available
      if (formattedAccountName && formattedAccountName !== "UNKNOWN ACCOUNT") {
        letterTitle = `${disputeData.errorType} (${formattedAccountName})`;
      }
      
      // Create a new letter from the dispute data
      const newLetter = {
        id: Date.now(),
        title: letterTitle,
        recipient: disputeData.bureau,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'ready', // Status is "ready"
        bureaus: [disputeData.bureau],
        laws: ['FCRA § 611', 'FCRA § 623'],
        content: disputeData.letterContent
      };
      
      // Log the generated letter
      console.log("Generated letter:", {
        title: newLetter.title,
        contentLength: newLetter.content.length,
        content: newLetter.content.substring(0, 100) + "..." // Log just the beginning
      });
      
      // Add the new letter 
      onAddNewLetter(newLetter);
      
      // Only try to save the letter if not in test mode or if user is authenticated
      if (!testMode) {
        try {
          // Save the letter to Supabase if user is logged in
          const saved = await saveLetter(disputeData);
          if (saved) {
            toast({
              title: "Dispute letter saved",
              description: "Your dispute letter has been saved to your account.",
              duration: 5000,
            });
          }
        } catch (error) {
          console.error("Error saving letter to account:", error);
          // We still continue even if saving fails
        }
      } else {
        // In test mode, we just notify the user that we're in test mode
        toast({
          title: "Test Mode Active",
          description: "Letter generated but not saved to account in test mode.",
          duration: 5000,
        });
      }
      
      toast({
        title: "Dispute letter created",
        description: "Your dispute letter has been generated and is ready for review.",
        duration: 5000,
      });
      
      // Set flag in session storage to indicate a letter was generated
      sessionStorage.setItem('autoGeneratedLetter', 'true');
      
      return true;
    } catch (error) {
      console.error('Error in handleGenerateDispute:', error);
      toast({
        title: "Error generating letter",
        description: "There was a problem generating your dispute letter. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  return { handleGenerateDispute, isGenerating };
};

export default useDisputeLetterGenerator;
