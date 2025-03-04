
/**
 * Credit Report Table Formatter
 * Formats potential tabular data in PDF text to HTML tables
 */

/**
 * Format potential tabular data in PDF text to HTML tables
 */
export function formatPdfTables(html: string): string {
  // Look for patterns that might indicate tabular data
  const tablePatterns = [
    // Pattern for account listings
    {
      pattern: /(\w+[\s\w]*)\s+(\d{2}\/\d{2}\/\d{2,4})\s+(\$[\d,.]+)\s+(Current|Late|Paid|Delinquent)/g,
      replacement: '<table class="detected-table"><tr><td>$1</td><td>$2</td><td>$3</td><td>$4</td></tr></table>'
    },
    // Pattern for inquiry listings
    {
      pattern: /(\d{2}\/\d{2}\/\d{2,4})\s+([A-Z\s]+)\s+(EXPERIAN|EQUIFAX|TRANSUNION)/gi,
      replacement: '<table class="detected-table"><tr><td>$1</td><td>$2</td><td>$3</td></tr></table>'
    }
  ];
  
  let formattedHtml = html;
  
  tablePatterns.forEach(({ pattern, replacement }) => {
    formattedHtml = formattedHtml.replace(pattern, replacement);
  });
  
  return formattedHtml;
}
