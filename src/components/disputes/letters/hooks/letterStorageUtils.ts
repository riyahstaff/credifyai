
import { Letter } from './useDisputeLettersData';

/**
 * Load letters from local storage
 */
export const loadLettersFromStorage = async (): Promise<Letter[]> => {
  try {
    console.log("Loading letters from storage...");
    
    // First try to load from generatedDisputeLetters (new format)
    const generatedLetters = sessionStorage.getItem('generatedDisputeLetters');
    if (generatedLetters) {
      try {
        const parsedLetters = JSON.parse(generatedLetters);
        console.log("Found generated letters:", parsedLetters.length);
        
        if (Array.isArray(parsedLetters) && parsedLetters.length > 0) {
          // Ensure each letter has the right format
          const formattedLetters = parsedLetters.map(formatLetterFromStorage);
          console.log("Formatted letters:", formattedLetters);
          return formattedLetters;
        }
      } catch (e) {
        console.error("Error parsing generated letters:", e);
      }
    }
    
    // If no generated letters, try pendingDisputeLetter (old format)
    const pendingLetter = sessionStorage.getItem('pendingDisputeLetter');
    if (pendingLetter) {
      try {
        const parsedLetter = JSON.parse(pendingLetter);
        console.log("Found pending letter:", parsedLetter);
        
        if (parsedLetter) {
          const formattedLetter = formatLetterFromStorage(parsedLetter);
          return [formattedLetter];
        }
      } catch (e) {
        console.error("Error parsing pending letter:", e);
      }
    }
    
    // If we still have no letters, return an empty array
    console.log("No letters found in storage.");
    return [];
  } catch (error) {
    console.error("Error loading letters from storage:", error);
    return [];
  }
};

/**
 * Save letters to local storage
 */
export const saveLettersToStorage = async (letters: Letter[]): Promise<boolean> => {
  try {
    // Save to generatedDisputeLetters (new format)
    sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(letters));
    
    // Also save the first letter to pendingDisputeLetter for backward compatibility
    if (letters.length > 0) {
      sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(letters[0]));
    }
    
    // Set the autoGeneratedLetter flag
    sessionStorage.setItem('autoGeneratedLetter', 'true');
    
    console.log("Saved letters to storage:", letters.length);
    return true;
  } catch (error) {
    console.error("Error saving letters to storage:", error);
    return false;
  }
};

/**
 * Add a single letter to storage
 */
export const addLetterToStorage = async (letter: Letter): Promise<boolean> => {
  try {
    // Get existing letters
    const existingLetters = await loadLettersFromStorage();
    
    // Add the new letter
    const updatedLetters = [...existingLetters, letter];
    
    // Save the updated letters
    return saveLettersToStorage(updatedLetters);
  } catch (error) {
    console.error("Error adding letter to storage:", error);
    return false;
  }
};

/**
 * Format a letter from storage to ensure it has all required fields
 */
export const formatLetterFromStorage = (letter: any): Letter => {
  return {
    id: letter.id || Date.now(),
    title: letter.title || "Credit Report Dispute",
    bureau: letter.bureau || "Credit Bureau",
    accountName: letter.accountName || "Unknown Account",
    accountNumber: letter.accountNumber || "",
    content: letter.content || letter.letterContent || "No content available",
    letterContent: letter.letterContent || letter.content || "No content available", // For compatibility
    createdAt: letter.createdAt || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: letter.status || "ready",
    errorType: letter.errorType || "General Dispute",
    recipient: letter.recipient || letter.bureau || "Credit Bureau",
  };
};
