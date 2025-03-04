
import { useToast } from '@/hooks/use-toast';

export function useLetterDownload() {
  const { toast } = useToast();
  
  const downloadLetter = (letterContent: string, bureau: string, accountName: string, accountNumber?: string) => {
    if (!letterContent) return;
    
    // Get consumer information from localStorage if available
    const consumerName = localStorage.getItem('userName') || '[YOUR NAME]';
    const consumerAddress = localStorage.getItem('userAddress') || '[YOUR ADDRESS]';
    const consumerCity = localStorage.getItem('userCity') || '[CITY]';
    const consumerState = localStorage.getItem('userState') || '[STATE]';
    const consumerZip = localStorage.getItem('userZip') || '[ZIP]';
    const consumerSSN = localStorage.getItem('userSSN') || '[SSN]';
    const consumerDOB = localStorage.getItem('userDOB') || '[DOB]';
    
    // Current date formatted
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Bureau addresses
    const bureauAddresses = {
      'Experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
      'Equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
      'TransUnion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
    };
    
    const bureauAddress = bureauAddresses[bureau as keyof typeof bureauAddresses] || `${bureau}\n[BUREAU ADDRESS]`;
    
    // Replace any remaining placeholders with actual consumer details
    let finalContent = letterContent
      .replace(/\[YOUR NAME\]|\[FULL_NAME\]|\[NAME\]/g, consumerName)
      .replace(/\[YOUR ADDRESS\]|\[ADDRESS\]/g, consumerAddress)
      .replace(/\[CITY\]/g, consumerCity)
      .replace(/\[STATE\]/g, consumerState)
      .replace(/\[ZIP\]/g, consumerZip)
      .replace(/\[SSN\]|\[SOCIAL SECURITY NUMBER\]/g, consumerSSN)
      .replace(/\[DOB\]|\[DATE OF BIRTH\]/g, consumerDOB)
      .replace(/\[ACCOUNT NUMBER\]/g, accountNumber || 'Unknown')
      .replace(/\[BUREAU\]/g, bureau)
      .replace(/\[BUREAU_ADDRESS\]/g, bureauAddress)
      .replace(/\[CURRENT_DATE\]|\[DATE\]/g, currentDate)
      .replace(/Your credit report/gi, "My credit report");
    
    // Make sure the disputed items section is properly filled
    if (!finalContent.includes("DISPUTED ITEM(S):") && accountName) {
      finalContent += `\n\nDISPUTED ITEM(S):\n- Account Name: ${accountName}\n- Account Number: ${accountNumber || 'Unknown'}\n`;
    }
    
    // Make sure we have a proper closure section with consumer name and address
    if (!finalContent.includes("Sincerely,")) {
      finalContent += `\n\nSincerely,\n\n\n${consumerName}\n${consumerAddress}\n${consumerCity}, ${consumerState} ${consumerZip}\n`;
    }
    
    // Ensure we only include the correct enclosures
    if (finalContent.includes("Enclosures:")) {
      const enclosurePattern = /Enclosures:[\s\S]*?(?=\n\n|\Z)/;
      finalContent = finalContent.replace(enclosurePattern, 
        `Enclosures:\n- Copy of Driver's License\n- Copy of Social Security Card`
      );
    } else {
      finalContent += `\n\nEnclosures:\n- Copy of Driver's License\n- Copy of Social Security Card`;
    }
    
    // Add FCRA compliance footer for inquiries
    if (finalContent.toLowerCase().includes("inquiry") && !finalContent.includes("15 U.S. Code § 1681i")) {
      finalContent += `\n\nPlease send your written response to my address of ${consumerAddress}, ${consumerCity}, ${consumerState} ${consumerZip}.\n\nI am aware that you have been sending out form letters in response to many of the disputes and challenges that consumers have submitted, regardless of the specific information that they have provided. This is illegal, as each dispute and challenge must be addressed individually and on its own merits. If you do not process my letters in a timely manner, I will consider it to be an intentional disregard of my rights as a consumer under 15 U.S. Code § 1681i.`;
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
