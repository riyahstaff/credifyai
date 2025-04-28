
// Re-export all types from the sub-files, being explicit about naming to avoid conflicts
export * from './letterTypes';

// Explicitly re-export types from creditReportTypes to avoid naming conflicts
export type {
  CreditReportAccount,
  CreditReportInquiry,
  CreditReportData,
  PersonalInfo,
  LegalReference,
  SampleDisputeLetter,
  CreditReportPublicRecord,
  Issue as CreditReportIssue,
  RecommendedDispute as CreditReportRecommendedDispute,
  IdentifiedIssue,
  AnalysisResults
} from './creditReportTypes';

// Explicitly re-export types from analysisTypes to avoid naming conflicts
export type {
  AnalysisProcessorProps,
  AnalysisHandlerProps,
  IssueItem,
  DisputeAnalysisResults,
  RecommendedDispute as AnalysisRecommendedDispute,
  IssueAnalysisResult,
  AccountIssue
} from './analysisTypes';

