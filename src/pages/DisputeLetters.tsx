
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DisputeLettersPage from '../components/disputes/letters/DisputeLettersPage';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';

const DisputeLetters = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const [lettersLoaded, setLettersLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Effect to load letters on mount - with proper dependency array
  useEffect(() => {
    console.log("DisputeLetters page: User auth state:", user ? "Logged in" : "Not logged in");
    
    const loadLetters = async () => {
      setIsLoading(true);
      
      // Store profile data in localStorage for letter generation if not already done in AuthProvider
      if (profile) {
        localStorage.setItem('userProfile', JSON.stringify(profile));
        
        if (profile.full_name) {
          localStorage.setItem('userName', profile.full_name);
        }
      }
      
      // First check if we already have letters in session storage
      const sessionLetters = sessionStorage.getItem('generatedDisputeLetters');
      
      if (sessionLetters) {
        console.log("[DisputeLetters] Found letters in session storage");
        setLettersLoaded(true);
        setIsLoading(false);
        return;
      }
      
      // If no letters in session storage, try to get them from the backend
      if (user) {
        try {
          console.log("[DisputeLetters] Fetching letters from backend");
          const { data: backendLetters, error } = await supabase
            .from('dispute_letters')
            .select('*')
            .order('createdAt', { ascending: false })
            .limit(10);
            
          if (error) {
            throw error;
          }
            
          if (backendLetters && backendLetters.length > 0) {
            console.log(`[DisputeLetters] Found ${backendLetters.length} letters in backend`);
            sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(backendLetters));
            setLettersLoaded(true);
          } else {
            console.log("[DisputeLetters] No letters found in backend");
            // Check for pendingLetter as last resort
            checkPendingLetter();
          }
        } catch (error) {
          console.error("[DisputeLetters] Error fetching backend letters:", error);
          // Check for pendingLetter as fallback
          checkPendingLetter();
        }
      } else {
        // No user logged in, check for pendingLetter as fallback
        checkPendingLetter();
      }
      
      setIsLoading(false);
    };
    
    const checkPendingLetter = () => {
      // Check for letter data as fallback
      const pendingLetter = sessionStorage.getItem('pendingDisputeLetter');
      
      // Log current state for debugging
      console.log("[DisputeLetters] Checking for pending letter flag");
      console.log("[DisputeLetters] pendingLetter:", pendingLetter ? "Present" : "Not present");
      
      if (pendingLetter) {
        try {
          const letterObj = JSON.parse(pendingLetter);
          if (letterObj && letterObj.content && letterObj.content.length > 0) {
            console.log("[DisputeLetters] Letter content found, length:", letterObj.content.length);
            
            if (letterObj.content.includes("Sample dispute letter content") || 
                letterObj.content.length < 100) {
              console.log("[DisputeLetters] Found placeholder content, regenerating letter");
              toast({
                title: "Regenerating Letter",
                description: "The previous letter contained placeholder content. Generating a proper letter now.",
              });
              
              setTimeout(() => {
                navigate('/upload-report');
              }, 2000);
              return;
            }
            
            // Convert pendingLetter to format expected by DisputeLettersPage
            const letters = [{
              ...letterObj,
              id: Date.now(),
              title: letterObj.title || "Credit Report Dispute",
              createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              status: "ready"
            }];
            
            // Store in session storage
            sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(letters));
            setLettersLoaded(true);
          }
        } catch (e) {
          console.error("[DisputeLetters] Error parsing letter:", e);
        }
      }
    };
    
    loadLetters();
    
    // Clean up any navigation flags from previous attempts
    return () => {
      sessionStorage.removeItem('navigationInProgress');
      sessionStorage.removeItem('redirectInProgress');
    };
  }, [toast, profile, navigate, user]);
  
  // If still loading, show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your dispute letters...</p>
        </div>
      </div>
    );
  }

  return (
    <DisputeLettersPage testMode={false} requirePayment={true} />
  );
};

export default DisputeLetters;
