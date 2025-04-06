import { useState, useEffect } from 'react';
import { CreditReportData, RecommendedDispute, IdentifiedIssue } from '@/utils/creditReport/types';
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
      const enhancedIssues = issues.map((issue, index) => {
        // Get sample dispute language for this type of issue
        const sampleLanguage = getSuccessfulDisputePhrases(issue.type);
        
        // Get legal references for this type of issue
        const legalRefs = getLegalReferencesForDispute(issue.type, issue.description);
        
        // Create a properly typed RecommendedDispute object
        const recommendedDispute: RecommendedDispute = {
          id: `dispute-${index}`,
          type: issue.type,
          title: issue.title,
          // Use primaryBureau from data if issue.bureau doesn't exist
          bureau: data.primaryBureau || data.bureau || "Unknown",
          accountName: issue.account?.accountName || "Unknown Account",
          accountNumber: issue.account?.accountNumber || "",
          reason: issue.description,
          description: issue.description,
          impact: mapImpactLevel(issue.impact),
          severity: issue.impact.toLowerCase().includes('high') ? "high" : 
                   issue.impact.toLowerCase().includes('medium') ? "medium" : "low",
          sampleDisputeLanguage: sampleLanguage.length > 0 ? sampleLanguage[0] : undefined,
          legalBasis: legalRefs
        };
        
        return recommendedDispute;
      });
      
      console.log(`Analysis complete. Found ${enhancedIssues.length} potential issues.`);
      
      // Sort issues by impact/severity
      const sortedIssues = enhancedIssues.sort((a, b) => {
        const impactOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
        return impactOrder[a.impact] - impactOrder[a.impact];
      });
      
      setIdentifiedIssues(sortedIssues);
      setSelectedIssues(sortedIssues.filter(issue => issue.impact === "High"));
      setAnalysisComplete(true);
    } catch (error) {
      console.error("Error analyzing credit report:", error);
      setAnalysisError("Failed to analyze credit report. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper function to map UI impact levels to RecommendedDispute impact levels
  const mapImpactLevel = (impactLevel: string): "High" | "Medium" | "Low" => {
    if (impactLevel.toLowerCase().includes('high') || impactLevel.toLowerCase().includes('critical')) {
      return "High";
    } else if (impactLevel.toLowerCase().includes('medium')) {
      return "Medium";
    } else {
      return "Low";
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
