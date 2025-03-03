
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const DisputeLettersPage = () => {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [currentLetter, setCurrentLetter] = useState(null);
  const [selectedView, setSelectedView] = useState<string>("letters");
  
  // Use the custom hooks for dispute letter data and actions
  const { letters, isLoading } = useDisputeLettersData();
  
  // Use the dispute letter actions hook
  const { handleDownloadLetter, handleSendLetter } = useDisputeLetterActions({
    onUpdateLetters: (updatedLetters) => {
      // In a real implementation, this would update letters state
      // But our letters now come from useDisputeLettersData
    }
  });
  
  // Use the dispute letter generator hook
  const { handleGenerateDispute } = useDisputeLetterGenerator({
    onAddNewLetter: (newLetter) => {
      setCurrentLetter(newLetter);
      setShowPreview(true);
      setSelectedView("letters");
    },
    saveLetter: async (disputeData) => {
      // This would be implemented using the saveLetter function
      // from the main component, but for now we'll return true
      return true;
    }
  });
  
  const onViewLetter = (letter) => {
    setCurrentLetter(letter);
    setShowPreview(true);
  };
  
  const onDownloadLetter = (letter) => {
    setCurrentLetter(letter);
    handleDownloadLetter(letter);
  };
  
  const onSendLetter = (letter) => {
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
            hideCreateButton={true} // Hide manual letter creation
          />
          
          {/* Letter Tabs */}
          <DisputeLettersTabs
            selectedView={selectedView}
            onViewChange={(view) => {/* Now only letters view is allowed */}}
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
