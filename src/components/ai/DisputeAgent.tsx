
import React, { useState, useEffect } from 'react';
import { Brain, FileText, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { generateEnhancedDisputeLetter } from '@/lib/supabase/letterGenerator';

interface DisputeAgentProps {
  onGenerateDispute: (disputeData: any) => void;
}

const DisputeAgent: React.FC<DisputeAgentProps> = ({ onGenerateDispute }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isThinking, setIsThinking] = useState(false);
  
  // Check if we're in test mode
  const searchParams = new URLSearchParams(location.search);
  const testMode = searchParams.get('testMode') === 'true';
  
  // Always log the testMode state to help with debugging
  useEffect(() => {
    console.log('DisputeAgent initialized - testMode:', testMode, 'Current path:', location.pathname, 'Search:', location.search);
  }, [testMode, location]);
  
  const handleActivateAI = async () => {
    setIsThinking(true);
    
    // Notify the user that CLEO is analyzing
    toast({
      title: "CLEO AI activated",
      description: "CLEO is analyzing your credit report and generating dispute letters...",
      duration: 3000,
    });
    
    // Get report data from session storage
    const storedReportData = sessionStorage.getItem('creditReportData');
    
    if (storedReportData) {
      try {
        const reportData = JSON.parse(storedReportData);
        
        if (!reportData.accounts || reportData.accounts.length === 0) {
          toast({
            title: "No account data found",
            description: "Your credit report doesn't contain any account information for CLEO to dispute.",
            variant: "destructive",
            duration: 5000,
          });
          setIsThinking(false);
          return;
        }
        
        // Get user info from local storage or use placeholder
        const userInfo = {
          name: localStorage.getItem('userName') || "[YOUR NAME]",
          address: localStorage.getItem('userAddress') || "[YOUR ADDRESS]",
          city: localStorage.getItem('userCity') || "[CITY]",
          state: localStorage.getItem('userState') || "[STATE]",
          zip: localStorage.getItem('userZip') || "[ZIP]"
        };
        
        // Generate a dispute letter for EACH account or at least the first few
        const accountsToDispute = reportData.accounts.slice(0, 3); // Limit to first 3 accounts for now
        console.log(`Generating dispute letters for ${accountsToDispute.length} accounts in ${testMode ? 'test mode' : 'normal mode'}`);
        
        for (const account of accountsToDispute) {
          const bureau = account.bureau || "Experian"; // Default to Experian if no specific bureau found
          const errorType = "Inaccurate Information";
          const explanation = `I am disputing this ${account.accountName} account as it contains inaccurate information that requires investigation and correction.`;
          
          try {
            // Generate an enhanced dispute letter
            const letterContent = await generateEnhancedDisputeLetter(
              errorType,
              {
                accountName: account.accountName,
                accountNumber: account.accountNumber || "Unknown",
                errorDescription: explanation,
                bureau: bureau
              },
              userInfo
            );
            
            // Create dispute data
            const disputeData = {
              bureau: bureau,
              accountName: account.accountName,
              accountNumber: account.accountNumber || "Unknown",
              errorType: errorType,
              explanation: explanation,
              letterContent: letterContent,
              generatedInTestMode: testMode
            };
            
            // Call the onGenerateDispute function to create a new letter
            onGenerateDispute(disputeData);
            
          } catch (error) {
            console.error(`Error generating letter for account ${account.accountName}:`, error);
            // Continue with other accounts even if one fails
          }
        }
        
        // Store the auto-generated flag in session storage
        sessionStorage.setItem('autoGeneratedLetter', 'true');
        
        // Notify user that CLEO has generated letters
        toast({
          title: "Dispute letters generated",
          description: `CLEO has generated ${accountsToDispute.length} dispute letters based on your credit report analysis.`,
          duration: 5000,
        });
        
        // Navigate to the dispute letters page to view the letters
        if (window.location.pathname !== '/dispute-letters') {
          // Ensure we preserve testMode when navigating
          const targetPath = testMode ? '/dispute-letters?testMode=true' : '/dispute-letters';
          console.log('Navigating to:', targetPath);
          navigate(targetPath);
        }
      } catch (error) {
        console.error("Error processing report data:", error);
        toast({
          title: "Letter generation failed",
          description: "CLEO couldn't generate dispute letters. Please try again.",
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
      
      // Navigate to upload report page with test mode parameter if active
      const targetPath = testMode ? '/upload-report?testMode=true' : '/upload-report';
      console.log('Navigating to:', targetPath);
      navigate(targetPath);
    }
    
    setIsThinking(false);
  };

  // Function to navigate while preserving testMode
  const handleNavigation = (path: string) => {
    const targetPath = testMode ? `${path}?testMode=true` : path;
    console.log('Navigation from DisputeAgent:', targetPath);
    navigate(targetPath);
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
          <div className="text-credify-navy dark:text-white font-medium mb-1">CLEO AI Assistant {testMode && "(Test Mode)"}</div>
          <div className="text-credify-navy-light dark:text-white/70 text-sm">
            I use AI to analyze credit reports, identify FCRA violations, and generate powerful dispute letters.
          </div>
          <div className="mt-2 flex gap-2">
            <button 
              className="text-xs bg-credify-teal/10 hover:bg-credify-teal/20 text-credify-teal px-2 py-1 rounded-full flex items-center gap-1"
              onClick={() => handleNavigation('/dashboard')}
            >
              <FileText size={12} />
              <span>Dashboard</span>
            </button>
            <button 
              className="text-xs bg-credify-teal/10 hover:bg-credify-teal/20 text-credify-teal px-2 py-1 rounded-full flex items-center gap-1"
              onClick={() => handleNavigation('/upload-report')}
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
