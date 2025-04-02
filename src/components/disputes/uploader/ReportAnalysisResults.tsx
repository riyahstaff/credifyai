
import React, { useState } from 'react';
import { CreditReportData, CreditReportAccount, IdentifiedIssue } from '@/utils/creditReport/types';
import { CheckCircle, XCircle, AlertTriangle, BarChart3, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import IssueImpactBadge from './IssueImpactBadge';

interface ReportAnalysisResultsProps {
  issues: IdentifiedIssue[];
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
  const [showAllIssues, setShowAllIssues] = useState(false);
  
  // Get counts of issue severity
  const criticalIssuesCount = issues.filter(issue => issue.impact === 'Critical Impact').length;
  const highIssuesCount = issues.filter(issue => issue.impact === 'High Impact').length;
  const mediumIssuesCount = issues.filter(issue => issue.impact === 'Medium Impact').length;
  const lowIssuesCount = issues.filter(issue => issue.impact === 'Low Impact').length;
  
  // Limit displayed issues if not showing all
  const displayIssues = showAllIssues ? issues : issues.slice(0, 3);
  
  const handleGenerateDisputeForAll = () => {
    onGenerateDispute();
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg p-4 flex items-center space-x-3">
        <CheckCircle className="text-green-500 dark:text-green-400 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-green-800 dark:text-green-300">Analysis Complete</h4>
          <p className="text-green-700 dark:text-green-400 text-sm">
            We've analyzed your credit report and found {issues.length} potential issues.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-credify-navy/20 border border-gray-200 dark:border-gray-700/30 rounded-lg p-3 text-center">
          <div className="text-sm text-gray-600 dark:text-gray-300">Critical Issues</div>
          <div className="text-xl font-bold text-red-600 dark:text-red-400">{criticalIssuesCount}</div>
        </div>
        <div className="bg-white dark:bg-credify-navy/20 border border-gray-200 dark:border-gray-700/30 rounded-lg p-3 text-center">
          <div className="text-sm text-gray-600 dark:text-gray-300">High Impact</div>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{highIssuesCount}</div>
        </div>
        <div className="bg-white dark:bg-credify-navy/20 border border-gray-200 dark:border-gray-700/30 rounded-lg p-3 text-center">
          <div className="text-sm text-gray-600 dark:text-gray-300">Medium Impact</div>
          <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{mediumIssuesCount}</div>
        </div>
        <div className="bg-white dark:bg-credify-navy/20 border border-gray-200 dark:border-gray-700/30 rounded-lg p-3 text-center">
          <div className="text-sm text-gray-600 dark:text-gray-300">Low Impact</div>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{lowIssuesCount}</div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-credify-navy/20 border border-gray-200 dark:border-gray-700/30 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-credify-navy dark:text-white mb-3">Identified Issues</h4>
        
        <div className="space-y-3">
          {displayIssues.map((issue, index) => (
            <div 
              key={index} 
              className="border border-gray-200 dark:border-gray-700/30 rounded-lg p-3 hover:border-credify-teal dark:hover:border-credify-teal/70"
            >
              <div className="flex justify-between items-start">
                <h5 className="font-medium text-credify-navy dark:text-white">{issue.title}</h5>
                <IssueImpactBadge impact={issue.impact} />
              </div>
              <p className="text-credify-navy-light dark:text-white/70 text-sm mt-1">{issue.description}</p>
              
              {issue.account && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700/30">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-credify-navy-light dark:text-white/70">
                      Account: {issue.account.accountName}
                    </span>
                    <button 
                      onClick={() => onGenerateDispute(issue.account)} 
                      className="text-xs bg-credify-teal hover:bg-credify-teal-dark text-white px-2 py-1 rounded transition-colors"
                    >
                      Dispute This Issue
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {issues.length > 3 && (
            <button 
              onClick={() => setShowAllIssues(!showAllIssues)}
              className="w-full text-sm text-credify-teal hover:text-credify-teal-dark flex items-center justify-center p-2 border border-dashed border-gray-200 dark:border-gray-700/30 rounded-lg"
            >
              {showAllIssues ? (
                <>Show Less <ChevronUp size={16} className="ml-1" /></>
              ) : (
                <>Show All {issues.length} Issues <ChevronDown size={16} className="ml-1" /></>
              )}
            </button>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button 
          onClick={handleGenerateDisputeForAll}
          className="flex-1 bg-credify-teal hover:bg-credify-teal-dark text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
        >
          Generate Dispute Letters
        </button>
        
        <button 
          onClick={onResetUpload}
          className="flex-1 border border-gray-300 dark:border-gray-700 text-credify-navy dark:text-white hover:bg-gray-100 dark:hover:bg-credify-navy/40 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Upload Different Report
        </button>
      </div>
    </div>
  );
};

export default ReportAnalysisResults;
