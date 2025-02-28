
/**
 * Credit Report Parser - Personal Information Extractor
 * This module handles extracting personal information from credit reports
 */

/**
 * Extract personal information from credit report content
 */
export const extractPersonalInfo = (content: string) => {
  // Initialize personal info object
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
  
  return Object.keys(personalInfo).length > 0 ? personalInfo : undefined;
};
