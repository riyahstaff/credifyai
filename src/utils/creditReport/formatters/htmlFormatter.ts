
/**
 * Credit Report HTML Formatter
 * Converts plain text credit reports to structured HTML
 */

/**
 * Convert plain text credit report to formatted HTML
 * @param content The text content to convert
 * @param isPdf Optional flag indicating if the source was a PDF
 */
export const convertReportToHtml = (content: string, isPdf: boolean = false): string => {
  if (!content || content.trim().length === 0) {
    return '<div class="empty-report">No report content available</div>';
  }
  
  // Replace line breaks with HTML breaks
  let html = content.replace(/\n/g, '<br>');
  
  // Highlight key sections
  const sections = [
    'Personal Information',
    'Credit Score',
    'Accounts',
    'Credit Accounts',
    'Tradelines',
    'Public Records',
    'Inquiries',
    'Collections',
    'Dispute Information'
  ];
  
  // Add HTML section headers
  sections.forEach(section => {
    // Create a regex that matches the section title with various formats
    const regex = new RegExp(`(${section}|${section.toUpperCase()}|${section.replace(/\s+/g, '')}|${section.toUpperCase().replace(/\s+/g, '')})\\s*(?:Summary|Information|History)?:?`, 'g');
    
    html = html.replace(regex, match => {
      return `<h3 class="report-section-header">${match}</h3>`;
    });
  });
  
  // Highlight account information
  html = html.replace(/(\b(?:Account|Loan|Card)\s+(?:#|Number|No\.?):?\s*([0-9X*]+(?:[-\s][0-9X*]+)*))/gi, 
    '<div class="account-number">$1</div>');
  
  // Highlight dates
  html = html.replace(/(\b\d{1,2}\/\d{1,2}\/\d{2,4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}\b)/gi,
    '<span class="report-date">$1</span>');
  
  // Highlight dollar amounts
  html = html.replace(/(\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g, 
    '<span class="dollar-amount">$1</span>');
  
  // Highlight payment status information
  const paymentStatuses = [
    'Current', 'Paid', 'Late', 'Delinquent', 'Collection', 
    'Charged Off', 'Foreclosure', 'Repossession'
  ];
  
  paymentStatuses.forEach(status => {
    const regex = new RegExp(`\\b(${status})\\b`, 'gi');
    html = html.replace(regex, match => {
      const statusClass = match.toLowerCase().replace(/\s+/g, '-');
      return `<span class="payment-status ${statusClass}">${match}</span>`;
    });
  });
  
  // PDF-specific enhancements
  if (isPdf) {
    // Add a class to indicate this is PDF content
    html = `<div class="pdf-content">${html}</div>`;
    
    // Remove excessive whitespace that might come from PDF parsing
    html = html.replace(/(<br\s*\/?>){3,}/gi, '<br><br>');
    
    // Try to identify tabular data and format as tables
    html = formatPdfTables(html);
  }
  
  // Wrap entire report in a container
  html = `<div class="credit-report-html ${isPdf ? 'pdf-source' : ''}">${html}</div>`;
  
  return html;
};

/**
 * Format potential tabular data in PDF text to HTML tables
 */
function formatPdfTables(html: string): string {
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

/**
 * Extract text from HTML content (for when we need to revert back to plain text)
 */
export const extractTextFromHtml = (html: string): string => {
  // Simple HTML stripping for basic cases
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/td>/gi, ' ')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n'); // Reduce excessive line breaks
};

/**
 * Add CSS styles for the HTML report
 */
export const getReportStyles = (): string => {
  return `
    .credit-report-html {
      font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 100%;
      overflow-x: auto;
    }
    
    .report-section-header {
      color: #1e40af;
      font-weight: 600;
      font-size: 1.25rem;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 0.5rem;
    }
    
    .account-number {
      font-family: monospace;
      background-color: #f3f4f6;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      margin: 0.25rem 0;
      display: inline-block;
    }
    
    .report-date {
      color: #4b5563;
      font-weight: 500;
    }
    
    .dollar-amount {
      color: #047857;
      font-weight: 600;
    }
    
    .payment-status {
      font-weight: 600;
      padding: 0.125rem 0.375rem;
      border-radius: 0.25rem;
      display: inline-block;
      margin: 0.125rem 0;
    }
    
    .payment-status.current, .payment-status.paid {
      background-color: #d1fae5;
      color: #065f46;
    }
    
    .payment-status.late, .payment-status.delinquent {
      background-color: #fee2e2;
      color: #b91c1c;
    }
    
    .payment-status.collection, .payment-status.charged-off, 
    .payment-status.foreclosure, .payment-status.repossession {
      background-color: #fef2f2;
      color: #991b1b;
    }
    
    .empty-report {
      padding: 2rem;
      text-align: center;
      color: #6b7280;
      font-style: italic;
    }
    
    /* PDF-specific styles */
    .pdf-source {
      border-left: 4px solid #3b82f6;
      padding-left: 1rem;
    }
    
    .pdf-content {
      font-family: 'Courier New', Courier, monospace;
      background-color: #f9fafb;
      padding: 1rem;
      border-radius: 0.375rem;
    }
    
    .detected-table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
    }
    
    .detected-table td {
      border: 1px solid #e5e7eb;
      padding: 0.5rem;
    }
  `;
};

