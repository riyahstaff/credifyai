
import { extractTextFromPDF } from '@/utils/creditReport/extractors';
import { parseReportContent, parseReportFile } from '@/utils/creditReport/parser';
import { CreditReportData, CreditReportAccount } from '@/utils/creditReport/types';
import { storeReportData } from '../utils/reportStorage';

interface AnalysisCompleteParams {
  uploadedFile: File;
  setReportData: (data: CreditReportData) => void;
  setIssues: (issues: Array<{
    type: string;
    title: string;
    description: string;
    impact: 'High Impact' | 'Critical Impact' | 'Medium Impact';
    impactColor: string;
    account?: CreditReportAccount;
    laws: string[];
  }>) => void;
  setLetterGenerated: (generated: boolean) => void;
  setAnalysisError: (error: string | null) => void;
  setAnalyzing: (analyzing: boolean) => void;
  setAnalyzed: (analyzed: boolean) => void;
  toast: any;
}

export const handleAnalysisComplete = async ({
  uploadedFile,
  setReportData,
  setIssues,
  setLetterGenerated,
  setAnalysisError,
  setAnalyzing,
  setAnalyzed,
  toast
}: AnalysisCompleteParams) => {
  try {
    console.log("Beginning analysis of credit report:", uploadedFile.name);
    
    // Extract text from the file (PDF or text)
    const fileText = await extractTextFromPDF(uploadedFile);
    console.log(`Extracted ${fileText.length} characters from file`);
    
    if (fileText.length < 100) {
      throw new Error("Could not extract sufficient text from the credit report. Please try a different file format.");
    }
    
    // Parse the report content
    console.log("Parsing credit report content...");
    const reportData = await parseReportFile(uploadedFile);
    
    if (!reportData) {
      throw new Error("Failed to parse credit report data");
    }
    
    console.log("Parsed credit report data:", {
      accounts: reportData.accounts.length,
      inquiries: reportData.inquiries.length,
      personalInfo: reportData.personalInfo 
        ? Object.keys(reportData.personalInfo).filter(k => !!reportData.personalInfo[k as keyof typeof reportData.personalInfo]).length + " fields" 
        : "none"
    });
    
    // Save extracted user data to localStorage for later use in letter generation
    if (reportData.personalInfo) {
      console.log("Saving personal info to localStorage");
      const { name, address, city, state, zip } = reportData.personalInfo;
      if (name) localStorage.setItem('userName', name);
      if (address) localStorage.setItem('userAddress', address);
      if (city) localStorage.setItem('userCity', city);
      if (state) localStorage.setItem('userState', state);
      if (zip) localStorage.setItem('userZip', zip);
    }
    
    // Store the report data in session storage
    const stored = storeReportData(reportData);
    if (!stored) {
      console.warn("Could not store full report data");
    }
    
    // Set the report data for use in the UI
    setReportData(reportData);
    
    // If we have analysis results, convert them to issues
    if (reportData.analysisResults?.recommendedDisputes) {
      const disputes = reportData.analysisResults.recommendedDisputes;
      console.log(`Found ${disputes.length} recommended disputes`);
      
      // Create issues from recommended disputes
      const issues = disputes.map(dispute => {
        const account = reportData.accounts.find(a => 
          a.accountNumber === dispute.accountNumber || 
          a.accountName === dispute.accountName
        );
        
        return {
          type: dispute.type,
          title: dispute.title,
          description: dispute.description,
          impact: dispute.impact === 'High' ? 'High Impact' : 'Medium Impact',
          impactColor: dispute.impact === 'High' ? 'red' : 'orange',
          account: account,
          laws: ['FCRA § 611', 'FCRA § 623']
        };
      });
      
      setIssues(issues);
    } else {
      console.log("No recommended disputes found, generating default issues");
      
      // Create default issues based on account types if no recommendations
      const defaultIssues = [];
      
      // Look for accounts with late payments
      const latePaymentAccounts = reportData.accounts.filter(account => 
        account.paymentStatus?.toLowerCase().includes('late') ||
        account.remarks?.some(remark => remark.toLowerCase().includes('late'))
      );
      
      if (latePaymentAccounts.length > 0) {
        latePaymentAccounts.forEach(account => {
          defaultIssues.push({
            type: 'late_payment',
            title: 'Late Payment Dispute',
            description: `Dispute late payments reported for ${account.accountName}`,
            impact: 'High Impact' as const,
            impactColor: 'red',
            account: account,
            laws: ['FCRA § 611', 'FCRA § 623']
          });
        });
      }
      
      // Look for collection accounts
      const collectionAccounts = reportData.accounts.filter(account => 
        account.accountType?.toLowerCase().includes('collection') ||
        account.accountName?.toLowerCase().includes('collection') ||
        account.paymentStatus?.toLowerCase().includes('collection')
      );
      
      if (collectionAccounts.length > 0) {
        collectionAccounts.forEach(account => {
          defaultIssues.push({
            type: 'collection',
            title: 'Collection Account Dispute',
            description: `Dispute collection account ${account.accountName}`,
            impact: 'Critical Impact' as const,
            impactColor: 'red',
            account: account,
            laws: ['FCRA § 611', 'FCRA § 623', 'FDCPA § 809']
          });
        });
      }
      
      // Look for inquiries
      if (reportData.inquiries.length > 0) {
        defaultIssues.push({
          type: 'inquiry',
          title: 'Unauthorized Inquiry Dispute',
          description: 'Dispute unauthorized inquiries on your credit report',
          impact: 'Medium Impact' as const,
          impactColor: 'orange',
          laws: ['FCRA § 611', 'FCRA § 604']
        });
      }
      
      // If we still don't have any issues, add a general issue
      if (defaultIssues.length === 0 && reportData.accounts.length > 0) {
        defaultIssues.push({
          type: 'general',
          title: 'General Dispute',
          description: 'Dispute inaccurate information on your credit report',
          impact: 'Medium Impact' as const,
          impactColor: 'orange',
          account: reportData.accounts[0],
          laws: ['FCRA § 611']
        });
      }
      
      setIssues(defaultIssues);
    }
    
    setAnalyzed(true);
    setAnalyzing(false);
    setAnalysisError(null);
    
    toast({
      title: "Analysis complete",
      description: `Successfully analyzed your credit report with ${reportData.accounts.length} accounts.`,
    });
    
  } catch (error) {
    console.error("Error analyzing credit report:", error);
    setAnalyzing(false);
    setAnalyzed(false);
    setAnalysisError(error instanceof Error ? error.message : "Unknown error analyzing credit report");
    
    toast({
      title: "Analysis failed",
      description: error instanceof Error ? error.message : "Unknown error analyzing credit report",
      variant: "destructive",
    });
  }
};
