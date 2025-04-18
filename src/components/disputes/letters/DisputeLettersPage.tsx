
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../layout/Navbar';
import Footer from '../../layout/Footer';
import { useDisputeLettersData, Letter } from './hooks/useDisputeLettersData';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { Profile } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Import existing components
import DisputeLettersList from './DisputeLettersList';  
import DisputeLetterViewer from './DisputeLetterViewer';
import DisputeLetterHeader from './DisputeLetterHeader';

interface DisputeLettersPageProps {
  testMode?: boolean;
  requirePayment?: boolean;
}

const DisputeLettersPage: React.FC<DisputeLettersPageProps> = ({ testMode = false, requirePayment = false }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    letters, 
    setLetters, 
    addLetter, 
    selectedLetter, 
    setSelectedLetter, 
    isLoading,
    saveLetter,
    profile
  } = useDisputeLettersData(testMode);
  
  // States for letter generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [letterLoadAttempts, setLetterLoadAttempts] = useState(0);
  
  // Handler for generating new dispute letters
  const handleGenerateDispute = async (disputeData: any) => {
    setIsGenerating(true);
    try {
      // Add the letter once generated
      addLetter(disputeData);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const [navHeight, setNavHeight] = useState<number>(0);
  
  // Check for forced reload flag
  useEffect(() => {
    const forceReload = sessionStorage.getItem('forceLettersReload');
    if (forceReload === 'true' && letters.length === 0 && !isLoading && letterLoadAttempts === 0) {
      console.log("Force reload flag detected, refreshing letters data");
      // Clear the flag
      sessionStorage.removeItem('forceLettersReload');
      // Force a refresh by incrementing the attempt counter
      setLetterLoadAttempts(prev => prev + 1);
      
      // Show loading toast
      toast({
        title: "Loading letters",
        description: "Retrieving your generated dispute letters...",
      });
      
      // Refresh the page once to ensure data is loaded
      window.location.reload();
    }
  }, [letters.length, isLoading, letterLoadAttempts, toast]);
  
  // Effect to measure navbar height
  useEffect(() => {
    const navbar = document.getElementById('main-navbar');
    if (navbar) {
      setNavHeight(navbar.offsetHeight);
    }
  }, []);
  
  // Create letter from issues found in the credit report
  const handleCreateLetterFromIssues = () => {
    navigate('/upload-report' + (testMode ? '?testMode=true' : ''));
  };

  // Check for pending dispute letter
  useEffect(() => {
    if (letters.length === 0 && !isLoading && letterLoadAttempts < 3) {
      console.log(`Checking for pending dispute letter (attempt ${letterLoadAttempts + 1})`);
      
      const pendingLetter = sessionStorage.getItem('pendingDisputeLetter');
      const generatedLetters = sessionStorage.getItem('generatedDisputeLetters');
      
      if ((pendingLetter || generatedLetters) && letterLoadAttempts === 0) {
        console.log("Found pending letters in session storage, reloading component");
        setLetterLoadAttempts(prev => prev + 1);
        
        // No need to reload the page here as it may cause an infinite loop
        // Instead, our useDisputeLettersData hook should reload the data
      }
    }
  }, [letters.length, isLoading, letterLoadAttempts]);
  
  // Function to handle letter selection that converts the type properly
  const handleSelectLetter = (letter: Letter) => {
    setSelectedLetter(letter);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-credify-navy-dark">
      <Navbar />
      
      <main 
        className="flex-grow pt-24 pb-20"
        style={{ marginTop: navHeight > 0 ? `${navHeight}px` : undefined }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <DisputeLetterHeader testMode={testMode} />
          
          {letters.length === 0 && !isLoading && letterLoadAttempts >= 3 && (
            <Alert className="mb-8 border-amber-300 bg-amber-50 dark:bg-amber-900/30 dark:border-amber-800/50">
              <FileText className="h-5 w-5 text-amber-600 dark:text-amber-500" />
              <AlertTitle className="text-amber-800 dark:text-amber-400 font-semibold">
                No Dispute Letters Found
              </AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-300">
                You don't have any dispute letters yet. To generate dispute letters based on your credit report, 
                please upload and analyze your credit report first.
              </AlertDescription>
              <Button 
                variant="outline" 
                className="mt-3 bg-white dark:bg-credify-navy-light/20 border-amber-300 dark:border-amber-800/50 text-amber-700 dark:text-amber-300 hover:bg-amber-100"
                onClick={handleCreateLetterFromIssues}
              >
                <FileText className="mr-2 h-4 w-4" />
                Upload Credit Report
              </Button>
            </Alert>
          )}
          
          {isLoading && (
            <Alert className="mb-8 border-blue-300 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-800/50">
              <AlertTitle className="text-blue-800 dark:text-blue-400 font-semibold">
                Loading Letters
              </AlertTitle>
              <AlertDescription className="text-blue-700 dark:text-blue-300">
                Please wait while we load your dispute letters...
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <DisputeLettersList 
                letters={letters}
                selectedLetter={selectedLetter}
                onSelectLetter={handleSelectLetter}
                isLoading={isLoading}
                onCreateLetter={handleCreateLetterFromIssues}
                testMode={testMode}
                userProfile={profile as Profile}
              />
            </div>
            
            <div className="lg:col-span-2">
              <DisputeLetterViewer 
                letter={selectedLetter}
                isLoading={isLoading}
                testMode={testMode}
                userProfile={profile as Profile}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DisputeLettersPage;
