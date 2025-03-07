
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DisputeAgent from '@/components/ai/DisputeAgent';
import DisputePreview from '@/components/disputes/DisputePreview';
import Navbar from '../../layout/Navbar';
import Footer from '../../layout/Footer';
import DisputeLettersHeader from './DisputeLettersHeader';
import DisputeLettersTabs from './DisputeLettersTabs';
import FCRAComplianceSection from './FCRAComplianceSection';
import { useDisputeLettersData } from './hooks/useDisputeLettersData';
import { useDisputeLetterActions } from './DisputeLetterActions';
import { useDisputeLetterGenerator } from './DisputeLetterGenerator';
import { useToast } from '@/hooks/use-toast';

interface DisputeLettersPageProps {
  testMode?: boolean;
}

const DisputeLettersPage: React.FC<DisputeLettersPageProps> = ({ testMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPreview, setShowPreview] = useState(false);
  const [currentLetter, setCurrentLetter] = useState<any>(null);
  const [selectedView, setSelectedView] = useState<string>("letters");
  const { toast } = useToast();
  
  // Check URL parameters for test mode
  const searchParams = new URLSearchParams(location.search);
  const urlTestMode = searchParams.get('testMode') === 'true';
  
  // Combine component prop and URL parameter
  const effectiveTestMode = testMode || urlTestMode;
  
  // Use the custom hooks for dispute letter data
  const { letters: initialLetters, isLoading } = useDisputeLettersData(effectiveTestMode);
  const [letters, setLetters] = useState<any[]>([]);
  
  // Update letters when initialLetters changes
  useEffect(() => {
    if (initialLetters && initialLetters.length > 0) {
      console.log(`Setting ${initialLetters.length} letters from initialLetters`);
      
      // Ensure we have unique letters by adding unique IDs if they don't exist
      const uniqueLetters = initialLetters.map((letter, index) => {
        if (!letter.id) {
          return { ...letter, id: Date.now() + index };
        }
        return letter;
      });
      
      setLetters(uniqueLetters);
      
      // Select the first letter for preview if none is selected
      if (!currentLetter) {
        setCurrentLetter(uniqueLetters[0]);
      }
    }
  }, [initialLetters, currentLetter]);
  
  // Use the dispute letter actions hook
  const { handleDownloadLetter, handleSendLetter } = useDisputeLetterActions({
    onUpdateLetters: (updatedLetters) => {
      setLetters(updatedLetters);
    }
  });
  
  // Use the dispute letter generator hook
  const { handleGenerateDispute } = useDisputeLetterGenerator({
    onAddNewLetter: (newLetter) => {
      // Ensure letter has a unique ID
      const letterWithId = { ...newLetter, id: newLetter.id || Date.now() };
      setLetters(prev => [letterWithId, ...prev]);
      setCurrentLetter(letterWithId);
      setShowPreview(true);
      setSelectedView("letters");
    },
    saveLetter: async (disputeData) => {
      // Skip saving in test mode
      if (effectiveTestMode) {
        console.log("[DisputeLettersPage] Test mode active - not saving letter to database");
        return true;
      }
      // In a real implementation, this would save to a database
      // For now, just return success
      return true;
    }
  });
  
  const onViewLetter = (letter: any) => {
    setCurrentLetter(letter);
    setShowPreview(true);
  };
  
  const onDownloadLetter = (letter: any) => {
    handleDownloadLetter(letter);
  };
  
  const onSendLetter = (letter: any) => {
    handleSendLetter(letter, letters);
    setShowPreview(false);
  };
  
  // Clear navigation flag and check for auth persistence
  useEffect(() => {
    // Clear navigation flags
    sessionStorage.removeItem('navigationInProgress');
    const authTimestamp = sessionStorage.getItem('authTimestamp');
    
    if (authTimestamp) {
      console.log(`Auth timestamp from navigation: ${authTimestamp}`);
      sessionStorage.removeItem('authTimestamp');
    }
    
    // Check that we have auth state
    const hasAuthSession = localStorage.getItem('hasAuthSession');
    console.log(`Auth session status: ${hasAuthSession ? 'Present' : 'Missing'}`);
    
    // Check on mount if we have any generated letters in session storage
    const generatedLetters = sessionStorage.getItem('generatedDisputeLetters');
    
    console.log("Checking for generated letters");
    console.log("Generated letters:", generatedLetters ? `Found ${JSON.parse(generatedLetters).length} letters` : "Not present");
    
    if (generatedLetters) {
      try {
        const parsedLetters = JSON.parse(generatedLetters);
        if (parsedLetters.length > 0) {
          // Force to letters tab
          setSelectedView("letters");
          
          // Show first letter preview
          setCurrentLetter(parsedLetters[0]);
          setShowPreview(true);
          
          // Set a flag to avoid multiple page loads
          sessionStorage.setItem('lettersAlreadyProcessed', 'true');
        }
      } catch (error) {
        console.error("Error parsing generated letters:", error);
      }
    }
    
    // Check for force reload flag
    const forceReload = sessionStorage.getItem('forceLettersReload');
    if (forceReload === 'true') {
      console.log("[DisputeLettersPage] Force reload flag found and cleared");
      sessionStorage.removeItem('forceLettersReload');
      
      // Only refresh if we haven't already processed the letters
      if (sessionStorage.getItem('lettersAlreadyProcessed') !== 'true') {
        sessionStorage.setItem('lettersAlreadyProcessed', 'true');
      }
    }
    
    return () => {
      // Clean up on unmount
      sessionStorage.removeItem('lettersAlreadyProcessed');
    };
  }, []);
  
  // Show a loading message while letters are being loaded
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-20 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Loading your dispute letters...</h2>
            <p className="text-gray-600">Please wait while we prepare your letters</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Page Header */}
          <DisputeLettersHeader 
            hideCreateButton={true} // Hide manual letter creation
          />
          
          {effectiveTestMode && (
            <div className="mb-4 p-3 bg-amber-100 text-amber-800 rounded-lg">
              <p><strong>Test Mode Active:</strong> Letters generated in test mode are not saved to your account and cannot be sent.</p>
            </div>
          )}
          
          {/* Letter Tabs */}
          <DisputeLettersTabs
            selectedView={selectedView}
            onViewChange={(view) => setSelectedView(view)}
            letters={letters}
            isLoading={isLoading}
            onViewLetter={onViewLetter}
            onDownloadLetter={onDownloadLetter}
            onSendLetter={onSendLetter}
            onGenerateDispute={handleGenerateDispute}
            hideGeneratorTab={true} // Hide manual generator tab
          />
          
          {/* FCRA Compliance Section */}
          <FCRAComplianceSection 
            showUploadReportButton={true}
            hideCreateButton={true}
            onUploadReport={() => navigate('/upload-report')}
          />
        </div>
      </main>
      
      {/* AI Agent Component */}
      <DisputeAgent onGenerateDispute={handleGenerateDispute} />
      
      {/* Dispute Preview Modal */}
      {showPreview && currentLetter && (
        <DisputePreview 
          letterContent={currentLetter.content || "Your dispute letter content will appear here."}
          onClose={() => setShowPreview(false)}
          onDownload={() => handleDownloadLetter(currentLetter)}
          onSend={() => onSendLetter(currentLetter)}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default DisputeLettersPage;
