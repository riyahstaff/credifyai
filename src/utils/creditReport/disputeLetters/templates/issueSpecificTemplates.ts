
/**
 * Issue-specific templates for dispute letters
 */

// Generic dispute template for any issue type
export const generalDisputeTemplate = `{{CONSUMER_NAME}}
{{CONSUMER_ADDRESS}}

{{DATE}}

{{BUREAU_NAME}}
{{BUREAU_ADDRESS}}

RE: Dispute of Inaccurate Information in Credit Report

To Whom It May Concern:

I am writing to dispute information in my credit report that I believe to be inaccurate. After reviewing my credit report, I have identified the following items that require investigation:

{{ACCOUNT_DETAILS}}

I am disputing this information because: {{ISSUE_DESCRIPTION}}

I am disputing this information under the following laws and regulations:
{{LEGAL_REFERENCES}}

Please conduct a thorough investigation of all items I am disputing, as required by the Fair Credit Reporting Act. If you cannot verify this information, please remove it from my credit report.

I understand that according to the Fair Credit Reporting Act, you are required to forward all relevant information to the information provider and to respond to my dispute within 30 days of receipt.

In accordance with Metro 2® reporting guidelines, I request that you properly code this account as "disputed by consumer" (compliance code XB) during your investigation.

Thank you for your prompt attention to this matter.

Sincerely,

{{CONSUMER_NAME}}`;

// Personal information dispute template
export const personalInfoTemplate = `{{CONSUMER_NAME}}
{{CONSUMER_ADDRESS}}

{{DATE}}

{{BUREAU_NAME}}
{{BUREAU_ADDRESS}}

RE: Dispute of Inaccurate Personal Information in Credit Report

To Whom It May Concern:

I am writing to dispute personal information in my credit report. After reviewing my report, I found the following incorrect personal information:

{{ISSUE_DESCRIPTION}}

Under the Fair Credit Reporting Act (FCRA), specifically under:
{{LEGAL_REFERENCES}}

I request that you investigate this matter and correct my personal information. Inaccurate personal information can lead to potential identity confusion issues and incorrect data linkage in my credit file.

Please update my personal information with the correct details as follows:
[Insert correct information here]

I understand that according to the Fair Credit Reporting Act, you are required to investigate this dispute and respond within 30 days of receipt.

Thank you for your prompt attention to this matter.

Sincerely,

{{CONSUMER_NAME}}`;

// Late payment dispute template
export const latePaymentTemplate = `{{CONSUMER_NAME}}
{{CONSUMER_ADDRESS}}

{{DATE}}

{{BUREAU_NAME}}
{{BUREAU_ADDRESS}}

RE: Dispute of Inaccurate Late Payment Information

To Whom It May Concern:

I am writing to dispute late payment information reported on my credit report. After reviewing my credit report, I found the following account contains late payment information that I believe is inaccurate:

{{ACCOUNT_DETAILS}}

I have always made payments on this account on time, and this reported late payment is incorrect. This error is harming my credit score and does not reflect my actual payment history.

Under the Fair Credit Reporting Act (FCRA), specifically:
{{LEGAL_REFERENCES}}

Furnishers are prohibited from reporting information they know to be inaccurate, and credit bureaus must follow reasonable procedures to assure maximum possible accuracy.

Please investigate this matter and remove the incorrect late payment information from my credit report. I have records of my payments that I can provide if needed.

I understand that according to the FCRA, you are required to investigate this dispute and respond within 30 days of receipt. During the investigation, this account should be marked as "disputed by consumer" using Metro 2® compliance code XB.

Thank you for your prompt attention to this matter.

Sincerely,

{{CONSUMER_NAME}}`;

// Collection account dispute template
export const collectionTemplate = `{{CONSUMER_NAME}}
{{CONSUMER_ADDRESS}}

{{DATE}}

{{BUREAU_NAME}}
{{BUREAU_ADDRESS}}

RE: Dispute of Collection Account

To Whom It May Concern:

I am writing to dispute a collection account on my credit report. After reviewing my credit report, I found the following collection account that I believe is inaccurate or unverifiable:

{{ACCOUNT_DETAILS}}

I dispute this collection account for the following reasons:
{{ISSUE_DESCRIPTION}}

Under the Fair Credit Reporting Act (FCRA) and the Fair Debt Collection Practices Act (FDCPA), specifically:
{{LEGAL_REFERENCES}}

I request that you:
1. Verify that the collection agency has provided complete and accurate documentation proving the validity of this debt
2. Verify that the collection agency has the legal right to collect this debt
3. Provide me with copies of all documentation related to this debt
4. Remove this collection account if it cannot be fully verified

If the debt cannot be properly verified with complete documentation, it must be removed from my credit report pursuant to the FCRA.

I understand that according to the FCRA, you are required to investigate this dispute and respond within 30 days of receipt. During the investigation, this account should be marked as "disputed by consumer" using Metro 2® compliance code XB.

Thank you for your prompt attention to this matter.

Sincerely,

{{CONSUMER_NAME}}`;

// Inquiry dispute template
export const inquiryTemplate = `{{CONSUMER_NAME}}
{{CONSUMER_ADDRESS}}

{{DATE}}

{{BUREAU_NAME}}
{{BUREAU_ADDRESS}}

RE: Dispute of Unauthorized Credit Inquiry

To Whom It May Concern:

I am writing to dispute an inquiry on my credit report. After reviewing my credit report, I found the following inquiry that I believe was not authorized by me:

{{ACCOUNT_DETAILS}}

I do not recall authorizing this inquiry, nor have I had any business relationship with this company that would justify accessing my credit information. This unauthorized inquiry represents improper access to my credit file.

Under the Fair Credit Reporting Act (FCRA), specifically:
{{LEGAL_REFERENCES}}

Credit inquiries can only be made with proper authorization or for explicitly permitted purposes. Unauthorized inquiries must be removed.

Please investigate this matter and remove this inquiry from my credit report if it cannot be verified as properly authorized.

I understand that according to the FCRA, you are required to investigate this dispute and respond within 30 days of receipt.

Thank you for your prompt attention to this matter.

Sincerely,

{{CONSUMER_NAME}}`;

// Student loan dispute template
export const studentLoanTemplate = `{{CONSUMER_NAME}}
{{CONSUMER_ADDRESS}}

{{DATE}}

{{BUREAU_NAME}}
{{BUREAU_ADDRESS}}

RE: Dispute of Duplicate Student Loan Accounts

To Whom It May Concern:

I am writing to dispute duplicate student loan accounts on my credit report. After reviewing my credit report, I found the following student loan accounts that appear to be duplicates:

{{ACCOUNT_DETAILS}}

These loans appear to be the same loan reported multiple times. This duplicate reporting is artificially inflating my debt levels and negatively impacting my credit score.

Under the Fair Credit Reporting Act (FCRA), specifically:
{{LEGAL_REFERENCES}}

Credit reporting agencies must follow reasonable procedures to assure maximum accuracy, which includes preventing duplicate accounts from appearing.

Please investigate this matter and remove the duplicate accounts from my credit report. The correct loan information should only appear once on my report.

I understand that according to the FCRA, you are required to investigate this dispute and respond within 30 days of receipt. During the investigation, these accounts should be marked as "disputed by consumer" using Metro 2® compliance code XB.

Thank you for your prompt attention to this matter.

Sincerely,

{{CONSUMER_NAME}}`;

// Bankruptcy dispute template
export const bankruptcyTemplate = `{{CONSUMER_NAME}}
{{CONSUMER_ADDRESS}}

{{DATE}}

{{BUREAU_NAME}}
{{BUREAU_ADDRESS}}

RE: Dispute of Bankruptcy Information

To Whom It May Concern:

I am writing to dispute bankruptcy information on my credit report. After reviewing my credit report, I found the following bankruptcy information that I believe is outdated or inaccurate:

{{ACCOUNT_DETAILS}}

Under the Fair Credit Reporting Act (FCRA), specifically:
{{LEGAL_REFERENCES}}

Bankruptcy information should not be reported beyond the legally permitted timeframe, which is generally 10 years from the date of filing for Chapter 7 bankruptcies and 7 years for Chapter 13 bankruptcies.

Please investigate this matter and remove this outdated bankruptcy information from my credit report.

I understand that according to the FCRA, you are required to investigate this dispute and respond within 30 days of receipt.

Thank you for your prompt attention to this matter.

Sincerely,

{{CONSUMER_NAME}}`;

// Map issue types to their appropriate templates
export const issueTemplateMapping: Record<string, string> = {
  'general': generalDisputeTemplate,
  'personal_info': personalInfoTemplate,
  'late_payment': latePaymentTemplate,
  'collection': collectionTemplate,
  'inquiry': inquiryTemplate,
  'student_loan': studentLoanTemplate,
  'bankruptcy': bankruptcyTemplate
};

// Mapping for bureau addresses
export const bureauAddressMapping: Record<string, string> = {
  'Experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
  'Equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
  'TransUnion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016',
  'Unknown': '[BUREAU ADDRESS]'
};

// Legal references by issue type
export const legalReferences = {
  'personal_info': ['15 USC 1681c', '15 USC 1681g'],
  'late_payment': ['15 USC 1681s-2(a)(3)', '15 USC 1681e(b)'],
  'collection': ['15 USC 1692c', '15 USC 1681s-2(a)(3)'],
  'inquiry': ['15 USC 1681b(a)(2)', '15 USC 1681m'],
  'student_loan': ['15 USC 1681e(b)', '15 USC 1681i'],
  'bankruptcy': ['15 USC 1681c', '15 USC 1681i', '15 USC 1681e(b)'],
  'general': ['15 USC 1681e(b)', '15 USC 1681i']
};
