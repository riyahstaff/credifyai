
import React from 'react';
import { Button } from '@/components/ui/button';
import { PendingLetterState } from './types/disputeTypes';

const PendingLettersNotification: React.FC<PendingLetterState> = ({
  hasPendingLetters,
  onContinueToLetters,
  onStartNewReport
}) => {
  if (!hasPendingLetters) return null;
  
  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg p-4 mb-6">
      <h3 className="text-amber-800 dark:text-amber-300 font-medium text-lg mb-2">
        You have pending dispute letters
      </h3>
      <p className="text-amber-700 dark:text-amber-400 mb-4">
        We detected previously generated dispute letters. You can view them or start a new report analysis.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={onContinueToLetters}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          Go to Dispute Letters
        </Button>
        <Button 
          onClick={onStartNewReport}
          variant="outline"
          className="border-amber-600 text-amber-700 hover:bg-amber-50"
        >
          Start New Report Analysis
        </Button>
      </div>
    </div>
  );
};

export default PendingLettersNotification;
