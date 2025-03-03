
import { Profile } from '@/lib/supabase';
import { RecommendedDispute } from '../../types';
import { 
  generateDisputeLetterForDiscrepancy, 
  getSampleDisputeLanguage 
} from '@/utils/creditReport/disputeLetters';

export const generateAutomaticDisputeLetter = async (
  targetDispute: RecommendedDispute,
  profile: Profile | null,
  sampleReportsLoaded: boolean
): Promise<{ disputeData: any, letterContent: string }> => {
  try {
    console.log("Generating automatic dispute letter for:", targetDispute);
    
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
        const sampleLanguage = await getSampleDisputeLanguage(
          targetDispute.reason, 
          targetDispute.bureau
        );
        
        if (sampleLanguage) {
          console.log("Found sample dispute language:", sampleLanguage.substring(0, 50) + "...");
          targetDispute.sampleDisputeLanguage = sampleLanguage;
        }
      } catch (error) {
        console.error("Error fetching sample dispute language:", error);
        // Continue without sample language if there's an error
      }
    }
    
    // Actually generate the letter
    const letterContent = await generateDisputeLetterForDiscrepancy(targetDispute, userInfo);
    
    console.log("Letter generated successfully");
    
    const disputeData = {
      bureau: targetDispute.bureau,
      accountName: targetDispute.accountName,
      accountNumber: targetDispute.accountNumber,
      errorType: targetDispute.reason,
      explanation: targetDispute.description,
      timestamp: new Date(),
      letterContent: letterContent
    };

    return { disputeData, letterContent };
  } catch (error) {
    console.error("Error generating dispute letter:", error);
    throw new Error(`Failed to generate dispute letter: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
