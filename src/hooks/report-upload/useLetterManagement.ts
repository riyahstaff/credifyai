
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useReportUpload } from '@/hooks/useReportUpload';
import { verifyLetterStorage } from '@/components/disputes/uploader/utils/bureauUtils';

export const useLetterManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    clearPendingLetters,
    resetUpload
  } = useReportUpload();

  const handleStartNewReport = () => {
    clearPendingLetters();
    resetUpload();
    toast({
      title: "Previous letters cleared",
      description: "You can now upload a new credit report.",
    });
  };

  const hasPendingLetters = verifyLetterStorage();

  return {
    hasPendingLetters,
    handleStartNewReport
  };
};
