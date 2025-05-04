
import { CreditReportData, IdentifiedIssue, Issue, LegalReference } from '@/utils/creditReport/types';
import { analyzeReportForIssues } from '@/utils/creditReport/parser/analyzeReportIssues';

/**
 * Identify issues in a credit report
 */
export function identifyIssues(reportData: CreditReportData): IdentifiedIssue[] {
  console.log("Identifying issues in credit report");
  
  if (!reportData) {
    console.error("No report data provided to issue identifier");
    return [];
  }
  
  try {
    console.log("Report data received:", 
      "accounts:", reportData.accounts?.length || 0,
      "rawText length:", reportData.rawText?.length || 0);
    
    // Use our enhanced analyzer to find issues
    const issues = analyzeReportForIssues(reportData);
    console.log(`Raw issues found: ${issues.length}`);
    
    if (issues.length === 0 && reportData.rawText) {
      console.warn("No issues found by analyzer, attempting fallback text analysis");
      // Search for common keywords that indicate potential issues
      const potentialIssues = extractIssuesFromRawText(reportData.rawText, reportData);
      if (potentialIssues.length > 0) {
        console.log(`Found ${potentialIssues.length} potential issues from raw text`);
        issues.push(...potentialIssues);
      }
    }
    
    // Convert Issue[] to IdentifiedIssue[] by ensuring all required fields are present
    const identifiedIssues: IdentifiedIssue[] = issues.map(issue => {
      // Convert legalBasis to string array safely
      let laws: string[] = [];
      
      if (Array.isArray(issue.legalBasis)) {
        // Check if elements appear to be LegalReference objects
        if (typeof issue.legalBasis[0] === 'object' && issue.legalBasis[0] !== null) {
          const legalRefs = issue.legalBasis as LegalReference[];
          laws = legalRefs.map(ref => typeof ref.law === 'string' ? ref.law : "");
        } else {
          // Assume array of strings
          laws = issue.legalBasis as unknown as string[];
        }
      } else if (typeof issue.legalBasis === 'string') {
        laws = [issue.legalBasis];
      }
      
      // Use existing legalReferences if available
      if (issue.legalReferences && Array.isArray(issue.legalReferences)) {
        laws = [...laws, ...issue.legalReferences];
      }
      
      return {
        id: issue.id || `issue-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        type: issue.type,
        title: issue.title || issue.type.charAt(0).toUpperCase() + issue.type.slice(1).replace(/_/g, ' '),
        description: issue.description,
        impact: issue.impact || (issue.severity === 'high' ? 'High Impact' : 
                issue.severity === 'medium' ? 'Medium Impact' : 'Low Impact'),
        impactColor: issue.impactColor || (issue.severity === 'high' ? 'red' : 
                    issue.severity === 'medium' ? 'orange' : 'yellow'),
        account: issue.accountName ? { 
          accountName: issue.accountName,
          accountNumber: issue.accountNumber
        } : undefined,
        laws: laws.filter(law => law), // Remove empty strings
        bureau: issue.bureau || reportData.primaryBureau || reportData.bureau || "Unknown",
        severity: issue.severity || (
          issue.impact && issue.impact.toLowerCase().includes('high') ? 'high' :
          issue.impact && issue.impact.toLowerCase().includes('medium') ? 'medium' : 'low'
        )
      };
    });
    
    console.log(`Found ${identifiedIssues.length} issues in credit report`);
    console.log("Sample issue:", identifiedIssues.length > 0 ? JSON.stringify(identifiedIssues[0], null, 2) : "No issues");
    
    return identifiedIssues;
  } catch (error) {
    console.error("Error identifying issues:", error);
    return [];
  }
}

/**
 * Extract potential issues from raw text when the structured analyzer fails
 */
function extractIssuesFromRawText(rawText: string, reportData: CreditReportData): Issue[] {
  const potentialIssues: Issue[] = [];
  
  // Common keywords that indicate potential issues
  const issueKeywords = [
    { keyword: "late payment", type: "late_payment", severity: "high" },
    { keyword: "past due", type: "late_payment", severity: "high" },
    { keyword: "collection", type: "collection_account", severity: "high" },
    { keyword: "charged off", type: "charge_off", severity: "high" },
    { keyword: "bankruptcy", type: "public_record", severity: "high" },
    { keyword: "foreclosure", type: "foreclosure", severity: "high" },
    { keyword: "judgment", type: "public_record", severity: "medium" },
    { keyword: "lien", type: "public_record", severity: "medium" },
    { keyword: "repossession", type: "repossession", severity: "high" },
    { keyword: "dispute", type: "previous_dispute", severity: "medium" },
    { keyword: "incorrect", type: "inaccurate_information", severity: "medium" },
    { keyword: "not mine", type: "not_my_account", severity: "high" },
    { keyword: "fraud", type: "fraud", severity: "high" },
    { keyword: "identity theft", type: "identity_theft", severity: "high" },
  ];
  
  // First, try to use actual accounts from the report
  if (reportData.accounts && reportData.accounts.length > 0) {
    console.log("Using actual accounts for issue identification:", reportData.accounts.length);
    
    // Check each account for potential issues
    for (const account of reportData.accounts) {
      const status = (account.status || account.paymentStatus || '').toLowerCase();
      
      // Check for negative accounts
      if (account.isNegative || 
          status.includes('late') || 
          status.includes('past due') || 
          status.includes('collection') || 
          status.includes('charged off') || 
          status.includes('delinq')) {
        
        const issueType = status.includes('collection') ? 'collection_account' : 'late_payment';
        const description = `Potential ${issueType.replace('_', ' ')} found: ${account.accountName}`;
        
        potentialIssues.push({
          id: `issue-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          type: issueType,
          title: issueType === 'collection_account' ? 'Collection Account' : 'Late Payment',
          description: description,
          severity: 'high' as 'high',
          accountName: account.accountName,
          accountNumber: account.accountNumber,
          bureau: account.bureau || determineBureauFromReport(reportData),
          legalBasis: ["15 USC 1681e(b)"]
        });
      }
    }
  }
  
  // Extract potential account names from raw text as fallback
  const accountPattern = /(?:account|acct)(?:\s*|:|\#).*?([\w\s\-&]+?)(?:\/|\n|,|\s{2,}|$)/gi;
  const accounts = [];
  let accountMatch;
  while ((accountMatch = accountPattern.exec(rawText)) !== null) {
    if (accountMatch[1] && accountMatch[1].trim().length > 3) {
      accounts.push(accountMatch[1].trim());
    }
  }
  
  // Look for common credit report issues in the raw text
  for (const issue of issueKeywords) {
    const regex = new RegExp(`(.{0,50}${issue.keyword}.{0,50})`, 'gi');
    let match;
    
    while ((match = regex.exec(rawText)) !== null) {
      // Check if this is an actual mention of an issue, not just a header
      const context = match[1].toLowerCase();
      
      // Skip if it's just a section header
      if (context.includes("section") || context.includes("header")) {
        continue;
      }
      
      // Find the closest account to this issue
      let accountName = '';
      let minDistance = Number.MAX_SAFE_INTEGER;
      
      for (const account of accounts) {
        const accountPos = rawText.indexOf(account);
        const issuePos = match.index;
        const distance = Math.abs(accountPos - issuePos);
        
        if (distance < minDistance && distance < 500) { // Within 500 chars
          minDistance = distance;
          accountName = account;
        }
      }
      
      // If we don't have an account name from context but do have accounts in the report
      if (!accountName && reportData.accounts && reportData.accounts.length > 0) {
        accountName = reportData.accounts[0].accountName;
      }
      
      potentialIssues.push({
        id: `issue-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        type: issue.type,
        title: issue.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: `Potential issue found: ${match[1].trim()}`,
        severity: issue.severity as 'high' | 'medium' | 'low',
        accountName: accountName || undefined,
        accountNumber: accountName ? 'XXXX' : undefined,
        bureau: determineBureauFromReport(reportData),
        legalBasis: ["15 USC 1681e(b)"]
      });
    }
  }
  
  return potentialIssues;
}

/**
 * Try to determine which bureau this report is from based on context
 */
function determineBureauFromReport(reportData: CreditReportData): string {
  // Check if we already have determined primary bureau
  if (reportData.primaryBureau) {
    return reportData.primaryBureau;
  }
  
  // Check if bureau is directly specified
  if (reportData.bureau) {
    return reportData.bureau;
  }
  
  // Check bureau flags
  if (reportData.bureaus) {
    if (reportData.bureaus.experian) {
      return "Experian";
    } else if (reportData.bureaus.equifax) {
      return "Equifax";
    } else if (reportData.bureaus.transunion) {
      return "TransUnion";
    }
  }
  
  // Default to checking raw text
  if (reportData.rawText) {
    const text = reportData.rawText.toLowerCase();
    if (text.includes('experian')) {
      return 'Experian';
    } else if (text.includes('equifax')) {
      return 'Equifax';
    } else if (text.includes('transunion') || text.includes('trans union')) {
      return 'TransUnion';
    }
  }
  
  return "Unknown";
}
