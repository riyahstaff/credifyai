
import { Profile } from '@/lib/supabase';
import { RecommendedDispute } from '../../types';
import { 
  generateDisputeLetterForDiscrepancy, 
  getSampleDisputeLanguage 
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
    
    // Create user info with defaults if profile properties are missing
    const userInfo = {
      name: profile?.full_name || "[YOUR NAME]",
      address: "[YOUR ADDRESS]", // Default as these are not in the Profile type
      city: "[CITY]",
      state: "[STATE]",
      zip: "[ZIP]"
    };
    
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
    const letterContent = await generateDisputeLetterForDiscrepancy(targetDispute, userInfo);
    
    if (!letterContent || letterContent.trim().length < 50) {
      throw new Error("Generated letter is empty or too short");
    }
    
    // Add test mode header if applicable
    const finalLetterContent = options?.testMode ? 
      `[TEST MODE - NOT FOR ACTUAL SUBMISSION]\n\n${letterContent}` : 
      letterContent;
    
    console.log("Letter generated successfully:", finalLetterContent.substring(0, 50) + "...");
    
    const disputeData = {
      bureau: targetDispute.bureau,
      accountName: targetDispute.accountName,
      accountNumber: targetDispute.accountNumber,
      errorType: targetDispute.reason,
      explanation: targetDispute.description,
      timestamp: new Date(),
      letterContent: finalLetterContent,
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
      enhancedDescription = `${baseDescription} Under the Fair Credit Reporting Act (FCRA) Section 623(a)(3), furnishers must investigate and correct any inaccurate payment information, including late payments, when notified of a dispute. Furthermore, Section 605(a)(5) limits negative information to seven years.`;
    } 
    else if (dispute.reason.toLowerCase().includes('balance')) {
      enhancedDescription = `${baseDescription} Per FCRA Section 623(a)(2), credit reporting agencies and furnishers must ensure the completeness and accuracy of reported account balances. The current balance report appears to violate these provisions.`;
    }
    else if (dispute.reason.toLowerCase().includes('inquiry') || dispute.reason.toLowerCase().includes('hard pull')) {
      enhancedDescription = `${baseDescription} Under FCRA Section 604(a), inquiries can only be made with permissible purpose and consumer authorization. Section 611 further requires thorough investigation of disputed inquiries that may have been unauthorized.`;
    }
    else if (dispute.reason.toLowerCase().includes('account')) {
      enhancedDescription = `${baseDescription} According to FCRA Section 611(a), upon receiving notice of dispute about account information, credit reporting agencies must conduct a reasonable investigation. This account appears to contain errors requiring correction under these provisions.`;
    }
    
    return enhancedDescription;
  } catch (error) {
    console.error("Error in deep analysis:", error);
    return null;
  }
}
