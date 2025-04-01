
/**
 * Advanced personal information extractor
 * Extracts user details from credit report text
 */

export interface PersonalInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  ssn?: string;
  dob?: string;
  phone?: string;
}

export function extractPersonalInfo(content: string): PersonalInfo {
  console.log("Extracting personal information from credit report");
  
  // Initialize with default values
  const personalInfo: PersonalInfo = {
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  };
  
  // Clean up the content (remove excess whitespace, normalize newlines)
  const cleanContent = content.replace(/\r\n/g, '\n').replace(/\s+/g, ' ');
  
  // Look for name in the report with various patterns
  const namePatterns = [
    /(?:Name|Consumer)(?:\s*|:)([A-Za-z\s\.]{2,35}?)(?:\n|\s{2,}|$)/i,
    /Personal\s+Information.*?(?:Name|Consumer)(?:\s*|:)([A-Za-z\s\.]{2,35}?)(?:\n|\s{2,}|$)/is,
    /Report\s+for:?\s*([A-Za-z\s\.]{2,35}?)(?:\n|\s{2,}|$)/i,
  ];
  
  for (const pattern of namePatterns) {
    const match = cleanContent.match(pattern);
    if (match && match[1]?.trim()) {
      personalInfo.name = match[1].trim();
      console.log(`Found name: ${personalInfo.name}`);
      break;
    }
  }
  
  // Look for address patterns
  const addressPatterns = [
    /(?:Address|Street|Location|Residence)(?:\s*|:)([^,\n]{5,50}[A-Za-z0-9])/i,
    /Personal\s+Information.*?(?:Address|Street)(?:\s*|:)([^,\n]{5,50}[A-Za-z0-9])/is,
    /(?:Current|Reported)\s+Address(?:\s*|:)([^,\n]{5,50}[A-Za-z0-9])/i,
  ];
  
  for (const pattern of addressPatterns) {
    const match = cleanContent.match(pattern);
    if (match && match[1]?.trim()) {
      personalInfo.address = match[1].trim();
      console.log(`Found address: ${personalInfo.address}`);
      break;
    }
  }
  
  // Look for city, state, zip patterns
  const cityStateZipPatterns = [
    /(?:Address|Street|Location|City)(?:\s*|:).*?\n?.*?([A-Za-z\s\.]{2,25}),\s*([A-Z]{2})\s*(\d{5}(?:-\d{4})?)/is,
    /([A-Za-z\s\.]{2,25}),\s*([A-Z]{2})\s*(\d{5}(?:-\d{4})?)/i,
  ];
  
  for (const pattern of cityStateZipPatterns) {
    const match = cleanContent.match(pattern);
    if (match && match[1]?.trim() && match[2] && match[3]) {
      personalInfo.city = match[1].trim();
      personalInfo.state = match[2];
      personalInfo.zip = match[3];
      console.log(`Found city/state/zip: ${personalInfo.city}, ${personalInfo.state} ${personalInfo.zip}`);
      break;
    }
  }
  
  // Extract SSN (last 4 digits only for security)
  const ssnPattern = /(?:SSN|Social Security)(?:\s*|:|\#).*?(\d{3}-\d{2}-\d{4}|\d{9})/i;
  const ssnMatch = cleanContent.match(ssnPattern);
  if (ssnMatch && ssnMatch[1]) {
    const fullSsn = ssnMatch[1].replace(/-/g, '');
    personalInfo.ssn = `xxx-xx-${fullSsn.slice(-4)}`;
    console.log("Found SSN (last 4 digits)");
  }
  
  // Extract phone number
  const phonePattern = /(?:Phone|Telephone|Mobile)(?:\s*|:).*?(\(?\d{3}\)?[-\s\.]?\d{3}[-\s\.]?\d{4})/i;
  const phoneMatch = cleanContent.match(phonePattern);
  if (phoneMatch && phoneMatch[1]) {
    personalInfo.phone = phoneMatch[1];
    console.log(`Found phone: ${personalInfo.phone}`);
  }
  
  // Extract date of birth
  const dobPattern = /(?:DOB|Date\s+of\s+Birth|Birth\s+Date)(?:\s*|:).*?(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\w+\s+\d{1,2},?\s+\d{4})/i;
  const dobMatch = cleanContent.match(dobPattern);
  if (dobMatch && dobMatch[1]) {
    personalInfo.dob = dobMatch[1];
    console.log(`Found DOB: ${personalInfo.dob}`);
  }
  
  return personalInfo;
}
