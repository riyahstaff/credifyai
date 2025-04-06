
import { useState, useCallback } from 'react';
import { CreditReportData, CreditReportAccount } from '@/utils/creditReport/types';
import { generateEnhancedDisputeLetter } from '@/utils/creditReport/disputeLetters';
import { useToast } from '@/hooks/use-toast';

export interface DisputeTemplate {
  id: string;
  name: string;
  content: string;
}

export const useDisputeGeneratorState = () => {
  const { toast } = useToast();
  
  // State variables
  const [selectedAccount, setSelectedAccount] = useState<CreditReportAccount | null>(null);
  const [selectedBureau, setSelectedBureau] = useState<string>('experian');
  const [selectedDisputeType, setSelectedDisputeType] = useState<string>('general');
  const [disputeContent, setDisputeContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  
  // Load stored report data from session
  const loadReportData = useCallback((): CreditReportData | null => {
    try {
      const storedData = sessionStorage.getItem('creditReportData');
      if (!storedData) return null;
      
      return JSON.parse(storedData);
    } catch (error) {
      console.error('Error loading report data:', error);
      return null;
    }
  }, []);
  
  // Report data
  const [reportData, setReportData] = useState<CreditReportData | null>(loadReportData());
  
  // Selected template for dispute
  const [selectedTemplate, setSelectedTemplate] = useState<DisputeTemplate | null>(null);
  
  // Handle when report is processed
  const handleReportProcessed = useCallback((data: CreditReportData) => {
    setReportData(data);
  }, []);
  
  // Handle account selection
  const handleAccountSelected = useCallback((account: CreditReportAccount | null) => {
    setSelectedAccount(account);
    setGeneratedLetter('');
  }, []);
  
  // Handle bureau selection
  const handleBureauSelected = useCallback((bureau: string) => {
    setSelectedBureau(bureau);
    setGeneratedLetter('');
  }, []);
  
  // Handle dispute type selection
  const handleDisputeTypeSelected = useCallback((disputeType: string) => {
    setSelectedDisputeType(disputeType);
    setGeneratedLetter('');
  }, []);
  
  // Handle template selection
  const handleTemplateSelected = useCallback((template: DisputeTemplate | null) => {
    setSelectedTemplate(template);
    if (template) {
      setDisputeContent(template.content);
    }
    setGeneratedLetter('');
  }, []);
  
  // Generate dispute letter
  const handleGenerateDispute = useCallback(async () => {
    if (!selectedAccount) {
      toast({ title: 'Error', description: 'Please select an account to dispute', variant: 'destructive' });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const letter = await generateEnhancedDisputeLetter(
        selectedDisputeType,
        {
          accountName: selectedAccount.accountName,
          accountNumber: selectedAccount.accountNumber,
          errorDescription: disputeContent || 'This information appears to be inaccurate',
          bureau: selectedBureau
        },
        {
          name: '[YOUR NAME]',
          address: '[YOUR ADDRESS]',
          city: '[CITY]',
          state: '[STATE]',
          zip: '[ZIP]'
        }
      );
      
      setGeneratedLetter(letter);
      toast({ title: 'Success', description: 'Dispute letter generated successfully' });
    } catch (error) {
      console.error('Error generating dispute letter:', error);
      toast({ title: 'Error', description: 'Failed to generate dispute letter', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  }, [selectedAccount, selectedDisputeType, disputeContent, selectedBureau, toast]);
  
  // Handle dispute generated
  const handleDisputeGenerated = useCallback((disputeData: any) => {
    setGeneratedLetter(disputeData);
  }, []);
  
  // Reset letter
  const handleLetterReset = useCallback(() => {
    setGeneratedLetter('');
  }, []);
  
  return {
    selectedAccount,
    selectedBureau,
    selectedDisputeType,
    disputeContent,
    isGenerating,
    generatedLetter,
    reportData,
    selectedTemplate,
    loadReportData,
    handleReportProcessed,
    handleAccountSelected,
    handleBureauSelected,
    handleDisputeTypeSelected,
    setDisputeContent,
    handleTemplateSelected,
    handleGenerateDispute,
    handleDisputeGenerated,
    handleLetterReset
  };
};
