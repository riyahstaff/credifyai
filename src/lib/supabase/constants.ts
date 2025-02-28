
// Storage bucket names
export const SAMPLE_REPORTS_BUCKET = 'sample-credit-reports';
export const SAMPLE_LETTERS_BUCKET = 'sample-dispute-letters';
export const LEGAL_TEMPLATES_BUCKET = 'legal-templates';

// Dispute letter templates categorized by reason
export const DISPUTE_TEMPLATES = {
  IDENTITY_THEFT: 'identity_theft_template.txt',
  NOT_MY_ACCOUNT: 'not_my_account_template.txt',
  INCORRECT_BALANCE: 'incorrect_balance_template.txt',
  INCORRECT_PAYMENT_HISTORY: 'incorrect_payment_history_template.txt',
  INCORRECT_STATUS: 'incorrect_status_template.txt',
  ACCOUNT_CLOSED: 'account_closed_template.txt',
  GENERAL_DISPUTE: 'general_dispute_template.txt',
  FCRA_VIOLATION: 'fcra_violation_template.txt',
};

// FCRA and legal reference sections
export const LEGAL_REFERENCES = {
  ACCURACY_REQUIREMENTS: 'fcra_accuracy_requirements.txt',
  INVESTIGATION_PROCEDURES: 'fcra_investigation_procedures.txt',
  DISPUTE_RIGHTS: 'fcra_dispute_rights.txt',
  FURNISHER_RESPONSIBILITIES: 'fcra_furnisher_resp.txt',
  COMMON_VIOLATIONS: 'fcra_common_violations.txt',
};
