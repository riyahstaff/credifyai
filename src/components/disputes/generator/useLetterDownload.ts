
import { useToast } from '@/hooks/use-toast';

export function useLetterDownload() {
  const { toast } = useToast();
  
  const downloadLetter = (letterContent: string, bureau: string, accountName: string, accountNumber?: string) => {
    if (!letterContent) return;
    
    // Replace any remaining placeholders with appropriate defaults
    let finalContent = letterContent
      .replace(/\[ACCOUNT NUMBER\]/g, accountNumber || 'Unknown')
      .replace(/Your credit report/gi, "My credit report");
    
    // Make sure the disputed items section is properly filled
    if (!finalContent.includes("DISPUTED ITEM(S):") && accountName) {
      finalContent += `\n\nDISPUTED ITEM(S):\n- Account Name: ${accountName}\n- Account Number: ${accountNumber || 'Unknown'}\n`;
    }
    
    const element = document.createElement('a');
    const file = new Blob([finalContent], {type: 'text/plain'});
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
