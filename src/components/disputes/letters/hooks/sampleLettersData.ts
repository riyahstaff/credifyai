
/**
 * Letter Types and Utilities - NO MOCK DATA
 * This file only contains types and an empty function for backward compatibility
 */

export interface Letter {
  id: number;
  title: string;
  recipient: string;
  createdAt: string;
  status: string;
  bureaus: string[];
  laws?: string[];
  content: string;
  resolvedAt?: string;
  accountName?: string;
  accountNumber?: string;
  errorType?: string;
  letterContent?: string;
  explanation?: string;
  bureau?: string;
  timestamp?: string;
}

/**
 * Always returns an empty array - NO MOCK LETTERS
 * This exists only for backward compatibility
 */
export const getSampleLetters = (): Letter[] => {
  console.log("REMOVED: getSampleLetters called but returns empty array - NO MOCK DATA");
  return [];
};
