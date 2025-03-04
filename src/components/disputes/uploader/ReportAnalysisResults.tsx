
import React from 'react';
import { CreditReportData, CreditReportAccount } from '@/utils/creditReportParser';
import AnalysisHeader from './results/AnalysisHeader';
import AnalysisSummary from './results/AnalysisSummary';
import IssuesList from './results/IssuesList';
import ActionButtons from './results/ActionButtons';
import { useLetterGeneration } from './hooks/useLetterGeneration';

interface ReportAnalysisResultsProps {
  issues: Array<{
    type: string;
    title: string;
    description: string;
    impact: 'High Impact' | 'Critical Impact' | 'Medium Impact';
    impactColor: string;
    account?: CreditReportAccount;
    laws: string[];
  }>;
  reportData: CreditReportData | null;
  onResetUpload: () => void;
  onGenerateDispute: (account?: CreditReportAccount) => void;
}

const ReportAnalysisResults: React.FC<ReportAnalysisResultsProps> = ({
  issues,
  reportData,
  onResetUpload,
  onGenerateDispute
}) => {
  const { handleGenerateAllLetters, handleSingleIssueDispute } = useLetterGeneration(reportData);
  
  const handleAllLettersGeneration = () => {
    handleGenerateAllLetters(issues);
  };
  
  const handleSingleIssue = (issueIndex: number, account?: CreditReportAccount) => {
    handleSingleIssueDispute(issueIndex, issues, account);
  };
  
  return (
    <div>
      <AnalysisHeader />
      <AnalysisSummary issuesCount={issues.length} />
      <IssuesList 
        issues={issues} 
        onSingleIssueDispute={handleSingleIssue} 
      />
      <ActionButtons 
        onResetUpload={onResetUpload} 
        onGenerateAllLetters={handleAllLettersGeneration} 
      />
    </div>
  );
};

export default ReportAnalysisResults;
