
import { Profile } from '@/lib/supabase';
import { RecommendedDispute } from '../../types';
import { generateDisputeLetterForDiscrepancy } from '@/utils/creditReport/disputeLetters';

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
