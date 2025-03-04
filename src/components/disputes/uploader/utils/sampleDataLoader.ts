
import { loadSampleDisputeLetters } from '@/utils/creditReport/disputeLetters/sampleLettersLoader';
import { loadSampleReports } from '@/utils/creditReport/sampleReports';

/**
 * Preload sample data to assist with analysis
 */
export const preloadSampleData = async () => {
  console.log("Preloading sample dispute letters and reports");
  
  try {
    // Load sample dispute letters with a timeout to prevent hanging
    const letterPromise = Promise.race([
      loadSampleDisputeLetters(),
      new Promise<any[]>((_, reject) => setTimeout(() => reject(new Error("Timeout loading sample letters")), 3000))
    ]);
    
    // Load sample reports with a timeout to prevent hanging
    const reportsPromise = Promise.race([
      loadSampleReports(),
      new Promise<any[]>((_, reject) => setTimeout(() => reject(new Error("Timeout loading sample reports")), 3000))
    ]);
    
    const [sampleDisputeLetters, sampleReports] = await Promise.allSettled([letterPromise, reportsPromise]);
    
    // Safely check the length with type guards
    const lettersLength = sampleDisputeLetters.status === 'fulfilled' && Array.isArray(sampleDisputeLetters.value) 
      ? sampleDisputeLetters.value.length 
      : 0;
      
    const reportsLength = sampleReports.status === 'fulfilled' && Array.isArray(sampleReports.value) 
      ? sampleReports.value.length 
      : 0;
    
    console.log(`Loaded ${lettersLength} sample dispute letters`);
    console.log(`Loaded ${reportsLength} sample credit reports`);
  } catch (error) {
    console.warn("Error in preloadSampleData, continuing anyway:", error);
  }
};
