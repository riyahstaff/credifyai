
import { Letter } from './useDisputeLettersData';

/**
 * Load all letters from storage
 */
export const loadLettersFromStorage = (): Letter[] => {
  try {
    // First check session storage
    const sessionLettersJSON = sessionStorage.getItem('generatedDisputeLetters');
    if (sessionLettersJSON) {
      return JSON.parse(sessionLettersJSON);
    }
    
    // Then check local storage
    const localLettersJSON = localStorage.getItem('disputeLetters');
    if (localLettersJSON) {
      return JSON.parse(localLettersJSON);
    }
    
    // Check for pending letter
    const pendingLetterJSON = sessionStorage.getItem('pendingDisputeLetter');
    if (pendingLetterJSON) {
      const letter = JSON.parse(pendingLetterJSON);
      return [formatLetterFromStorage(letter)];
    }
    
    return [];
  } catch (error) {
    console.error("Error loading letters from storage:", error);
    return [];
  }
};

/**
 * Save letters to storage
 */
export const saveLettersToStorage = (letters: Letter[]): boolean => {
  try {
    sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(letters));
    localStorage.setItem('disputeLetters', JSON.stringify(letters));
    return true;
  } catch (error) {
    console.error("Error saving letters to storage:", error);
    return false;
  }
};

/**
 * Add a new letter to storage
 */
export const addLetterToStorage = (letter: Letter): boolean => {
  try {
    // Get existing letters
    const existingLetters = loadLettersFromStorage();
    
    // Add the new letter
    const updatedLetters = [...existingLetters, letter];
    
    // Save updated array
    return saveLettersToStorage(updatedLetters);
  } catch (error) {
    console.error("Error adding letter to storage:", error);
    return false;
  }
};

/**
 * Format a letter object from storage to match the Letter interface
 */
export const formatLetterFromStorage = (letter: any): Letter => {
  return {
    id: letter.id || Date.now(),
    title: letter.title || `${letter.errorType || 'Dispute'} Letter`,
    recipient: letter.bureau || letter.recipient || 'Credit Bureau',
    createdAt: letter.createdAt || new Date().toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    }),
    status: letter.status || 'draft',
    bureaus: letter.bureaus || [letter.bureau || 'Unknown'],
    content: letter.letterContent || letter.content || '',
    accountName: letter.accountName || '',
    accountNumber: letter.accountNumber || '',
    errorType: letter.errorType || 'General Dispute'
  };
};
