
/**
 * Pre-defined templates for dispute letters
 */

// Template registry
const templates: Record<string, string> = {
  general: `{USER_NAME}
{USER_ADDRESS}
{USER_CITY}, {USER_STATE} {USER_ZIP}
{DATE}

{BUREAU_ADDRESS}

Re: Dispute of Inaccurate Information

To Whom It May Concern:

I am writing to dispute the following information in my credit report. I have identified the following item(s) that are inaccurate or incomplete:

Account Name: {ACCOUNT_NAME}
Account Number: {ACCOUNT_NUMBER}
Reason for Dispute: {REASON}

Under the Fair Credit Reporting Act (FCRA), you are required to:
1. Conduct a reasonable investigation into the information I am disputing
2. Forward all relevant information that I provide to the furnisher
3. Review and consider all relevant information
4. Provide me the results of your investigation
5. Delete the disputed information if it cannot be verified

I am disputing this information as it is inaccurate and the creditor may be unable to provide adequate verification as required by law. The industry standard Metro 2 format requires specific, accurate reporting practices that have not been followed in this case.

Please investigate this matter and provide me with the results within 30 days as required by the FCRA.

Sincerely,

{USER_NAME}

Enclosures:
- Copy of ID
- Copy of social security card
- Copy of utility bill`,

  late_payment: `{USER_NAME}
{USER_ADDRESS}
{USER_CITY}, {USER_STATE} {USER_ZIP}
{DATE}

{BUREAU_ADDRESS}

Re: Dispute of Late Payment Information

To Whom It May Concern:

I am writing to dispute late payment information reported on my credit report. I have identified the following account with incorrect late payment information:

Account Name: {ACCOUNT_NAME}
Account Number: {ACCOUNT_NUMBER}

I dispute the late payment(s) reported on this account because {REASON}. After reviewing my records, I have found that these payments were either made on time or the late payment information is otherwise inaccurate.

Under the Fair Credit Reporting Act (FCRA), you are required to conduct a reasonable investigation into this matter. If the furnisher cannot adequately verify this information, it must be removed from my credit report.

Please investigate this matter and provide me with the results within 30 days as required by the FCRA.

Sincerely,

{USER_NAME}`,

  collection_account: `{USER_NAME}
{USER_ADDRESS}
{USER_CITY}, {USER_STATE} {USER_ZIP}
{DATE}

{BUREAU_ADDRESS}

Re: Dispute of Collection Account

To Whom It May Concern:

I am writing to dispute a collection account reported on my credit report. I have identified the following collection account that I believe is inaccurate:

Collection Account Name: {ACCOUNT_NAME}
Account Number: {ACCOUNT_NUMBER}

I dispute this collection account because {REASON}. This account either does not belong to me, has already been paid, was included in bankruptcy, or otherwise contains inaccurate information.

Under the Fair Credit Reporting Act (FCRA), if this information cannot be properly verified with adequate documentation, it must be removed from my credit report.

Please investigate this matter and provide me with the results within 30 days as required by the FCRA.

Sincerely,

{USER_NAME}`,

  inquiry: `{USER_NAME}
{USER_ADDRESS}
{USER_CITY}, {USER_STATE} {USER_ZIP}
{DATE}

{BUREAU_ADDRESS}

Re: Dispute of Unauthorized Inquiry

To Whom It May Concern:

I am writing to dispute an unauthorized inquiry on my credit report. I have identified the following inquiry that I did not authorize:

Inquiry Company: {ACCOUNT_NAME}
Date of Inquiry: {ACCOUNT_NUMBER}

I dispute this inquiry because {REASON}. I did not provide authorization for this company to access my credit report, and this inquiry was made without my consent.

Under the Fair Credit Reporting Act (FCRA), inquiries can only be made with proper authorization. Since I did not authorize this inquiry, it should be removed from my credit report.

Please investigate this matter and provide me with the results within 30 days as required by the FCRA.

Sincerely,

{USER_NAME}`,

  account_ownership: `{USER_NAME}
{USER_ADDRESS}
{USER_CITY}, {USER_STATE} {USER_ZIP}
{DATE}

{BUREAU_ADDRESS}

Re: Dispute of Account Ownership

To Whom It May Concern:

I am writing to dispute an account on my credit report that does not belong to me. I have identified the following account that is not mine:

Account Name: {ACCOUNT_NAME}
Account Number: {ACCOUNT_NUMBER}

I dispute this account because {REASON}. This account does not belong to me, and I have never opened an account with this creditor.

Under the Fair Credit Reporting Act (FCRA), you are required to remove information that cannot be verified as belonging to me. Since this account is not mine, it should be removed from my credit report.

Please investigate this matter and provide me with the results within 30 days as required by the FCRA.

Sincerely,

{USER_NAME}`,

  personal_information: `{USER_NAME}
{USER_ADDRESS}
{USER_CITY}, {USER_STATE} {USER_ZIP}
{DATE}

{BUREAU_ADDRESS}

Re: Dispute of Personal Information

To Whom It May Concern:

I am writing to dispute personal information reported on my credit report that is inaccurate. I have identified the following personal information that needs to be corrected:

Issue: {ACCOUNT_NAME}

The correct information is as follows:
{REASON}

Under the Fair Credit Reporting Act (FCRA), you are required to correct inaccurate personal information. Please update your records with the correct information provided above.

Please investigate this matter and provide me with the results within 30 days as required by the FCRA.

Sincerely,

{USER_NAME}`,
};

/**
 * Gets the appropriate letter template based on dispute type
 */
export function getLetterTemplate(disputeType: string): string {
  // Convert dispute type to lowercase and normalize
  const normalizedType = disputeType.toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
  
  // Check if we have a specific template for this type
  for (const [key, template] of Object.entries(templates)) {
    if (normalizedType.includes(key)) {
      console.log(`Found template match: ${key} for dispute type: ${disputeType}`);
      return template;
    }
  }
  
  // Use general template as fallback
  console.log(`No specific template found for ${disputeType}, using general template`);
  return templates.general;
}
