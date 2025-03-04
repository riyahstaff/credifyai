
/**
 * Credit Report Style Generator
 * Generates CSS styles for HTML formatted credit reports
 */

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
