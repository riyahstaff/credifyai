
import React from 'react';
import { CreditReportData, CreditReportAccount } from '@/utils/creditReportParser';
import AnalysisHeader from './results/AnalysisHeader';
import AnalysisSummary from './results/AnalysisSummary';
import IssuesList from './results/IssuesList';
import ActionButtons from './results/ActionButtons';
import { useLetterGeneration } from './hooks/useLetterGeneration';
import { useToast } from '@/hooks/use-toast';
import { useReportNavigation } from '@/hooks/report-upload/useReportNavigation';

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
  const { navigateToDisputeLetters } = useReportNavigation();
  const { handleGenerateAllLetters, handleSingleIssueDispute } = useLetterGeneration(reportData);
  
  const handleAllLettersGeneration = () => {
    toast({
      title: "Generating all dispute letters",
      description: "Please wait while all dispute letters are being generated...",
    });
    handleGenerateAllLetters(issues);
    
    // Force navigation after a short delay
    setTimeout(() => {
      navigateToDisputeLetters();
    }, 1000);
  };
  
  const handleSingleIssue = (issueIndex: number, account?: CreditReportAccount) => {
    toast({
      title: "Generating dispute letter",
      description: "Please wait while your dispute letter is being generated...",
    });
    console.log(`Handling single issue dispute for index ${issueIndex}${account ? ' with account info' : ''}`);
    
    // Create a detailed dispute with explicit fields for the letter generator
    const issue = issues[issueIndex];
    
    // Generate the letter with complete context
    handleSingleIssueDispute(issueIndex, issues, account);
    
    // Also call the onGenerateDispute from parent component to ensure multiple navigation methods are attempted
    if (account) {
      onGenerateDispute(account);
    } else {
      onGenerateDispute();
    }
    
    // Force navigation after letter generation with a short delay
    setTimeout(() => {
      console.log("Forcing navigation to dispute letters page after single issue generation");
      navigateToDisputeLetters();
    }, 1000);
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
