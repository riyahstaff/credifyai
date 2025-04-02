
import React from 'react';

type ImpactLevel = 'Critical Impact' | 'High Impact' | 'Medium Impact' | 'Low Impact';

interface IssueImpactBadgeProps {
  impact: ImpactLevel;
}

const IssueImpactBadge: React.FC<IssueImpactBadgeProps> = ({ impact }) => {
  let badgeClasses = 'text-xs px-2 py-0.5 rounded-full';
  
  switch (impact) {
    case 'Critical Impact':
      badgeClasses += ' bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      break;
    case 'High Impact':
      badgeClasses += ' bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      break;
    case 'Medium Impact':
      badgeClasses += ' bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      break;
    case 'Low Impact':
      badgeClasses += ' bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      break;
    default:
      badgeClasses += ' bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300';
  }
  
  return (
    <span className={badgeClasses}>
      {impact}
    </span>
  );
};

export default IssueImpactBadge;
