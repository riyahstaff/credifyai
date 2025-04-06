
/**
 * Types related to dispute letters and templates
 */

import { LegalReference, CreditReportAccount } from '../types';

export interface DisputeLetter {
  id: string;
  title: string;
  content: string;
  letterContent: string; // Duplicate for compatibility with older code
  bureau: string;
  accountName: string;
  accountNumber: string;
  errorType: string;
  status: 'ready' | 'draft' | 'sent' | 'rejected';
  createdAt: string;
  userId: string;
  customizations?: Record<string, any>;
}

export interface LetterTemplate {
  id: string;
  type: string;
  name: string;
  description: string;
  content: string;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface Issue {
  id: string;
  type: string;
  description: string;
  bureau: string;
  accountName?: string;
  accountNumber?: string;
  date?: string;
  reason?: string;
  legalBasis?: string;
  severity: 'high' | 'medium' | 'low';
  details?: Record<string, any>;
}

export interface DisputeLetterGenerationResult {
  success: boolean;
  letter?: DisputeLetter;
  message?: string;
  errorCode?: string;
}
