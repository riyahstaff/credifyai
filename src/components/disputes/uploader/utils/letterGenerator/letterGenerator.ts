
/**
 * Core letter generation functionality
 */
import { DisputeIssue, DisputeLetter } from './types';
import { determineBureau } from './bureauUtils';
import { createEmergencyLetter } from './emergencyLetter';
import { storeGeneratedLetters } from './storageUtils';
import { selectDisputeIssues } from './letterSelection';
import { generateManualDisputeLetter } from '@/components/ai/services/disputes/manualLetterGenerator';
import { generateDisputeLetterForDiscrepancy } from '@/utils/creditReport/disputeLetters';

/**
 * Generate dispute letters for the given issues
 */
export const generateDisputeLetters = async (
  issues: DisputeIssue[],
  reportData?: any
): Promise<DisputeLetter[]> => {
  console.log(`Generating dispute letters for ${issues.length} issues`);
  
  // Extract accounts for dispute letters
  const accounts = reportData?.accounts || [];
  
  // Select issues to generate letters for
  const selectedIssues = selectDisputeIssues(issues);
  
  // Generate letters
  const letters = await Promise.all(selectedIssues.map(async (issue, index) => {
    console.log(`Generating dispute letter for: ${issue.title} - ${issue.account?.accountName || 'General Issue'}`);
    
    const bureau = determineBureau(issue);
    const accountName = issue.account?.accountName || issue.title;
    const accountNumber = issue.account?.accountNumber || '';
    
    try {
      // Try to use the enhanced letter generator first for better formatted letters
      const userInfo = {
        name: localStorage.getItem('userName') || "[YOUR NAME]",
        address: localStorage.getItem('userAddress') || "[YOUR ADDRESS]",
        city: localStorage.getItem('userCity') || "[CITY]",
        state: localStorage.getItem('userState') || "[STATE]",
        zip: localStorage.getItem('userZip') || "[ZIP]"
      };
      
      // Create a fully compliant RecommendedDispute object with all required properties
      const letterContent = await generateDisputeLetterForDiscrepancy(
        {
          id: `issue-${Date.now()}-${index}`,
          type: issue.type,
          title: issue.title,
          impact: issue.impact === 'Critical Impact' ? 'High' : 
                 issue.impact === 'High Impact' ? 'High' : 'Medium',
          accountName: accountName,
          accountNumber: accountNumber,
          bureau: bureau,
          reason: issue.title,
          description: issue.description,
          legalBasis: issue.laws.map(law => {
            const [lawName, section] = law.split(' § ');
            return {
              law: lawName,
              section: section,
              title: law,
              text: `According to ${law}, consumer reporting agencies must ensure accurate reporting.`
            };
          }),
          severity: issue.impact === 'Critical Impact' ? 'high' : 
                   issue.impact === 'High Impact' ? 'high' : 'medium'
        },
        userInfo,
        reportData
      );
      
      if (!letterContent || letterContent.trim().length < 10) {
        throw new Error("Empty letter content generated");
      }
      
      console.log(`Successfully generated enhanced letter for ${issue.title} (${letterContent.length} chars)`);
      
      // Create letter object with all required fields
      return createLetterObject(issue, bureau, accountName, accountNumber, letterContent, index);
    } catch (error) {
      console.error(`Error generating enhanced letter for ${issue.title}:`, error);
      
      // Fall back to manual letter generator
      try {
        const disputeParams = {
          bureau: bureau,
          accountName: accountName,
          accountNumber: accountNumber,
          errorType: issue.title,
          explanation: issue.description,
          accounts: accounts, // Include all accounts from the report
          reportData: reportData // Pass the entire report data
        };
        
        const letterContent = await generateManualDisputeLetter(
          disputeParams,
          {},
          {
            testMode: false,
            accounts: accounts
          }
        );
        
        if (!letterContent || letterContent.trim().length < 10) {
          throw new Error("Empty letter content generated by fallback generator");
        }
        
        console.log(`Successfully generated fallback letter for ${issue.title} (${letterContent.length} chars)`);
        
        return createLetterObject(issue, bureau, accountName, accountNumber, letterContent, index);
      } catch (fallbackError) {
        console.error(`Error with fallback letter generator for ${issue.title}:`, fallbackError);
        
        // Create a basic formatted letter as last resort
        return createEmergencyLetter(
          `${issue.title} (${accountName})`, 
          accountName, 
          accountNumber, 
          issue.title
        );
      }
    }
  }));
  
  // Filter out null letters
  const validLetters = letters.filter(letter => letter !== null) as DisputeLetter[];
  console.log(`Generated ${validLetters.length} valid letters`);
  
  // Store the letters - with enhanced error logging
  if (validLetters.length > 0) {
    try {
      // Store all letters
      storeGeneratedLetters(validLetters);
      return validLetters;
    } catch (error) {
      console.error("Error storing generated letters:", error);
      // On error, create a simple letter to ensure something is returned
      const errorLetter = createEmergencyLetter("Error Recovery Letter", "Error Recovery", "", "System Error");
      
      // Try to store at least this letter
      try {
        storeGeneratedLetters([errorLetter]);
      } catch (storageError) {
        console.error("Error storing recovery letter:", storageError);
      }
      
      return [errorLetter];
    }
  } else {
    console.warn("No valid letters were generated");
    
    // Create a fallback letter if no valid letters were generated
    const fallbackLetter = createEmergencyLetter("General Dispute Letter", "General Dispute", "", "Multiple Issues");
    
    // Store the fallback letter
    try {
      storeGeneratedLetters([fallbackLetter]);
    } catch (error) {
      console.error("Error storing fallback letter:", error);
    }
    
    return [fallbackLetter];
  }
};

/**
 * Helper function to create a letter object with all required fields
 */
function createLetterObject(
  issue: DisputeIssue,
  bureau: string,
  accountName: string,
  accountNumber: string,
  letterContent: string,
  index: number
): DisputeLetter {
  return {
    id: Date.now() + index,
    title: `${issue.title} (${accountName})`,
    bureau: bureau,
    recipient: bureau,
    accountName: accountName,
    accountNumber: accountNumber,
    errorType: issue.title,
    explanation: issue.description,
    letterContent: letterContent,
    content: letterContent, // Duplicate for compatibility
    status: 'draft',
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    bureaus: [bureau],
    laws: issue.laws,
    timestamp: new Date().toISOString()
  };
}
