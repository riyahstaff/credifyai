import { useState, useEffect } from 'react';
import { Letter } from './sampleLettersData';
import { loadLettersFromStorage, saveLettersToStorage, addLetterToStorage, formatLetterFromStorage } from './letterStorageUtils';
import { useAuth } from '@/contexts/auth';

export const useDisputeLettersData = (testMode: boolean = false) => {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, profile } = useAuth();

  useEffect(() => {
    console.log("Loading dispute letters...");
    // Load letters from session storage
    const result = loadLettersFromStorage();
    
    if (result.foundLetters && result.letters.length > 0) {
      console.log(`Successfully parsed ${result.letters.length} letters from storage`);
      
      // Check if the letters have actual content
      const hasValidContent = result.letters.some(letter => 
        letter.content && 
        letter.content.length > 100 && 
        !letter.content.includes("Sample dispute letter content")
      );
      
      if (hasValidContent) {
        console.log("Found valid letters with substantial content");
        setLetters(result.letters);
        setSelectedLetter(result.selectedLetter);
      }
    }
    
    setIsLoading(false);
  }, []);

  const addLetter = (letterData: any) => {
    const newLetter = formatLetterFromStorage(letterData, letters.length);
    const updatedLetters = [...letters, newLetter];
    setLetters(updatedLetters);
    setSelectedLetter(newLetter);
    saveLettersToStorage(updatedLetters, newLetter);
  };

  const saveLetter = (letter: Letter) => {
    const updatedLetters = letters.map(l => 
      l.id === letter.id ? letter : l
    );
    setLetters(updatedLetters);
    saveLettersToStorage(updatedLetters, letter);
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
