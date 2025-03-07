
import { useToast } from '@/hooks/use-toast';

export function useLetterDownload() {
  const { toast } = useToast();
  
  const downloadLetter = (letterContent: string, bureau: string, accountName: string, accountNumber?: string) => {
    if (!letterContent) return;
    
    // Get consumer information from localStorage if available
    const consumerName = localStorage.getItem('userName') || localStorage.getItem('name') || '[YOUR NAME]';
    const consumerAddress = localStorage.getItem('userAddress') || '[YOUR ADDRESS]';
    const consumerCity = localStorage.getItem('userCity') || '[CITY]';
    const consumerState = localStorage.getItem('userState') || '[STATE]';
    const consumerZip = localStorage.getItem('userZip') || '[ZIP]';
    
    // Format date with multiple formats to match sample letters
    const today = new Date();
    const currentDate = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Credit report number
    const creditReportNumber = 'CR' + Math.floor(Math.random() * 10000000);
    
    // Bureau addresses
    const bureauAddresses = {
      'Experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
      'Equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
      'TransUnion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
    };
    
    const bureauAddress = bureauAddresses[bureau as keyof typeof bureauAddresses] || `${bureau}\n[BUREAU ADDRESS]`;
    
    // If this doesn't look like a properly formatted letter, create a new one
    if (!letterContent.includes("Credit Report #") || letterContent.length < 200) {
      // Generate a new letter with proper formatting
      letterContent = `Credit Report #: ${creditReportNumber}\nToday is ${currentDate}\n\n`;
      letterContent += `${consumerName}\n`;
      letterContent += `${consumerAddress}\n`;
      letterContent += `${consumerCity}, ${consumerState} ${consumerZip}\n\n`;
      
      letterContent += `${bureau}\n`;
      letterContent += `${bureauAddress}\n\n`;
      
      letterContent += `Re: Dispute of Inaccurate Information - ${accountName}\n\n`;
      
      letterContent += `To Whom It May Concern:\n\n`;
      letterContent += `I am writing to dispute the following information in my credit report. I have identified the following item(s) that are inaccurate or incomplete:\n\n`;
      
      letterContent += `DISPUTED ITEM(S):\n`;
      letterContent += `Account Name: ${accountName.toUpperCase()}\n`;
      if (accountNumber) {
        letterContent += `Account Number: ${'x'.repeat(Math.max(0, accountNumber.length - 4))}${accountNumber.slice(-4)}\n`;
      }
      letterContent += `Reason for Dispute: Inaccurate Information\n\n`;
      
      letterContent += `This information appears to be inaccurate and requires verification or correction.\n\n`;
      
      letterContent += `According to the Fair Credit Reporting Act, Section 611 (15 U.S.C. § 1681i), you are required to conduct a reasonable investigation into this matter and remove or correct any information that cannot be verified. Furthermore, as a consumer reporting agency, you are obligated to follow reasonable procedures to assure maximum possible accuracy of the information in consumer reports, as required by Section 607 (15 U.S.C. § 1681e).\n\n`;
      
      letterContent += `Please investigate this matter and correct your records within the 30-day timeframe provided by the FCRA. Additionally, please provide me with notification of the results of your investigation and a free updated copy of my credit report if changes are made, as required by law.\n\n`;
      
      letterContent += `Sincerely,\n\n`;
      letterContent += `${consumerName}\n\n`;
      
      letterContent += `Enclosures:\n`;
      letterContent += `- Copy of Driver's License\n`;
      letterContent += `- Copy of Social Security Card\n`;
    } else {
      // Replace placeholders in existing letter content
      letterContent = letterContent
        .replace(/\[YOUR NAME\]|\[FULL_NAME\]|\[NAME\]/g, consumerName)
        .replace(/\[YOUR ADDRESS\]|\[ADDRESS\]/g, consumerAddress)
        .replace(/\[CITY\]/g, consumerCity)
        .replace(/\[STATE\]/g, consumerState)
        .replace(/\[ZIP\]/g, consumerZip)
        .replace(/\[ACCOUNT NUMBER\]/g, accountNumber || 'Unknown')
        .replace(/\[BUREAU\]/g, bureau)
        .replace(/\[BUREAU_ADDRESS\]/g, bureauAddress)
        .replace(/\[CURRENT_DATE\]|\[DATE\]|\[TODAY'S DATE\]/g, currentDate);
    }
    
    // Create file and trigger download
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
