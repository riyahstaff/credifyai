
import { useToast } from '@/hooks/use-toast';

export function useLetterDownload() {
  const { toast } = useToast();
  
  const downloadLetter = (letterContent: string, bureau: string, accountName: string) => {
    if (!letterContent) return;
    
    const element = document.createElement('a');
    const file = new Blob([letterContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Dispute_Letter_${bureau}_${accountName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Letter downloaded",
      description: "Your dispute letter has been downloaded to your device.",
    });
  };
  
  return { downloadLetter };
}
