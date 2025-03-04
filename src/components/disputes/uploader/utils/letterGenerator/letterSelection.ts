
/**
 * Letter selection and prioritization logic
 */
import { DisputeIssue } from './types';

/**
 * Extract and prioritize issues for letter generation
 */
export function selectDisputeIssues(issues: DisputeIssue[]): DisputeIssue[] {
  console.log(`Selecting issues from ${issues.length} total issues`);
  
  // Extract the most important issues to generate letters for
  const priorityIssues = issues
    .filter(issue => issue.impact === 'Critical Impact' || issue.impact === 'High Impact')
    .slice(0, 5);
    
  const mediumIssues = issues
    .filter(issue => issue.impact === 'Medium Impact')
    .slice(0, 3 - priorityIssues.length);
  
  const selectedIssues = [...priorityIssues, ...mediumIssues];
  
  // If no specific issues were selected but we have issues, take the first three
  if (selectedIssues.length === 0 && issues.length > 0) {
    console.log("No priority issues found, using first 3 available issues");
    selectedIssues.push(...issues.slice(0, 3));
  }
  
  console.log(`Selected ${selectedIssues.length} issues for letter generation`);
  return selectedIssues;
}
