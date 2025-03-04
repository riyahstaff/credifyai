
// This file now simply re-exports the refactored hook
// This ensures backward compatibility with existing imports

export { useDisputeLettersData } from './useDisputeLettersData.tsx';
export type { Letter } from './sampleLettersData';

// Also export the utility functions for direct use if needed
export { 
  loadLettersFromStorage,
  saveLettersToStorage,
  addLetterToStorage,
  formatLetterFromStorage 
} from './letterStorageUtils';

export { getSampleLetters } from './sampleLettersData';
