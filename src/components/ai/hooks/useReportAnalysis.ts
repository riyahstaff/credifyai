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

  useEffect(() => {
    if (reportData) {
      analyzeReport(reportData);
    } else {
      setIdentifiedIssues([]);
      setSelectedIssues([]);
      setAnalysisComplete(false);
      setAnalysisError(null);
    }
  }, [reportData]);

  const analyzeReport = async (data: CreditReportData) => {
    try {
      setIsAnalyzing(true);
      setAnalysisError(null);
      
      console.log("Starting credit report analysis...");
      
      const issues = await identifyIssues(data);
      
      const enhancedIssues = issues.map((issue, index) => {
        const sampleLanguage = getSuccessfulDisputePhrases(issue.type);
        const legalRefs = getLegalReferencesForDispute(issue.type, issue.description);
        
        const recommendedDispute: RecommendedDispute = {
          id: `dispute-${index}`,
          type: issue.type,
          title: issue.title,
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

  const mapImpactLevel = (impactLevel: string): "High" | "Medium" | "Low" => {
    if (impactLevel.toLowerCase().includes('high') || impactLevel.toLowerCase().includes('critical')) {
      return "High";
    } else if (impactLevel.toLowerCase().includes('medium')) {
      return "Medium";
    } else {
      return "Low";
    }
  };

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

  const selectAllIssues = () => {
    setSelectedIssues([...identifiedIssues]);
  };

  const clearSelectedIssues = () => {
    setSelectedIssues([]);
  };

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
