
import { LegalReference } from './types';

// Collection of FCRA legal references for dispute letters
export const getFCRAReferences = (): Record<string, LegalReference> => {
  return {
    section_609: {
      law: "FCRA",
      section: "609",
      title: "Disclosures to Consumers",
      text: "Each consumer reporting agency shall, upon request, clearly and accurately disclose to the consumer all information in the consumer's file at the time of the request.",
      applicability: "Consumer has right to access their credit information"
    },
    section_611: {
      law: "FCRA",
      section: "611",
      title: "Procedure in Case of Disputed Accuracy",
      text: "If the completeness or accuracy of any item of information contained in a consumer's file at a consumer reporting agency is disputed by the consumer and the consumer notifies the agency directly, or indirectly through a reseller, of such dispute, the agency shall, free of charge, conduct a reasonable reinvestigation to determine whether the disputed information is inaccurate and record the current status of the disputed information, or delete the item from the file.",
      applicability: "Consumer has right to dispute inaccurate information"
    },
    section_623: {
      law: "FCRA",
      section: "623",
      title: "Responsibilities of Furnishers of Information",
      text: "A person shall not furnish information relating to a consumer to any consumer reporting agency if the person knows or has reasonable cause to believe that the information is inaccurate.",
      applicability: "Furnishers must provide accurate information"
    },
    section_605: {
      law: "FCRA",
      section: "605",
      title: "Requirements Relating to Information Contained in Consumer Reports",
      text: "Except as authorized under subsection (b), no consumer reporting agency may make any consumer report containing any of the following items of information...",
      applicability: "Sets limits on how long negative info can be reported"
    },
    fdcpa_809: {
      law: "FDCPA",
      section: "809",
      title: "Validation of Debts",
      text: "If the consumer notifies the debt collector in writing within the thirty-day period described in subsection (a) that the debt, or any portion thereof, is disputed, or that the consumer requests the name and address of the original creditor, the debt collector shall cease collection of the debt, or any disputed portion thereof, until the debt collector obtains verification of the debt or a copy of a judgment, or the name and address of the original creditor, and a copy of such verification or judgment, or name and address of the original creditor, is mailed to the consumer by the debt collector.",
      applicability: "Debt collectors must validate debts"
    }
  };
};

// Helper function to get FCRA references
export const getReferenceText = (referenceKey: string): string | undefined => {
  const references = getFCRAReferences();
  return references[referenceKey]?.text;
};

/**
 * Returns legal references relevant for a specific dispute
 * @param disputeReason The reason for the dispute
 * @param description Additional description of the dispute
 * @returns Array of legal references applicable to this dispute
 */
export const getLegalReferencesForDispute = (disputeReason: string, description: string): LegalReference[] => {
  const references = getFCRAReferences();
  const result: LegalReference[] = [];
  
  // Always include section 611 as it's the basis for all disputes
  if (references.section_611) {
    result.push(references.section_611);
  }
  
  // Add section 623 for furnisher responsibilities
  if (references.section_623) {
    result.push(references.section_623);
  }
  
  // Check for specific types of disputes and add relevant references
  const lowerReason = disputeReason.toLowerCase();
  const lowerDescription = description.toLowerCase();
  
  // For collection-related disputes, add FDCPA reference
  if (
    lowerReason.includes('collection') || 
    lowerReason.includes('debt') || 
    lowerDescription.includes('collection') || 
    lowerDescription.includes('collector')
  ) {
    if (references.fdcpa_809) {
      result.push(references.fdcpa_809);
    }
  }
  
  // For disputes about information being too old, add section 605
  if (
    lowerReason.includes('too old') || 
    lowerReason.includes('expired') || 
    lowerDescription.includes('too old') || 
    lowerDescription.includes('seven years') || 
    lowerDescription.includes('7 years')
  ) {
    if (references.section_605) {
      result.push(references.section_605);
    }
  }
  
  // For disputes about access to information, add section 609
  if (
    lowerReason.includes('access') || 
    lowerReason.includes('disclosure') || 
    lowerDescription.includes('access') || 
    lowerDescription.includes('disclosure')
  ) {
    if (references.section_609) {
      result.push(references.section_609);
    }
  }
  
  return result;
};
