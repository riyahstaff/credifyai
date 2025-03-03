
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import DisputeAgent from '../components/ai/DisputeAgent';
import DisputePreview from '../components/disputes/DisputePreview';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import DisputeLettersHeader from '@/components/disputes/letters/DisputeLettersHeader';
import DisputeLettersTabs from '@/components/disputes/letters/DisputeLettersTabs';
import FCRAComplianceSection from '@/components/disputes/letters/FCRAComplianceSection';
import DisputeLetterManager from '@/components/disputes/letters/DisputeLetterManager';
import DisputeLetterActions from '@/components/disputes/letters/DisputeLetterActions';
import DisputeLetterGenerator from '@/components/disputes/letters/DisputeLetterGenerator';

interface Letter {
  id: number;
  title: string;
  recipient: string;
  createdAt: string;
  status: string;
  bureaus: string[];
  laws: string[];
  content: string;
  resolvedAt?: string;
}

const DisputeLetters = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [currentLetter, setCurrentLetter] = useState<Letter | null>(null);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get the view from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const viewFromQuery = queryParams.get('view');
  
  // Set the default view based on the query parameter or default to "letters"
  const [selectedView, setSelectedView] = useState<string>(viewFromQuery || "letters");
  
  // Update URL when view changes
  const handleViewChange = (view: string) => {
    setSelectedView(view);
    if (view !== "letters") {
      navigate(`/dispute-letters?view=${view}`, { replace: true });
    } else {
      navigate('/dispute-letters', { replace: true });
    }
  };
  
  // Handle letter management
  const { isLoading: letterLoading, saveLetter } = DisputeLetterManager({
    onLetterUpdate: (fetchedLetters) => {
      setLetters(fetchedLetters);
      setIsLoading(letterLoading);
    },
    onPreviewLetter: (letter) => {
      setCurrentLetter(letter);
      setShowPreview(true);
    }
  });

  // Set loading state from letter manager
  useEffect(() => {
    setIsLoading(letterLoading);
  }, [letterLoading]);
  
  // Handle letter actions
  const { handleDownloadLetter, handleSendLetter } = DisputeLetterActions({
    onUpdateLetters: (updatedLetters) => {
      setLetters(updatedLetters);
    }
  });
  
  // Handle letter generation
  const { handleGenerateDispute } = DisputeLetterGenerator({
    onAddNewLetter: (newLetter) => {
      setLetters(prevLetters => [newLetter, ...prevLetters]);
      setCurrentLetter(newLetter);
      setShowPreview(true);
      setSelectedView("letters");
    },
    saveLetter
  });
  
  const onViewLetter = (letter: Letter) => {
    setCurrentLetter(letter);
    setShowPreview(true);
  };
  
  const onDownloadLetter = (letter: Letter) => {
    setCurrentLetter(letter);
    handleDownloadLetter(letter);
  };
  
  const onSendLetter = (letter: Letter) => {
    handleSendLetter(letter, letters);
    setShowPreview(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Page Header */}
          <DisputeLettersHeader 
            onCreateNewLetter={() => handleViewChange("generator")}
          />
          
          {/* Letter Tabs */}
          <DisputeLettersTabs
            selectedView={selectedView}
            onViewChange={handleViewChange}
            letters={letters}
            isLoading={isLoading}
            onViewLetter={onViewLetter}
            onDownloadLetter={onDownloadLetter}
            onSendLetter={onSendLetter}
            onGenerateDispute={handleGenerateDispute}
          />
          
          {/* FCRA Compliance Section */}
          <FCRAComplianceSection 
            onCreateLetter={() => handleViewChange("generator")}
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

export default DisputeLetters;
