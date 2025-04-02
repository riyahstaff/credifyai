
import { useState, useEffect } from 'react';
import { Letter } from './sampleLettersData';
import { loadLettersFromStorage, saveLettersToStorage, addLetterToStorage, formatLetterFromStorage } from './letterStorageUtils';
import { useAuth } from '@/contexts/AuthContext';

export const useDisputeLettersData = (testMode: boolean = false) => {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, profile } = useAuth();

  useEffect(() => {
    console.log("Loading dispute letters...");
    // Load letters from session storage
    const storedLetters = loadLettersFromStorage();
    
    if (storedLetters && storedLetters.length > 0) {
      console.log(`Successfully parsed ${storedLetters.length} letters from storage`);
      
      // Check if the letters have actual content
      const hasValidContent = storedLetters.some(letter => 
        letter.content && 
        letter.content.length > 100 && 
        !letter.content.includes("Sample dispute letter content")
      );
      
      if (hasValidContent) {
        console.log("Found valid letters with substantial content");
        setLetters(storedLetters);
        setSelectedLetter(storedLetters[0]);
      }
    }
    
    setIsLoading(false);
  }, []);

  const addLetter = (letterData: any) => {
    const newLetter = formatLetterFromStorage(letterData);
    const updatedLetters = [...letters, newLetter];
    setLetters(updatedLetters);
    setSelectedLetter(newLetter);
    saveLettersToStorage(updatedLetters);
  };

  const saveLetter = (letter: Letter) => {
    const updatedLetters = letters.map(l => 
      l.id === letter.id ? letter : l
    );
    setLetters(updatedLetters);
    saveLettersToStorage(updatedLetters);
  };

  return {
    letters,
    setLetters,
    addLetter,
    saveLetter,
    selectedLetter,
    setSelectedLetter,
    isLoading,
    profile
  };
};
