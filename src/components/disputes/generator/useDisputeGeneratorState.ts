
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CreditReportData, CreditReportAccount } from '@/utils/creditReport/types';

interface LetterTemplate {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
}

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
    
    const storedReportData = sessionStorage.getItem('creditReportData');
    const storedSelectedAccount = sessionStorage.getItem('selectedAccount');
    
    if (storedReportData) {
      try {
        const parsedData = JSON.parse(storedReportData);
        setReportData(parsedData);
        
        toast({
          title: "Credit report loaded",
          description: `Loaded credit report with ${parsedData.accounts?.length || 0} accounts.`,
        });
        
        if (parsedData.accounts?.length > 0 && !storedSelectedAccount) {
          const firstAccount = parsedData.accounts[0];
          setSelectedAccount(firstAccount);
          sessionStorage.setItem('selectedAccount', JSON.stringify(firstAccount));
          
          if (firstAccount.bureau) {
            setSelectedBureau(determineBureau(firstAccount.bureau));
          } else {
            setSelectedBureau('Experian');
          }
        }
      } catch (error) {
        console.error("Error parsing stored credit report data:", error);
      }
    }
    
    if (storedSelectedAccount) {
      try {
        const parsedAccount = JSON.parse(storedSelectedAccount);
        setSelectedAccount(parsedAccount);
        
        if (parsedAccount.bureau) {
          setSelectedBureau(determineBureau(parsedAccount.bureau));
        } else {
          setSelectedBureau('Experian');
        }
      } catch (error) {
        console.error("Error parsing stored selected account:", error);
      }
    }
  }, [toast, testMode]);
  
  const determineBureau = (bureauString: string): string => {
    const lowerBureau = bureauString.toLowerCase();
    if (lowerBureau.includes('experian')) {
      return 'Experian';
    } else if (lowerBureau.includes('equifax')) {
      return 'Equifax';
    } else if (lowerBureau.includes('transunion')) {
      return 'TransUnion';
    }
    return 'Experian'; // Default
  };
  
  const handleReportProcessed = (data: CreditReportData) => {
    setReportData(data);
    sessionStorage.setItem('creditReportData', JSON.stringify(data));
    
    if (data.accounts && data.accounts.length > 0) {
      const firstAccount = data.accounts[0];
      setSelectedAccount(firstAccount);
      sessionStorage.setItem('selectedAccount', JSON.stringify(firstAccount));
      
      if (firstAccount.bureau) {
        setSelectedBureau(determineBureau(firstAccount.bureau));
      } else {
        setSelectedBureau('Experian');
      }
      
      console.log("First account loaded:", firstAccount);
    }
  };
  
  const handleAccountSelected = (account: CreditReportAccount) => {
    setSelectedAccount(account);
    sessionStorage.setItem('selectedAccount', JSON.stringify(account));
    
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
  
  const handleDisputeGenerated = (disputeData: any) => {
    if (testMode) {
      disputeData.generatedInTestMode = true;
    }
    
    console.log("Dispute generated:", disputeData, "Test mode:", testMode);
    
    // Process the letter content to ensure it has all specific account details
    let letterContent = disputeData.letterContent;
    
    // Replace any [ACCOUNT NUMBER] placeholders with the actual account number
    if (disputeData.accountNumber) {
      letterContent = letterContent.replace(/\[ACCOUNT NUMBER\]/g, disputeData.accountNumber);
    }
    
    // Ensure "Your credit report" is changed to "My credit report"
    letterContent = letterContent.replace(/Your credit report/gi, "My credit report");
    
    // Ensure the DISPUTED ITEMS section is present
    if (!letterContent.includes("DISPUTED ITEM(S):") && disputeData.accountName) {
      letterContent += `\n\nDISPUTED ITEM(S):\n- Account Name: ${disputeData.accountName}\n- Account Number: ${disputeData.accountNumber || 'Unknown'}\n`;
    }
    
    // Update enclosures section to only include ID and SSN card
    if (letterContent.includes("Enclosures:")) {
      const enclosurePattern = /Enclosures:[\s\S]*?(?=\n\n|\Z)/;
      letterContent = letterContent.replace(enclosurePattern, 
        `Enclosures:\n- Copy of Driver's License\n- Copy of Social Security Card`
      );
    }
    
    // Save the updated letter content
    disputeData.letterContent = letterContent;
    setGeneratedLetter(letterContent);
    sessionStorage.setItem('autoGeneratedLetter', 'true');
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
