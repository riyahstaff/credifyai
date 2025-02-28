
import { Profile } from '@/lib/supabase';
import { RecommendedDispute } from '../types';
import { 
  generateDisputeLetterForDiscrepancy,
  getSampleDisputeLanguage as getSampleDisputeLanguageUtil 
} from '@/utils/creditReport/disputeLetters';

export type DisputeType = {
  bureau: string;
  accountName: string;
  errorType: string;
  explanation: string;
};

// Enhanced function to find potential dispute opportunities even from limited data
export const getSampleDisputeLanguage = async (
  accountName: string, 
  field: string, 
  bureau: string
): Promise<string> => {
  // Get dispute type from field
  let disputeType = 'general';
  
  const fieldLower = field.toLowerCase();
  if (fieldLower.includes('balance')) {
    disputeType = 'balance';
  } else if (fieldLower.includes('payment') || fieldLower.includes('late')) {
    disputeType = 'late_payment';
  } else if (fieldLower.includes('status')) {
    disputeType = 'account_status';
  } else if (fieldLower.includes('date')) {
    disputeType = 'dates';
  } else if (fieldLower.includes('inquiry') || fieldLower.includes('inquiries')) {
    disputeType = 'inquiry';
  } else if (accountName.toLowerCase().includes('personal') || fieldLower.includes('address') || fieldLower.includes('name')) {
    disputeType = 'personal_information';
  } else if (fieldLower.includes('student') || accountName.toLowerCase().includes('student')) {
    disputeType = 'student_loan';
  }
  
  // Default sample language based on dispute type
  const defaultLanguage: Record<string, string> = {
    'balance': 'The balance shown on this account is incorrect and does not reflect my actual financial obligation. This error violates Metro 2 reporting standards which require accurate balance reporting.',
    'late_payment': 'This account is incorrectly reported as delinquent. According to my records, all payments have been made on time. This error violates FCRA Section 623 which requires furnishers to report accurate information.',
    'account_status': 'The account status is being reported incorrectly. This violates FCRA accuracy requirements and Metro 2 standards for proper status code reporting.',
    'dates': 'The dates associated with this account are inaccurate and do not align with the actual account history. This violates Metro 2 standards for date reporting.',
    'personal_information': 'My personal information is reported incorrectly. This error affects my credit profile and violates FCRA requirements for accurate consumer information.',
    'inquiry': 'This inquiry was made without my knowledge or consent. This violates FCRA Section 604, which requires a permissible purpose for accessing my credit information.',
    'student_loan': 'This student loan account is being reported inaccurately. Recent Department of Education changes may qualify this loan for discharge or reduction. This violates FCRA Section 623 which requires furnishers to report accurate information.',
    'general': `The information for this account is being inaccurately reported by ${bureau}. This information is incorrect and should be investigated and corrected to reflect accurate information. This error violates both FCRA Section 611(a) accuracy requirements and Metro 2 Format standards.`
  };
  
  // Get the specific language for the field if available, otherwise use a generic template
  const language = defaultLanguage[disputeType] || defaultLanguage['general'];
  
  return language;
};

export const generateManualDisputeLetter = (dispute: DisputeType, samplePhrases: Record<string, string[]> = {}) => {
  // Enhanced letter template with FCRA citations and legal language
  const bureauAddresses = {
    'experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
    'equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
    'transunion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
  };
  
  const bureau = dispute.bureau.toLowerCase();
  const bureauAddress = bureauAddresses[bureau as keyof typeof bureauAddresses] || '[BUREAU ADDRESS]';
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Try to find appropriate sample language based on dispute type
  let additionalLanguage = "";
  if (samplePhrases) {
    if (dispute.errorType.toLowerCase().includes('balance')) {
      additionalLanguage = samplePhrases.balanceDisputes?.[0] || "";
    } else if (dispute.errorType.toLowerCase().includes('late') || dispute.errorType.toLowerCase().includes('payment')) {
      additionalLanguage = samplePhrases.latePaymentDisputes?.[0] || "";
    } else if (dispute.errorType.toLowerCase().includes('not mine') || dispute.errorType.toLowerCase().includes('fraud')) {
      additionalLanguage = samplePhrases.accountOwnershipDisputes?.[0] || "";
    } else if (dispute.errorType.toLowerCase().includes('closed')) {
      additionalLanguage = samplePhrases.closedAccountDisputes?.[0] || "";
    } else if (dispute.errorType.toLowerCase().includes('inquiry')) {
      additionalLanguage = samplePhrases.inquiryDisputes?.[0] || "";
    } else if (dispute.errorType.toLowerCase().includes('name') || dispute.errorType.toLowerCase().includes('address')) {
      additionalLanguage = samplePhrases.personalInfoDisputes?.[0] || "";
    } else if (dispute.errorType.toLowerCase().includes('student')) {
      // Add student loan specific language
      additionalLanguage = "In light of recent Department of Education changes affecting student loan servicing and reporting, this information should be reviewed for compliance with current federal guidelines.";
    }
  }
  
  // Add the sample language if available
  const explanation = additionalLanguage ? 
    `${dispute.explanation}\n\n${additionalLanguage}` : 
    dispute.explanation;
  
  return `
[YOUR NAME]
[YOUR ADDRESS]
[CITY, STATE ZIP]

${currentDate}

${dispute.bureau}
${bureauAddress}

Re: Dispute of Inaccurate Information - Account #[ACCOUNT NUMBER]

To Whom It May Concern:

I am writing in accordance with my rights under the Fair Credit Reporting Act (FCRA), 15 U.S.C. § 1681 et seq., to dispute inaccurate information appearing on my credit report.

After reviewing my credit report from ${dispute.bureau}, I have identified the following item that is inaccurate and requires investigation and correction:

Account Name: ${dispute.accountName}
Account Number: [ACCOUNT NUMBER]
Reason for Dispute: ${dispute.errorType}

This information is inaccurate because: ${explanation}

Under Section 611(a) of the FCRA, you are required to conduct a reasonable investigation into this matter and remove or correct any information that cannot be verified. Additionally, Section 623 of the FCRA places responsibilities on furnishers of information to provide accurate data to consumer reporting agencies.

I request that you:
1. Conduct a thorough investigation of this disputed information
2. Forward all relevant information to the furnisher of this information
3. Provide me with copies of any documentation used to verify this debt
4. Remove the disputed item if it cannot be properly verified
5. Send me an updated copy of my credit report showing the results of your investigation

Please complete your investigation within the 30-day timeframe (or 45 days if based on information I provide) as required by the FCRA. If you have any questions or need additional information, please contact me at the address listed above.

Sincerely,

[YOUR SIGNATURE]
[YOUR PRINTED NAME]

Enclosures:
- Copy of credit report with disputed item highlighted
- [LIST ANY SUPPORTING DOCUMENTATION]
  `;
};

export const generateAutomaticDisputeLetter = async (
  targetDispute: RecommendedDispute,
  profile: Profile | null,
  sampleReportsLoaded: boolean
): Promise<{ disputeData: any, letterContent: string }> => {
  // Create user info with defaults if profile properties are missing
  const userInfo = {
    name: profile?.full_name || "[YOUR NAME]",
    address: "[YOUR ADDRESS]", // Default as these are not in the Profile type
    city: "[CITY]",
    state: "[STATE]",
    zip: "[ZIP]"
  };
  
  // Actually generate the letter
  const letterContent = await generateDisputeLetterForDiscrepancy(targetDispute, userInfo);
  
  const disputeData = {
    bureau: targetDispute.bureau,
    accountName: targetDispute.accountName,
    accountNumber: targetDispute.accountNumber,
    errorType: targetDispute.reason,
    explanation: targetDispute.description,
    timestamp: new Date(),
    letterContent: letterContent
  };

  return { disputeData, letterContent };
};

// New: Check for security breaches affecting the consumer
export const checkSecurityBreaches = async (bureau: string): Promise<string | null> => {
  // Add logic here to check for known breaches
  // For now, just return static information about known breaches
  
  if (bureau.toLowerCase() === 'equifax') {
    return "Equifax had a major data breach in 2017 that affected approximately 147 million consumers. If you were affected, you may have additional grounds for dispute based on compromised information security.";
  }
  
  if (bureau.toLowerCase() === 'experian') {
    return "Experian has had several security incidents in recent years, including a 2015 breach affecting approximately 15 million consumers. If you were affected, you may have additional grounds for dispute.";
  }
  
  if (bureau.toLowerCase() === 'transunion') {
    return "TransUnion has had security incidents in recent years. If you were affected by these incidents, you may have additional grounds for dispute related to the security of your information.";
  }
  
  return null;
};

// New: Check for Department of Education changes affecting student loans
export const checkStudentLoanChanges = (): string => {
  return "The Department of Education has implemented several student loan relief programs in the past two years, including Public Service Loan Forgiveness (PSLF) waivers, income-driven repayment plan adjustments, and targeted loan discharges. Student loans on your credit report may be eligible for correction or removal based on these programs.";
};
