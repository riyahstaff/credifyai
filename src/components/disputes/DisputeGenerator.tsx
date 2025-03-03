import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { FileText } from 'lucide-react';
import { CreditReportData, CreditReportAccount } from '@/utils/creditReport/types';
import CreditReportUploader from './CreditReportUploader';
import LetterTemplateManager from './LetterTemplateManager';
import DisputeForm from './generator/DisputeForm';
import DisputeResult from './generator/DisputeResult';
import AiAssistantPrompt from './generator/AiAssistantPrompt';

interface LetterTemplate {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
}

interface DisputeGeneratorProps {
  onGenerateDispute: (disputeData: any) => void;
}

const DisputeGenerator: React.FC<DisputeGeneratorProps> = ({ onGenerateDispute }) => {
  const { toast } = useToast();
  const location = useLocation();
  const [reportData, setReportData] = useState<CreditReportData | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<CreditReportAccount | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<LetterTemplate | null>(null);
  const [selectedBureau, setSelectedBureau] = useState<string | null>(null);
  const [generatedLetter, setGeneratedLetter] = useState('');
  
  const searchParams = new URLSearchParams(location.search);
  const testMode = searchParams.get('testMode') === 'true';
  
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
            const lowerBureau = firstAccount.bureau.toLowerCase();
            if (lowerBureau.includes('experian')) {
              setSelectedBureau('Experian');
            } else if (lowerBureau.includes('equifax')) {
              setSelectedBureau('Equifax');
            } else if (lowerBureau.includes('transunion')) {
              setSelectedBureau('TransUnion');
            } else {
              setSelectedBureau('Experian');
            }
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
          const lowerBureau = parsedAccount.bureau.toLowerCase();
          if (lowerBureau.includes('experian')) {
            setSelectedBureau('Experian');
          } else if (lowerBureau.includes('equifax')) {
            setSelectedBureau('Equifax');
          } else if (lowerBureau.includes('transunion')) {
            setSelectedBureau('TransUnion');
          } else {
            setSelectedBureau('Experian');
          }
        } else {
          setSelectedBureau('Experian');
        }
      } catch (error) {
        console.error("Error parsing stored selected account:", error);
      }
    }
  }, [toast, testMode]);
  
  const handleReportProcessed = (data: CreditReportData) => {
    setReportData(data);
    sessionStorage.setItem('creditReportData', JSON.stringify(data));
    
    if (data.accounts && data.accounts.length > 0) {
      const firstAccount = data.accounts[0];
      setSelectedAccount(firstAccount);
      sessionStorage.setItem('selectedAccount', JSON.stringify(firstAccount));
      
      if (firstAccount.bureau) {
        const lowerBureau = firstAccount.bureau.toLowerCase();
        if (lowerBureau.includes('experian')) {
          setSelectedBureau('Experian');
        } else if (lowerBureau.includes('equifax')) {
          setSelectedBureau('Equifax');
        } else if (lowerBureau.includes('transunion')) {
          setSelectedBureau('TransUnion');
        } else {
          setSelectedBureau('Experian');
        }
      } else {
        setSelectedBureau('Experian');
      }
    }
  };
  
  const handleAccountSelected = (account: CreditReportAccount) => {
    setSelectedAccount(account);
    sessionStorage.setItem('selectedAccount', JSON.stringify(account));
    
    if (account.bureau) {
      const lowerBureau = account.bureau.toLowerCase();
      if (lowerBureau.includes('experian')) {
        setSelectedBureau('Experian');
      } else if (lowerBureau.includes('equifax')) {
        setSelectedBureau('Equifax');
      } else if (lowerBureau.includes('transunion')) {
        setSelectedBureau('TransUnion');
      } else {
        setSelectedBureau('Experian');
      }
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
    setGeneratedLetter(disputeData.letterContent);
    sessionStorage.setItem('autoGeneratedLetter', 'true');
    onGenerateDispute(disputeData);
  };
  
  const handleDownload = () => {
    if (!generatedLetter) return;
    
    const element = document.createElement('a');
    const file = new Blob([generatedLetter], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Dispute_Letter_${selectedBureau}_${selectedAccount?.accountName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Letter downloaded",
      description: "Your dispute letter has been downloaded to your device.",
    });
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/30 p-5">
          <h3 className="text-lg font-semibold text-credify-navy dark:text-white mb-4">
            Create Detailed Dispute Letter {testMode && <span className="text-amber-500 text-sm ml-2">(Test Mode)</span>}
          </h3>
          
          {!generatedLetter ? (
            <DisputeForm 
              reportData={reportData}
              selectedAccount={selectedAccount}
              selectedTemplate={selectedTemplate}
              onGenerate={handleDisputeGenerated}
              testMode={testMode}
            />
          ) : (
            <DisputeResult
              letterContent={generatedLetter}
              selectedAccount={selectedAccount}
              selectedBureau={selectedBureau || ""}
              onReset={() => setGeneratedLetter('')}
              onDownload={handleDownload}
              testMode={testMode}
            />
          )}
        </div>
        
        <AiAssistantPrompt testMode={testMode} />
      </div>
      
      <div className="lg:col-span-1 space-y-6">
        <CreditReportUploader 
          onReportProcessed={handleReportProcessed}
          onAccountSelected={handleAccountSelected}
          testMode={testMode}
        />
        
        <LetterTemplateManager 
          onSelectTemplate={handleTemplateSelected}
          testMode={testMode}
        />
      </div>
    </div>
  );
};

export default DisputeGenerator;
