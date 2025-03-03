import { useToast } from '@/hooks/use-toast';
import { processCreditReport, CreditReportData, CreditReportAccount } from '@/utils/creditReportParser';
import { identifyIssues, enhanceReportData } from '@/utils/reportAnalysis';
import { generateEnhancedDisputeLetter } from '@/lib/supabase/letterGenerator';
import { loadSampleDisputeLetters } from '@/utils/creditReport/disputeLetters/sampleLettersLoader';
import { loadSampleReports } from '@/utils/creditReport/sampleReports';

export interface AnalysisProcessorProps {
  uploadedFile: File | null;
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
}: AnalysisProcessorProps & { toast: ReturnType<typeof useToast> }) => {
  console.log("handleAnalysisComplete called");
  
  try {
    setAnalyzing(true);
    
    if (!uploadedFile) {
      console.error("No file available for analysis");
      setAnalysisError("No file was available for analysis");
      setAnalyzing(false);
      setAnalyzed(true);
      return;
    }
    
    console.log("Processing credit report:", uploadedFile.name);
    
    console.log("Preloading sample dispute letters and reports");
    const sampleDisputeLetters = await loadSampleDisputeLetters();
    console.log(`Loaded ${sampleDisputeLetters.length} sample dispute letters`);
    const sampleReports = await loadSampleReports();
    console.log(`Loaded ${sampleReports.length} sample credit reports`);
    
    const data = await processCreditReport(uploadedFile);
    
    console.log("Enhancing report data");
    const enhancedData = enhanceReportData(data);
    setReportData(enhancedData);
    
    console.log("Identifying issues in report data");
    let detectedIssues = identifyIssues(enhancedData);
    
    if (detectedIssues.length < 3) {
      console.log("Not enough issues detected, forcing minimum issues");
      
      const existingIssues = [...detectedIssues];
      
      const mandatoryIssues = [
        {
          type: 'fcra',
          title: 'FCRA Verification Rights',
          description: 'Under the Fair Credit Reporting Act (FCRA), you have the right to dispute any information in your credit report, even if it appears accurate.',
          impact: 'High Impact' as const,
          impactColor: 'orange',
          laws: ['FCRA § 611 (Procedure in case of disputed accuracy)']
        },
        {
          type: 'late_payment',
          title: 'Late Payment Disputes',
          description: 'Late payments must be reported with 100% accuracy. Any discrepancy in dates, amounts, or frequency allows for successful disputes.',
          impact: 'Critical Impact' as const,
          impactColor: 'red',
          laws: ['FCRA § 611', 'FCRA § 623']
        },
        {
          type: 'inquiry',
          title: 'Unauthorized Hard Inquiries',
          description: 'Inquiries on your credit report may have been made without proper authorization, which violates the FCRA and can be disputed.',
          impact: 'High Impact' as const,
          impactColor: 'orange',
          laws: ['FCRA § 604', 'FCRA § 611']
        }
      ];
      
      const combinedIssues = [...existingIssues];
      
      for (const issue of mandatoryIssues) {
        if (!combinedIssues.some(i => i.title === issue.title)) {
          combinedIssues.push(issue);
        }
      }
      
      detectedIssues = combinedIssues;
    }
    
    console.log(`Found ${detectedIssues.length} potential issues:`, detectedIssues);
    setIssues(detectedIssues);
    
    if (enhancedData) {
      const slimReportData = {
        personalInfo: enhancedData.personalInfo,
        accounts: enhancedData.accounts?.slice(0, 5) || [],
        inquiries: enhancedData.inquiries?.slice(0, 5) || [],
        fileContent: null,
        reportSections: null
      };
      
      try {
        sessionStorage.setItem('creditReportData', JSON.stringify(slimReportData));
      } catch (storageError) {
        console.warn("Could not store full report data in session storage, storing minimal data", storageError);
        
        const minimalData = {
          personalInfo: enhancedData.personalInfo,
          accounts: (enhancedData.accounts || []).slice(0, 2).map(account => ({
            accountName: account.accountName,
            accountNumber: account.accountNumber,
            accountType: account.accountType,
            bureau: account.bureau
          }))
        };
        sessionStorage.setItem('creditReportData', JSON.stringify(minimalData));
      }
      
      console.log(`Generating dispute letters for ${detectedIssues.length} issues`);
      
      const userInfo = {
        name: localStorage.getItem('userName') || "[YOUR NAME]",
        address: localStorage.getItem('userAddress') || "[YOUR ADDRESS]",
        city: localStorage.getItem('userCity') || "[CITY]",
        state: localStorage.getItem('userState') || "[STATE]",
        zip: localStorage.getItem('userZip') || "[ZIP]"
      };
      
      const generatedLetters = [];
      
      for (const issue of detectedIssues.slice(0, 3)) { 
        const bureauName = issue.account?.bureau || "Experian";
        
        const accountName = issue.account?.accountName || issue.title;
        
        const accountNumber = issue.account?.accountNumber || "Unknown";
        
        try {
          console.log(`Generating dispute letter for: ${accountName} - ${issue.title}`);
          const letterContent = await generateEnhancedDisputeLetter(
            issue.title,
            {
              accountName: accountName,
              accountNumber: accountNumber,
              errorDescription: issue.description,
              bureau: bureauName
            },
            userInfo
          );
          
          const disputeData = {
            bureau: bureauName,
            accountName: accountName,
            accountNumber: accountNumber || "",
            errorType: issue.title,
            explanation: issue.description,
            letterContent: letterContent,
            timestamp: new Date().toISOString()
          };
          
          generatedLetters.push(disputeData);
          console.log(`Letter generated for ${accountName} - ${issue.title}`);
        } catch (error) {
          console.error(`Error generating letter for ${accountName}:`, error);
        }
      }
      
      if (generatedLetters.length === 0) {
        console.log("No letters generated, creating fallback letter");
        
        const fallbackLetter = {
          bureau: "Experian",
          accountName: "All Accounts",
          accountNumber: "",
          errorType: "General Dispute",
          explanation: "I am disputing all information in my credit report that may be inaccurate or incomplete under my rights provided by the Fair Credit Reporting Act.",
          letterContent: `
[YOUR NAME]
[YOUR ADDRESS]
[CITY, STATE ZIP]
[DATE]

Experian
P.O. Box 4500
Allen, TX 75013

RE: Dispute of Inaccurate Credit Information

To Whom It May Concern:

I am writing to dispute inaccurate information in my credit report. I have the right under the Fair Credit Reporting Act (FCRA), Section 611, to dispute incomplete or inaccurate information.

After reviewing my credit report, I have identified multiple items that I believe are inaccurate and request that they be verified and corrected.

I request that all items in my credit report be verified for accuracy. If any information cannot be fully verified, it must be removed from my credit report as required by the FCRA.

Please investigate these matters and correct my credit report accordingly.

Sincerely,

[YOUR NAME]
          `,
          timestamp: new Date().toISOString()
        };
        
        generatedLetters.push(fallbackLetter);
      }
      
      if (generatedLetters.length > 0) {
        try {
          const firstLetter = generatedLetters[0];
          sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(firstLetter));
          
          try {
            sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(generatedLetters));
          } catch (storageError) {
            console.warn("Could not store all letters, only storing first letter:", storageError);
          }
          
          setLetterGenerated(true);
          sessionStorage.setItem('autoGeneratedLetter', 'true');
          
          console.log(`${generatedLetters.length} letters generated and stored in session storage`);
          
          toast.toast({
            title: "Dispute letters generated",
            description: `${generatedLetters.length} dispute letters have been created and are ready for review.`,
          });
        } catch (storageError) {
          console.error("Failed to store letters in session storage:", storageError);
          setAnalysisError("Generated letters are too large for browser storage. Please try generating individual letters.");
          
          toast.toast({
            title: "Storage error",
            description: "Letters were generated but couldn't be stored due to browser limitations.",
            variant: "destructive",
          });
        }
      } else {
        console.error("Failed to generate any dispute letters");
        setAnalysisError("Failed to generate dispute letters. Please try manually creating one.");
        
        toast.toast({
          title: "Letter generation failed",
          description: "Failed to generate dispute letters. Please try creating one manually.",
          variant: "destructive",
        });
      }
    }
    
    toast.toast({
      title: "Analysis complete",
      description: `Found ${detectedIssues.length} potential issues in your credit report.`,
    });
    
    setAnalyzing(false);
    setAnalyzed(true);
    
  } catch (error) {
    console.error("Error analyzing report:", error);
    setAnalysisError(error instanceof Error ? error.message : "Unknown error processing report");
    setAnalyzing(false);
    setAnalyzed(true);
    
    toast.toast({
      title: "Analysis failed",
      description: error instanceof Error ? error.message : "Failed to process your credit report.",
      variant: "destructive",
    });
  }
};
