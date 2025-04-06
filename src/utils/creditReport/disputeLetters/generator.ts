
import { CreditReportData, CreditReportAccount, RecommendedDispute } from '../types';
import { DisputeLetter as DisputeLetterType } from '../types/letterTypes';
import { getSampleDisputeLanguage } from './sampleLanguage';
import { generateFallbackAccountDisputeLetter } from './fallbackTemplates/accountLetter';
import { generateFallbackInquiryDisputeLetter } from './fallbackTemplates/inquiryLetter';

/**
 * Generate a dispute letter based on credit report data and a specific account
 * @param creditReportData The credit report data
 * @param account The account to dispute
 * @param customLanguage Optional custom language to include in the letter
 * @returns Generated dispute letter content
 */
export function generateDisputeLetterForDiscrepancy(
  creditReportData: CreditReportData,
  account: CreditReportAccount,
  customLanguage?: string
): string {
  // Use fallback letter generation for now
  return generateFallbackAccountDisputeLetter(
    creditReportData.personalInfo || {},
    account,
    creditReportData.primaryBureau || account.bureau || 'Unknown',
    customLanguage
  );
}

/**
 * Generates an enhanced dispute letter based on credit report data and identified issues
 * @param creditReportData The parsed credit report data
 * @param issues Array of identified issues in the credit report
 * @param userId The user ID for storing the letter
 * @returns The generated dispute letter object
 */
export async function generateEnhancedDisputeLetter(
  creditReportData: CreditReportData,
  recommendedDisputes: RecommendedDispute[],
  userId: string = 'anonymous'
): Promise<DisputeLetterType> {
  try {
    // For now, use a simplified approach with fallback templates
    const firstDispute = recommendedDisputes[0];
    
    if (!firstDispute) {
      return createDefaultLetter(creditReportData, userId);
    }
    
    // Find the account in the credit report data
    const account = creditReportData.accounts.find(a => 
      a.accountName === firstDispute.accountName || 
      a.accountNumber === firstDispute.accountNumber
    );
    
    // Generate letter content
    let letterContent = '';
    
    if (firstDispute.type.toLowerCase().includes('inquiry')) {
      // For inquiry disputes
      const inquiry = creditReportData.inquiries.find(i => 
        i.inquiryBy === firstDispute.accountName || 
        i.creditor === firstDispute.accountName
      );
      
      if (inquiry) {
        letterContent = generateFallbackInquiryDisputeLetter(
          creditReportData.personalInfo || {},
          inquiry,
          firstDispute.bureau
        );
      }
    } else if (account) {
      // For account disputes
      letterContent = generateFallbackAccountDisputeLetter(
        creditReportData.personalInfo || {},
        account,
        firstDispute.bureau,
        firstDispute.sampleDisputeLanguage
      );
    } else {
      // General dispute for unknown account
      letterContent = generateFallbackAccountDisputeLetter(
        creditReportData.personalInfo || {},
        {
          accountName: firstDispute.accountName,
          accountNumber: firstDispute.accountNumber
        } as CreditReportAccount,
        firstDispute.bureau,
        firstDispute.sampleDisputeLanguage
      );
    }
    
    // Create the dispute letter object
    const letter: DisputeLetterType = {
      id: generateUniqueId(),
      title: `${firstDispute.bureau} Dispute - ${firstDispute.accountName || 'Multiple Accounts'}`,
      content: letterContent,
      letterContent: letterContent, // Duplicate for compatibility
      bureau: firstDispute.bureau,
      accountName: firstDispute.accountName || 'Multiple Accounts',
      accountNumber: firstDispute.accountNumber || 'Multiple',
      errorType: firstDispute.type,
      status: 'ready',
      createdAt: new Date().toISOString(),
      userId
    };
    
    return letter;
  } catch (error) {
    console.error('Error generating dispute letter:', error);
    return createDefaultLetter(creditReportData, userId);
  }
}

/**
 * Generates a unique ID for a dispute letter
 */
function generateUniqueId(): string {
  return `letter_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Creates a default letter if no specific issues were identified
 */
function createDefaultLetter(creditReportData: CreditReportData, userId: string): DisputeLetterType {
  return {
    id: generateUniqueId(),
    title: 'General Credit Report Dispute',
    content: 'Please review the attached credit report for accuracy.',
    letterContent: 'Please review the attached credit report for accuracy.',
    bureau: creditReportData.primaryBureau || 'all',
    accountName: 'Multiple Accounts',
    accountNumber: 'Multiple',
    errorType: 'general',
    status: 'draft',
    createdAt: new Date().toISOString(),
    userId
  };
}
