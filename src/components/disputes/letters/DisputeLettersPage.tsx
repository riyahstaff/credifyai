
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../layout/Navbar';
import Footer from '../../layout/Footer';
import { useDisputeLettersData } from './hooks/useDisputeLettersData';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { Profile } from '@/lib/supabase/client';

// Import existing components
import DisputeLettersList from './DisputeLettersList';  
import DisputeLetterViewer from './DisputeLetterViewer';
import DisputeLetterHeader from './DisputeLetterHeader';

interface DisputeLettersPageProps {
  testMode?: boolean;
}

const DisputeLettersPage: React.FC<DisputeLettersPageProps> = ({ testMode = false }) => {
  const navigate = useNavigate();
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
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-credify-navy-dark">
      <Navbar />
      
      <main 
        className="flex-grow pt-24 pb-20"
        style={{ marginTop: navHeight > 0 ? `${navHeight}px` : undefined }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <DisputeLetterHeader testMode={testMode} />
          
          {letters.length === 0 && !isLoading && (
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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <DisputeLettersList 
                letters={letters}
                selectedLetter={selectedLetter}
                onSelectLetter={setSelectedLetter}
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
