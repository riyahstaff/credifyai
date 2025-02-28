
/**
 * Credit Report Parser - Inquiry Extractor
 * This module handles extracting inquiry information from credit reports
 */

/**
 * Extract inquiry information from credit report content
 */
export const extractInquiries = (
  content: string,
  bureaus: { experian?: boolean; equifax?: boolean; transunion?: boolean; }
) => {
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
      // Use match instead of matchAll due to compatibility
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
          } else if (bureaus.experian && !bureaus.equifax && !bureaus.transunion) {
            bureau = 'Experian';
          } else if (!bureaus.experian && bureaus.equifax && !bureaus.transunion) {
            bureau = 'Equifax';
          } else if (!bureaus.experian && !bureaus.equifax && bureaus.transunion) {
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
  
  return inquiries;
};
