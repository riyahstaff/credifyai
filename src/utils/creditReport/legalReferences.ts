
/**
 * Credit Report Parser - Legal References
 * This module provides legal references for dispute letters
 */
import { LegalReference } from './types';

/**
 * Get legal references for a specific dispute type and context
 */
export const getLegalReferencesForDispute = (
  disputeType: string,
  context?: string
): LegalReference[] => {
  const references: LegalReference[] = [];
  
  // Add base FCRA references
  references.push({
    law: "FCRA",
    section: "611(a)",
    description: "Requires CRAs to conduct a reasonable investigation of disputed information",
    relevance: "Core legal basis for dispute investigation"
  });
  
  // Add references based on dispute type
  switch (disputeType.toLowerCase()) {
    case 'payment':
    case 'late_payment':
    case 'late payment':
      references.push({
        law: "FCRA",
        section: "623(a)(3)",
        description: "Prohibits furnishers from reporting information known to be inaccurate",
        relevance: "Applies to incorrect payment status reporting"
      });
      break;
      
    case 'balance':
    case 'account_balance':
    case 'incorrect_balance':
      references.push({
        law: "FCRA",
        section: "623(a)(2)",
        description: "Requires furnishers to correct and update incomplete or inaccurate information",
        relevance: "Applies to incorrect balance reporting"
      });
      break;
      
    case 'remarks':
    case 'negative_remarks':
      references.push({
        law: "FCRA",
        section: "605(a)",
        description: "Sets time limits for reporting negative information",
        relevance: "May apply if remarks are obsolete"
      });
      break;
      
    case 'account_type':
    case 'account type':
      references.push({
        law: "FCRA",
        section: "623(a)(1)(B)",
        description: "Requires furnishers to report complete and accurate information",
        relevance: "Applies to incorrect account type classification"
      });
      break;
      
    case 'account_information':
    case 'account information':
      references.push({
        law: "FCRA",
        section: "611(a)(1)(A)",
        description: "Requires CRAs to forward all relevant information to the furnisher",
        relevance: "Ensures full investigation of account details"
      });
      break;
      
    case 'inquiries':
    case 'inquiry':
      references.push({
        law: "FCRA",
        section: "604(f)",
        description: "Prohibits unauthorized access to consumer reports",
        relevance: "Applies to unauthorized credit inquiries"
      });
      references.push({
        law: "FCRA",
        section: "604(a)",
        description: "Lists permissible purposes for consumer reports",
        relevance: "Inquiries must have a permissible purpose"
      });
      break;
      
    case 'identity_theft':
    case 'identity theft':
    case 'not_my_account':
    case 'not mine':
      references.push({
        law: "FCRA",
        section: "605B",
        description: "Allows blocking of information resulting from identity theft",
        relevance: "Critical for identity theft disputes"
      });
      references.push({
        law: "FCRA",
        section: "609(e)",
        description: "Requires furnishers to provide records of fraudulent transactions",
        relevance: "Helps verify identity theft claims"
      });
      break;
      
    case 'general_dispute':
    default:
      references.push({
        law: "FCRA",
        section: "623(b)",
        description: "Requires furnishers to investigate disputes received from CRAs",
        relevance: "General dispute investigation requirement"
      });
      break;
  }
  
  // Add context-specific references if context is provided
  if (context) {
    const contextLower = context.toLowerCase();
    
    // Check for statute of limitations context
    if (contextLower.includes('old') || 
        contextLower.includes('years ago') || 
        contextLower.includes('statute of limitations')) {
      references.push({
        law: "FCRA",
        section: "605(a)",
        description: "Most negative information can only be reported for 7 years",
        relevance: "Applies to potentially time-barred information"
      });
    }
    
    // Check for verification context
    if (contextLower.includes('verify') || 
        contextLower.includes('verification') || 
        contextLower.includes('prove')) {
      references.push({
        law: "FCRA",
        section: "611(a)(1)(A)",
        description: "CRAs must provide furnisher with all relevant information",
        relevance: "Requires thorough verification of disputed information"
      });
    }
  }
  
  return references;
};
