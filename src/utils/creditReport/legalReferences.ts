
/**
 * Credit Laws and Regulations Database
 * This module contains references to credit laws and regulations
 */
import { LegalReference } from './types';

// Credit Laws and Regulations Database
export const CREDIT_LAWS = {
  FCRA: {
    name: "Fair Credit Reporting Act",
    sections: {
      "601": {
        title: "Short title",
        description: "Establishes the short title of the Act as the Fair Credit Reporting Act."
      },
      "602": {
        title: "Congressional findings and statement of purpose",
        description: "Outlines the purpose of the FCRA to ensure fair and accurate credit reporting."
      },
      "603": {
        title: "Definitions; rules of construction",
        description: "Provides definitions for terms used in the Act."
      },
      "605": {
        title: "Requirements relating to information contained in consumer reports",
        description: "Limits the time periods for reporting negative information in consumer credit reports."
      },
      "605A": {
        title: "Identity theft prevention and credit history restoration",
        description: "Outlines provisions for fraud alerts and active duty alerts."
      },
      "605B": {
        title: "Block of information resulting from identity theft",
        description: "Provides for blocking of information resulting from identity theft."
      },
      "609": {
        title: "Disclosures to consumers",
        description: "Requires consumer reporting agencies to disclose information to consumers."
      },
      "610": {
        title: "Conditions and form of disclosure to consumers",
        description: "Specifies the conditions and form of disclosures to consumers."
      },
      "611": {
        title: "Procedure in case of disputed accuracy",
        description: "Requires consumer reporting agencies to reinvestigate disputed information and correct or delete inaccurate information."
      },
      "623": {
        title: "Responsibilities of furnishers of information to consumer reporting agencies",
        description: "Outlines the responsibilities of those who furnish information to consumer reporting agencies."
      }
    }
  },
  METRO2: {
    name: "METRO 2 Format",
    sections: {
      "Compliance": {
        title: "Compliance with Metro 2 Format",
        description: "Requires furnishers to report information in the standard Metro 2 Format."
      },
      "Accuracy": {
        title: "Data Accuracy",
        description: "Requires furnishers to report accurate and complete information."
      },
      "PaymentHistory": {
        title: "Payment History Profile",
        description: "Standardizes reporting of account status and payment history."
      },
      "AccountStatus": {
        title: "Account Status Codes",
        description: "Defines standard codes for reporting account status."
      },
      "ConsumerInfo": {
        title: "Consumer Information Indicator",
        description: "Provides codes for special consumer situations such as bankruptcy or dispute."
      },
      "Dates": {
        title: "Date Reporting",
        description: "Standardizes reporting of dates including date opened, date of last payment, date reported."
      }
    }
  },
  ECOA: {
    name: "Equal Credit Opportunity Act",
    sections: {
      "701": {
        title: "Prohibited discrimination",
        description: "Prohibits discrimination in credit transactions."
      },
      "702": {
        title: "Definitions",
        description: "Provides definitions for terms used in the Act."
      },
      "704B": {
        title: "Small business loan data collection",
        description: "Requires collection of small business loan data."
      }
    }
  },
  FDCPA: {
    name: "Fair Debt Collection Practices Act",
    sections: {
      "803": {
        title: "Definitions",
        description: "Provides definitions for terms used in the Act."
      },
      "805": {
        title: "Communication in connection with debt collection",
        description: "Restricts communications with consumers in connection with debt collection."
      },
      "807": {
        title: "False or misleading representations",
        description: "Prohibits false or misleading representations in connection with debt collection."
      },
      "809": {
        title: "Validation of debts",
        description: "Requires debt collectors to validate debts when disputed by consumers."
      }
    }
  }
};

// Associate common dispute scenarios with applicable legal references
export const LEGAL_REFERENCES_BY_DISPUTE_TYPE: Record<string, LegalReference[]> = {
  "identity_theft": [
    { law: "FCRA", section: "Section 605B", description: "You have the right to block information resulting from identity theft." },
    { law: "FCRA", section: "Section 605A", description: "You can place a fraud alert on your credit file when you've been a victim of identity theft." }
  ],
  "not_mine": [
    { law: "FCRA", section: "Section 611(a)", description: "Credit bureaus must conduct a reasonable investigation of disputed information." },
    { law: "FCRA", section: "Section 623(b)", description: "Furnishers must investigate disputed information reported to them by a consumer reporting agency." }
  ],
  "late_payment": [
    { law: "FCRA", section: "Section 611(a)", description: "You have the right to dispute inaccurate information about your payment history." },
    { law: "METRO 2", section: "Payment History Profile", description: "Creditors must accurately report payment history according to Metro 2 standards." }
  ],
  "balance": [
    { law: "FCRA", section: "Section 611(a)", description: "You have the right to dispute inaccurate balance information." },
    { law: "METRO 2", section: "Accuracy", description: "Creditors must report the correct current balance per Metro 2 standards." }
  ],
  "account_status": [
    { law: "FCRA", section: "Section 623", description: "Furnishers must report accurate status information to credit bureaus." },
    { law: "METRO 2", section: "AccountStatus", description: "Account status must be reported using correct codes per Metro 2 standards." }
  ],
  "account_information": [
    { law: "FCRA", section: "Section 611(a)", description: "Credit bureaus must investigate disputed account information." },
    { law: "METRO 2", section: "Compliance", description: "Account information must be reported accurately according to Metro 2 standards." }
  ],
  "personal_information": [
    { law: "FCRA", section: "Section 611(a)", description: "You have the right to dispute inaccurate personal information." },
    { law: "METRO 2", section: "ConsumerInfo", description: "Consumer information must be reported accurately per Metro 2 standards." }
  ],
  "closed_account": [
    { law: "FCRA", section: "Section 623", description: "Furnishers must report accurate information about account closure." },
    { law: "METRO 2", section: "AccountStatus", description: "Closed accounts must be reported with the correct status code." }
  ],
  "dates": [
    { law: "FCRA", section: "Section 611(a)", description: "You have the right to dispute inaccurate dates on your credit report." },
    { law: "METRO 2", section: "Dates", description: "Dates must be reported accurately according to Metro 2 standards." }
  ]
};

/**
 * Find applicable legal references for a specific dispute type
 */
export function getLegalReferencesForDispute(field: string, context?: string): LegalReference[] {
  // Map the field to a dispute type
  let disputeType = 'account_information'; // default
  
  const fieldLower = field.toLowerCase();
  const contextLower = context?.toLowerCase() || '';
  
  if (fieldLower.includes('name') || fieldLower.includes('address')) {
    disputeType = 'personal_information';
  } else if (fieldLower.includes('balance') || contextLower.includes('balance')) {
    disputeType = 'balance';
  } else if (fieldLower.includes('payment') || fieldLower.includes('late') || contextLower.includes('late')) {
    disputeType = 'late_payment';
  } else if (fieldLower.includes('status') || contextLower.includes('closed') || contextLower.includes('open')) {
    disputeType = 'account_status';
  } else if (fieldLower.includes('date') || contextLower.includes('date')) {
    disputeType = 'dates';
  } else if (contextLower.includes('not mine') || contextLower.includes('not my account')) {
    disputeType = 'not_mine';
  } else if (contextLower.includes('identity theft') || contextLower.includes('fraud')) {
    disputeType = 'identity_theft';
  }
  
  return LEGAL_REFERENCES_BY_DISPUTE_TYPE[disputeType] || LEGAL_REFERENCES_BY_DISPUTE_TYPE['account_information'];
}
