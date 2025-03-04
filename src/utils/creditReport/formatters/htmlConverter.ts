
/**
 * Credit Report HTML Converter
 * Converts plain text credit reports to structured HTML
 */

import { formatPdfTables } from './tableFormatter';

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
