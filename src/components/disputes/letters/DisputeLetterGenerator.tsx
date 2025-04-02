import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { CreditReportData } from '@/utils/creditReport/types';
import { generateEnhancedDisputeLetter } from '@/lib/supabase/letterGenerator';

interface DisputeLetterGeneratorProps {
  reportData: CreditReportData | null;
}

const DisputeLetterGenerator: React.FC<DisputeLetterGeneratorProps> = ({ reportData }) => {
  const [bureau, setBureau] = useState<string>('Experian');
  const [accountName, setAccountName] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [errorType, setErrorType] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [generating, setGenerating] = useState<boolean>(false);
  const [letterGenerated, setLetterGenerated] = useState<boolean>(false);
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Get user info from localStorage
  const userName = localStorage.getItem('userName') || '[YOUR NAME]';
  const userAddress = localStorage.getItem('userAddress') || '[YOUR ADDRESS]';
  const userCity = localStorage.getItem('userCity') || '[CITY]';
  const userState = localStorage.getItem('userState') || '[STATE]';
  const userZip = localStorage.getItem('userZip') || '[ZIP]';

  const generateLetter = async () => {
    setGenerating(true);
    setError(null);
    
    try {
      // Create dispute object
      const disputeData = {
        title: errorType,
        bureau,
        accountName,
        accountNumber,
        errorType,
        explanation,
        letterContent: '',
        timestamp: new Date(),
        // Add all raw extracted text for dispute generation
        rawText: reportData?.rawText || ''
      };
      
      // Generate letter content
      const letterContent = await generateEnhancedDisputeLetter(
        errorType,
        {
          accountName,
          accountNumber,
          errorDescription: explanation,
          bureau
        },
        {
          name: userName,
          address: userAddress,
          city: userCity,
          state: userState,
          zip: userZip
        },
        reportData
      );
      
      // Update the dispute data with the letter content
      disputeData.letterContent = letterContent;
      
      // Store in session storage
      sessionStorage.setItem('pendingDisputeLetter', JSON.stringify({
        ...disputeData,
        content: letterContent,
        id: Date.now(),
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'ready'
      }));
      
      // Show success message
      toast({
        title: "Dispute letter generated",
        description: "Your dispute letter has been created and is ready for review.",
        duration: 3000,
      });
      
      // Set letter generated flag
      setLetterGenerated(true);
      
      // Set the letter content
      setGeneratedLetter(letterContent);
    } catch (error) {
      console.error('Error generating letter:', error);
      setError('Failed to generate dispute letter. Please try again.');
      toast({
        title: "Error generating letter",
        description: "There was a problem creating your dispute letter. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dispute Letter Generator</h1>

      {/* Bureau Selection */}
      <div className="mb-4">
        <Label htmlFor="bureau">Select Bureau</Label>
        <select
          id="bureau"
          className="w-full p-2 border rounded"
          value={bureau}
          onChange={(e) => setBureau(e.target.value)}
        >
          <option value="Experian">Experian</option>
          <option value="Equifax">Equifax</option>
          <option value="TransUnion">TransUnion</option>
        </select>
      </div>

      {/* Account Information */}
      <div className="mb-4">
        <Label htmlFor="accountName">Account Name</Label>
        <Input
          type="text"
          id="accountName"
          className="w-full p-2 border rounded"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="accountNumber">Account Number</Label>
        <Input
          type="text"
          id="accountNumber"
          className="w-full p-2 border rounded"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
      </div>

      {/* Dispute Details */}
      <div className="mb-4">
        <Label htmlFor="errorType">Error Type</Label>
        <Input
          type="text"
          id="errorType"
          className="w-full p-2 border rounded"
          value={errorType}
          onChange={(e) => setErrorType(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="explanation">Explanation</Label>
        <Textarea
          id="explanation"
          className="w-full p-2 border rounded"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
        />
      </div>

      {/* Generate Letter Button */}
      <Button onClick={generateLetter} disabled={generating}>
        {generating ? "Generating..." : "Generate Letter"}
      </Button>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Display Generated Letter */}
      {letterGenerated && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Generated Letter</h2>
          <div className="border rounded p-4 whitespace-pre-line">
            {generatedLetter}
          </div>
        </div>
      )}
    </div>
  );
};

export default DisputeLetterGenerator;
