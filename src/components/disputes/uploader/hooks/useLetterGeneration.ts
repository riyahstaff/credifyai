
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
import { clearAllLetterData } from '@/utils/creditReport/clearLetterData';

export const useLetterGeneration = (reportData: CreditReportData | null) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGenerateAllLetters = async (issues: Array<any>) => {
    if (reportData) {
      // IMPORTANT: Clear any existing letters first to ensure fresh generation
      clearAllLetterData();
      
      // Store report data for use in letter generation
      sessionStorage.setItem('creditReportData', JSON.stringify(reportData));
      
      // Add a timestamp to ensure we don't reuse cached data
      sessionStorage.setItem('letterGenerationTime', Date.now().toString());
      
      toast({
        title: "Generating letters",
        description: "Creating dispute letters for all identified issues",
      });
      
      console.log("Starting letter generation for all issues:", issues);
      
      try {
        console.log("Generating dispute letters for all issues");
        const generatedLetters = await generateDisputeLetters(issues, reportData);
        
        if (generatedLetters && generatedLetters.length > 0) {
          console.log(`Successfully generated ${generatedLetters.length} dispute letters`);
          console.log("First letter sample:", generatedLetters[0].content.substring(0, 100));
          
          // Ensure each letter has content in both fields
          const normalizedLetters = generatedLetters.map(letter => ({
            ...letter,
            content: letter.content || letter.letterContent || '',
            letterContent: letter.letterContent || letter.content || '',
            id: letter.id || `letter-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            createdAt: letter.createdAt || new Date().toLocaleDateString('en-US', { 
              month: 'short', day: 'numeric', year: 'numeric' 
            }),
          }));
          
          const stored = storeGeneratedLetters(normalizedLetters);
          
          if (stored) {
            toast({
              title: "Letters Generated",
              description: `${normalizedLetters.length} dispute letters have been created and are ready for review.`,
            });
            
            // Set flag to force reload on letters page
            sessionStorage.setItem('forceLettersReload', 'true');
            sessionStorage.setItem('hasDisputeLetters', 'true');
            
            // Break navigation loops
            sessionStorage.removeItem('navigationInProgress');
            sessionStorage.removeItem('shouldNavigateToLetters');
            
            // Trigger navigation in multiple ways for redundancy
            console.log("ANALYSIS_COMPLETE_READY_FOR_NAVIGATION");
            
            // Use window.location for the most reliable navigation
            setTimeout(() => {
              console.log("Forcing navigation to dispute letters page");
              window.location.href = '/dispute-letters';
            }, 1000);
          } else {
            throw new Error("Failed to store generated letters");
          }
        } else {
          console.warn("No letters were generated, creating a fallback letter");
          
          const fallbackLetter = createFallbackLetter();
          const letters = [fallbackLetter];
          
          // Ensure the fallback letter has content in both fields
          letters[0].content = letters[0].letterContent || letters[0].content;
          letters[0].letterContent = letters[0].content || letters[0].letterContent;
          letters[0].id = letters[0].id || `letter-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          
          const stored = storeGeneratedLetters(letters);
          
          if (stored) {
            toast({
              title: "Simple Letter Created",
              description: "We've created a basic dispute letter for you to review and customize.",
            });
            
            // Set flag to force reload on letters page
            sessionStorage.setItem('forceLettersReload', 'true');
            sessionStorage.setItem('hasDisputeLetters', 'true');
            
            // Break navigation loops
            sessionStorage.removeItem('navigationInProgress');
            sessionStorage.removeItem('shouldNavigateToLetters');
            
            // Trigger navigation
            setTimeout(() => {
              console.log("Forcing navigation to dispute letters page");
              window.location.href = '/dispute-letters';
            }, 1000);
          } else {
            throw new Error("Failed to store fallback letter");
          }
        }
      } catch (error) {
        console.error("Error in letter generation:", error);
        handleLetterGenerationError(error, toast, navigate);
      }
    } else {
      console.error("No report data available for letter generation");
      toast({
        title: "Error generating letters",
        description: "No report data available. Please try uploading your report again.",
        variant: "destructive"
      });
    }
  };

  const handleSingleIssueDispute = async (issueIndex: number, issues: Array<any>, account?: CreditReportAccount) => {
    console.log(`Generating dispute for issue #${issueIndex} with account:`, account || "No account provided");
    
    toast({
      title: "Generating letter",
      description: "Creating dispute letter for selected issue",
    });
    
    if (reportData) {
      try {
        // Clear any existing letters first
        clearAllLetterData();
        
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
          console.log("Letter content sample:", generatedLetters[0].content.substring(0, 100));
          
          // Ensure each letter has content in both fields
          const normalizedLetters = generatedLetters.map(letter => ({
            ...letter,
            content: letter.content || letter.letterContent || '',
            letterContent: letter.letterContent || letter.content || ''
          }));
          
          const stored = storeGeneratedLetters(normalizedLetters);
          
          if (stored) {
            toast({
              title: "Letter Generated",
              description: "Your dispute letter is ready for review.",
            });
            
            // Set flag to force reload on letters page
            sessionStorage.setItem('forceLettersReload', 'true');
            
            // Break navigation loops
            sessionStorage.removeItem('navigationInProgress');
            sessionStorage.removeItem('shouldNavigateToLetters');
            
            // Logging to trigger any navigation hooks
            console.log("ANALYSIS_COMPLETE_READY_FOR_NAVIGATION");
            
            // Use window.location for the most reliable navigation
            setTimeout(() => {
              console.log("Forcing navigation to dispute letters page");
              window.location.href = '/dispute-letters';
            }, 1000);
          } else {
            throw new Error("Failed to store generated letter");
          }
        } else {
          throw new Error("No letter was generated");
        }
      } catch (error) {
        console.error("Error in single issue letter generation:", error);
        handleLetterGenerationError(error, toast, navigate);
      }
    } else {
      console.error("No report data available for letter generation");
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
