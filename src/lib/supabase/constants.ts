
// Storage bucket names
export const SAMPLE_LETTERS_BUCKET = 'sample_letters';
export const LEGAL_TEMPLATES_BUCKET = 'legal_templates';
export const SAMPLE_REPORTS_BUCKET = 'sample_reports'; // Adding missing bucket name

// Define dispute templates
export const DISPUTE_TEMPLATES = {
  general: {
    GENERAL_DISPUTE: 'General Credit Report Dispute',
  },
  account: {
    NOT_MY_ACCOUNT: 'Not My Account Dispute',
    IDENTITY_THEFT: 'Identity Theft Dispute',
    INCORRECT_BALANCE: 'Incorrect Balance Dispute',
    INCORRECT_PAYMENT_HISTORY: 'Incorrect Payment History Dispute',
    INCORRECT_STATUS: 'Incorrect Account Status Dispute',
    ACCOUNT_CLOSED: 'Account Closed by Consumer Dispute',
  },
  inquiry: {
    UNAUTHORIZED_INQUIRY: 'Unauthorized Inquiry Dispute',
  },
  collection: {
    COLLECTION_DISPUTE: 'Collection Account Dispute',
  }
};

// Define legal references for disputes
export const LEGAL_REFERENCES = {
  fcra_section_611: `Under the Fair Credit Reporting Act (FCRA) § 611 [15 USC § 1681i], credit reporting agencies must conduct a reasonable investigation into any item disputed by a consumer. This investigation must be free of charge and completed within a 30 day period (45 days in certain circumstances).`,
  
  fcra_section_623: `Under the FCRA § 623 [15 USC § 1681s-2], furnishers of information to credit reporting agencies have a duty to provide accurate information and to investigate consumer disputes about the accuracy of information they provide.`,
  
  fcra_section_605: `Under the FCRA § 605 [15 USC § 1681c], most negative information must be removed from your credit report after 7 years, with bankruptcies remaining for 10 years.`,
  
  fcra_section_604: `Under the FCRA § 604 [15 USC § 1681b], credit reporting agencies may only furnish consumer reports under specific circumstances, including when there is a permissible purpose.`,
  
  fcra_section_609: `Under the FCRA § 609 [15 USC § 1681g], upon request, consumer reporting agencies must clearly and accurately disclose to the consumer all information in the consumer's file.`,
  
  fdcpa_section_809: `Under the Fair Debt Collection Practices Act (FDCPA) § 809 [15 USC § 1692g], within five days after the initial communication with a consumer, a debt collector must send the consumer a written validation notice.`
};
