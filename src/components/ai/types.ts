
import { RecommendedDispute } from '@/utils/creditReport/types';

// Re-export RecommendedDispute type so components can import it from here
export type { RecommendedDispute };

export interface MessageType {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  isFileUpload?: boolean;
  hasDiscrepancies?: boolean;
  discrepancies?: RecommendedDispute[];
  requiresSubscription?: boolean; // Add this property
}

export interface DisputeOptionsProps {
  discrepancies: RecommendedDispute[];
  onSelect: (discrepancy: RecommendedDispute) => void;
}

export interface TypingIndicatorProps {
  isProcessingFile?: boolean;
}
