
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  FileEditIcon,
  ArrowRight,
  Sparkles, 
  Info
} from 'lucide-react';

interface DisputeFormProps {
  reportData: any;
  selectedAccount: any;
  selectedTemplate: any;
  onGenerate: (disputeData: any) => void;
  testMode?: boolean;
}

const DisputeForm: React.FC<DisputeFormProps> = ({
  reportData,
  selectedAccount,
  selectedTemplate,
  onGenerate,
  testMode = false
}) => {
  const { toast } = useToast();
  const [selectedBureau, setSelectedBureau] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Log test mode status
  useEffect(() => {
    if (testMode) {
      console.log("DisputeForm: Test mode is active");
    }
  }, [testMode]);
  
  const bureaus = ['Experian', 'Equifax', 'TransUnion'];
  
  const disputeReasons = [
    'Not my account',
    'Account closed by consumer',
    'Account paid in full',
    'Incorrect balance',
    'Incorrect payment status',
    'Incorrect account information',
    'Duplicate account',
    'Account included in bankruptcy',
    'Account settled',
    'Fraudulent account/Identity theft',
    'Late payments disputed',
    'Other (specify below)'
  ];

  // Try to determine which bureaus report this account when the selectedAccount changes
  useEffect(() => {
    if (selectedAccount?.bureau) {
      const lowerBureau = selectedAccount.bureau.toLowerCase();
      if (lowerBureau.includes('experian')) {
        setSelectedBureau('Experian');
      } else if (lowerBureau.includes('equifax')) {
        setSelectedBureau('Equifax');
      } else if (lowerBureau.includes('transunion')) {
        setSelectedBureau('TransUnion');
      }
    }
  }, [selectedAccount]);
  
  const handleGenerateDispute = () => {
    if (!selectedAccount || !selectedTemplate || !selectedBureau || !disputeReason) {
      toast({
        title: "Missing information",
        description: "Please select an account, template, bureau, and dispute reason.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      try {
        // Generate dispute letter by replacing placeholders in the template
        let letterContent = selectedTemplate.content;
        
        // Replace placeholders with actual values
        letterContent = letterContent
          .replace(/\[BUREAU\]/g, selectedBureau)
          .replace(/\[ACCOUNT_NAME\]/g, selectedAccount.accountName)
          .replace(/\[ACCOUNT_NUMBER\]/g, selectedAccount.accountNumber || '[Account Number]')
          .replace(/\[DISPUTE_REASON\]/g, disputeReason)
          .replace(/\[EXPLANATION\]/g, explanation || 'This information is inaccurate and should be investigated.')
          .replace(/\[REPORT_DATE\]/g, new Date().toLocaleDateString())
          .replace(/\[YOUR_NAME\]/g, '[YOUR NAME]');
        
        // Set dates if available
        if (selectedAccount.dateOpened) {
          letterContent = letterContent.replace(/\[DATE_OPENED\]/g, selectedAccount.dateOpened);
        }
        
        if (selectedAccount.dateReported) {
          letterContent = letterContent.replace(/\[DATE_REPORTED\]/g, selectedAccount.dateReported);
        }
        
        // Replace bureau address placeholders
        const bureauAddresses = {
          'Experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
          'Equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
          'TransUnion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
        };
        
        letterContent = letterContent.replace(/\[BUREAU_ADDRESS\]/g, bureauAddresses[selectedBureau as keyof typeof bureauAddresses] || '[BUREAU ADDRESS]');
        
        const disputeData = {
          bureau: selectedBureau,
          accountName: selectedAccount.accountName,
          accountNumber: selectedAccount.accountNumber,
          errorType: disputeReason,
          explanation: explanation,
          creditReport: reportData,
          letterContent: letterContent,
          template: selectedTemplate.name,
          timestamp: new Date(),
          generatedInTestMode: testMode
        };
        
        onGenerate(disputeData);
        
        toast({
          title: testMode ? "Test letter created" : "Dispute letter created",
          description: `Your personalized dispute letter has been generated${testMode ? ' in test mode' : ''}.`,
        });
      } catch (error) {
        toast({
          title: "Error generating letter",
          description: "Failed to generate dispute letter. Please try again.",
          variant: "destructive",
        });
        console.error('Error generating dispute letter:', error);
      } finally {
        setIsGenerating(false);
      }
    }, 1500);
  };
  
  const isReadyToGenerate = () => {
    return selectedAccount && selectedTemplate && selectedBureau && disputeReason;
  };
  
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-700/30 pb-4 mb-2">
        <div className="p-2 rounded-full bg-credify-teal text-white">
          <FileEditIcon size={18} />
        </div>
        <h4 className="font-medium text-credify-navy dark:text-white">
          Dispute Details
          {testMode && <span className="text-amber-500 text-sm ml-2">(Test Mode)</span>}
        </h4>
      </div>
      
      {testMode && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg p-3 mb-4">
          <p className="text-amber-800 dark:text-amber-300 text-sm">
            You are creating a dispute letter in test mode. The letter will be generated but not saved to your account.
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-credify-navy-light dark:text-white/70 mb-1">
            Select Credit Bureau
          </label>
          <select
            value={selectedBureau || ''}
            onChange={(e) => setSelectedBureau(e.target.value || null)}
            className="w-full px-3 py-2 bg-white dark:bg-credify-navy/40 border border-gray-200 dark:border-gray-700/50 rounded-lg"
          >
            <option value="">Select a bureau</option>
            {bureaus.map((bureau) => (
              <option key={bureau} value={bureau}>
                {bureau}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-credify-navy-light dark:text-white/70 mb-1">
            Account to Dispute
          </label>
          <div className="w-full px-3 py-2 bg-white dark:bg-credify-navy/40 border border-gray-200 dark:border-gray-700/50 rounded-lg flex justify-between items-center">
            {selectedAccount ? (
              <div>
                <span className="font-medium text-credify-navy dark:text-white">
                  {selectedAccount.accountName}
                </span>
                {selectedAccount.accountNumber && (
                  <span className="text-xs text-credify-navy-light dark:text-white/70 ml-2">
                    #{selectedAccount.accountNumber}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-credify-navy-light dark:text-white/70">
                Select an account from your credit report
              </span>
            )}
            <Info size={16} className="text-gray-400" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-credify-navy-light dark:text-white/70 mb-1">
            Reason for Dispute
          </label>
          <select
            value={disputeReason}
            onChange={(e) => setDisputeReason(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-credify-navy/40 border border-gray-200 dark:border-gray-700/50 rounded-lg"
          >
            <option value="">Select a reason</option>
            {disputeReasons.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-credify-navy-light dark:text-white/70 mb-1">
            Detailed Explanation
          </label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-credify-navy/40 border border-gray-200 dark:border-gray-700/50 rounded-lg min-h-[120px]"
            placeholder="Provide additional details about why this information is incorrect..."
          ></textarea>
          <p className="mt-1 text-xs text-credify-navy-light dark:text-white/70">
            The more details you provide, the stronger your dispute case will be.
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-credify-navy-light dark:text-white/70 mb-1">
            Letter Template
          </label>
          <div className="w-full px-3 py-2 bg-white dark:bg-credify-navy/40 border border-gray-200 dark:border-gray-700/50 rounded-lg flex justify-between items-center">
            {selectedTemplate ? (
              <span className="font-medium text-credify-navy dark:text-white">
                {selectedTemplate.name}
              </span>
            ) : (
              <span className="text-credify-navy-light dark:text-white/70">
                Select a letter template
              </span>
            )}
            <Info size={16} className="text-gray-400" />
          </div>
        </div>
        
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleGenerateDispute}
            disabled={!isReadyToGenerate() || isGenerating}
            className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 ${
              isReadyToGenerate() && !isGenerating
                ? 'bg-credify-teal hover:bg-credify-teal-dark text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="h-5 w-5 border-2 border-white/70 border-t-transparent rounded-full animate-spin"></div>
                <span>Generating Letter...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Generate Dispute Letter</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisputeForm;
