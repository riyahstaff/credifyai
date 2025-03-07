
/**
 * Sample Dispute Letters Module
 * Handles loading and processing sample dispute letters
 */
import { supabase } from '@/lib/supabase';

/**
 * Retrieve a sample dispute letter from storage
 */
export const getSampleDisputeLanguage = async (
  disputeType: string,
  bureau: string = 'TransUnion'
): Promise<string | null> => {
  try {
    console.log(`Looking for sample dispute letter for ${disputeType} with ${bureau}`);
    
    // Normalize the dispute type and bureau for better matching
    const normalizedType = disputeType.toLowerCase();
    const normalizedBureau = bureau.toLowerCase();
    
    // Get sample letters from storage
    const { data: sampleLetters, error } = await supabase
      .storage
      .from('sample-letters')
      .list();
      
    if (error) {
      console.error("Error loading sample letters:", error);
      return null;
    }
    
    if (!sampleLetters || sampleLetters.length === 0) {
      console.log("No sample letters found in storage");
      return null;
    }
    
    console.log(`Found ${sampleLetters.length} sample letters in storage`);
    
    // Find the best matching letter based on dispute type and bureau
    const matchingLetterName = sampleLetters.find(letter => {
      const fileName = letter.name.toLowerCase();
      return fileName.includes(normalizedType) && fileName.includes(normalizedBureau);
    })?.name;
    
    if (!matchingLetterName) {
      console.log("No matching sample letter found for this dispute type and bureau");
      return null;
    }
    
    // Download the matching letter content
    const { data: letterData, error: downloadError } = await supabase
      .storage
      .from('sample-letters')
      .download(matchingLetterName);
      
    if (downloadError || !letterData) {
      console.error("Error downloading sample letter:", downloadError);
      return null;
    }
    
    // Convert the blob to text
    const letterText = await letterData.text();
    console.log(`Successfully loaded sample letter: ${matchingLetterName.substring(0, 30)}...`);
    return letterText;
  } catch (error) {
    console.error("Error in getSampleDisputeLanguage:", error);
    return null;
  }
};

/**
 * Find a sample dispute letter that matches the given criteria
 */
export const findSampleDispute = async (
  disputeType: string,
  bureau: string = 'TransUnion'
): Promise<{ content: string; filename: string } | null> => {
  try {
    // Normalize inputs for better matching
    const normalizedType = disputeType.toLowerCase();
    const normalizedBureau = bureau.toLowerCase();
    
    // Get available sample letters
    const { data: sampleLetters, error } = await supabase
      .storage
      .from('sample-letters')
      .list();
      
    if (error || !sampleLetters || sampleLetters.length === 0) {
      return null;
    }
    
    // Try to find an exact match first (both dispute type and bureau)
    let matchingLetter = sampleLetters.find(letter => {
      const fileName = letter.name.toLowerCase();
      return fileName.includes(normalizedType) && fileName.includes(normalizedBureau);
    });
    
    // If no exact match, try to find a match just based on dispute type
    if (!matchingLetter) {
      matchingLetter = sampleLetters.find(letter => {
        const fileName = letter.name.toLowerCase();
        return fileName.includes(normalizedType);
      });
    }
    
    // If still no match, try to find a match based on bureau
    if (!matchingLetter) {
      matchingLetter = sampleLetters.find(letter => {
        const fileName = letter.name.toLowerCase();
        return fileName.includes(normalizedBureau);
      });
    }
    
    // If still no match, just get any sample letter
    if (!matchingLetter && sampleLetters.length > 0) {
      matchingLetter = sampleLetters[0];
    }
    
    if (!matchingLetter) {
      return null;
    }
    
    // Download the chosen letter
    const { data: letterData, error: downloadError } = await supabase
      .storage
      .from('sample-letters')
      .download(matchingLetter.name);
      
    if (downloadError || !letterData) {
      return null;
    }
    
    // Return the letter content and filename
    const content = await letterData.text();
    return { content, filename: matchingLetter.name };
  } catch (error) {
    console.error("Error finding sample dispute:", error);
    return null;
  }
};
