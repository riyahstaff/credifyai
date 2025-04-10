
/**
 * Letter Types and Utilities - NO MOCK DATA
 * This file only contains types and an empty function for backward compatibility
 */

// Re-export the Letter type from our implementation
export type { Letter } from './useDisputeLettersData.tsx';

/**
 * Always returns an empty array - NO MOCK LETTERS
 * This exists only for backward compatibility
 */
export const getSampleLetters = (): any[] => {
  console.log("REMOVED: getSampleLetters called but returns empty array - NO MOCK DATA");
  return [];
};
