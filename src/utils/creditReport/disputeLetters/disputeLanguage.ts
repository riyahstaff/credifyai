/**
 * Dispute language templates for different types of credit report issues
 */

export function getDisputeLanguageForType(
  disputeType: string, 
  accountDetails: {
    accountName: string;
    accountNumber?: string;
    errorDescription?: string;
    balance?: string | number;
    status?: string;
  }
): string {
  const accountName = accountDetails.accountName;
  
  switch (disputeType.toLowerCase()) {
    case 'late_payment':
      return `The payment history reported for ${accountName} contains inaccurate late payment information. I have always made payments on time for this account, and the reporting of late payments is damaging my credit score unfairly. Under FCRA § 623, furnishers must ensure the accuracy of all reported information. I request that all inaccurate late payment entries be removed immediately.`;
    
    case 'collection_account':
    case 'collection':
      return `The collection account reported by ${accountName} is inaccurate and unverified. I dispute this debt as: (1) I have no record of owing this debt, (2) the debt has not been properly validated, or (3) the debt is not mine. Under the FDCPA § 809 and FCRA § 611, this account must be properly verified or removed from my credit report.`;
    
    case 'charge_off':
    case 'charged_off':
      return `The charge-off status reported for ${accountName} is inaccurate. This account was either: (1) never charged off, (2) paid in full, or (3) settled. Under FCRA § 623, the current status being reported is incorrect and must be updated to reflect the accurate account status.`;
    
    case 'inquiry':
    case 'hard_inquiry':
      return `The credit inquiry reported by ${accountName} was not authorized by me. I did not apply for credit with this company and have no knowledge of this inquiry. Under FCRA § 604, all credit inquiries must have a permissible purpose. This unauthorized inquiry should be removed immediately.`;
    
    case 'personal_info':
    case 'personal_information':
      return `The personal information section of my credit report contains inaccuracies regarding my identifying information. The incorrect information includes outdated addresses, wrong employment information, or other personal details that do not belong to me. Under FCRA § 611, all personal information must be accurate and current.`;
    
    case 'duplicate_account':
    case 'duplicate':
      return `The account ${accountName} appears to be duplicated on my credit report, creating an inaccurate representation of my credit utilization and payment history. This duplicate reporting is artificially inflating my credit obligations and damaging my credit score. Under FCRA § 623, each account should only be reported once.`;
    
    case 'balance_error':
    case 'incorrect_balance':
      return `The balance reported for ${accountName} is incorrect. The actual balance should be ${accountDetails.balance ? `$${accountDetails.balance}` : '[correct amount]'}, not the amount currently being reported. This inaccurate balance reporting affects my credit utilization ratio and overall credit score.`;
    
    case 'account_status':
    case 'status_error':
      return `The account status reported for ${accountName} is inaccurate. The account is being reported as "${accountDetails.status || '[incorrect status]'}" when it should reflect the correct current status. This misrepresentation is negatively affecting my creditworthiness.`;
    
    case 'identity_theft':
    case 'fraud':
      return `The account ${accountName} is the result of identity theft and fraud. I did not open this account and have filed appropriate reports with law enforcement. Under FCRA § 605B, all fraudulent accounts must be blocked from my credit report immediately upon notification.`;
    
    case 'bankruptcy_discharge':
    case 'discharged_debt':
      return `The account ${accountName} was discharged in bankruptcy but continues to be reported with an incorrect status. Under FCRA § 605, discharged debts must be reported accurately to reflect their discharged status and cannot be reported as outstanding obligations.`;
    
    case 'settled_debt':
    case 'paid_settlement':
      return `The account ${accountName} was settled in full, but the credit report does not accurately reflect this settlement. The account should show a "Paid Settlement" or "Settled" status rather than continuing to report as an outstanding debt.`;
    
    case 'paid_account':
    case 'account_paid':
      return `The account ${accountName} has been paid in full, but my credit report does not accurately reflect this payment. The account should show a "Paid" status with a zero balance rather than continuing to report an outstanding balance.`;
    
    case 'not_my_account':
    case 'unknown_account':
      return `I do not recognize the account ${accountName} and believe it does not belong to me. I have no record of opening this account or conducting business with this creditor. This may be the result of mixed files or identity theft. Under FCRA § 611, unverified accounts must be removed.`;
    
    case 'date_error':
    case 'incorrect_dates':
      return `The dates reported for ${accountName} are inaccurate, including the date opened, date of last activity, or reporting dates. These incorrect dates affect the age of the account and the timing of negative information, impacting my credit score calculation.`;
    
    case 'high_utilization':
    case 'utilization_error':
      return `The credit utilization being reported for ${accountName} is inaccurate due to incorrect balance or credit limit information. This misrepresentation of my actual utilization ratio is negatively affecting my credit score and creditworthiness.`;
    
    default:
      return `The information reported for ${accountName} contains inaccuracies that require investigation and correction. ${accountDetails.errorDescription || 'The reported information does not accurately reflect the true status of this account.'} Under FCRA § 611, all disputed information must be verified as accurate and complete or removed from my credit report.`;
  }
}

export function getDisputeTypeTitle(disputeType: string): string {
  switch (disputeType.toLowerCase()) {
    case 'late_payment': return 'Late Payment Dispute';
    case 'collection_account':
    case 'collection': return 'Collection Account Dispute';
    case 'charge_off':
    case 'charged_off': return 'Charge-Off Status Dispute';
    case 'inquiry':
    case 'hard_inquiry': return 'Unauthorized Inquiry Dispute';
    case 'personal_info':
    case 'personal_information': return 'Personal Information Dispute';
    case 'duplicate_account':
    case 'duplicate': return 'Duplicate Account Dispute';
    case 'balance_error':
    case 'incorrect_balance': return 'Balance Error Dispute';
    case 'account_status':
    case 'status_error': return 'Account Status Dispute';
    case 'identity_theft':
    case 'fraud': return 'Identity Theft Dispute';
    case 'bankruptcy_discharge':
    case 'discharged_debt': return 'Bankruptcy Discharge Dispute';
    case 'settled_debt':
    case 'paid_settlement': return 'Settled Debt Dispute';
    case 'paid_account':
    case 'account_paid': return 'Paid Account Dispute';
    case 'not_my_account':
    case 'unknown_account': return 'Unknown Account Dispute';
    case 'date_error':
    case 'incorrect_dates': return 'Date Error Dispute';
    case 'high_utilization':
    case 'utilization_error': return 'Utilization Error Dispute';
    default: return 'Credit Report Dispute';
  }
}