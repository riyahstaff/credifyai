import { useState, useEffect } from 'react';
import { CreditReportData, RecommendedDispute } from '@/utils/creditReport/types';
import { identifyIssues } from '@/utils/reportAnalysis/issueIdentification';
import { getSuccessfulDisputePhrases } from '@/utils/creditReport/disputeLetters/sampleLanguage';
import { getLegalReferencesForDispute } from '@/utils/creditReport/legalReferences';

export function useReportAnalysis(reportData: CreditReportData | null) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [identifiedIssues, setIdentifiedIssues] = useState<RecommendedDispute[]>([]);
  const [selectedIssues, setSelectedIssues] = useState<RecommendedDispute[]>([]);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Run analysis when report data changes
  useEffect(() => {
    if (reportData) {
      analyzeReport(reportData);
    } else {
      // Reset state when report data is cleared
      setIdentifiedIssues([]);
      setSelectedIssues([]);
      setAnalysisComplete(false);
      setAnalysisError(null);
    }
  }, [reportData]);

  // Analyze the credit report to identify issues
  const analyzeReport = async (data: CreditReportData) => {
    try {
      setIsAnalyzing(true);
      setAnalysisError(null);
      
      console.log("Starting credit report analysis...");
      
      // Identify issues in the credit report
      const issues = await identifyIssues(data);
      
      // Enhance issues with sample dispute language and legal references
      const enhancedIssues = issues.map(issue => {
        // Get sample dispute language for this type of issue
        const sampleLanguage = getSuccessfulDisputePhrases(issue.type);
        
        // Get legal references for this type of issue
        const legalRefs = getLegalReferencesForDispute(issue.type, issue.description);
        
        return {
          ...issue,
          sampleDisputeLanguage: sampleLanguage.length > 0 ? sampleLanguage[0] : undefined,
          legalBasis: legalRefs
        };
      });
      
      console.log(`Analysis complete. Found ${enhancedIssues.length} potential issues.`);
      
      // Sort issues by impact/severity
      const sortedIssues = enhancedIssues.sort((a, b) => {
        const impactOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
        return impactOrder[a.impact] - impactOrder[b.impact];
      });
      
      setIdentifiedIssues(sortedIssues);
      setSelectedIssues(sortedIssues.filter(issue => issue.impact === 'High'));
      setAnalysisComplete(true);
    } catch (error) {
      console.error("Error analyzing credit report:", error);
      setAnalysisError("Failed to analyze credit report. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle selection of an issue
  const toggleIssueSelection = (issueId: string) => {
    setSelectedIssues(prev => {
      const isSelected = prev.some(issue => issue.id === issueId);
      
      if (isSelected) {
        return prev.filter(issue => issue.id !== issueId);
      } else {
        const issueToAdd = identifiedIssues.find(issue => issue.id === issueId);
        return issueToAdd ? [...prev, issueToAdd] : prev;
      }
    });
  };

  // Select all issues
  const selectAllIssues = () => {
    setSelectedIssues([...identifiedIssues]);
  };

  // Clear all selected issues
  const clearSelectedIssues = () => {
    setSelectedIssues([]);
  };

  // Select issues by impact level
  const selectIssuesByImpact = (impact: 'High' | 'Medium' | 'Low') => {
    const filteredIssues = identifiedIssues.filter(issue => issue.impact === impact);
    setSelectedIssues(filteredIssues);
  };

  return {
    isAnalyzing,
    analysisComplete,
    identifiedIssues,
    selectedIssues,
    analysisError,
    toggleIssueSelection,
    selectAllIssues,
    clearSelectedIssues,
    selectIssuesByImpact
  };
}
