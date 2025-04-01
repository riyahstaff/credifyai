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
