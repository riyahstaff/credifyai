
import { CreditReportData, IdentifiedIssue, Issue } from '@/utils/creditReport/types';
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
      const potentialIssues = extractIssuesFromRawText(reportData.rawText);
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
          laws = (issue.legalBasis as any[]).map(ref => 
            typeof ref.law === 'string' ? ref.law : "");
        } else {
          // Assume array of strings
          laws = issue.legalBasis as unknown as string[];
        }
      } else if (typeof issue.legalBasis === 'string') {
        laws = [issue.legalBasis];
      }
      
      return {
        id: issue.id || `issue-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        type: issue.type,
        title: issue.type.charAt(0).toUpperCase() + issue.type.slice(1).replace('_', ' '),
        description: issue.description,
        impact: issue.severity === 'high' ? 'High Impact' : 
              issue.severity === 'medium' ? 'Medium Impact' : 'Low Impact',
        impactColor: issue.severity === 'high' ? 'red' : 
                    issue.severity === 'medium' ? 'orange' : 'yellow',
        account: issue.accountName ? { 
          accountName: issue.accountName,
          accountNumber: issue.accountNumber
        } : undefined,
        laws: laws,
        bureau: issue.bureau,
        severity: issue.severity
      };
    });
    
    console.log(`Found ${identifiedIssues.length} issues in credit report`);
    
    return identifiedIssues;
  } catch (error) {
    console.error("Error identifying issues:", error);
    return [];
  }
}

/**
 * Extract potential issues from raw text when the structured analyzer fails
 */
function extractIssuesFromRawText(rawText: string): Issue[] {
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
  
  // Extract potential account names
  const accountPattern = /(?:account|acct)(?:\s*|:|\#).*?([\w\s\-&]+?)(?:\/|\n|,|\s{2,}|$)/gi;
  const accounts = [];
  let accountMatch;
  while ((accountMatch = accountPattern.exec(rawText)) !== null) {
    if (accountMatch[1] && accountMatch[1].trim().length > 3) {
      accounts.push(accountMatch[1].trim());
    }
  }
  
  // Look for common credit report issues
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
      
      potentialIssues.push({
        id: `issue-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        type: issue.type,
        description: `Potential issue found: ${match[1].trim()}`,
        severity: issue.severity as 'high' | 'medium' | 'low',
        accountName: accountName || undefined,
        accountNumber: undefined,
        bureau: extractBureauFromContext(context) || "Unknown",
        legalBasis: ["15 USC 1681e(b)"] as unknown as string
      });
    }
  }
  
  return potentialIssues;
}

/**
 * Try to determine which bureau this issue is from based on context
 */
function extractBureauFromContext(context: string): string | undefined {
  context = context.toLowerCase();
  
  if (context.includes("experian")) {
    return "Experian";
  } else if (context.includes("equifax")) {
    return "Equifax";
  } else if (context.includes("transunion")) {
    return "TransUnion";
  }
  
  return undefined;
}
