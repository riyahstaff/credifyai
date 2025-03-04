
import { Letter } from './sampleLettersData';

/**
 * Loads letters from session storage
 */
export const loadLettersFromStorage = (): { 
  letters: Letter[], 
  selectedLetter: Letter | null,
  foundLetters: boolean
} => {
  const generatedLettersJSON = sessionStorage.getItem('generatedDisputeLetters');
  const pendingLetterJSON = sessionStorage.getItem('pendingDisputeLetter');
  const autoGeneratedFlag = sessionStorage.getItem('autoGeneratedLetter');
  
  console.log("[loadLettersFromStorage] Auto-generated flag:", autoGeneratedFlag);
  console.log("[loadLettersFromStorage] Generated letters JSON exists:", !!generatedLettersJSON);
  console.log("[loadLettersFromStorage] Pending letter JSON exists:", !!pendingLetterJSON);
  
  if (generatedLettersJSON) {
    console.log("[loadLettersFromStorage] Generated letters JSON content:", generatedLettersJSON.substring(0, 100) + "...");
  }
  
  if (pendingLetterJSON) {
    console.log("[loadLettersFromStorage] Pending letter JSON content:", pendingLetterJSON.substring(0, 100) + "...");
  }
  
  let letters: Letter[] = [];
  let selectedLetter: Letter | null = null;
  let foundLetters = false;
  
  // Try to load multiple letters first
  if (generatedLettersJSON) {
    try {
      const parsedLetters = JSON.parse(generatedLettersJSON);
      console.log("[loadLettersFromStorage] Parsed generated letters:", parsedLetters);
      
      if (Array.isArray(parsedLetters) && parsedLetters.length > 0) {
        console.log(`[loadLettersFromStorage] Found ${parsedLetters.length} generated letters in session storage`);
        
        letters = parsedLetters.map((letter, index) => formatLetterFromStorage(letter, index));
        
        console.log("[loadLettersFromStorage] Formatted letters:", letters);
        
        if (letters.length > 0) {
          selectedLetter = letters[0];
          console.log("[loadLettersFromStorage] Selected first letter:", letters[0]);
        }
        
        foundLetters = true;
        return { letters, selectedLetter, foundLetters };
      }
    } catch (error) {
      console.error("[loadLettersFromStorage] Error parsing generated letters:", error);
    }
  } 
  
  // Fall back to single letter if available
  if (pendingLetterJSON) {
    try {
      const pendingLetter = JSON.parse(pendingLetterJSON);
      console.log("[loadLettersFromStorage] Found pending letter in session storage", pendingLetter);
      
      if (pendingLetter) {
        const formattedLetter = formatLetterFromStorage(pendingLetter, 0);
        letters = [formattedLetter];
        selectedLetter = formattedLetter;
        foundLetters = true;
        
        console.log("[loadLettersFromStorage] Formatted pending letter:", formattedLetter);
        return { letters, selectedLetter, foundLetters };
      }
    } catch (error) {
      console.error("[loadLettersFromStorage] Error parsing pending letter:", error);
    }
  }
  
  console.log("[loadLettersFromStorage] No letters found in storage");
  return { letters, selectedLetter, foundLetters };
};

/**
 * Formats a letter from storage to match the Letter interface
 */
export const formatLetterFromStorage = (letter: any, index: number): Letter => {
  console.log("[formatLetterFromStorage] Formatting letter:", letter);
  
  // Ensure letter has all required fields
  const formattedLetter = {
    id: letter.id || Date.now() + index,
    title: letter.title || `${letter.errorType || 'Dispute'} (${letter.accountName || 'Account'})`,
    recipient: letter.bureau || letter.recipient || 'Credit Bureau',
    createdAt: letter.createdAt || new Date().toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric' 
    }),
    status: letter.status || 'draft',
    bureaus: letter.bureaus || [letter.bureau || 'Unknown'],
    // Ensure content is available in both fields for compatibility
    content: letter.letterContent || letter.content || '',
    letterContent: letter.content || letter.letterContent || '',
    accountName: letter.accountName || 'Unknown Account',
    accountNumber: letter.accountNumber || '',
    errorType: letter.errorType || 'General Dispute',
    laws: letter.laws || ["FCRA § 611"]
  };
  
  console.log("[formatLetterFromStorage] Formatted letter result:", formattedLetter);
  return formattedLetter;
};

/**
 * Saves all letters to session storage
 */
export const saveLettersToStorage = (letters: Letter[], selectedLetter: Letter | null) => {
  try {
    console.log(`[saveLettersToStorage] Saving ${letters.length} letters to storage`);
    
    // Make sure all letters have both content and letterContent fields
    const normalizedLetters = letters.map(letter => ({
      ...letter,
      content: letter.content || letter.letterContent || '',
      letterContent: letter.letterContent || letter.content || ''
    }));
    
    sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(normalizedLetters));
    
    if (selectedLetter) {
      const normalizedLetter = {
        ...selectedLetter,
        content: selectedLetter.content || selectedLetter.letterContent || '',
        letterContent: selectedLetter.letterContent || selectedLetter.content || ''
      };
      
      sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(normalizedLetter));
    }
    
    sessionStorage.setItem('autoGeneratedLetter', 'true');
    sessionStorage.setItem('forceLettersReload', 'true');
    
    console.log("[saveLettersToStorage] Storage state after saving:");
    console.log("- pendingDisputeLetter exists:", !!sessionStorage.getItem('pendingDisputeLetter'));
    console.log("- generatedDisputeLetters exists:", !!sessionStorage.getItem('generatedDisputeLetters'));
    console.log("- autoGeneratedLetter:", sessionStorage.getItem('autoGeneratedLetter'));
    console.log("- forceLettersReload:", sessionStorage.getItem('forceLettersReload'));
    
    return true;
  } catch (error) {
    console.error("[saveLettersToStorage] Error saving letters to storage:", error);
    return false;
  }
};

/**
 * Adds a single letter to session storage
 */
export const addLetterToStorage = (letter: Letter) => {
  try {
    console.log("[addLetterToStorage] Adding letter to storage:", letter);
    
    // First try to get existing letters
    const existingLettersJSON = sessionStorage.getItem('generatedDisputeLetters');
    let letters: Letter[] = [];
    
    if (existingLettersJSON) {
      try {
        const parsed = JSON.parse(existingLettersJSON);
        if (Array.isArray(parsed)) {
          letters = parsed;
        }
      } catch (e) {
        console.error("[addLetterToStorage] Error parsing existing letters:", e);
      }
    }
    
    // Normalize letter to have both content fields
    const normalizedLetter = {
      ...letter,
      content: letter.content || letter.letterContent || '',
      letterContent: letter.letterContent || letter.content || ''
    };
    
    // Add new letter to the array
    letters.unshift(normalizedLetter);
    
    // Save updated array
    sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(letters));
    sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(normalizedLetter));
    sessionStorage.setItem('autoGeneratedLetter', 'true');
    sessionStorage.setItem('forceLettersReload', 'true');
    
    console.log("[addLetterToStorage] Successfully added letter to storage");
    return true;
  } catch (error) {
    console.error("[addLetterToStorage] Error adding letter to storage:", error);
    return false;
  }
};

/**
 * Verifies if letters exist in storage
 */
export const verifyLettersExist = (): boolean => {
  const pendingLetter = sessionStorage.getItem('pendingDisputeLetter');
  const generatedLetters = sessionStorage.getItem('generatedDisputeLetters');
  
  console.log("[verifyLettersExist] Checking for letters in storage:");
  console.log("- pendingDisputeLetter exists:", !!pendingLetter);
  console.log("- generatedDisputeLetters exists:", !!generatedLetters);
  
  return !!pendingLetter || !!generatedLetters;
};
