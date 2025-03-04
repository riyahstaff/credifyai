
import React from 'react';
import { CreditReportAccount } from '@/utils/creditReportParser';
import CreditReportIssue from '../CreditReportIssue';

interface IssuesListProps {
  issues: Array<{
    type: string;
    title: string;
    description: string;
    impact: 'High Impact' | 'Critical Impact' | 'Medium Impact';
    impactColor: string;
    account?: CreditReportAccount;
    laws: string[];
  }>;
  onSingleIssueDispute: (index: number, account?: CreditReportAccount) => void;
}

const IssuesList: React.FC<IssuesListProps> = ({ issues, onSingleIssueDispute }) => {
  return (
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
            onGenerateDispute={() => onSingleIssueDispute(index, issue.account)}
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
  );
};

export default IssuesList;
