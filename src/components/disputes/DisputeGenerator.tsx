
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FileText } from 'lucide-react';
import { CreditReportData, CreditReportAccount } from '@/utils/creditReportParser';
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
  const [reportData, setReportData] = useState<CreditReportData | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<CreditReportAccount | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<LetterTemplate | null>(null);
  const [selectedBureau, setSelectedBureau] = useState<string | null>(null);
  const [generatedLetter, setGeneratedLetter] = useState('');
  
  // Load report data and selected account from session storage if available
  useEffect(() => {
    const storedReportData = sessionStorage.getItem('creditReportData');
    const storedSelectedAccount = sessionStorage.getItem('selectedAccount');
    
    if (storedReportData) {
      try {
        const parsedData = JSON.parse(storedReportData);
        setReportData(parsedData);
        
        // Show toast that data was loaded
        toast({
          title: "Credit report loaded",
          description: `Loaded credit report with ${parsedData.accounts?.length || 0} accounts.`,
        });
      } catch (error) {
        console.error("Error parsing stored credit report data:", error);
      }
    }
    
    if (storedSelectedAccount) {
      try {
        const parsedAccount = JSON.parse(storedSelectedAccount);
        setSelectedAccount(parsedAccount);
        
        // Try to determine which bureaus report this account
        if (parsedAccount.bureau) {
          const lowerBureau = parsedAccount.bureau.toLowerCase();
          if (lowerBureau.includes('experian')) {
            setSelectedBureau('Experian');
          } else if (lowerBureau.includes('equifax')) {
            setSelectedBureau('Equifax');
          } else if (lowerBureau.includes('transunion')) {
            setSelectedBureau('TransUnion');
          }
        }
      } catch (error) {
        console.error("Error parsing stored selected account:", error);
      }
    }
  }, [toast]);
  
  const handleReportProcessed = (data: CreditReportData) => {
    setReportData(data);
    // Store in session storage
    sessionStorage.setItem('creditReportData', JSON.stringify(data));
  };
  
  const handleAccountSelected = (account: CreditReportAccount) => {
    setSelectedAccount(account);
    // Store in session storage
    sessionStorage.setItem('selectedAccount', JSON.stringify(account));
    
    // Try to determine which bureaus report this account
    if (account.bureau) {
      const lowerBureau = account.bureau.toLowerCase();
      if (lowerBureau.includes('experian')) {
        setSelectedBureau('Experian');
      } else if (lowerBureau.includes('equifax')) {
        setSelectedBureau('Equifax');
      } else if (lowerBureau.includes('transunion')) {
        setSelectedBureau('TransUnion');
      }
    }
  };
  
  const handleTemplateSelected = (template: LetterTemplate) => {
    setSelectedTemplate(template);
  };
  
  const handleDisputeGenerated = (disputeData: any) => {
    setGeneratedLetter(disputeData.letterContent);
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
            Create Detailed Dispute Letter
          </h3>
          
          {!generatedLetter ? (
            <DisputeForm 
              reportData={reportData}
              selectedAccount={selectedAccount}
              selectedTemplate={selectedTemplate}
              onGenerate={handleDisputeGenerated}
            />
          ) : (
            <DisputeResult
              letterContent={generatedLetter}
              selectedAccount={selectedAccount}
              selectedBureau={selectedBureau || ""}
              onReset={() => setGeneratedLetter('')}
              onDownload={handleDownload}
            />
          )}
        </div>
        
        <AiAssistantPrompt />
      </div>
      
      <div className="lg:col-span-1 space-y-6">
        <CreditReportUploader 
          onReportProcessed={handleReportProcessed}
          onAccountSelected={handleAccountSelected}
        />
        
        <LetterTemplateManager 
          onSelectTemplate={handleTemplateSelected}
        />
      </div>
    </div>
  );
};

export default DisputeGenerator;
