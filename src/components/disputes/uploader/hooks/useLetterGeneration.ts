
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { CreditReportAccount, CreditReportData } from '@/utils/creditReportParser';
import { generateDisputeLetters } from '../utils/letterGenerator';
import { forceNavigateToLetters } from '../utils/bureauUtils';
import { 
  storeGeneratedLetters, 
  createFallbackLetter, 
  handleLetterGenerationError 
} from '../utils/disputeLetterHelpers';

export const useLetterGeneration = (reportData: CreditReportData | null) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGenerateAllLetters = async (issues: Array<any>) => {
    if (reportData) {
      // Clear any existing letters first
      sessionStorage.removeItem('pendingDisputeLetter');
      sessionStorage.removeItem('generatedDisputeLetters');
      sessionStorage.removeItem('autoGeneratedLetter');
      sessionStorage.removeItem('forceLettersReload');
      
      // Store report data for use in letter generation
      sessionStorage.setItem('creditReportData', JSON.stringify(reportData));
      
      toast({
        title: "Generating letters",
        description: "Creating dispute letters for all identified issues",
      });
      
      try {
        console.log("Generating dispute letters for all issues");
        const generatedLetters = await generateDisputeLetters(issues, reportData);
        
        if (generatedLetters && generatedLetters.length > 0) {
          console.log(`Successfully generated ${generatedLetters.length} dispute letters`);
          
          const stored = storeGeneratedLetters(generatedLetters);
          
          if (stored) {
            toast({
              title: "Letters Generated",
              description: `${generatedLetters.length} dispute letters have been created and are ready for review.`,
            });
            
            // Add a delay before navigation to ensure storage operations complete
            setTimeout(() => {
              forceNavigateToLetters(navigate);
            }, 300);
          } else {
            throw new Error("Failed to store generated letters");
          }
        } else {
          console.warn("No letters were generated, creating a fallback letter");
          
          const fallbackLetter = createFallbackLetter();
          const letters = [fallbackLetter];
          const stored = storeGeneratedLetters(letters);
          
          if (stored) {
            toast({
              title: "Simple Letter Created",
              description: "We've created a basic dispute letter for you to review and customize.",
            });
            
            // Add a delay before navigation to ensure storage operations complete
            setTimeout(() => {
              forceNavigateToLetters(navigate);
            }, 300);
          } else {
            throw new Error("Failed to store fallback letter");
          }
        }
      } catch (error) {
        handleLetterGenerationError(error, toast, navigate);
      }
    } else {
      toast({
        title: "Error generating letters",
        description: "No report data available. Please try uploading your report again.",
        variant: "destructive"
      });
    }
  };

  const handleSingleIssueDispute = async (issueIndex: number, issues: Array<any>, account?: CreditReportAccount) => {
    console.log(`Generating dispute for issue #${issueIndex} with account:`, account);
    
    toast({
      title: "Generating letter",
      description: "Creating dispute letter for selected issue",
    });
    
    if (reportData) {
      try {
        // Clear any existing letters first
        sessionStorage.removeItem('pendingDisputeLetter');
        sessionStorage.removeItem('generatedDisputeLetters');
        sessionStorage.removeItem('autoGeneratedLetter');
        sessionStorage.removeItem('forceLettersReload');
        
        // Store report data for use in letter generation
        sessionStorage.setItem('creditReportData', JSON.stringify(reportData));
        
        const targetIssue = issues[issueIndex];
        if (!targetIssue) {
          throw new Error("Selected issue not found");
        }
        
        console.log("Generating letter for issue:", targetIssue.title);
        
        const singleIssueArray = [targetIssue];
        
        const generatedLetters = await generateDisputeLetters(singleIssueArray, reportData);
        
        if (generatedLetters && generatedLetters.length > 0) {
          console.log("Successfully generated letter for selected issue:", generatedLetters);
          
          const stored = storeGeneratedLetters(generatedLetters);
          
          if (stored) {
            toast({
              title: "Letter Generated",
              description: "Your dispute letter is ready for review.",
            });
            
            // Add a delay before navigation to ensure storage operations complete
            setTimeout(() => {
              forceNavigateToLetters(navigate);
            }, 300);
          } else {
            throw new Error("Failed to store generated letter");
          }
        } else {
          throw new Error("No letter was generated");
        }
      } catch (error) {
        handleLetterGenerationError(error, toast, navigate);
      }
    } else {
      toast({
        title: "Error generating letter",
        description: "No report data available. Please try uploading your report again.",
        variant: "destructive"
      });
    }
  };

  return {
    handleGenerateAllLetters,
    handleSingleIssueDispute
  };
};
