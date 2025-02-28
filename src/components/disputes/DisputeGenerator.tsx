
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Copy, 
  Download, 
  Mail, 
  Sparkles, 
  AlertTriangle, 
  Check, 
  Info,
  Eye,
  ArrowRight,
  FileEditIcon
} from 'lucide-react';
import { CreditReportData, CreditReportAccount } from '@/utils/creditReportParser';
import CreditReportUploader from './CreditReportUploader';
import LetterTemplateManager from './LetterTemplateManager';
import AgentAvatar from '../ai/AgentAvatar';  // Fixed import path

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
  const [disputeReason, setDisputeReason] = useState('');
  const [explanation, setExplanation] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
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
  
  const handleReportProcessed = (data: CreditReportData) => {
    setReportData(data);
  };
  
  const handleAccountSelected = (account: CreditReportAccount) => {
    setSelectedAccount(account);
    
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
  
  const generateDispute = () => {
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
        
        setGeneratedLetter(letterContent);
        
        const disputeData = {
          bureau: selectedBureau,
          accountName: selectedAccount.accountName,
          accountNumber: selectedAccount.accountNumber,
          errorType: disputeReason,
          explanation: explanation,
          creditReport: reportData,
          letterContent: letterContent,
          template: selectedTemplate.name,
          timestamp: new Date()
        };
        
        onGenerateDispute(disputeData);
        
        toast({
          title: "Dispute letter created",
          description: "Your personalized dispute letter has been generated.",
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
  
  const isReadyToGenerate = () => {
    return selectedAccount && selectedTemplate && selectedBureau && disputeReason;
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/30 p-5">
          <h3 className="text-lg font-semibold text-credify-navy dark:text-white mb-4">
            Create Detailed Dispute Letter
          </h3>
          
          {!generatedLetter ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-700/30 pb-4 mb-2">
                <div className="p-2 rounded-full bg-credify-teal text-white">
                  <FileEditIcon size={18} />
                </div>
                <h4 className="font-medium text-credify-navy dark:text-white">
                  Dispute Details
                </h4>
              </div>
              
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
                    onClick={generateDispute}
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
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <Check size={16} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-credify-navy dark:text-white">
                      Dispute Letter Generated
                    </h4>
                    <p className="text-xs text-credify-navy-light dark:text-white/70">
                      For {selectedAccount?.accountName} with {selectedBureau}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedLetter);
                      toast({
                        title: "Copied",
                        description: "Letter content copied to clipboard",
                      });
                    }}
                    className="p-2 text-credify-navy-light hover:text-credify-teal dark:text-white/70 dark:hover:text-credify-teal hover:bg-gray-100 dark:hover:bg-credify-navy/60 rounded-lg transition-colors"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 text-credify-navy-light hover:text-credify-teal dark:text-white/70 dark:hover:text-credify-teal hover:bg-gray-100 dark:hover:bg-credify-navy/60 rounded-lg transition-colors"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-credify-navy/40 rounded-lg p-4 max-h-[500px] overflow-y-auto">
                <pre className="font-sans text-sm whitespace-pre-wrap text-credify-navy dark:text-white">
                  {generatedLetter}
                </pre>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setGeneratedLetter('')}
                  className="px-4 py-2 text-credify-navy-light dark:text-white/70 hover:bg-gray-100 dark:hover:bg-credify-navy/60 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Eye size={16} />
                  <span>Edit Letter</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-700/50 text-credify-navy dark:text-white hover:bg-gray-50 dark:hover:bg-credify-navy/60 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Download size={16} />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => {
                    // Would integrate with mail sending API in production
                    toast({
                      title: "Letter ready to send",
                      description: "Your dispute letter will be sent to the credit bureau.",
                    });
                  }}
                  className="px-4 py-2 bg-credify-teal hover:bg-credify-teal-dark text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Mail size={16} />
                  <span>Send to Bureau</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-gradient-to-br from-credify-teal/10 to-blue-500/10 dark:from-credify-teal/20 dark:to-blue-500/20 rounded-xl p-5 border border-credify-teal/20 dark:border-credify-teal/30">
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <AgentAvatar size="md" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-credify-navy dark:text-white mb-2">
                Need Help? Ask CLEO
              </h3>
              <p className="text-credify-navy-light dark:text-white/70 mb-4">
                Our AI assistant can help you create a custom dispute letter by asking about your specific situation.
              </p>
              <button
                onClick={() => {
                  // This would trigger the CLEO agent
                  const cleoButton = document.querySelector('[aria-label="Open AI assistant"]') as HTMLElement;
                  if (cleoButton) {
                    cleoButton.click();
                  }
                }}
                className="inline-flex items-center gap-2 bg-white dark:bg-credify-navy/60 hover:bg-gray-50 dark:hover:bg-credify-navy/80 text-credify-navy dark:text-white px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700/50 transition-colors"
              >
                <Sparkles size={16} className="text-credify-teal" />
                <span>Chat with CLEO</span>
              </button>
            </div>
          </div>
        </div>
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
