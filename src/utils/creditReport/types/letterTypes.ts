
/**
 * Types for letter generation functionality
 */

export interface Issue {
  id?: string;
  type: string;
  description: string;
  accountName?: string;
  accountNumber?: string;
  bureau: string;
  reason?: string;
  legalBasis?: string;
  date?: string;  // For inquiries
  impact?: 'High' | 'Medium' | 'Low';
}

export interface LetterTemplate {
  id: string;
  name: string;
  content: string;
  type: string;
  created_at?: string;
  updated_at?: string;
}

export interface DisputeLetter {
  id: string;
  title: string;
  content: string;
  letterContent: string;
  bureau: string;
  accountName: string;
  accountNumber?: string;
  errorType: string;
  status: 'draft' | 'ready' | 'sent' | 'completed';
  createdAt: string;
  userId: string;
  sentAt?: string;
  responseAt?: string;
  responseContent?: string;
}
