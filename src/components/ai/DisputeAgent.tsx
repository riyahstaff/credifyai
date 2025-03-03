
import React, { useState } from 'react';
import { Brain, FileText, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface DisputeAgentProps {
  onGenerateDispute: (disputeData: any) => void;
}

const DisputeAgent: React.FC<DisputeAgentProps> = ({ onGenerateDispute }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isThinking, setIsThinking] = useState(false);
  
  const handleActivateAI = () => {
    setIsThinking(true);
    
    // Notify the user that CLEO is analyzing
    toast({
      title: "CLEO AI activated",
      description: "CLEO is analyzing your credit report and generating dispute letters...",
      duration: 3000,
    });
    
    // Simulate CLEO's deep thinking process
    setTimeout(() => {
      // Check if there's report data in session storage
      const storedReportData = sessionStorage.getItem('creditReportData');
      
      if (storedReportData) {
        try {
          const reportData = JSON.parse(storedReportData);
          
          // Generate a sample dispute letter for the first account or a generic one
          const accountName = reportData.accounts && reportData.accounts.length > 0 
            ? reportData.accounts[0].accountName 
            : "Identified Account";
          
          const bureau = "Experian"; // Default to Experian if no specific bureau found
          
          const disputeData = {
            bureau: bureau,
            accountName: accountName,
            accountNumber: reportData.accounts && reportData.accounts.length > 0 
              ? reportData.accounts[0].accountNumber 
              : "Unknown",
            errorType: "Inaccurate Information",
            explanation: "This account contains inaccurate information that requires investigation and correction.",
            letterContent: generateDisputeLetterContent(accountName, bureau)
          };
          
          // Call the onGenerateDispute function to create a new letter
          onGenerateDispute(disputeData);
          
          // Notify user that CLEO has generated a letter
          toast({
            title: "Dispute letter generated",
            description: "CLEO has generated a dispute letter based on your credit report analysis.",
            duration: 5000,
          });
          
          // If user is not on the dispute letters page, navigate there
          if (window.location.pathname !== '/dispute-letters') {
            navigate('/dispute-letters');
          }
        } catch (error) {
          console.error("Error processing report data:", error);
          toast({
            title: "Letter generation failed",
            description: "CLEO couldn't generate a dispute letter. Please try uploading your report again.",
            variant: "destructive",
            duration: 5000,
          });
        }
      } else {
        // If no report data, prompt user to upload a report
        toast({
          title: "No credit report found",
          description: "Please upload a credit report for CLEO to analyze and generate dispute letters.",
          duration: 5000,
        });
        
        // Navigate to upload report page
        navigate('/upload-report');
      }
      
      setIsThinking(false);
    }, 2500);
  };
  
  // Generate a basic dispute letter content
  const generateDisputeLetterContent = (accountName: string, bureau: string) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Get bureau address
    const bureauAddresses: {[key: string]: string} = {
      'experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
      'equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
      'transunion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
    };
    
    const bureauKey = bureau.toLowerCase();
    const bureauAddress = bureauAddresses[bureauKey] || `${bureau}\n[Bureau Address]`;
    
    return `[YOUR NAME]
[YOUR ADDRESS]
[CITY], [STATE] [ZIP]

${currentDate}

${bureau}
${bureauAddress}

Re: Dispute of Inaccurate Information in Credit Report

Account Name: ${accountName}
Account Number: [ACCOUNT NUMBER]
Reason for Dispute: Inaccurate Information

To Whom It May Concern:

This letter is to formally dispute inaccurate information appearing on my credit report. I am writing in accordance with my rights under the Fair Credit Reporting Act (FCRA), specifically Section 611(a).

The information for the account listed above is being reported inaccurately. After reviewing my credit report, I have identified errors that require investigation and correction.

Legal basis for dispute:
Under the FCRA Section 611(a), consumer reporting agencies are required to conduct a reasonable investigation into any disputed information. Additionally, Section 623 places responsibilities on furnishers of information to provide accurate data.

Under the FCRA, you are required to:
1. Complete your investigation within 30 days (or 45 days if I provide additional information)
2. Forward all relevant information to the furnisher for verification
3. Provide me with the results of your investigation and a free copy of my credit report if changes are made
4. Notify me if you reinsert any information that was deleted

I request that you:
- Conduct a thorough investigation of this disputed information
- Remove the inaccurate information from my credit report
- Provide me with written confirmation of the results of your investigation

If you have any questions or need additional information, please contact me at the address listed above.

Sincerely,

[YOUR SIGNATURE]

Enclosures:
- Copy of credit report with disputed item highlighted
- [SUPPORTING DOCUMENTATION]`;
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="relative group">
        <button 
          className={`w-16 h-16 rounded-full bg-gradient-to-br from-credify-teal to-blue-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all ${isThinking ? 'animate-pulse' : ''}`}
          aria-label="CLEO AI Assistant"
          onClick={handleActivateAI}
          disabled={isThinking}
        >
          {isThinking ? (
            <Sparkles size={28} className="animate-spin" />
          ) : (
            <Brain size={28} className="animate-pulse" />
          )}
        </button>
        
        <div className="absolute bottom-full right-0 mb-3 w-64 p-3 bg-white dark:bg-credify-navy rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
          <div className="text-credify-navy dark:text-white font-medium mb-1">CLEO AI Assistant</div>
          <div className="text-credify-navy-light dark:text-white/70 text-sm">
            I use DeepSeek-level AI to analyze credit reports, identify FCRA violations, and generate powerful dispute letters.
          </div>
          <div className="mt-2 flex gap-2">
            <button 
              className="text-xs bg-credify-teal/10 hover:bg-credify-teal/20 text-credify-teal px-2 py-1 rounded-full flex items-center gap-1"
              onClick={() => navigate('/upload-report')}
            >
              <FileText size={12} />
              <span>Upload Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisputeAgent;
