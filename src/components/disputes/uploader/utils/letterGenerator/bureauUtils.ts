
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
