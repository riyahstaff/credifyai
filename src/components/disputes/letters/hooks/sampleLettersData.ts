
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
 * Returns empty array to ensure no more mock letters are used
 */
export const getSampleLetters = (): Letter[] => {
  console.log("getSampleLetters called - returning EMPTY array - NO MOCK DATA");
  return [];
};
