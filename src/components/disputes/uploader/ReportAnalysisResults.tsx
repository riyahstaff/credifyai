
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, FileCheck, Upload } from 'lucide-react';
import { CreditReportData, CreditReportAccount } from '@/utils/creditReportParser';
import CreditReportIssue from './CreditReportIssue';
import { APP_ROUTES } from '@/lib/supabase';
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
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleGenerateAllLetters = () => {
    if (reportData) {
      // Store the report data in session storage
      sessionStorage.setItem('creditReportData', JSON.stringify(reportData));
      
      // Navigate to dispute letters page
      toast({
        title: "Generating letters",
        description: "Creating dispute letters for all identified issues",
      });
      
      // Automatically generate disputes for all issues
      // This triggers the dispute generation pipeline
      onGenerateDispute();
      
      // Navigate to the dispute letters page after a short delay
      setTimeout(() => {
        navigate('/dispute-letters');
      }, 2000);
    } else {
      toast({
        title: "Error generating letters",
        description: "No report data available. Please try uploading your report again.",
        variant: "destructive"
      });
    }
  };
  
  const handleSingleIssueDispute = (account?: CreditReportAccount) => {
    console.log("Generating dispute for specific issue with account:", account);
    onGenerateDispute(account);
    
    toast({
      title: "Generating letter",
      description: "Creating dispute letter for selected issue",
    });
    
    // Navigate to the dispute letters page after a short delay
    setTimeout(() => {
      navigate('/dispute-letters');
    }, 2000);
  };
  
  return (
    <div>
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <Check className="text-green-600 dark:text-green-400" size={24} />
        </div>
        <h3 className="text-xl font-semibold text-credify-navy dark:text-white">
          Analysis Complete
        </h3>
      </div>
      
      <div className="bg-credify-teal/5 border border-credify-teal/20 rounded-lg p-4 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <FileCheck className="text-credify-teal" size={20} />
          <p className="font-medium text-credify-navy dark:text-white">AI Found {issues.length} Potential {issues.length === 1 ? 'Issue' : 'Issues'}</p>
        </div>
        <p className="text-credify-navy-light dark:text-white/70 text-sm">
          {issues.length > 0 
            ? `Our AI has identified ${issues.length} potential ${issues.length === 1 ? 'issue' : 'issues'} in your credit report that could ${issues.length === 1 ? 'be negatively impacting' : 'negatively impact'} your score. Review the findings below and generate dispute letters.`
            : 'Our AI did not detect any obvious issues in your credit report. However, you may still want to review it carefully for any inaccuracies.'}
        </p>
      </div>
      
      {/* Findings */}
      <div className="space-y-6 mb-8">
        <h3 className="text-lg font-semibold text-credify-navy dark:text-white border-b border-gray-200 dark:border-gray-700/30 pb-2">
          Identified Issues
        </h3>
        
        {issues.length > 0 ? (
          issues.map((issue, index) => (
            <CreditReportIssue
              key={index}
              title={issue.title}
              description={issue.description}
              impact={issue.impact}
              impactColor={issue.impactColor}
              account={issue.account}
              laws={issue.laws}
              onGenerateDispute={() => handleSingleIssueDispute(issue.account)}
            />
          ))
        ) : (
          <div className="bg-white dark:bg-credify-navy/40 border border-gray-100 dark:border-gray-700/30 rounded-lg p-5 text-center">
            <p className="text-credify-navy-light dark:text-white/70">
              No issues were detected in your credit report. This could mean your report is accurate or our system couldn't identify any obvious problems.
            </p>
            <p className="text-credify-navy-light dark:text-white/70 mt-2">
              You may still want to review your report manually for any inaccuracies.
            </p>
          </div>
        )}
      </div>
      
      <div className="flex justify-center gap-4">
        <button
          onClick={onResetUpload}
          className="btn-outline flex items-center gap-1"
        >
          <Upload size={18} />
          <span>Upload New Report</span>
        </button>
        
        <button
          onClick={handleGenerateAllLetters}
          className="btn-primary flex items-center gap-1"
        >
          <FileCheck size={18} />
          <span>Generate All Letters</span>
        </button>
      </div>
    </div>
  );
};

export default ReportAnalysisResults;
