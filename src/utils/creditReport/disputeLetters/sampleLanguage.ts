
/**
 * Sample language and templates for dispute letters
 */

import { DisputePhrasesCache } from '../types/letterTypes';

// Cache for dispute phrases
let disputePhrasesCache: DisputePhrasesCache = {
  balanceDisputes: [],
  latePaymentDisputes: [],
  accountOwnershipDisputes: [], // Fixed typo here
  closedAccountDisputes: [],
  personalInfoDisputes: [],
  inquiryDisputes: [],
  general: []
};

/**
 * Gets sample dispute language for a specific dispute type
 * @param disputeType Type of dispute (e.g., 'late_payment', 'inquiry')
 * @returns Array of sample dispute phrases
 */
export const getSampleDisputeLanguage = (disputeType: string): string[] => {
  // Initialize with general phrases for all dispute types
  const generalPhrases = [
    "I am disputing this information as it appears to be inaccurate.",
    "This information does not accurately reflect my credit history.",
    "I request that you investigate this matter and correct your records accordingly.",
    "Under the FCRA, you are required to verify this information or remove it.",
    "I have no record of this account/information and believe it may be reported in error."
  ];
  
  // Add specific phrases based on dispute type
  switch(disputeType.toLowerCase()) {
    case 'late_payment':
      return [
        ...generalPhrases,
        "I have always made timely payments on this account.",
        "The late payment reported on my account is inaccurate as I paid within the allowed time period.",
        "I have documentation showing that the payment was made on time.",
        "This late payment report is incorrect and damaging to my credit profile."
      ];
      
    case 'balance':
      return [
        ...generalPhrases,
        "The balance reported for this account is incorrect.",
        "My records indicate a different balance than what is being reported.",
        "This balance does not reflect recent payments made on the account.",
        "The balance shown is higher than my actual debt."
      ];
      
    case 'account_ownership':
      return [
        ...generalPhrases,
        "This account does not belong to me and appears to be the result of identity theft or mixed files.",
        "I have never opened an account with this creditor.",
        "This account may belong to someone with a similar name or identifier.",
        "I request immediate removal of this account as it does not belong to me."
      ];
      
    case 'inquiry':
      return [
        ...generalPhrases,
        "I did not authorize this inquiry on my credit report.",
        "This inquiry was made without my knowledge or consent.",
        "I have no relationship with this company and did not apply for credit with them.",
        "This unauthorized inquiry has negatively affected my credit score."
      ];
      
    default:
      return generalPhrases;
  }
};

/**
 * Gets a sample dispute letter template for a specific dispute type
 * @param templateType Type of template (e.g., 'late_payment', 'inquiry')
 * @returns Template content as a string
 */
export const getSampleDisputeLetterTemplate = (templateType: string): string => {
  // Basic template structure that can be customized based on type
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Default template
  let template = `
{CONSUMER_FULL_NAME}
{CONSUMER_STREET_ADDRESS}
{CONSUMER_CITY}, {CONSUMER_STATE} {CONSUMER_ZIP}

${currentDate}

{CREDIT_BUREAU_NAME}
{CREDIT_BUREAU_ADDRESS}
{CREDIT_BUREAU_CITY}, {CREDIT_BUREAU_STATE} {CREDIT_BUREAU_ZIP}

Re: Dispute of Inaccurate Information - Credit Report #{CREDIT_REPORT_NUMBER}

To Whom It May Concern:

I am writing to dispute the following information in my credit report. I have identified the following item(s) that are inaccurate or incomplete:

{DISPUTE_SUMMARY_LIST}

{SPECIFIC_DISPUTE_DETAILS}

Under the Fair Credit Reporting Act (FCRA), you are required to:
1. Conduct a reasonable investigation into the information I am disputing
2. Forward all relevant information that I provide to the furnisher
3. Review and consider all relevant information
4. Provide me the results of your investigation
5. Delete the disputed information if it cannot be verified

Please investigate this matter and provide me with the results within 30 days as required by the FCRA.

Sincerely,

{CONSUMER_FULL_NAME}

Enclosures:
- Copy of ID
- Copy of social security card
- Copy of utility bill
`;

  // Add specific language based on template type
  switch(templateType.toLowerCase()) {
    case 'late_payment_disputes':
      template += `\nAdditional Information:
The late payment information reported for {ACCOUNT_NAME} (account ending in {ACCOUNT_NUMBER_MASKED}) is inaccurate. I have always made payments on time for this account, and I can provide documentation to support this if needed.

{LATE_PAYMENT_ACCOUNTS_LIST}
`;
      break;
      
    case 'inquiry_disputes':
      template += `\nAdditional Information:
I did not authorize the following inquiry(ies) on my credit report. According to FCRA Section 604, inquiries can only be made with permissible purpose and consumer authorization.

{UNAUTHORIZED_INQUIRIES_LIST}
`;
      break;
      
    case 'account_ownership_disputes':
      template += `\nAdditional Information:
The following account(s) do not belong to me. I have never opened an account with the listed creditor(s) and believe this may be the result of identity theft or a mixed file.

{NOT_MY_ACCOUNTS_LIST}
`;
      break;
  }
  
  return template;
};

/**
 * Initializes or updates the cache of dispute phrases
 * @param newPhrases New phrases to add to the cache
 */
export const updateDisputePhrasesCache = (newPhrases?: Partial<DisputePhrasesCache>): void => {
  if (newPhrases) {
    disputePhrasesCache = {
      ...disputePhrasesCache,
      ...newPhrases
    };
  }
};

/**
 * Gets the entire dispute phrases cache
 * @returns The current dispute phrases cache
 */
export const getDisputePhrasesCache = (): DisputePhrasesCache => {
  return disputePhrasesCache;
};

/**
 * Gets successful dispute phrases/examples for a specific dispute type
 * @param disputeType Type of dispute (e.g., 'late_payment', 'inquiry')
 * @returns Array of successful dispute phrases
 */
export const getSuccessfulDisputePhrases = (disputeType: string): string[] => {
  const generalExamples = [
    "I have reviewed my credit report and found inaccurate information that requires correction.",
    "Under the Fair Credit Reporting Act, you are required to verify this information or remove it from my report.",
    "I am requesting that you investigate and correct this error as required by law."
  ];
  
  // Type-specific examples
  switch(disputeType.toLowerCase()) {
    case 'late_payment_disputes':
      return [
        ...generalExamples,
        "I have never made a late payment on this account and have documentation to prove timely payments.",
        "The late payment reported on this account is incorrect as I have always paid within the terms of our agreement."
      ];
    case 'inquiry_disputes':
      return [
        ...generalExamples,
        "I did not authorize this inquiry on my credit report and request its immediate removal.",
        "This inquiry was made without my consent or knowledge and violates FCRA Section 604."
      ];
    default:
      return generalExamples;
  }
};
