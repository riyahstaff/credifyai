import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CreditReportData, CreditReportAccount } from '@/utils/creditReport/types';
import { LetterTemplate, DisputeData } from './types';
import { determineBureau } from './utils/bureauUtils';
import { loadStoredData, saveAccountToStorage, saveReportToStorage } from './utils/storageUtils';
import { processDisputeData } from './utils/letterUtils';
import { generateFallbackInquiryDisputeLetter } from '@/utils/creditReport/disputeLetters/fallbackTemplates/inquiryLetter';

export function useDisputeGeneratorState(testMode: boolean = false) {
  const { toast } = useToast();
  const [reportData, setReportData] = useState<CreditReportData | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<CreditReportAccount | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<LetterTemplate | null>(null);
  const [selectedBureau, setSelectedBureau] = useState<string | null>(null);
  const [generatedLetter, setGeneratedLetter] = useState('');
  
  useEffect(() => {
    if (testMode) {
      console.log("DisputeGenerator: Test mode is active");
    }
    
    const { reportData, selectedAccount, selectedBureau } = loadStoredData();
    
    if (reportData) {
      setReportData(reportData);
      toast({
        title: "Credit report loaded",
        description: `Loaded credit report with ${reportData.accounts?.length || 0} accounts.`,
      });
    }
    
    if (selectedAccount) {
      setSelectedAccount(selectedAccount);
      setSelectedBureau(selectedBureau || 'Experian');
    }
  }, [toast, testMode]);
  
  const handleReportProcessed = (data: CreditReportData) => {
    setReportData(data);
    saveReportToStorage(data);
    
    if (data.accounts && data.accounts.length > 0) {
      const firstAccount = data.accounts[0];
      setSelectedAccount(firstAccount);
      saveAccountToStorage(firstAccount);
      
      if (firstAccount.bureau) {
        setSelectedBureau(determineBureau(firstAccount.bureau));
      } else {
        setSelectedBureau('Experian');
      }
    }
  };
  
  const handleAccountSelected = (account: CreditReportAccount) => {
    setSelectedAccount(account);
    saveAccountToStorage(account);
    
    console.log("Account selected:", account);
    
    if (account.bureau) {
      setSelectedBureau(determineBureau(account.bureau));
    } else {
      setSelectedBureau('Experian');
    }
    
    if (!generatedLetter) {
      const errorType = "Inaccurate Information";
      const explanation = `I am disputing this ${account.accountName} account as it contains inaccurate information that requires investigation and correction.`;
      
      const disputeData = {
        bureau: selectedBureau || 'Experian',
        accountName: account.accountName,
        accountNumber: account.accountNumber || "Unknown",
        errorType: errorType,
        explanation: explanation,
        actualAccountInfo: {
          name: account.accountName,
          number: account.accountNumber || "Unknown",
          balance: account.currentBalance || account.balance,
          openDate: account.dateOpened || account.openDate,
          reportedDate: account.dateReported || account.lastReportedDate,
          status: account.paymentStatus
        }
      };
      
      setTimeout(() => {
        const disputeFormButton = document.querySelector('button[type="submit"]');
        if (disputeFormButton instanceof HTMLButtonElement) {
          disputeFormButton.click();
        }
      }, 500);
    }
  };
  
  const handleTemplateSelected = (template: LetterTemplate) => {
    setSelectedTemplate(template);
  };
  
  const handleDisputeGenerated = async (disputeData: DisputeData) => {
    console.log("Handling dispute generation with data:", {
      accountName: disputeData.accountName,
      bureau: disputeData.bureau,
      errorType: disputeData.errorType
    });
    
    try {
      const processedData = await processDisputeData(disputeData, testMode);
      
      const isInquiryDispute = disputeData.errorType.toLowerCase().includes('inquiry') || 
        (selectedAccount && selectedAccount.accountType === 'Inquiry');
      
      let letterContent = processedData.letterContent || "";
      
      if (!letterContent || letterContent.length < 100) {
        console.warn("No valid letter content was generated, using fallback template");
        
        if (isInquiryDispute) {
          const { generateFallbackInquiryDisputeLetter } = await import('@/utils/creditReport/disputeLetters/fallbackTemplates/inquiryLetter');
          letterContent = generateFallbackInquiryDisputeLetter();
        } else {
          const { generateFallbackAccountDisputeLetter } = await import('@/utils/creditReport/disputeLetters/fallbackTemplates/accountLetter');
          letterContent = generateFallbackAccountDisputeLetter({
            accountName: disputeData.accountName,
            accountNumber: disputeData.accountNumber,
            errorType: disputeData.errorType,
            bureau: disputeData.bureau
          });
        }
        
        processedData.letterContent = letterContent;
        
        try {
          const existingLetterData = sessionStorage.getItem('pendingDisputeLetter');
          if (existingLetterData) {
            const parsedLetter = JSON.parse(existingLetterData);
            parsedLetter.letterContent = letterContent;
            parsedLetter.content = letterContent;
            sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(parsedLetter));
          }
        } catch (error) {
          console.error("Error updating letter with fallback content:", error);
        }
      }
      
      setGeneratedLetter(letterContent);
      sessionStorage.setItem('autoGeneratedLetter', 'true');
      console.log("Setting autoGeneratedLetter flag to true");
      
      sessionStorage.setItem('forceLettersReload', 'true');
      console.log("Setting forceLettersReload flag to true");
    } catch (error) {
      console.error("Error in handleDisputeGenerated:", error);
      toast({
        title: "Letter Generation Error",
        description: "There was a problem generating your dispute letter. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleLetterReset = () => {
    setGeneratedLetter('');
  };
  
  return {
    reportData,
    selectedAccount,
    selectedTemplate,
    selectedBureau,
    generatedLetter,
    handleReportProcessed,
    handleAccountSelected,
    handleTemplateSelected,
    handleDisputeGenerated,
    handleLetterReset
  };
}
