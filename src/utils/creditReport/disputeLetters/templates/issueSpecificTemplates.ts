
import { FCRA_LAWS } from '../../types';

/**
 * Issue-specific dispute letter templates
 * These templates are customized for specific credit report issues
 */

// Personal Information Dispute Template
export const personalInfoDisputeTemplate = `
[DATE]

[BUREAU_NAME]
[BUREAU_ADDRESS]

RE: Dispute of Inaccurate Personal Information in Credit Report

To Whom It May Concern:

I am writing in accordance with my rights under the Fair Credit Reporting Act (FCRA) to dispute inaccurate personal information in my credit report.

My personal information:
Name: [CONSUMER_NAME]
Address: [CONSUMER_ADDRESS]
City, State, ZIP: [CONSUMER_CITY], [CONSUMER_STATE] [CONSUMER_ZIP]
SSN: [CONSUMER_SSN_LAST_4]

After reviewing my credit report dated [REPORT_DATE], I have identified the following inaccurate personal information:

[ISSUE_DETAILS]

This information is inaccurate because: [ISSUE_REASON]

Under the Fair Credit Reporting Act, specifically 15 USC 1681c and 15 USC 1681g, you are required to maintain accurate personal information and to correct or delete information that cannot be verified.

Please investigate this matter and update my credit report accordingly. If you cannot verify this information with the furnisher within the 30-day time period specified by law, it must be removed from my report.

Please send me written confirmation of your findings and a corrected copy of my credit report.

Sincerely,

[CONSUMER_NAME]
`;

// Late Payments Dispute Template
export const latePaymentsDisputeTemplate = `
[DATE]

[BUREAU_NAME]
[BUREAU_ADDRESS]

RE: Dispute of Late Payments on Credit Report

To Whom It May Concern:

I am writing to dispute late payment information on my credit report that I believe to be inaccurate. After reviewing my credit report dated [REPORT_DATE], I have identified the following discrepancies:

Account Information:
Creditor: [CREDITOR_NAME]
Account Number: [ACCOUNT_NUMBER]
Reported Late Payment Dates: [LATE_PAYMENT_DATES]

Issue: [ISSUE_DETAILS]

This information is inaccurate because: [ISSUE_REASON]

Under the Fair Credit Reporting Act, specifically 15 USC 1681s-2(a)(3) and 15 USC 1681e(b), credit reporting agencies must follow reasonable procedures to assure maximum possible accuracy of information, and furnishers may not continue to report information found to be inaccurate.

Please investigate this matter and correct my credit report. If you cannot verify these late payments within the 30-day period specified by law, they must be removed from my report.

Please send me written confirmation of your findings and a corrected copy of my credit report.

Sincerely,

[CONSUMER_NAME]
[CONSUMER_ADDRESS]
[CONSUMER_CITY], [CONSUMER_STATE] [CONSUMER_ZIP]
`;

// Collections Account Dispute Template
export const collectionsDisputeTemplate = `
[DATE]

[BUREAU_NAME]
[BUREAU_ADDRESS]

RE: Dispute of Collection Account on Credit Report

To Whom It May Concern:

I am writing to dispute a collection account on my credit report that I believe to be inaccurate. After reviewing my credit report dated [REPORT_DATE], I have identified the following discrepancies:

Collection Account Information:
Collection Agency: [CREDITOR_NAME]
Account Number: [ACCOUNT_NUMBER]
Original Creditor: [ORIGINAL_CREDITOR]
Reported Balance: [BALANCE]
Reported Date: [REPORT_DATE]

Issue: [ISSUE_DETAILS]

This information is inaccurate because: [ISSUE_REASON]

Under the Fair Credit Reporting Act, specifically 15 USC 1692c and 15 USC 1681s-2(a)(3), and in accordance with Metro 2® Compliance Guidelines, credit reporting agencies must follow reasonable procedures to assure maximum possible accuracy of information.

Please investigate this matter and correct my credit report. If you cannot verify this collection account within the 30-day period specified by law, it must be removed from my report.

Please send me written confirmation of your findings and a corrected copy of my credit report.

Sincerely,

[CONSUMER_NAME]
[CONSUMER_ADDRESS]
[CONSUMER_CITY], [CONSUMER_STATE] [CONSUMER_ZIP]
`;

// Duplicate/Inaccurate Account Dispute Template
export const inaccuracyDisputeTemplate = `
[DATE]

[BUREAU_NAME]
[BUREAU_ADDRESS]

RE: Dispute of Inaccurate Account Information on Credit Report

To Whom It May Concern:

I am writing to dispute account information on my credit report that I believe to be inaccurate. After reviewing my credit report dated [REPORT_DATE], I have identified the following discrepancies:

Account Information:
Creditor: [CREDITOR_NAME]
Account Number: [ACCOUNT_NUMBER]
Reported Information: [REPORTED_INFO]

Issue: [ISSUE_DETAILS]

This information is inaccurate because: [ISSUE_REASON]

Under the Fair Credit Reporting Act, specifically 15 USC 1681e(b) and 15 USC 1681i, credit reporting agencies must follow reasonable procedures to assure maximum possible accuracy of information and must properly investigate disputes.

Additionally, 12 CFR 1026.13 provides further protections regarding billing errors and dispute resolution procedures.

Please investigate this matter and correct my credit report. If you cannot verify this information within the 30-day period specified by law, it must be removed from my report.

Please send me written confirmation of your findings and a corrected copy of my credit report.

Sincerely,

[CONSUMER_NAME]
[CONSUMER_ADDRESS]
[CONSUMER_CITY], [CONSUMER_STATE] [CONSUMER_ZIP]
`;

// Student Loan Duplicate Dispute Template
export const studentLoanDisputeTemplate = `
[DATE]

[BUREAU_NAME]
[BUREAU_ADDRESS]

RE: Dispute of Duplicate Student Loan Reporting on Credit Report

To Whom It May Concern:

I am writing to dispute duplicate student loan information on my credit report that I believe to be inaccurate. After reviewing my credit report dated [REPORT_DATE], I have identified the following discrepancies:

Student Loan Information:
Original Loan Provider: [ORIGINAL_CREDITOR]
Current Loan Provider: [CREDITOR_NAME]
Account Number: [ACCOUNT_NUMBER]
Loan Amount: [BALANCE]

Issue: This student loan appears to be reported multiple times on my credit report with identical loan amounts but under different loan servicers. This is a duplicate reporting violation, as the loan has been transferred/sold to another servicer but is being reported as separate accounts.

This violates 15 USC 1681s-2(a)(1) which requires furnishers to provide accurate information to credit reporting agencies, and 20 USC 1087 which governs student loan servicing.

Please investigate this matter and remove the duplicate reporting from my credit report. If you cannot verify which entry is the correct current one within the 30-day period specified by law, all duplicate entries must be removed.

Please send me written confirmation of your findings and a corrected copy of my credit report.

Sincerely,

[CONSUMER_NAME]
[CONSUMER_ADDRESS]
[CONSUMER_CITY], [CONSUMER_STATE] [CONSUMER_ZIP]
`;

// Bankruptcy Dispute Template
export const bankruptcyDisputeTemplate = `
[DATE]

[BUREAU_NAME]
[BUREAU_ADDRESS]

RE: Dispute of Bankruptcy Information on Credit Report

To Whom It May Concern:

I am writing to dispute bankruptcy information on my credit report that I believe to be inaccurate or outdated. After reviewing my credit report dated [REPORT_DATE], I have identified the following discrepancies:

Bankruptcy Information:
Case Number: [CASE_NUMBER]
Filing Date: [FILING_DATE]
Discharge Date: [DISCHARGE_DATE]

Issue: [ISSUE_DETAILS]

This information is inaccurate because: [ISSUE_REASON]

Under the Fair Credit Reporting Act, specifically 15 USC 1681c(a)(1), bankruptcies should not be reported more than 10 years from the date of entry of the order for relief or the date of adjudication. Additionally, 11 USC 525 prohibits discriminatory treatment of debtors who have filed for bankruptcy.

Please investigate this matter and correct my credit report. If you cannot verify this bankruptcy information within the 30-day period specified by law, it must be removed from my report.

Please send me written confirmation of your findings and a corrected copy of my credit report.

Sincerely,

[CONSUMER_NAME]
[CONSUMER_ADDRESS]
[CONSUMER_CITY], [CONSUMER_STATE] [CONSUMER_ZIP]
`;

// Inquiry Dispute Template
export const inquiryDisputeTemplate = `
[DATE]

[BUREAU_NAME]
[BUREAU_ADDRESS]

RE: Dispute of Unauthorized Inquiries on Credit Report

To Whom It May Concern:

I am writing to dispute unauthorized inquiries on my credit report. After reviewing my credit report dated [REPORT_DATE], I have identified the following unauthorized inquiries:

Inquiry Information:
Company Name: [CREDITOR_NAME]
Inquiry Date: [INQUIRY_DATE]

Issue: These inquiries were either not authorized by me or are outdated (over one year old for standard inquiries or over two years old as specified by the Fair Credit Reporting Act).

Under the Fair Credit Reporting Act, specifically 15 USC 1681b(a)(2) and 15 USC 1681m, credit bureaus may only furnish consumer reports to parties with a permissible purpose, and users must notify consumers when adverse actions are taken.

Please investigate these inquiries and remove any that cannot be verified as authorized by me or that exceed the legal time limits for reporting. If you cannot verify these inquiries within the 30-day period specified by law, they must be removed from my report.

Please send me written confirmation of your findings and a corrected copy of my credit report.

Sincerely,

[CONSUMER_NAME]
[CONSUMER_ADDRESS]
[CONSUMER_CITY], [CONSUMER_STATE] [CONSUMER_ZIP]
`;

// General Multi-Issue Dispute Template
export const generalDisputeTemplate = `
[DATE]

[BUREAU_NAME]
[BUREAU_ADDRESS]

RE: Multiple Disputes on Credit Report

To Whom It May Concern:

I am writing in accordance with my rights under the Fair Credit Reporting Act to dispute multiple items in my credit report dated [REPORT_DATE]. After careful review, I have identified the following discrepancies:

[ISSUE_DETAILS]

Under the Fair Credit Reporting Act, specifically:
- 15 USC 1681e(b): Requires credit reporting agencies to follow reasonable procedures to assure maximum possible accuracy
- 15 USC 1681i: Requires a reasonable reinvestigation of disputed information
- 15 USC 1681s-2(a)(3): Prohibits furnishers from continuing to report information found to be inaccurate
- 15 USC 1681b: Governs permissible purposes of consumer reports
- 12 CFR 1026.13: Provides protections regarding billing error resolution procedures
- 18 USC 1028a: Prohibits identity theft and fraud related to identification documents

Please investigate these matters and correct my credit report. If you cannot verify this information within the 30-day period specified by law, these items must be removed from my report.

In accordance with Metro 2® reporting guidelines, I request that you properly code these accounts as "disputed by consumer" (compliance code XB) during your investigation.

Please send me written confirmation of your findings and a corrected copy of my credit report.

Sincerely,

[CONSUMER_NAME]
[CONSUMER_ADDRESS]
[CONSUMER_CITY], [CONSUMER_STATE] [CONSUMER_ZIP]
`;

// Templates mapping by issue type
export const issueTemplateMapping: Record<string, string> = {
  'personal_info': personalInfoDisputeTemplate,
  'late_payment': latePaymentsDisputeTemplate,
  'collection': collectionsDisputeTemplate,
  'inaccuracy': inaccuracyDisputeTemplate,
  'student_loan': studentLoanDisputeTemplate,
  'bankruptcy': bankruptcyDisputeTemplate,
  'inquiry': inquiryDisputeTemplate,
  'general': generalDisputeTemplate,
  // Handle aliases for issue types
  'personalInfo': personalInfoDisputeTemplate,
  'latePayments': latePaymentsDisputeTemplate,
  'collections': collectionsDisputeTemplate,
  'inaccuracies': inaccuracyDisputeTemplate,
  'studentLoans': studentLoanDisputeTemplate,
  'inquiries': inquiryDisputeTemplate,
};

// Map of bureau names to their addresses
export const bureauAddressMapping: Record<string, string> = {
  'Experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
  'Equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
  'TransUnion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016',
  'All Bureaus': '[BUREAU ADDRESS]'
};

// Export legal references for different issue types
export const legalReferences = FCRA_LAWS;
