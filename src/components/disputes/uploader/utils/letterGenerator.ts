import { CreditReportAccount } from '@/utils/creditReportParser';
import { generateManualDisputeLetter } from '@/components/ai/services/disputes/manualLetterGenerator';
import { generateDisputeLetterForDiscrepancy } from '@/utils/creditReport/disputeLetters';

export const generateDisputeLetters = async (
  issues: Array<{
    type: string;
    title: string;
    description: string;
    impact: 'High Impact' | 'Critical Impact' | 'Medium Impact';
    impactColor: string;
    account?: CreditReportAccount;
    laws: string[];
  }>,
  reportData?: any
) => {
  console.log(`Generating dispute letters for ${issues.length} issues`);
  
  // Extract accounts for dispute letters
  const accounts = reportData?.accounts || [];
  
  // Extract the most important issues to generate letters for
  const priorityIssues = issues
    .filter(issue => issue.impact === 'Critical Impact' || issue.impact === 'High Impact')
    .slice(0, 5);
    
  const mediumIssues = issues
    .filter(issue => issue.impact === 'Medium Impact')
    .slice(0, 3 - priorityIssues.length);
  
  const selectedIssues = [...priorityIssues, ...mediumIssues];
  
  // If no specific issues were selected but we have issues, take the first three
  if (selectedIssues.length === 0 && issues.length > 0) {
    console.log("No priority issues found, using first 3 available issues");
    selectedIssues.push(...issues.slice(0, 3));
  }
  
  console.log(`Selected ${selectedIssues.length} issues for letter generation`);
  
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
      } catch (fallbackError) {
        console.error(`Error with fallback letter generator for ${issue.title}:`, fallbackError);
        
        // Create a basic formatted letter as last resort
        const creditReportNumber = 'CR' + Math.floor(Math.random() * 10000000);
        const currentDate = new Date().toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        });
        
        const basicLetterContent = `
${currentDate}

Re: My certified letter in notice of an official consumer declaration of complaint for inaccurate information.

${bureau}
[BUREAU ADDRESS]

To Whom It May Concern:

I received a copy of my credit report (Credit Report #: ${creditReportNumber}) and found the following item(s) to be errors.

Alleging Creditor and Account as is reported on my credit report:
${accountName.toUpperCase()}
ACCOUNT- ${accountNumber ? 'xxxxxxxx' + accountNumber.substring(Math.max(0, accountNumber.length - 4)) : 'xxxxxxxx####'}
Notation: Per CRSA enacted, CDIA implemented laws, any and all reporting must be deleted if not Proven CERTIFIABLY fully true, correct, complete, timely, of known ownership and responsibility but also fully Metro 2 compliant

EXPLANATION OF INACCURACY:
${issue.description}

LEGAL BASIS FOR DISPUTE:
According to the Fair Credit Reporting Act § 611 (FCRA § 611) and § 623, you are required to conduct a reasonable investigation into this matter and remove or correct any information that cannot be verified.

Under Section 611 of the FCRA, you must:
1. Conduct a thorough investigation of this disputed information within 30 days
2. Forward all relevant information to the furnisher of this information
3. Consider all information I have submitted
4. Provide me with the results of your investigation and a free copy of my credit report if changes are made
5. Remove the disputed item if it cannot be properly verified

Please notify me that the above items have been deleted pursuant to FCRA § 611 (a)(6). I am also requesting an updated copy of my credit report, which should be sent to the address listed below.

Sincerely,
[YOUR NAME]

Enclosures:
- Copy of Driver's License
- Copy of Social Security Card
`;
        
        return {
          id: Date.now() + index,
          title: `${issue.title} (${accountName})`,
          bureau: bureau,
          recipient: bureau,
          accountName: accountName,
          accountNumber: accountNumber,
          errorType: issue.title,
          explanation: issue.description,
          letterContent: basicLetterContent,
          content: basicLetterContent, // Duplicate for compatibility
          status: 'draft',
          createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          bureaus: [bureau],
          laws: issue.laws,
          timestamp: new Date().toISOString()
        };
      }
    }
  }));
  
  // Filter out null letters
  const validLetters = letters.filter(letter => letter !== null);
  console.log(`Generated ${validLetters.length} valid letters`);
  
  // Store the letters - with enhanced error logging
  if (validLetters.length > 0) {
    try {
      // Store all letters
      console.log(`Storing ${validLetters.length} letters in session storage`);
      sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(validLetters));
      
      // Also store the first letter for legacy support
      console.log(`Storing first letter as pendingDisputeLetter: ${validLetters[0].title}`);
      sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(validLetters[0]));
      
      // Set the auto-generated flag
      sessionStorage.setItem('autoGeneratedLetter', 'true');
      console.log("Set autoGeneratedLetter flag to true");
      
      // Log storage state to verify
      console.log("✓ Storage state after saving letters:");
      console.log("  - autoGeneratedLetter:", sessionStorage.getItem('autoGeneratedLetter'));
      console.log("  - pendingDisputeLetter exists:", !!sessionStorage.getItem('pendingDisputeLetter'));
      console.log("  - generatedDisputeLetters exists:", !!sessionStorage.getItem('generatedDisputeLetters'));
      
      return validLetters;
    } catch (error) {
      console.error("Error storing generated letters:", error);
      // On error, create a simple letter to ensure something is returned
      const errorLetter = createEmergencyLetter("Error Recovery Letter", "Error Recovery", "", "System Error");
      
      // Try to store at least this letter
      try {
        sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(errorLetter));
        sessionStorage.setItem('generatedDisputeLetters', JSON.stringify([errorLetter]));
        sessionStorage.setItem('autoGeneratedLetter', 'true');
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
      sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(fallbackLetter));
      sessionStorage.setItem('generatedDisputeLetters', JSON.stringify([fallbackLetter]));
      sessionStorage.setItem('autoGeneratedLetter', 'true');
      console.log("Stored fallback letter in session storage");
    } catch (error) {
      console.error("Error storing fallback letter:", error);
    }
    
    return [fallbackLetter];
  }
};

/**
 * Create an emergency letter when all other methods fail
 */
function createEmergencyLetter(title: string, accountName: string, accountNumber: string, errorType: string) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  
  const creditReportNumber = 'CR' + Math.floor(Math.random() * 10000000);
  
  const content = `
${currentDate}

Re: My certified letter in notice of an official consumer declaration of complaint for your thus far NOT proven true, NOT proven correct, NOT proven complete, NOT proven timely, or NOT proven compliant mis-information.

Experian
P.O. Box 4500
Allen, TX 75013

To Whom It May Concern:

I received a copy of my credit report (Credit Report #: ${creditReportNumber}) and found the following item(s) to be errors, or are deficient of proof of not being untrue, incorrect, incomplete, untimely, not mine, not my responsibility, or else wise not compliant.

Alleging Creditor and Account as is reported on my credit report:
${accountName.toUpperCase()}
ACCOUNT- ${accountNumber ? 'xxxxxxxx' + accountNumber.substring(Math.max(0, accountNumber.length - 4)) : 'xxxxxxxx####'}
Notation: Per CRSA enacted, CDIA implemented laws, any and all reporting must be deleted if not Proven CERTIFIABLY fully true, correct, complete, timely, of known ownership and responsibility but also fully Metro 2 compliant

The federal and state laws require full compliance to any and all standards of exacting and perfect reporting in its entirety. I am requesting that you investigate this information and remove any inaccurate items that cannot be verified.

According to the Fair Credit Reporting Act § 611 (FCRA § 611), you are required to conduct a reasonable investigation into this matter and remove or correct any information that cannot be verified.

Please send an updated copy of my credit report to my address. According to the act, there shall be no charge for this updated report.

Sincerely,
[YOUR NAME]

Enclosures:
- Copy of Driver's License
- Copy of Social Security Card
`;

  return {
    id: Date.now(),
    title: title,
    bureau: "Experian",
    recipient: "Experian",
    accountName: accountName,
    accountNumber: accountNumber,
    errorType: errorType,
    explanation: "This letter addresses issues found in your credit report.",
    letterContent: content,
    content: content,
    status: 'draft',
    createdAt: new Date().toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric' 
    }),
    bureaus: ["Experian"],
    laws: ["FCRA § 611", "FCRA § 623"],
    timestamp: new Date().toISOString()
  };
}

/**
 * Determine which bureau to send the dispute to based on the issue
 */
function determineBureau(issue: any): string {
  // If the issue specifies a bureau, use that
  if (issue.bureau) {
    return issue.bureau;
  }
  
  // If the account specifies a bureau, use that
  if (issue.account?.bureau) {
    return issue.account.bureau;
  }
  
  // Otherwise try to determine from the issue description
  const description = (issue.description || '').toLowerCase();
  if (description.includes('equifax')) {
    return 'Equifax';
  } else if (description.includes('experian')) {
    return 'Experian';
  } else if (description.includes('transunion')) {
    return 'TransUnion';
  }
  
  // Default to Experian if we can't determine
  return 'Experian';
}

/**
 * Store generated letters in session storage
 */
export const storeGeneratedLetters = (letters: any[]) => {
  try {
    // Format letters to ensure they have proper fields
    const formattedLetters = letters.map((letter, index) => ({
      ...letter,
      id: letter.id || Date.now() + index,
      title: letter.title || `${letter.errorType || 'Dispute'} (${letter.accountName || 'Account'})`,
      content: letter.letterContent || letter.content,
      status: letter.status || 'draft',
      bureaus: letter.bureaus || [letter.bureau || 'Unknown'],
      createdAt: letter.createdAt || new Date().toLocaleDateString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric' 
      }),
      laws: letter.laws || ["FCRA § 611"]
    }));
    
    // Store all letters in session storage with clear logging
    console.log(`Storing ${formattedLetters.length} generated letters in session storage:`, formattedLetters);
    sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(formattedLetters));
    
    // Also store the first letter for quick access
    if (formattedLetters.length > 0) {
      console.log(`Storing first letter in pendingDisputeLetter: ${formattedLetters[0].title}`);
      sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(formattedLetters[0]));
      sessionStorage.setItem('autoGeneratedLetter', 'true');
      console.log("Set autoGeneratedLetter flag to true");
    }
    
    return true;
  } catch (error) {
    console.error("Error storing generated letters:", error);
    return false;
  }
};
