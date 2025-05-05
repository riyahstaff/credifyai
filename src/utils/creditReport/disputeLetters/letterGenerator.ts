
import { CreditReportData, IdentifiedIssue } from '../types';
import { generateEnhancedDisputeLetter } from '../disputeLetters';

/**
 * Generate dispute letters for all issues found in a credit report
 */
export async function generateDisputeLetters(reportData: CreditReportData): Promise<any[]> {
  if (!reportData) {
    console.error("No report data provided to letter generator");
    return [];
  }

  const letters: any[] = [];
  
  try {
    console.log("Starting dispute letter generation process");
    const issues = reportData.issues || [];
    
    if (issues.length === 0) {
      console.warn("No issues found in report data for letter generation");
      return [];
    }
    
    console.log(`Found ${issues.length} issues to generate letters for`);
    
    // Group issues by bureau to minimize the number of letters
    const issuesByBureau: Record<string, IdentifiedIssue[]> = {};
    
    for (const issue of issues) {
      const bureau = issue.bureau?.toLowerCase() || 'equifax';
      
      if (!issuesByBureau[bureau]) {
        issuesByBureau[bureau] = [];
      }
      
      issuesByBureau[bureau].push(issue);
    }
    
    // Generate a letter for each bureau
    for (const [bureau, bureauIssues] of Object.entries(issuesByBureau)) {
      console.log(`Generating letter for ${bureau} with ${bureauIssues.length} issues`);
      
      // Group issues by account
      const issuesByAccount: Record<string, IdentifiedIssue[]> = {};
      
      for (const issue of bureauIssues) {
        const accountKey = `${issue.accountName || 'unknown'}-${issue.accountNumber || 'unknown'}`;
        
        if (!issuesByAccount[accountKey]) {
          issuesByAccount[accountKey] = [];
        }
        
        issuesByAccount[accountKey].push(issue);
      }
      
      // For each account with issues, generate a separate letter
      for (const [accountKey, accountIssues] of Object.entries(issuesByAccount)) {
        try {
          // Get sample issue to extract account details
          const sampleIssue = accountIssues[0];
          
          // Build a summary of all issues for this account
          let issuesSummary = accountIssues.map(issue => 
            `- ${issue.description || issue.type} (${issue.severity || 'medium'} severity)`
          ).join('\n');
          
          // Generate the dispute letter content
          const letterContent = await generateEnhancedDisputeLetter(
            sampleIssue.type || 'inaccurate_information',
            {
              accountName: sampleIssue.accountName || 'Unknown Account',
              accountNumber: sampleIssue.accountNumber || '',
              errorDescription: `Multiple issues found:\n${issuesSummary}`,
              bureau: bureau
            },
            {
              name: '[YOUR NAME]',
              address: '[YOUR ADDRESS]',
              city: '[CITY]',
              state: '[STATE]',
              zip: '[ZIP]'
            }
          );
          
          // Create the letter object
          const letter = {
            id: Date.now() + letters.length,
            title: `${sampleIssue.type || 'Dispute'} (${sampleIssue.accountName || 'Account'})`,
            recipient: bureau.charAt(0).toUpperCase() + bureau.slice(1),
            createdAt: new Date().toLocaleDateString('en-US', { 
              month: 'short', day: 'numeric', year: 'numeric' 
            }),
            status: 'draft',
            bureaus: [bureau],
            content: letterContent,
            letterContent: letterContent,
            accountName: sampleIssue.accountName,
            accountNumber: sampleIssue.accountNumber,
            errorType: sampleIssue.type || 'inaccurate_information'
          };
          
          letters.push(letter);
          console.log(`Generated letter for ${sampleIssue.accountName || 'unknown account'}`);
        } catch (error) {
          console.error(`Error generating letter for account in ${bureau}:`, error);
        }
      }
    }
    
    console.log(`Successfully generated ${letters.length} dispute letters`);
    return letters;
  } catch (error) {
    console.error("Error in dispute letter generation:", error);
    return [];
  }
}
