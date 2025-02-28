
import { CreditReportAccount, RecommendedDispute } from '@/utils/creditReportParser';

export type { CreditReportAccount, RecommendedDispute };

export type MessageType = {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  isLoading?: boolean;
  isFileUpload?: boolean;
  hasDiscrepancies?: boolean;
  discrepancies?: RecommendedDispute[];
};
