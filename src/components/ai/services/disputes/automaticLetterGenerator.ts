
import { Profile } from '@/lib/supabase';
import { RecommendedDispute } from '../../types';
import { 
  generateDisputeLetterForDiscrepancy, 
  generateAdvancedDisputeLetter,
  getSampleDisputeLanguage,
  findSampleDispute
} from '@/utils/creditReport/disputeLetters';
import { useToast } from '@/hooks/use-toast';
import { CreditReportData } from '@/utils/creditReport/types';
import { generateEnhancedDisputeLetter } from '@/lib/supabase/letterGenerator';

export const generateAutomaticDisputeLetter = async (
  targetDispute: RecommendedDispute,
  profile: Profile | null,
  sampleReportsLoaded: boolean,
  options?: { testMode?: boolean }
): Promise<{ disputeData: any, letterContent: string }> => {
  try {
    console.log("Generating automatic dispute letter for:", targetDispute, "Test mode:", options?.testMode);
    
    // IMPORTANT: Always enable test mode subscription to bypass subscription page
    sessionStorage.setItem('testModeSubscription', 'true');
    
    // Check if we have report data in session storage
    let creditReportData: CreditReportData | null = null;
    const storedReportData = sessionStorage.getItem('creditReportData');
    
    if (storedReportData) {
      try {
        creditReportData = JSON.parse(storedReportData) as CreditReportData;
        console.log("Found stored credit report data for auto-generation:", 
          creditReportData ? {
            personalInfo: creditReportData.personalInfo,
            accounts: creditReportData.accounts?.length,
            bureaus: creditReportData.bureaus
          } : "No report data"
        );
      } catch (e) {
        console.error("Error parsing stored credit report data:", e);
      }
    }
    
    // Create user info with defaults if profile properties are missing
    const userInfo = {
      name: profile?.full_name || localStorage.getItem('userName') || localStorage.getItem('name') || "[YOUR NAME]",
      address: localStorage.getItem('userAddress') || "[YOUR ADDRESS]",
      city: localStorage.getItem('userCity') || "[CITY]",
      state: localStorage.getItem('userState') || "[STATE]",
      zip: localStorage.getItem('userZip') || "[ZIP]"
    };
    
    // Generate a credit report number
    const creditReportNumber = `CR${Math.floor(Math.random() * 10000000)}`;
    
    // Format account number with masking
    const rawAccountNumber = targetDispute.accountNumber || "1000";
    const formattedAccountNumber = rawAccountNumber.length > 4
      ? `xx-xxxx-${rawAccountNumber.slice(-4)}`
      : `xx-xxxx-${rawAccountNumber}`;
    
    // Format the account name consistently
    const formattedAccountName = targetDispute.accountName.toUpperCase();
    
    // Try to find a sample dispute letter first
    let letterContent = '';
    let usedSampleLetter = false;
    
    try {
      const sampleLetter = await findSampleDispute(targetDispute.reason, targetDispute.bureau);
      if (sampleLetter) {
        console.log("Found sample dispute letter for", targetDispute.reason);
        // Extract key phrases from the sample letter to enhance our letter
        letterContent = sampleLetter.content
          .replace(/\[FULL_NAME\]|\[YOUR_NAME\]|\[NAME\]/g, userInfo.name)
          .replace(/\[ADDRESS\]|\[YOUR_ADDRESS\]/g, userInfo.address)
          .replace(/\[CITY\]/g, userInfo.city)
          .replace(/\[STATE\]/g, userInfo.state)
          .replace(/\[ZIP\]/g, userInfo.zip)
          .replace(/\[DATE\]|\[CURRENT_DATE\]/g, new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }))
          .replace(/\[BUREAU\]/g, targetDispute.bureau)
          .replace(/\[ACCOUNT_NAME\]/g, formattedAccountName)
          .replace(/\[ACCOUNT_NUMBER\]/g, formattedAccountNumber)
          .replace(/\[DISPUTE_REASON\]|\[ERROR_TYPE\]/g, targetDispute.reason)
          .replace(/\[ERROR_DESCRIPTION\]|\[EXPLANATION\]/g, targetDispute.description);
        
        // Replace credit report number placeholder
        letterContent = letterContent.replace(
          /Credit Report #: [A-Z0-9]+/,
          `Credit Report #: ${creditReportNumber}`
        );
        
        // Ensure the disputed items section is present
        if (!letterContent.includes("DISPUTED ITEM")) {
          const accountSection = `
DISPUTED ITEM(S):
Account Name: ${formattedAccountName}
Account Number: ${formattedAccountNumber}
Reason for Dispute: ${targetDispute.reason}
`;
          letterContent = letterContent.replace(
            /To Whom It May Concern:/,
            `To Whom It May Concern:\n\nI am writing to dispute the following information in my credit report. I have identified the following item(s) that are inaccurate or incomplete:\n${accountSection}`
          );
        }
        
        usedSampleLetter = true;
      }
    } catch (error) {
      console.error("Error finding sample dispute letter:", error);
    }
    
    // If we couldn't use a sample letter, use the enhanced generator
    if (!usedSampleLetter) {
      try {
        console.log("Using enhanced letter generator with credit report data");
        
        // Use our enhanced generator with the credit report data
        letterContent = await generateEnhancedDisputeLetter(
          targetDispute.reason,
          {
            accountName: formattedAccountName,
            accountNumber: formattedAccountNumber,
            errorDescription: targetDispute.description,
            bureau: targetDispute.bureau
          },
          userInfo,
          creditReportData // Pass the credit report data
        );
      } catch (error) {
        console.error("Error generating enhanced letter:", error);
        
        // Use a very simple fallback if all else fails
        letterContent = `Credit Report #: ${creditReportNumber}
Today is ${new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}

${userInfo.name}
${userInfo.address}
${userInfo.city}, ${userInfo.state} ${userInfo.zip}

${targetDispute.bureau}
${getBureauAddress(targetDispute.bureau)}

Re: Dispute of Inaccurate Information

To Whom It May Concern:

I am writing to dispute the following information in my credit report:

DISPUTED ITEM(S):
Account Name: ${formattedAccountName}
Account Number: ${formattedAccountNumber}
Reason for Dispute: ${targetDispute.reason}

I believe this information is inaccurate because: ${targetDispute.description}

Please investigate this matter and update my credit report accordingly.

Sincerely,
${userInfo.name}`;
      }
    }
    
    // Add test mode header if applicable  
    const finalLetterContent = options?.testMode ? 
      `[TEST MODE - NOT FOR ACTUAL SUBMISSION]\n\n${letterContent}` : 
      letterContent;
    
    // Create a detailed dispute data object
    const disputeData = {
      id: Date.now(),
      title: `${targetDispute.reason} Dispute (${formattedAccountName})`,
      bureau: targetDispute.bureau,
      recipient: targetDispute.bureau,
      accountName: formattedAccountName,
      accountNumber: formattedAccountNumber,
      errorType: targetDispute.reason,
      explanation: targetDispute.description,
      status: 'ready', // Explicitly set to 'ready', not 'draft'
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      bureaus: [targetDispute.bureau],
      content: finalLetterContent,
      letterContent: finalLetterContent,
      timestamp: new Date(),
      usedSampleLetter: usedSampleLetter,
      generatedInTestMode: options?.testMode
    };

    return { disputeData, letterContent: finalLetterContent };
  } catch (error) {
    console.error("Error generating dispute letter:", error);
    throw new Error(`Failed to generate dispute letter: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Helper function to get bureau address
function getBureauAddress(bureau: string): string {
  const bureauAddresses: Record<string, string> = {
    'Experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
    'Equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
    'TransUnion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
  };
  
  return bureauAddresses[bureau] || 'P.O. Box 1234\nCity, State 12345';
}
