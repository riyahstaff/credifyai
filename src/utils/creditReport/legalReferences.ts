
/**
 * Utility functions for getting appropriate legal references for disputes
 */

export interface LegalReference {
  code: string;
  title: string;
  description: string;
  text?: string;
}

// Common FCRA sections used in disputes
const FCRA_SECTIONS: Record<string, LegalReference> = {
  '611': {
    code: 'FCRA § 611',
    title: 'Procedure in case of disputed accuracy',
    description: 'Requires credit bureaus to investigate disputed information and remove or correct inaccurate items.',
    text: 'If the completeness or accuracy of any item of information contained in a consumer's file at a consumer reporting agency is disputed by the consumer and the consumer notifies the agency directly, or indirectly through a reseller, of such dispute, the agency shall, free of charge, conduct a reasonable reinvestigation to determine whether the disputed information is inaccurate.'
  },
  '623': {
    code: 'FCRA § 623',
    title: 'Responsibilities of furnishers of information to consumer reporting agencies',
    description: 'Outlines the duties of companies that provide information to credit bureaus.',
    text: 'A person shall not furnish information relating to a consumer to any consumer reporting agency if the person knows or has reasonable cause to believe that the information is inaccurate.'
  },
  '605': {
    code: 'FCRA § 605',
    title: 'Requirements relating to information contained in consumer reports',
    description: 'Limits how long negative information can stay on your credit report.',
    text: 'Accounts placed for collection or charged to profit and loss which antedate the report by more than seven years may not be reported.'
  },
  '615': {
    code: 'FCRA § 615',
    title: 'Requirements on users of consumer reports',
    description: 'Requires notification when information in your credit report has been used against you.',
    text: 'If any person takes any adverse action with respect to any consumer that is based in whole or in part on any information contained in a consumer report, the person shall provide notice to the consumer.'
  }
};

// Common FDCPA sections used in disputes
const FDCPA_SECTIONS: Record<string, LegalReference> = {
  '807': {
    code: 'FDCPA § 807',
    title: 'False or misleading representations',
    description: 'Prohibits debt collectors from using false, deceptive, or misleading practices.',
    text: 'A debt collector may not use any false, deceptive, or misleading representation or means in connection with the collection of any debt.'
  },
  '809': {
    code: 'FDCPA § 809',
    title: 'Validation of debts',
    description: 'Requires debt collectors to verify a debt when disputed.',
    text: 'If the consumer notifies the debt collector in writing within the thirty-day period that the debt, or any portion thereof, is disputed, the debt collector shall cease collection of the debt until the debt collector obtains verification of the debt.'
  }
};

/**
 * Gets relevant legal references based on dispute reason and description
 * @param disputeReason The type of dispute (e.g., "Late Payment Dispute", "Identity Theft")
 * @param description Additional description of the dispute
 * @returns Array of legal references relevant to the dispute
 */
export function getLegalReferencesForDispute(
  disputeReason: string,
  description?: string
): LegalReference[] {
  const references: LegalReference[] = [];
  
  // Always include these core sections for all disputes
  references.push(FCRA_SECTIONS['611']); // Investigation requirement
  references.push(FCRA_SECTIONS['623']); // Furnisher responsibilities
  
  // Add specific sections based on the dispute reason
  const reasonLower = disputeReason.toLowerCase();
  
  if (reasonLower.includes('collection') || reasonLower.includes('debt')) {
    references.push(FDCPA_SECTIONS['807']); // False representations
    references.push(FDCPA_SECTIONS['809']); // Debt validation
  }
  
  if (reasonLower.includes('old') || reasonLower.includes('obsolete') || reasonLower.includes('time limit')) {
    references.push(FCRA_SECTIONS['605']); // Time limits on reporting
  }
  
  if (reasonLower.includes('inquiry') || reasonLower.includes('pull')) {
    references.push(FCRA_SECTIONS['615']); // Requirements for users of reports
  }
  
  // Check description for additional context
  if (description) {
    const descLower = description.toLowerCase();
    
    if (descLower.includes('collection') && !reasonLower.includes('collection')) {
      references.push(FDCPA_SECTIONS['807']);
    }
    
    if ((descLower.includes('7 year') || descLower.includes('seven year')) && 
        !references.some(r => r.code === 'FCRA § 605')) {
      references.push(FCRA_SECTIONS['605']);
    }
  }
  
  // Remove duplicates
  return Array.from(new Map(references.map(item => [item.code, item])).values());
}
