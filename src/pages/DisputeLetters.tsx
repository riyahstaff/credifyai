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
import { getUserDisputeLetters, saveDisputeLetter } from '@/lib/supabase/disputeLetters';
import { useDisputeLetterActions } from '@/components/disputes/letters/DisputeLetterActions';
import { useDisputeLetterGenerator } from '@/components/disputes/letters/DisputeLetterGenerator';

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
  
  // Get the view from URL query parameter - now we only support letters view
  const [selectedView, setSelectedView] = useState<string>("letters");
  
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
            const sampleLetters = getSampleLetters();
            setLetters(sampleLetters);
          }
        } catch (error) {
          console.error('Error fetching dispute letters:', error);
          toast({
            title: "Error loading dispute letters",
            description: "There was a problem loading your dispute letters. Please try again.",
            variant: "destructive",
          });
          
          // Set sample letters even on error for demo purposes
          const sampleLetters = getSampleLetters();
          setLetters(sampleLetters);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        
        // Set sample letters for non-logged in users
        const sampleLetters = getSampleLetters();
        setLetters(sampleLetters);
      }
    };

    fetchLetters();
  }, [user?.id, toast]);

  const getSampleLetters = (): Letter[] => {
    return [
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
    ];
  };

  // Save letter functionality
  const saveLetter = async (disputeData: any) => {
    if (user?.id) {
      try {
        const saved = await saveDisputeLetter(user.id, disputeData);
        return saved;
      } catch (error) {
        console.error('Error saving dispute letter:', error);
        toast({
          title: "Error saving letter",
          description: "There was a problem saving your dispute letter. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    }
    return false;
  };
  
  // Use the dispute letter actions hook
  const { handleDownloadLetter, handleSendLetter } = useDisputeLetterActions({
    onUpdateLetters: (updatedLetters) => {
      setLetters(updatedLetters);
    }
  });
  
  // Use the dispute letter generator hook
  const { handleGenerateDispute } = useDisputeLetterGenerator({
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
      
      {/* AI Agent Component - Enhanced to indicate deep thinking capabilities */}
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
