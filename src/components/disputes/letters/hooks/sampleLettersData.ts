
/**
 * Letter Types and Utilities - NO MOCK DATA
 * This file only contains types and an empty function for backward compatibility
 */

// Import Letter type directly from useDisputeLettersData
import { Letter } from './useDisputeLettersData';

// Re-export the Letter type for backward compatibility
export type { Letter };

/**
 * Always returns an empty array - NO MOCK LETTERS
 * This exists only for backward compatibility
 */
export const getSampleLetters = (): Letter[] => {
  console.log("REMOVED: getSampleLetters called but returns empty array - NO MOCK DATA");
  return [];
};
