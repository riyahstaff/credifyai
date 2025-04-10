
// Import Letter type directly from useDisputeLettersData.tsx
import { Letter } from './useDisputeLettersData';

const STORAGE_KEY = 'disputeLetters';

/**
 * Load letters from storage
 */
export const loadLettersFromStorage = async (): Promise<Letter[]> => {
  try {
    const storedLetters = localStorage.getItem(STORAGE_KEY);
    
    if (!storedLetters) {
      return [];
    }
    
    const parsedLetters = JSON.parse(storedLetters);
    
    // Format each letter to ensure it has all required fields
    return parsedLetters.map(formatLetterFromStorage);
  } catch (error) {
    console.error('Error loading letters from storage:', error);
    return [];
  }
};

/**
 * Save letters to storage
 */
export const saveLettersToStorage = async (letters: Letter[]): Promise<boolean> => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
    return true;
  } catch (error) {
    console.error('Error saving letters to storage:', error);
    return false;
  }
};

/**
 * Add a new letter to storage
 */
export const addLetterToStorage = async (letter: Letter): Promise<boolean> => {
  try {
    const currentLetters = await loadLettersFromStorage();
    const updatedLetters = [...currentLetters, letter];
    
    return saveLettersToStorage(updatedLetters);
  } catch (error) {
    console.error('Error adding letter to storage:', error);
    return false;
  }
};

/**
 * Format a letter from storage to ensure it has all required fields
 */
export const formatLetterFromStorage = (letter: any): Letter => {
  return {
    id: letter.id || Date.now(),
    title: letter.title || 'Credit Report Dispute',
    bureau: letter.bureau || 'Credit Bureau',
    accountName: letter.accountName || 'Multiple Accounts',
    accountNumber: letter.accountNumber || '',
    content: letter.content || letter.letterContent || '',
    letterContent: letter.letterContent || letter.content || '',
    createdAt: letter.createdAt || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: letter.status || 'ready',
    errorType: letter.errorType || 'General Dispute',
    recipient: letter.recipient || letter.bureau || 'Credit Bureau',
    bureaus: letter.bureaus || [letter.bureau || 'Credit Bureau'],
  };
};
