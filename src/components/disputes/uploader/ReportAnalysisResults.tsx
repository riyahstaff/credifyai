
import React from 'react';
import { CreditReportData, CreditReportAccount } from '@/utils/creditReportParser';
import AnalysisHeader from './results/AnalysisHeader';
import AnalysisSummary from './results/AnalysisSummary';
import IssuesList from './results/IssuesList';
import ActionButtons from './results/ActionButtons';
import { useLetterGeneration } from './hooks/useLetterGeneration';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const { handleGenerateAllLetters, handleSingleIssueDispute } = useLetterGeneration(reportData);
  
  const handleAllLettersGeneration = () => {
    toast({
      title: "Generating all dispute letters",
      description: "Please wait while all dispute letters are being generated...",
    });
    handleGenerateAllLetters(issues);
  };
  
  const handleSingleIssue = (issueIndex: number, account?: CreditReportAccount) => {
    toast({
      title: "Generating dispute letter",
      description: "Please wait while your dispute letter is being generated...",
    });
    console.log(`Handling single issue dispute for index ${issueIndex}${account ? ' with account info' : ''}`);
    handleSingleIssueDispute(issueIndex, issues, account);
    
    // Also call the onGenerateDispute from parent component to ensure multiple navigation methods are attempted
    if (account) {
      onGenerateDispute(account);
    } else {
      onGenerateDispute();
    }
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
