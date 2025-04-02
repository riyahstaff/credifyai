
import { CreditReportData, CreditReportAccount, IdentifiedIssue } from '@/utils/creditReport/types';

export interface AnalysisProcessorProps {
  uploadedFile: File | null;
  setReportData: (data: CreditReportData) => void;
  setIssues: (issues: IdentifiedIssue[]) => void;
  setLetterGenerated: (generated: boolean) => void;
  setAnalysisError: (error: string | null) => void;
  setAnalyzing: (analyzing: boolean) => void;
  setAnalyzed: (analyzed: boolean) => void;
}

export interface AnalysisHandlerProps extends AnalysisProcessorProps {
  toast: ReturnType<typeof import('@/hooks/use-toast').useToast>;
}

export type IssueItem = IdentifiedIssue;
