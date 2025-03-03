
/**
 * Legal references for credit report disputes
 */
import { LegalReference } from './types';

/**
 * Get legal references relevant to a specific dispute type
 */
export const getLegalReferencesForDispute = (
  disputeType: string,
  details?: string
): LegalReference[] => {
  const references: LegalReference[] = [];
  
  // FCRA Section 611 - Always include this for all disputes
  references.push({
    law: 'FCRA',
    section: '611',
    title: 'Procedure in case of disputed accuracy',
    text: 'If the completeness or accuracy of any item of information contained in a consumer's file at a consumer reporting agency is disputed by the consumer and the consumer notifies the agency directly, the agency shall, free of charge, conduct a reasonable reinvestigation to determine whether the disputed information is inaccurate.',
    applicability: ['All Disputes']
  });
  
  // Add references based on dispute type
  switch (disputeType) {
    case 'payment':
      references.push({
        law: 'FCRA',
        section: '623',
        title: 'Responsibilities of furnishers of information to consumer reporting agencies',
        text: 'A person shall not furnish information relating to a consumer to any consumer reporting agency if the person knows or has reasonable cause to believe that the information is inaccurate.',
        applicability: ['Late Payments', 'Payment History']
      });
      break;
      
    case 'account_ownership':
      references.push({
        law: 'FCRA',
        section: '605',
        title: 'Requirements relating to information contained in consumer reports',
        text: 'Consumer reporting agencies must ensure that information in a consumer's credit report is accurate and belongs to the consumer.',
        applicability: ['Account Ownership']
      });
      break;
      
    case 'balance':
      references.push({
        law: 'FCRA',
        section: '623',
        title: 'Responsibilities of furnishers of information to consumer reporting agencies',
        text: 'Furnishers must provide accurate information about account balances and limits.',
        applicability: ['Account Balances']
      });
      break;
      
    case 'inquiries':
      references.push({
        law: 'FCRA',
        section: '604',
        title: 'Permissible purposes of consumer reports',
        text: 'A consumer reporting agency may furnish a consumer report only under specific permissible purposes, including with the consumer's written consent.',
        applicability: ['Unauthorized Inquiries']
      });
      break;
      
    case 'account_information':
      references.push({
        law: 'FCRA',
        section: '623',
        title: 'Furnisher responsibilities',
        text: 'Information furnishers must provide complete and accurate information to consumer reporting agencies.',
        applicability: ['Account Information']
      });
      break;
      
    case 'remarks':
      references.push({
        law: 'FCRA',
        section: '605',
        title: 'Requirements relating to information contained in consumer reports',
        text: 'Negative information should be reported accurately and should not exceed reporting time limits.',
        applicability: ['Account Remarks']
      });
      break;
      
    case 'account_type':
      references.push({
        law: 'FCRA',
        section: '623',
        title: 'Furnisher responsibilities',
        text: 'Account type must be accurately reported.',
        applicability: ['Account Information']
      });
      break;
      
    case 'general_dispute':
      references.push({
        law: 'FCRA',
        section: '609',
        title: 'Disclosures to consumers',
        text: 'Consumer reporting agencies must disclose all information in a consumer's file upon request.',
        applicability: ['All Disputes']
      });
      break;
  }
  
  return references;
};
