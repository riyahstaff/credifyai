
/**
 * Credit Report Parser
 * This module handles parsing text content from credit reports into structured data
 */
import { CreditReportData, CreditReportAccount } from './types';
import { getLegalReferencesForDispute } from './legalReferences';

/**
 * Parse text content from a credit report into structured data
 */
export const parseReportContent = (content: string): CreditReportData => {
  console.log("Parsing credit report content, length:", content.length);
  
  // Create empty report structure
  const reportData: CreditReportData = {
    bureaus: {
      experian: false,
      equifax: false,
      transunion: false
    },
    accounts: [],
    inquiries: [],
    rawText: content // Store the raw text for later reference
  };
  
  // Check which bureaus are mentioned in the report
  const lowerContent = content.toLowerCase();
  reportData.bureaus.experian = lowerContent.includes('experian');
  reportData.bureaus.equifax = lowerContent.includes('equifax');
  reportData.bureaus.transunion = lowerContent.includes('transunion');
  
  console.log("Detected bureaus:", reportData.bureaus);
  
  // Extract personal information
  const personalInfo: {
    name?: string;
    address?: string;
    previousAddresses?: string[];
    employers?: string[];
    bureauSpecificInfo?: {
      experian?: any;
      equifax?: any;
      transunion?: any;
    };
    discrepancies?: any[];
  } = {};
  
  // Look for name in the report
  const namePatterns = [
    /Name:?\s*([^\n\r]+)/i,
    /(?:Consumer|Customer|Client)(?:\s+Name)?:?\s*([^\n\r]+)/i,
    /Personal\s+Information[\s\S]{0,50}(?:Name|Consumer):?\s*([^\n\r]+)/i
  ];
  
  for (const pattern of namePatterns) {
    const match = content.match(pattern);
    if (match && match[1]?.trim()) {
      personalInfo.name = match[1].trim();
      break;
    }
  }
  
  // Look for address in the report
  const addressPatterns = [
    /(?:Address|Street|Location|Residence):?\s*([^\n\r]+(?:\r?\n[^\n\r]+){0,2})/i,
    /Personal\s+Information[\s\S]{0,100}(?:Address|Street):?\s*([^\n\r]+(?:\r?\n[^\n\r]+){0,2})/i
  ];
  
  for (const pattern of addressPatterns) {
    const match = content.match(pattern);
    if (match && match[1]?.trim()) {
      personalInfo.address = match[1].trim().replace(/\r?\n/g, ' ');
      break;
    }
  }
  
  // Extract previous addresses
  const previousAddressPatterns = [
    /Previous\s+Address(?:es)?:?\s*([\s\S]{0,200}?)(?=\n\s*\n|\n\s*[A-Z])/i,
    /Former\s+Address(?:es)?:?\s*([\s\S]{0,200}?)(?=\n\s*\n|\n\s*[A-Z])/i
  ];
  
  const previousAddresses: string[] = [];
  
  for (const pattern of previousAddressPatterns) {
    const match = content.match(pattern);
    if (match && match[1]?.trim()) {
      const addressText = match[1].trim();
      // Split by newlines and filter out empty lines
      const addresses = addressText.split(/\r?\n/)
                                 .map(a => a.trim())
                                 .filter(a => a.length > 0);
      previousAddresses.push(...addresses);
    }
  }
  
  if (previousAddresses.length > 0) {
    personalInfo.previousAddresses = previousAddresses;
  }
  
  // Extract employer information
  const employerPatterns = [
    /Employer(?:s)?:?\s*([\s\S]{0,200}?)(?=\n\s*\n|\n\s*[A-Z])/i,
    /Employment:?\s*([\s\S]{0,200}?)(?=\n\s*\n|\n\s*[A-Z])/i
  ];
  
  const employers: string[] = [];
  
  for (const pattern of employerPatterns) {
    const match = content.match(pattern);
    if (match && match[1]?.trim()) {
      const employerText = match[1].trim();
      // Split by newlines and filter out empty lines
      const extractedEmployers = employerText.split(/\r?\n/)
                                          .map(e => e.trim())
                                          .filter(e => e.length > 0);
      employers.push(...extractedEmployers);
    }
  }
  
  if (employers.length > 0) {
    personalInfo.employers = employers;
  }
  
  // Save personal information to report data
  if (Object.keys(personalInfo).length > 0) {
    reportData.personalInfo = personalInfo;
  }
  
  // Extract account information
  // Look for sections that might contain account information
  const accountSectionPatterns = [
    /(?:Accounts|Trade(?:lines)?|Credit\s+Accounts)(?:(?:\s+Information)|(?:\s+History)|(?:\s+Summary))?[\s\S]*?((?:Account|Creditor|Subscriber|Company|Bank)[^\n]*(?:[\s\S]*?)(?=\s*(?:Inquiries|Public\s+Records|Additional\s+Information|Summary|Disclaimers|End\s+of\s+Report|\Z)))/i,
    /(?:Revolving\s+Accounts|Installment\s+Accounts|Mortgage\s+Accounts|Open\s+Accounts|Closed\s+Accounts|Collection\s+Accounts)[\s\S]*?((?:Account|Creditor|Subscriber|Company|Bank)[^\n]*(?:[\s\S]*?)(?=\s*(?:Revolving\s+Accounts|Installment\s+Accounts|Mortgage\s+Accounts|Open\s+Accounts|Closed\s+Accounts|Collection\s+Accounts|Inquiries|Public\s+Records|Additional\s+Information|Summary|Disclaimers|End\s+of\s+Report|\Z)))/i
  ];
  
  let accountSections: string[] = [];
  
  for (const pattern of accountSectionPatterns) {
    // Make sure to use a global flag for matchAll
    const matches = content.match(pattern);
    if (matches && matches[1]) {
      accountSections.push(matches[1]);
    }
  }
  
  // If we didn't find any account sections using the patterns, try looking for account-specific keywords
  if (accountSections.length === 0) {
    const accountKeywords = [
      "Account Number", "Date Opened", "Payment Status", "Account Status",
      "High Credit", "Credit Limit", "Balance", "Monthly Payment", "Past Due",
      "Payment History", "Date of Last Payment", "Current Status"
    ];
    
    const potentialAccountSections = content.split(/\n\s*\n/);
    for (const section of potentialAccountSections) {
      if (section.length > 100 && accountKeywords.some(keyword => section.includes(keyword))) {
        accountSections.push(section);
      }
    }
  }
  
  console.log(`Found ${accountSections.length} potential account sections`);
  
  // Process each account section to extract account information
  for (const section of accountSections) {
    // Split the section into potential account blocks
    const accountBlocks = section.split(/\n\s*\n/);
    
    for (const block of accountBlocks) {
      // Skip very short blocks that are unlikely to contain account information
      if (block.length < 50) continue;
      
      const account: CreditReportAccount = {
        accountName: "Unknown Account", // Default value to be overridden
        remarks: []
      };
      
      // Try to extract account name
      const accountNamePatterns = [
        /(?:Creditor|Subscriber|Company|Bank|Account\s+Name):\s*([^\n\r]+)/i,
        /^([A-Z][A-Z0-9\s&.,'-]+)(?:\r?\n|\s{2,})/i,
        /([A-Z][A-Z0-9\s&.,'-]{2,}(?:BANK|CARD|AUTO|LOAN|MORTGAGE|FINANCE|CREDIT|FUND|HOME|SERVICES))/i
      ];
      
      for (const pattern of accountNamePatterns) {
        const match = block.match(pattern);
        if (match && match[1]?.trim() && match[1].length > 3) {
          account.accountName = match[1].trim();
          break;
        }
      }
      
      // Try to extract account number
      const accountNumberPatterns = [
        /(?:Account|Loan|Card)\s+(?:#|Number|No\.?):?\s*([0-9X*]+(?:[-\s][0-9X*]+)*)/i,
        /(?:Account|Loan|Card)(?:\s+(?:#|Number|No\.?))?:?\s*([0-9X*]{4,})/i,
        /(?:#|Number|No\.?):?\s*([0-9X*]{4,})/i
      ];
      
      for (const pattern of accountNumberPatterns) {
        const match = block.match(pattern);
        if (match && match[1]?.trim()) {
          account.accountNumber = match[1].trim();
          break;
        }
      }
      
      // Try to extract account type
      const accountTypePatterns = [
        /(?:Account\s+Type|Loan\s+Type|Type\s+of\s+Loan|Type\s+of\s+Account):\s*([^\n\r]+)/i,
        /Type:\s*([^\n\r]+)/i
      ];
      
      for (const pattern of accountTypePatterns) {
        const match = block.match(pattern);
        if (match && match[1]?.trim()) {
          account.accountType = match[1].trim();
          break;
        }
      }
      
      // Try to extract current balance
      const balancePatterns = [
        /(?:Current\s+Balance|Balance|Balance\s+Amount|Current\s+Amount):\s*\$?([\d,.]+)/i,
        /(?:Balance|Amount):\s*\$?([\d,.]+)/i,
        /Balance(?:\s+as\s+of|\s+Date|\s+Amount)?:\s*\$?([\d,.]+)/i
      ];
      
      for (const pattern of balancePatterns) {
        const match = block.match(pattern);
        if (match && match[1]?.trim()) {
          account.currentBalance = `$${match[1].trim()}`;
          account.balance = `$${match[1].trim()}`; // Set both for compatibility
          break;
        }
      }
      
      // Try to extract payment status
      const paymentStatusPatterns = [
        /(?:Payment\s+Status|Status|Account\s+Status):\s*([^\n\r]+)/i,
        /Status:\s*([^\n\r]+)/i
      ];
      
      for (const pattern of paymentStatusPatterns) {
        const match = block.match(pattern);
        if (match && match[1]?.trim()) {
          account.paymentStatus = match[1].trim();
          break;
        }
      }
      
      // Try to extract date opened
      const dateOpenedPatterns = [
        /(?:Date\s+Opened|Opened\s+Date|Open\s+Date|Account\s+Opened\s+Date):\s*([^\n\r]+)/i,
        /Opened:\s*([^\n\r]+)/i,
        /Opened\s+(?:on|in|since):\s*([^\n\r]+)/i
      ];
      
      for (const pattern of dateOpenedPatterns) {
        const match = block.match(pattern);
        if (match && match[1]?.trim()) {
          account.dateOpened = match[1].trim();
          break;
        }
      }
      
      // Try to extract date reported
      const dateReportedPatterns = [
        /(?:Date\s+Reported|Reported\s+Date|Last\s+Reported|Last\s+Updated|Report\s+Date):\s*([^\n\r]+)/i,
        /Reported:\s*([^\n\r]+)/i,
        /(?:Last|Recent)\s+Report(?:ed)?:\s*([^\n\r]+)/i
      ];
      
      for (const pattern of dateReportedPatterns) {
        const match = block.match(pattern);
        if (match && match[1]?.trim()) {
          account.dateReported = match[1].trim();
          break;
        }
      }
      
      // Try to extract remarks
      const remarksPatterns = [
        /(?:Remarks|Comments|Notes|Comment):\s*([^\n\r]+)/i,
        /(?:Dispute|Disputed\s+Information):\s*([^\n\r]+)/i
      ];
      
      for (const pattern of remarksPatterns) {
        const match = block.match(pattern);
        if (match && match[1]?.trim()) {
          account.remarks?.push(match[1].trim());
        }
      }
      
      // Check if we have enough information to consider this a valid account
      if (account.accountName !== "Unknown Account" && 
          (account.accountNumber || account.accountType || account.currentBalance || account.paymentStatus)) {
        // Determine which bureau this account is from based on surrounding text
        if (block.toLowerCase().includes('experian')) {
          account.bureau = 'Experian';
        } else if (block.toLowerCase().includes('equifax')) {
          account.bureau = 'Equifax';
        } else if (block.toLowerCase().includes('transunion')) {
          account.bureau = 'TransUnion';
        } else if (reportData.bureaus.experian && !reportData.bureaus.equifax && !reportData.bureaus.transunion) {
          account.bureau = 'Experian';
        } else if (!reportData.bureaus.experian && reportData.bureaus.equifax && !reportData.bureaus.transunion) {
          account.bureau = 'Equifax';
        } else if (!reportData.bureaus.experian && !reportData.bureaus.equifax && reportData.bureaus.transunion) {
          account.bureau = 'TransUnion';
        }
        
        reportData.accounts.push(account);
      }
    }
  }
  
  // If we didn't find any accounts using our detailed extraction, try a very basic approach
  if (reportData.accounts.length === 0) {
    // Look for common creditor names
    const commonCreditors = [
      "BANK OF AMERICA", "CHASE", "CAPITAL ONE", "DISCOVER", "AMERICAN EXPRESS", 
      "WELLS FARGO", "CITI", "US BANK", "PNC", "TD BANK", "SYNCHRONY", "BARCLAYS",
      "CREDIT ONE", "FIRST PREMIER", "GOLDMAN SACHS", "USAA", "NAVY FEDERAL",
      "CARMAX", "TOYOTA", "HONDA", "BMW", "MERCEDES", "FORD", "GM", "CHRYSLER"
    ];
    
    for (const creditor of commonCreditors) {
      if (content.includes(creditor)) {
        // Look for nearby account information
        const creditorIndex = content.indexOf(creditor);
        const surroundingText = content.substring(
          Math.max(0, creditorIndex - 100), 
          Math.min(content.length, creditorIndex + creditor.length + 300)
        );
        
        const account: CreditReportAccount = {
          accountName: creditor
        };
        
        // Try to extract an account number
        const accountNumberMatch = surroundingText.match(/(?:Account|Loan|Card)\s+(?:#|Number|No\.?):\s*([0-9X*]+(?:[-\s][0-9X*]+)*)/i);
        if (accountNumberMatch && accountNumberMatch[1]) {
          account.accountNumber = accountNumberMatch[1].trim();
        }
        
        // Try to extract a balance
        const balanceMatch = surroundingText.match(/(?:Balance|Amount):\s*\$?([\d,.]+)/i);
        if (balanceMatch && balanceMatch[1]) {
          account.currentBalance = `$${balanceMatch[1].trim()}`;
          account.balance = `$${balanceMatch[1].trim()}`; // Set both for compatibility
        }
        
        reportData.accounts.push(account);
      }
    }
    
    // If we still don't have any accounts, add generic placeholders based on detected account types
    if (reportData.accounts.length === 0) {
      const accountTypes = [
        { type: "Credit Card", regex: /credit\s+card/i },
        { type: "Mortgage", regex: /mortgage/i },
        { type: "Auto Loan", regex: /auto\s+loan/i },
        { type: "Personal Loan", regex: /personal\s+loan/i },
        { type: "Student Loan", regex: /student\s+loan/i },
        { type: "Collection", regex: /collection/i }
      ];
      
      for (const { type, regex } of accountTypes) {
        if (regex.test(content)) {
          reportData.accounts.push({
            accountName: `Generic ${type}`,
            accountType: type
          });
        }
      }
    }
  }
  
  // Extract inquiry information
  const inquirySectionPatterns = [
    /(?:Inquiries|Credit\s+Inquiries|Requests\s+for\s+Your\s+Credit\s+History)[\s\S]*?((?:Date|Creditor|Subscriber|Company)[^\n]*(?:[\s\S]*?)(?=\s*(?:Public\s+Records|Additional\s+Information|Summary|Disclaimers|End\s+of\s+Report|\Z)))/i
  ];
  
  const inquiries: Array<{
    inquiryDate: string;
    creditor: string;
    bureau: string;
  }> = [];
  
  for (const pattern of inquirySectionPatterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      const inquirySection = match[1];
      
      // Extract individual inquiries
      const inquiryBlockPattern = /(?:(\d{1,2}\/\d{1,2}\/\d{2,4})|(\w{3}\s+\d{1,2},\s+\d{4}))\s+([^\n\r]+)/g;
      let inquiryMatch;
      // Use match instead of matchAll due to the error
      let matches = [];
      while ((inquiryMatch = inquiryBlockPattern.exec(inquirySection)) !== null) {
        matches.push(inquiryMatch);
      }
      
      for (const inquiryMatch of matches) {
        const inquiryDate = inquiryMatch[1] || inquiryMatch[2];
        const creditor = inquiryMatch[3]?.trim();
        
        if (inquiryDate && creditor) {
          // Determine which bureau this inquiry is from
          let bureau = "Unknown";
          if (inquirySection.toLowerCase().includes('experian')) {
            bureau = 'Experian';
          } else if (inquirySection.toLowerCase().includes('equifax')) {
            bureau = 'Equifax';
          } else if (inquirySection.toLowerCase().includes('transunion')) {
            bureau = 'TransUnion';
          } else if (reportData.bureaus.experian && !reportData.bureaus.equifax && !reportData.bureaus.transunion) {
            bureau = 'Experian';
          } else if (!reportData.bureaus.experian && reportData.bureaus.equifax && !reportData.bureaus.transunion) {
            bureau = 'Equifax';
          } else if (!reportData.bureaus.experian && !reportData.bureaus.equifax && reportData.bureaus.transunion) {
            bureau = 'TransUnion';
          }
          
          inquiries.push({
            inquiryDate,
            creditor,
            bureau
          });
        }
      }
    }
  }
  
  if (inquiries.length > 0) {
    reportData.inquiries = inquiries;
  }
  
  // Extract public records information
  const publicRecordSectionPatterns = [
    /(?:Public\s+Records|Public\s+Record\s+Information)[\s\S]*?((?:Date|Type|Status|Court|Amount)[^\n]*(?:[\s\S]*?)(?=\s*(?:Inquiries|Additional\s+Information|Summary|Disclaimers|End\s+of\s+Report|\Z)))/i
  ];
  
  const publicRecords: Array<{
    recordType: string;
    bureau: string;
    dateReported: string;
    status: string;
  }> = [];
  
  for (const pattern of publicRecordSectionPatterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      const publicRecordSection = match[1];
      
      // Extract individual public records
      const recordBlocks = publicRecordSection.split(/\n\s*\n/);
      
      for (const block of recordBlocks) {
        // Skip very short blocks
        if (block.length < 20) continue;
        
        const recordType = block.match(/(?:Type|Record\s+Type):\s*([^\n\r]+)/i)?.[1]?.trim() || 
                      block.match(/(?:Bankruptcy|Tax\s+Lien|Judgment|Civil\s+Claim)/i)?.[0]?.trim() ||
                      "Unknown";
                      
        const dateReported = block.match(/(?:Date|Filed\s+Date|Report\s+Date):\s*([^\n\r]+)/i)?.[1]?.trim() || 
                       block.match(/(?:Filed|Reported)\s+(?:on|in):\s*([^\n\r]+)/i)?.[1]?.trim() ||
                       "";
                       
        const status = block.match(/(?:Status|Disposition):\s*([^\n\r]+)/i)?.[1]?.trim() || 
                 block.match(/(?:Satisfied|Dismissed|Discharged|Paid|Unpaid)/i)?.[0]?.trim() ||
                 "";
        
        // If we have at least a record type, add it
        if (recordType !== "Unknown" || dateReported || status) {
          // Determine which bureau this record is from
          let bureau = "Unknown";
          if (block.toLowerCase().includes('experian')) {
            bureau = 'Experian';
          } else if (block.toLowerCase().includes('equifax')) {
            bureau = 'Equifax';
          } else if (block.toLowerCase().includes('transunion')) {
            bureau = 'TransUnion';
          } else if (reportData.bureaus.experian && !reportData.bureaus.equifax && !reportData.bureaus.transunion) {
            bureau = 'Experian';
          } else if (!reportData.bureaus.experian && reportData.bureaus.equifax && !reportData.bureaus.transunion) {
            bureau = 'Equifax';
          } else if (!reportData.bureaus.experian && !reportData.bureaus.equifax && reportData.bureaus.transunion) {
            bureau = 'TransUnion';
          }
          
          publicRecords.push({
            recordType,
            bureau,
            dateReported,
            status
          });
        }
      }
    }
  }
  
  if (publicRecords.length > 0) {
    reportData.publicRecords = publicRecords;
  }
  
  // Generate a simplified analysis summary
  const totalAccounts = reportData.accounts.length;
  const accountsWithIssues = reportData.accounts.filter(
    account => account.remarks && account.remarks.length > 0 || 
              (account.paymentStatus && 
              (account.paymentStatus.includes('Late') || 
               account.paymentStatus.includes('Delinquent') || 
               account.paymentStatus.includes('Collection')))
  ).length;
  
  // If we have enough data, generate a basic analysis
  if (totalAccounts > 0) {
    reportData.analysisResults = {
      totalDiscrepancies: accountsWithIssues,
      highSeverityIssues: Math.floor(accountsWithIssues / 2), // Just an estimate
      accountsWithIssues,
      recommendedDisputes: []
    };
    
    // Generate recommended disputes for accounts with issues
    for (const account of reportData.accounts) {
      if (account.remarks && account.remarks.length > 0) {
        // For each remark, create a separate dispute recommendation
        for (const remark of account.remarks) {
          reportData.analysisResults.recommendedDisputes.push({
            accountName: account.accountName,
            accountNumber: account.accountNumber,
            bureau: account.bureau || 'Unknown',
            reason: 'Negative Remark',
            description: `Your ${account.accountName} account has the following remarks: "${remark}". This could be disputed if inaccurate.`,
            severity: 'high',
            legalBasis: getLegalReferencesForDispute('remarks', remark)
          });
        }
      }
      
      if (account.paymentStatus && 
          (account.paymentStatus.includes('Late') || 
           account.paymentStatus.includes('Delinquent') || 
           account.paymentStatus.includes('Collection'))) {
        reportData.analysisResults.recommendedDisputes.push({
          accountName: account.accountName,
          accountNumber: account.accountNumber,
          bureau: account.bureau || 'Unknown',
          reason: 'Late Payment',
          description: `Your ${account.accountName} account shows a "${account.paymentStatus}" status, which could significantly impact your credit score. This can be disputed if inaccurate.`,
          severity: 'high',
          legalBasis: getLegalReferencesForDispute('payment', account.paymentStatus)
        });
      }
    }
    
    // If there's no recommended disputes but we have at least one account,
    // add a generic dispute recommendation
    if (reportData.analysisResults.recommendedDisputes.length === 0 && reportData.accounts.length > 0) {
      const randomAccount = reportData.accounts[Math.floor(Math.random() * reportData.accounts.length)];
      reportData.analysisResults.recommendedDisputes.push({
        accountName: randomAccount.accountName,
        accountNumber: randomAccount.accountNumber,
        bureau: randomAccount.bureau || 'Unknown',
        reason: 'Account Review',
        description: `Review this ${randomAccount.accountName} account for any inaccuracies in balance, payment history, or account status.`,
        severity: 'medium',
        legalBasis: getLegalReferencesForDispute('account_information')
      });
    }
  }
  
  return reportData;
};
