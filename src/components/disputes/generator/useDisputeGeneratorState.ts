import { useState, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast"
import { CreditReportAccount } from '@/utils/creditReport/types';
import { generateEnhancedDisputeLetter } from '@/utils/creditReport/disputeLetters';
import { generateAutomaticDisputeLetter } from '@/components/ai/services/disputes/automaticLetterGenerator';

interface DisputeGeneratorState {
  selectedBureau: string;
  setSelectedBureau: (bureau: string) => void;
  accountName: string;
  setAccountName: (name: string) => void;
  selectedAccount: CreditReportAccount | null;
  setSelectedAccount: (account: CreditReportAccount | null) => void;
  useSelectedAccount: boolean;
  setUseSelectedAccount: (use: boolean) => void;
  disputeType: string;
  setDisputeType: (type: string) => void;
  issueDescription: string;
  setIssueDescription: (description: string) => void;
  generating: boolean;
  setGenerating: (generating: boolean) => void;
  letterContent: string;
  setLetterContent: (content: string) => void;
  statusMessage: string;
  setStatusMessage: (message: string) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  streetAddress: string;
  setStreetAddress: (address: string) => void;
  city: string;
  setCity: (city: string) => void;
  state: string;
  setState: (state: string) => void;
  zipCode: string;
  setZipCode: (zip: string) => void;
  generator: 'manual' | 'ai';
  setGenerator: (generatorType: 'manual' | 'ai') => void;
  aiPromptOpen: boolean;
  setAiPromptOpen: (open: boolean) => void;
  generateLetter: () => Promise<void>;
}

export const useDisputeGeneratorState = (): DisputeGeneratorState => {
  const [selectedBureau, setSelectedBureau] = useState<string>('experian');
  const [accountName, setAccountName] = useState<string>('');
  const [selectedAccount, setSelectedAccount] = useState<CreditReportAccount | null>(null);
  const [useSelectedAccount, setUseSelectedAccount] = useState<boolean>(false);
  const [disputeType, setDisputeType] = useState<string>('incorrect_information');
  const [issueDescription, setIssueDescription] = useState<string>('');
  const [generating, setGenerating] = useState<boolean>(false);
  const [letterContent, setLetterContent] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [streetAddress, setStreetAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [generator, setGenerator] = useState<'manual' | 'ai'>('manual');
  const [aiPromptOpen, setAiPromptOpen] = useState<boolean>(false);
  const { toast } = useToast();

  // Fix the generateLetter function to use the correct parameter signature
  const generateLetter = async () => {
    if (generating) return;
    
    setGenerating(true);
    
    try {
      let content = "";
      
      // Get stored report data if available
      const storedReportData = sessionStorage.getItem('creditReportData');
      const creditReportData = storedReportData ? JSON.parse(storedReportData) : null;
      
      // Get user info from form
      const userInfo = {
        name: customerName,
        address: streetAddress,
        city,
        state,
        zip: zipCode
      };
      
      if (generator === 'ai' && aiPromptOpen) {
        // Generate letter using AI assistant
        setStatusMessage("Generating letter with AI assistant...");
        content = await generateAutomaticDisputeLetter(
          creditReportData,
          accountName,
          userInfo
        );
      } else {
        // Standard letter generation
        if (useSelectedAccount && selectedAccount) {
          // Account-specific dispute
          setStatusMessage("Generating account-specific dispute letter...");
          content = await generateEnhancedDisputeLetter(
            disputeType,
            {
              accountName: selectedAccount.accountName || accountName,
              accountNumber: selectedAccount.accountNumber,
              errorDescription: issueDescription,
              bureau: selectedBureau
            },
            userInfo,
            creditReportData
          );
        } else {
          // General dispute
          setStatusMessage("Generating general dispute letter...");
          content = await generateEnhancedDisputeLetter(
            disputeType,
            {
              accountName: accountName || 'Multiple Accounts',
              accountNumber: undefined,
              errorDescription: issueDescription,
              bureau: selectedBureau
            },
            userInfo,
            creditReportData
          );
        }
      }
      
      setLetterContent(content);
      setStatusMessage("Letter generated successfully!");
      toast({
        title: "Letter Generated",
        description: "Your dispute letter has been generated and is ready for review."
      });
    } catch (error) {
      console.error("Error generating letter:", error);
      setStatusMessage(`Error generating letter: ${error instanceof Error ? error.message : String(error)}`);
      toast({
        variant: "destructive",
        title: "Letter Generation Failed",
        description: "There was an error generating your dispute letter. Please try again."
      });
    } finally {
      setGenerating(false);
    }
  };

  return {
    selectedBureau,
    setSelectedBureau,
    accountName,
    setAccountName,
    selectedAccount,
    setSelectedAccount,
    useSelectedAccount,
    setUseSelectedAccount,
    disputeType,
    setDisputeType,
    issueDescription,
    setIssueDescription,
    generating,
    setGenerating,
    letterContent,
    setLetterContent,
    statusMessage,
    setStatusMessage,
    customerName,
    setCustomerName,
    streetAddress,
    setStreetAddress,
    city,
    setCity,
    state,
    setState,
    zipCode,
    setZipCode,
    generator,
    setGenerator,
    aiPromptOpen,
    setAiPromptOpen,
    generateLetter,
  };
};
