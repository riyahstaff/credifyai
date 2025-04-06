
/**
 * Legal reference types and utilities for credit report disputes
 */

import { LegalReference as CommonLegalReference } from './types';

// Add the missing properties to align with the type in types.ts
export interface LegalReference extends CommonLegalReference {
  law: string;
  section: string;
  title: string;
  text: string;
  applicability?: string;
}

/**
 * Gets legal references relevant to a specific type of dispute
 * @param disputeType Type of credit dispute
 * @param description Optional description to refine reference selection
 * @returns Array of applicable legal references
 */
export function getLegalReferencesForDispute(disputeType: string, description?: string): LegalReference[] {
  const references: LegalReference[] = [];
  
  // Add FCRA reference for all disputes
  references.push({
    law: "FCRA",
    section: "611",
    title: "Fair Credit Reporting Act - Investigation of Disputed Information",
    text: "If the completeness or accuracy of any item of information contained in a consumer's file at a consumer reporting agency is disputed by the consumer, the agency shall, free of charge, conduct a reasonable reinvestigation to determine whether the disputed information is inaccurate and record the current status of the disputed information.",
    applicability: "All credit report disputes"
  });
  
  // Add type-specific references
  switch (disputeType.toLowerCase()) {
    case 'late_payment':
      references.push({
        law: "FCRA",
        section: "605(a)(5)",
        title: "Time limit on adverse information",
        text: "The consumer reporting agency shall not report accounts placed for collection or charged to profit and loss which antedate the report by more than seven years.",
        applicability: "Late payment disputes"
      });
      break;
      
    case 'collection':
    case 'collection_account':
      references.push({
        law: "FDCPA",
        section: "809",
        title: "Validation of debts",
        text: "If the consumer notifies the debt collector in writing within the thirty-day period that the debt is disputed, the debt collector shall cease collection of the debt until the debt collector obtains verification of the debt.",
        applicability: "Collection account disputes"
      });
      break;
      
    case 'inquiry':
    case 'unauthorized_inquiry':
      references.push({
        law: "FCRA",
        section: "604",
        title: "Permissible purposes of consumer reports",
        text: "A consumer reporting agency may furnish a consumer report only under specific circumstances, including with the written permission of the consumer.",
        applicability: "Inquiry disputes"
      });
      break;
      
    case 'account_not_mine':
    case 'identity_theft':
      references.push({
        law: "FCRA",
        section: "605B",
        title: "Block of information resulting from identity theft",
        text: "A consumer reporting agency shall block the reporting of any information that the consumer identifies as resulting from identity theft, not later than 4 business days after the date of receipt.",
        applicability: "Identity theft or not-mine disputes"
      });
      break;
  }
  
  return references;
}
