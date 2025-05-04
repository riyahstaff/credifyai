
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../layout/Navbar';
import Footer from '../../layout/Footer';
import { useDisputeLettersData, Letter } from './hooks/useDisputeLettersData';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FileText, AlertTriangle, RefreshCw, RotateCw } from 'lucide-react';
import { Profile } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useReportStorage } from '@/hooks/useReportStorage';
import { clearAllLetterData } from '@/utils/creditReport/clearLetterData';

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
  const { clearStoredReport } = useReportStorage();
  
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
  
  const [navHeight, setNavHeight] = useState<number>(0);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  // FIXED: Don't automatically clear letters on mount, only check for stale data
  useEffect(() => {
    console.log("DisputeLettersPage: Checking for navigation flags");
    
    // Break navigation loops by clearing flags
    sessionStorage.removeItem('navigationInProgress');
    sessionStorage.removeItem('redirectInProgress');
    sessionStorage.removeItem('shouldNavigateToLetters');
    
    // Only mark report as not ready if we explicitly don't have letters
    if (sessionStorage.getItem('hasDisputeLetters') !== 'true') {
      console.log("No dispute letters found in storage");
      sessionStorage.removeItem('reportReadyForLetters');
    } else {
      console.log("Dispute letters are present, keeping storage intact");
    }
  }, []);
  
  // Effect to measure navbar height
  useEffect(() => {
    const navbar = document.getElementById('main-navbar');
    if (navbar) {
      setNavHeight(navbar.offsetHeight);
    }
  }, []);
  
  // Handle loading timeout - show message if taking too long
  useEffect(() => {
    // If still loading after 5 seconds, show timeout message
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setLoadingTimeout(true);
        console.log("Loading timeout reached, showing error options");
      }
    }, 5000);
    
    // Clear timeout when loading finishes or component unmounts
    return () => clearTimeout(timeoutId);
  }, [isLoading]);
  
  // Create letter from issues found in the credit report
  const handleCreateLetterFromIssues = () => {
    // Add debug logging to track navigation
    console.log("Navigating to upload report page");
    
    // CRITICAL: Clear all existing letters before creating new ones
    clearAllLetterData();
    
    toast({
      title: "Creating New Letter",
      description: "Redirecting to credit report upload...",
      duration: 3000,
    });
    navigate('/upload-report' + (testMode ? '?testMode=true' : ''));
  };
  
  // Reset session storage and retry loading
  const handleResetAndRetry = () => {
    // Clear ALL session storage related to letters
    clearAllLetterData();
    
    toast({
      title: "Retrying",
      description: "Resetting data and trying again...",
    });
    
    // Redirect to upload report page to start fresh
    navigate('/upload-report');
  };

  // Force reload the page
  const handleForceReload = () => {
    toast({
      title: "Reloading Page",
      description: "Refreshing the dispute letters page...",
    });
    
    // Force hard reload
    window.location.reload();
  };

  // Function to handle letter selection that converts the type properly
  const handleSelectLetter = (letter: Letter) => {
    setSelectedLetter(letter);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main 
        className="flex-grow pt-24 pb-20"
        style={{ marginTop: navHeight > 0 ? `${navHeight}px` : undefined }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <DisputeLetterHeader testMode={testMode} />
          
          {/* Loading Timeout Error Message */}
          {loadingTimeout && isLoading && (
            <Alert className="mb-8 border-destructive bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <AlertTitle className="text-foreground font-semibold">
                Taking Too Long to Load
              </AlertTitle>
              <AlertDescription className="text-foreground/90">
                Your dispute letters are taking too long to load. This might be due to a temporary issue.
              </AlertDescription>
              <div className="flex flex-wrap gap-4 mt-4">
                <Button 
                  variant="outline" 
                  className="bg-background border-border hover:bg-accent flex items-center gap-2"
                  onClick={handleForceReload}
                >
                  <RotateCw size={16} />
                  Reload Page
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleResetAndRetry}
                >
                  Reset & Create New Letter
                </Button>
              </div>
            </Alert>
          )}
          
          {!isLoading && letters.length === 0 && (
            <Alert className="mb-8 border-amber-300 bg-amber-50/50 dark:bg-amber-900/30 dark:border-amber-800/50">
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
                className="mt-3 bg-background dark:bg-background border-amber-300 dark:border-amber-800/50 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50"
                onClick={handleCreateLetterFromIssues}
              >
                <FileText className="mr-2 h-4 w-4" />
                Upload Credit Report
              </Button>
            </Alert>
          )}
          
          {isLoading && !loadingTimeout && (
            <Alert className="mb-8 border-primary/30 bg-primary/5">
              <AlertTitle className="text-foreground font-semibold">
                Loading Letters
              </AlertTitle>
              <AlertDescription className="text-foreground/80">
                Please wait while we load your dispute letters...
              </AlertDescription>
              <div className="w-full flex justify-center mt-4">
                <div className="w-8 h-8 border-4 border-t-primary border-primary/20 rounded-full animate-spin"></div>
              </div>
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
