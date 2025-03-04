
import { useState, useEffect } from 'react';
import { CreditReportData } from '@/utils/creditReportParser';
import { parseCreditReport, loadSampleReports, getSuccessfulDisputePhrases } from '@/utils/creditReportParser';
import { MessageType } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useReportAnalysis = () => {
  const { toast } = useToast();
  const [reportData, setReportData] = useState<CreditReportData | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [sampleReportsLoaded, setSampleReportsLoaded] = useState(false);
  const [samplePhrases, setSamplePhrases] = useState<Record<string, string[]>>({});

  // Load sample reports and successful phrases on component mount
  useEffect(() => {
    const loadSamples = async () => {
      try {
        // Load sample reports
        await loadSampleReports();
        setSampleReportsLoaded(true);
        
        // Load successful dispute phrases
        const phrases = await getSuccessfulDisputePhrases();
        setSamplePhrases(phrases);
        
        console.log("Sample reports and phrases loaded successfully");
      } catch (error) {
        console.error("Error loading sample data:", error);
      }
    };
    
    loadSamples();
  }, []);

  const processReport = async (file: File, addMessage: (message: MessageType) => void) => {
    setIsProcessingFile(true);
    
    try {
      // Process the report
      console.log("Starting credit report processing...");
      const fileContent = await readFileAsText(file);
      const data = parseCreditReport(fileContent) || {
        bureaus: {
          experian: false,
          equifax: false,
          transunion: false
        },
        accounts: [],
        inquiries: [],
        publicRecords: [],
        rawText: fileContent
      };
      console.log("Credit report processing complete.");
      setReportData(data);
      return data;
    } catch (error) {
      console.error("Error processing credit report:", error);
      
      const errorMessage: MessageType = {
        id: Date.now().toString(),
        content: `I encountered an error processing your credit report: ${error instanceof Error ? error.message : "Unknown error"}. Please make sure you've uploaded a valid credit report file.`,
        sender: 'agent',
        timestamp: new Date(),
      };
      
      addMessage(errorMessage);
      toast({
        title: "Error processing report",
        description: "There was an error processing your credit report. Please try a different file.",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsProcessingFile(false);
    }
  };

  // Helper function to read file content
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error("Could not read file"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  return {
    reportData,
    setReportData,
    isProcessingFile,
    setIsProcessingFile,
    sampleReportsLoaded,
    samplePhrases,
    processReport
  };
};
