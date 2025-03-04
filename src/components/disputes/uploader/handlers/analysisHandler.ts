import { CreditReport } from '@/utils/creditReportParser';
import { analyzeCreditReport } from '@/components/ai/services/creditReport/analysisService';
import { generateDisputeLetters } from '../utils/letterGenerator';

interface AnalysisResult {
  reportData: CreditReport | null;
  issues: any[];
  error: string | null;
}

export const handleCreditReportAnalysis = async (fileContent: string): Promise<AnalysisResult> => {
  try {
    console.log("Starting credit report analysis...");
    const { reportData, issues } = await analyzeCreditReport(fileContent);
    
    if (!reportData) {
      console.error("Credit report analysis failed: No report data returned");
      return { reportData: null, issues: [], error: "Credit report analysis failed: No report data returned" };
    }
    
    console.log("Credit report analysis completed successfully");
    return { reportData, issues, error: null };
  } catch (error: any) {
    console.error("Error during credit report analysis:", error);
    return { reportData: null, issues: [], error: error.message || "Credit report analysis failed" };
  }
};

interface LetterGenerationResult {
  lettersGenerated: boolean;
  error: string | null;
}

export const handleDisputeLetterGeneration = async (issues: any[], reportData: CreditReport): Promise<LetterGenerationResult> => {
  try {
    console.log("Starting dispute letter generation...");
    await generateDisputeLetters(issues, reportData);
    console.log("Dispute letter generation completed successfully");
    return { lettersGenerated: true, error: null };
  } catch (error: any) {
    console.error("Error during dispute letter generation:", error);
    return { lettersGenerated: false, error: error.message || "Dispute letter generation failed" };
  }
};
