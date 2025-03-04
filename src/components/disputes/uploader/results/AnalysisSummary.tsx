
import React from 'react';
import { FileCheck } from 'lucide-react';

interface AnalysisSummaryProps {
  issuesCount: number;
}

const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({ issuesCount }) => {
  return (
    <div className="bg-credify-teal/5 border border-credify-teal/20 rounded-lg p-4 mb-8">
      <div className="flex items-center gap-2 mb-2">
        <FileCheck className="text-credify-teal" size={20} />
        <p className="font-medium text-credify-navy dark:text-white">
          AI Found {issuesCount} Potential {issuesCount === 1 ? 'Issue' : 'Issues'}
        </p>
      </div>
      <p className="text-credify-navy-light dark:text-white/70 text-sm">
        {issuesCount > 0 
          ? `Our AI has identified ${issuesCount} potential ${issuesCount === 1 ? 'issue' : 'issues'} in your credit report that could ${issuesCount === 1 ? 'be negatively impacting' : 'negatively impact'} your score. Review the findings below and generate dispute letters.`
          : 'Our AI did not detect any obvious issues in your credit report. However, you may still want to review it carefully for any inaccuracies.'}
      </p>
    </div>
  );
};

export default AnalysisSummary;
