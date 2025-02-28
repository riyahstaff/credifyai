
/**
 * Credit Report Parser - Public Records Extractor
 * This module handles extracting public records information from credit reports
 */

/**
 * Extract public records information from credit report content
 */
export const extractPublicRecords = (
  content: string,
  bureaus: { experian?: boolean; equifax?: boolean; transunion?: boolean; }
) => {
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
          } else if (bureaus.experian && !bureaus.equifax && !bureaus.transunion) {
            bureau = 'Experian';
          } else if (!bureaus.experian && bureaus.equifax && !bureaus.transunion) {
            bureau = 'Equifax';
          } else if (!bureaus.experian && !bureaus.equifax && bureaus.transunion) {
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
  
  return publicRecords;
};
