
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import DisputeAgent from '../components/ai/DisputeAgent';
import DisputePreview from '../components/disputes/DisputePreview';
import { useToast } from '@/hooks/use-toast';
import { getUserDisputeLetters, saveDisputeLetter } from '@/lib/supabase/disputeLetters';
import { useAuth } from '@/contexts/AuthContext';
import DisputeLettersHeader from '@/components/disputes/letters/DisputeLettersHeader';
import DisputeLettersTabs from '@/components/disputes/letters/DisputeLettersTabs';
import FCRAComplianceSection from '@/components/disputes/letters/FCRAComplianceSection';

const DisputeLetters = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [currentLetter, setCurrentLetter] = useState<any>(null);
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
  
  // Sample data for dispute letters
  const [letters, setLetters] = useState<any[]>([]);

  // Fetch user's dispute letters
  useEffect(() => {
    const fetchLetters = async () => {
      if (user?.id) {
        setIsLoading(true);
        try {
          const userLetters = await getUserDisputeLetters(user.id);
          if (userLetters && userLetters.length > 0) {
            // Transform the data to match our expected format
            const formattedLetters = userLetters.map(letter => ({
              id: letter.id,
              title: `${letter.error_type} Dispute (${letter.account_name})`,
              recipient: letter.bureau,
              createdAt: new Date(letter.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              status: 'in-progress',
              bureaus: [letter.bureau],
              laws: ['FCRA § 611', 'FCRA § 623'],
              content: letter.letter_content
            }));
            setLetters(formattedLetters);
          } else {
            // If no letters found, set some samples for demo purposes
            setLetters([
              {
                id: 1,
                title: 'Duplicate Account Dispute (Bank of America)',
                recipient: 'Experian',
                createdAt: 'May 10, 2023',
                status: 'in-progress',
                bureaus: ['Experian', 'TransUnion'],
                laws: ['FCRA § 611', 'FCRA § 623'],
                content: `Dear Experian,\n\nI am writing to dispute a duplicate account appearing on my credit report. The Bank of America account appears twice with different account numbers. This is affecting my credit utilization ratio negatively.\n\nUnder the Fair Credit Reporting Act, I request that you investigate this matter and remove the duplicate entry.\n\nSincerely,\n[YOUR NAME]`
              },
              {
                id: 2,
                title: 'Incorrect Balance Dispute (Chase Card)',
                recipient: 'All Bureaus',
                createdAt: 'Apr 22, 2023',
                status: 'resolved',
                bureaus: ['Experian', 'Equifax', 'TransUnion'],
                laws: ['FCRA § 623'],
                resolvedAt: 'May 12, 2023',
                content: `Dear Credit Bureau,\n\nI am writing to dispute an incorrect balance on my Chase credit card. The current balance is reported as $8,450, but my actual balance is $4,225.\n\nPlease investigate this matter as required by the FCRA and update the information accordingly.\n\nSincerely,\n[YOUR NAME]`
              },
              {
                id: 3,
                title: 'Outdated Address Information Dispute',
                recipient: 'Equifax',
                createdAt: 'May 5, 2023',
                status: 'in-progress',
                bureaus: ['Equifax'],
                laws: ['FCRA § 605'],
                content: `Dear Equifax,\n\nI am writing to request that you update the address information on my credit report. My current report shows an old address that I haven't lived at for over 3 years.\n\nPlease update this information as required by the FCRA.\n\nSincerely,\n[YOUR NAME]`
              },
              {
                id: 4,
                title: 'Late Payment Dispute (Capital One)',
                recipient: 'TransUnion',
                createdAt: 'Mar 15, 2023',
                status: 'resolved',
                bureaus: ['TransUnion'],
                laws: ['FCRA § 623'],
                resolvedAt: 'Apr 10, 2023',
                content: `Dear TransUnion,\n\nI am writing to dispute a late payment record on my Capital One account. I have always made payments on time, and I have included proof of my payment history.\n\nPlease investigate this matter and remove the incorrect late payment notation.\n\nSincerely,\n[YOUR NAME]`
              },
              {
                id: 5,
                title: 'Hard Inquiry Dispute (Unknown Source)',
                recipient: 'All Bureaus',
                createdAt: 'May 1, 2023',
                status: 'in-progress',
                bureaus: ['Experian', 'Equifax', 'TransUnion'],
                laws: ['FCRA § 604', 'FCRA § 611'],
                content: `Dear Credit Bureau,\n\nI am writing to dispute an unauthorized hard inquiry on my credit report. I did not authorize this inquiry and suspect it may be fraudulent.\n\nUnder the FCRA, I request that you investigate and remove this unauthorized inquiry.\n\nSincerely,\n[YOUR NAME]`
              },
            ]);
          }
        } catch (error) {
          console.error('Error fetching dispute letters:', error);
          toast({
            title: "Error loading dispute letters",
            description: "There was a problem loading your dispute letters. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchLetters();
  }, [user?.id, toast]);

  const handleGenerateDispute = async (disputeData: any) => {
    // Create a new letter from the dispute data
    console.log('Generated dispute:', disputeData);
    
    const newLetter = {
      id: Date.now(),
      title: `${disputeData.errorType} Dispute (${disputeData.accountName})`,
      recipient: disputeData.bureau,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'draft',
      bureaus: [disputeData.bureau],
      laws: ['FCRA § 611', 'FCRA § 623'],
      content: disputeData.letterContent
    };
    
    // Add the new letter to the letters array
    setLetters(prevLetters => [newLetter, ...prevLetters]);
    
    // Set the current letter and show the preview
    setCurrentLetter(newLetter);
    setShowPreview(true);
    
    // Save the letter to Supabase if user is logged in
    if (user?.id) {
      try {
        const saved = await saveDisputeLetter(user.id, disputeData);
        if (saved) {
          toast({
            title: "Dispute letter saved",
            description: "Your dispute letter has been saved to your account.",
            duration: 5000,
          });
        }
      } catch (error) {
        console.error('Error saving dispute letter:', error);
        toast({
          title: "Error saving letter",
          description: "There was a problem saving your dispute letter. Please try again.",
          variant: "destructive",
        });
      }
    }
    
    toast({
      title: "Dispute letter created",
      description: "Your dispute letter has been generated and is ready for review.",
      duration: 5000,
    });
    
    // Switch to the letters view to show the newly created letter
    setSelectedView("letters");
  };
  
  const handleDownloadLetter = () => {
    if (!currentLetter) return;
    
    // Create text file with letter content
    const element = document.createElement('a');
    const file = new Blob([currentLetter.content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${currentLetter.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Letter downloaded",
      description: "Your dispute letter has been downloaded to your device.",
    });
  };
  
  const handleSendLetter = () => {
    // In a real implementation, this would send the letter via API or email
    if (!currentLetter) return;
    
    // Update the letter status to in-progress
    setLetters(prevLetters => 
      prevLetters.map(letter => 
        letter.id === currentLetter.id 
          ? { ...letter, status: 'in-progress' } 
          : letter
      )
    );
    
    toast({
      title: "Letter queued for sending",
      description: "Your dispute letter will be sent to the credit bureau.",
    });
    
    setShowPreview(false);
  };
  
  const handleViewLetter = (letter: any) => {
    setCurrentLetter(letter);
    setShowPreview(true);
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
            onViewLetter={handleViewLetter}
            onDownloadLetter={(letter) => {
              setCurrentLetter(letter);
              handleDownloadLetter();
            }}
            onSendLetter={(letter) => {
              setCurrentLetter(letter);
              handleSendLetter();
            }}
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
          onDownload={handleDownloadLetter}
          onSend={handleSendLetter}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default DisputeLetters;
