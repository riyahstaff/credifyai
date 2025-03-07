
import { Profile } from '@/lib/supabase';
import { RecommendedDispute } from '../../types';
import { 
  generateDisputeLetterForDiscrepancy, 
  getSampleDisputeLanguage,
  findSampleDispute
} from '@/utils/creditReport/disputeLetters';
import { useToast } from '@/hooks/use-toast';

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
    
    // Create user info with defaults if profile properties are missing
    const userInfo = {
      name: profile?.full_name || "[YOUR NAME]",
      address: localStorage.getItem('userAddress') || "[YOUR ADDRESS]",
      city: localStorage.getItem('userCity') || "[CITY]",
      state: localStorage.getItem('userState') || "[STATE]",
      zip: localStorage.getItem('userZip') || "[ZIP]"
    };
    
    // Check for existing address in localStorage to make letter more complete
    if (localStorage.getItem('userAddress')) {
      console.log("Using address from localStorage for dispute letter");
    }
    
    // Try to find a sample dispute letter first
    let letterContent = '';
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
          .replace(/\[ACCOUNT_NAME\]/g, targetDispute.accountName)
          .replace(/\[ACCOUNT_NUMBER\]/g, targetDispute.accountNumber || "Unknown")
          .replace(/\[DISPUTE_REASON\]|\[ERROR_TYPE\]/g, targetDispute.reason)
          .replace(/\[ERROR_DESCRIPTION\]|\[EXPLANATION\]/g, targetDispute.description)
          .replace(/your credit report/gi, "my credit report")
          .replace(/Your credit report/gi, "My credit report");
          
        // Ensure the disputed items section is present
        if (!letterContent.includes("DISPUTED ITEM(S):")) {
          letterContent += `\n\nDISPUTED ITEM(S):\n- Account Name: ${targetDispute.accountName}\n- Account Number: ${targetDispute.accountNumber || "Unknown"}\n- Reason for Dispute: ${targetDispute.reason}\n`;
        }
        
        // Update enclosures section to only include ID and SSN card
        if (letterContent.includes("Enclosures:")) {
          const enclosurePattern = /Enclosures:[\s\S]*?(?=\n\n|\Z)/;
          letterContent = letterContent.replace(enclosurePattern, 
            `Enclosures:\n- Copy of Driver's License\n- Copy of Social Security Card`
          );
        }
      }
    } catch (error) {
      console.error("Error finding sample dispute letter:", error);
    }
    
    // If we couldn't use a sample letter, proceed with the standard generation
    if (!letterContent) {
      // If there's no sample dispute language in the dispute object, try to fetch one
      if (!targetDispute.sampleDisputeLanguage) {
        try {
          console.log("Fetching sample dispute language for", targetDispute.reason);
          const sampleLanguage = await getSampleDisputeLanguage(
            targetDispute.reason, 
            targetDispute.bureau
          );
          
          if (sampleLanguage) {
            console.log("Found sample dispute language:", sampleLanguage.substring(0, 50) + "...");
            targetDispute.sampleDisputeLanguage = sampleLanguage;
          } else {
            console.log("No sample language found, using original description");
          }
        } catch (error) {
          console.error("Error fetching sample dispute language:", error);
          // Continue without sample language if there's an error
        }
      }
      
      // Force regenerate the description with deep analysis even if we already have one
      const enhancedDescription = await deepAnalyzeDisputeReason(targetDispute);
      if (enhancedDescription) {
        console.log("Enhanced dispute description:", enhancedDescription.substring(0, 100) + "...");
        targetDispute.description = enhancedDescription;
      }
      
      // Actually generate the letter
      console.log("Calling letterGenerator with dispute and user info");
      letterContent = await generateDisputeLetterForDiscrepancy(targetDispute, userInfo);
      
      // Ensure all placeholders are replaced
      letterContent = letterContent
        .replace(/your credit report/gi, "my credit report")
        .replace(/Your credit report/gi, "My credit report")
        .replace(/\[ACCOUNT NUMBER\]/g, targetDispute.accountNumber || "Unknown");
    }
    
    if (!letterContent || letterContent.trim().length < 50) {
      throw new Error("Generated letter is empty or too short");
    }
    
    // Add test mode header if applicable
    const finalLetterContent = options?.testMode ? 
      `[TEST MODE - NOT FOR ACTUAL SUBMISSION]\n\n${letterContent}` : 
      letterContent;
    
    console.log("Letter generated successfully:", finalLetterContent.substring(0, 50) + "...");
    
    // Create a detailed dispute data object
    const disputeData = {
      id: Date.now(),
      title: `${targetDispute.reason} Dispute (${targetDispute.accountName})`,
      bureau: targetDispute.bureau,
      recipient: targetDispute.bureau,
      accountName: targetDispute.accountName,
      accountNumber: targetDispute.accountNumber || "Unknown",
      errorType: targetDispute.reason,
      explanation: targetDispute.description,
      status: 'draft',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      bureaus: [targetDispute.bureau],
      content: finalLetterContent,
      timestamp: new Date(),
      generatedInTestMode: options?.testMode
    };

    return { disputeData, letterContent: finalLetterContent };
  } catch (error) {
    console.error("Error generating dispute letter:", error);
    throw new Error(`Failed to generate dispute letter: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Deep analysis of dispute reasons to craft more effective dispute letters
async function deepAnalyzeDisputeReason(dispute: RecommendedDispute): Promise<string | null> {
  try {
    // In a production environment, this would call an advanced LLM like DeepSeek or Grok
    // For now, we'll enhance the description based on the dispute type
    
    const baseDescription = dispute.description;
    let enhancedDescription = baseDescription;
    
    // Enhance based on dispute reason
    if (dispute.reason.toLowerCase().includes('payment')) {
      enhancedDescription = `${baseDescription} Under the Fair Credit Reporting Act (FCRA) Section 623(a)(3), furnishers must investigate and correct any inaccurate payment information, including late payments, when notified of a dispute. Furthermore, Section 605(a)(5) limits negative information to seven years. The reported late payment information is inaccurate and damaging to my credit profile.`;
    } 
    else if (dispute.reason.toLowerCase().includes('balance')) {
      enhancedDescription = `${baseDescription} Per FCRA Section 623(a)(2), credit reporting agencies and furnishers must ensure the completeness and accuracy of reported account balances. The current balance report appears to violate these provisions. My records indicate a different balance, and this discrepancy must be investigated.`;
    }
    else if (dispute.reason.toLowerCase().includes('inquiry') || dispute.reason.toLowerCase().includes('hard pull')) {
      enhancedDescription = `${baseDescription} Under FCRA Section 604(a), inquiries can only be made with permissible purpose and consumer authorization. Section 611 further requires thorough investigation of disputed inquiries that may have been unauthorized. I have no record of providing authorization for this inquiry.`;
    }
    else if (dispute.reason.toLowerCase().includes('account')) {
      enhancedDescription = `${baseDescription} According to FCRA Section 611(a), upon receiving notice of dispute about account information, credit reporting agencies must conduct a reasonable investigation. This account appears to contain errors requiring correction under these provisions. The account information as reported does not accurately reflect the actual account status.`;
    }
    else if (dispute.reason.toLowerCase().includes('collection') || dispute.reason.toLowerCase().includes('debt')) {
      enhancedDescription = `${baseDescription} Under the FDCPA Section 809(b) and FCRA Section 623, collection agencies must verify debts upon dispute and ensure accurate reporting. This collection account appears to be inaccurate or improperly verified. I request validation of this debt and correction of any inaccuracies.`;
    }
    else if (dispute.reason.toLowerCase().includes('identity') || dispute.reason.toLowerCase().includes('fraud') || dispute.reason.toLowerCase().includes('not mine')) {
      enhancedDescription = `${baseDescription} This account does not belong to me and appears to be the result of identity theft or mistaken identity. Under FCRA Section 605B, you are required to block the reporting of information resulting from identity theft. I have no knowledge of or connection to this account.`;
    }
    
    return enhancedDescription;
  } catch (error) {
    console.error("Error in deep analysis:", error);
    return null;
  }
}
