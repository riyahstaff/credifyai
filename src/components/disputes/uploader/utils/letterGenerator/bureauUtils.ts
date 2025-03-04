
// Safe access to the bureau property which might not exist on some CreditReportAccount objects
export const getBureauFromAccount = (account: any): string => {
  if (account?.bureau) {
    return account.bureau;
  }
  
  // Try to extract from bureauReporting if available
  if (account?.bureauReporting && Array.isArray(account.bureauReporting) && account.bureauReporting.length > 0) {
    return account.bureauReporting[0];
  }
  
  // Default to Experian if no bureau info available
  return 'Experian';
};

// Determine the bureau for a dispute issue
export const determineBureau = (issue: any): string => {
  // Check if the issue has an account with bureau information
  if (issue.account) {
    return getBureauFromAccount(issue.account);
  }
  
  // Check if the issue itself has a bureau property
  if (issue.bureau) {
    return formatBureauName(issue.bureau);
  }
  
  // If issue specifically targets a bureau by name in the title or description
  const issueText = `${issue.title} ${issue.description}`.toLowerCase();
  if (issueText.includes('experian')) {
    return 'Experian';
  } else if (issueText.includes('equifax')) {
    return 'Equifax';
  } else if (issueText.includes('transunion') || issueText.includes('trans union')) {
    return 'TransUnion';
  }
  
  // Default to Experian if no bureau info available
  return getDefaultBureau();
};

// Additional utility functions for bureau handling
export const getAllBureausFromAccount = (account: any): string[] => {
  if (account?.bureauReporting && Array.isArray(account.bureauReporting) && account.bureauReporting.length > 0) {
    return account.bureauReporting;
  }
  
  if (account?.bureau) {
    return [account.bureau];
  }
  
  // Default to all bureaus if no specific bureau info available
  return ['Experian', 'Equifax', 'TransUnion'];
};

export const formatBureauName = (bureau: string): string => {
  const bureauMap: Record<string, string> = {
    'experian': 'Experian',
    'equifax': 'Equifax',
    'transunion': 'TransUnion',
    'trans union': 'TransUnion',
  };
  
  const lowerBureau = bureau.toLowerCase();
  return bureauMap[lowerBureau] || bureau;
};

export const getDefaultBureau = (): string => {
  return 'Experian';
};
