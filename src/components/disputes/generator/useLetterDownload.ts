
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
    const consumerSSN = localStorage.getItem('userSSN') || '[SSN]';
    const consumerDOB = localStorage.getItem('userDOB') || '[DOB]';
    
    // Format date with multiple formats to match sample letters
    const today = new Date();
    const currentDate = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const numericDate = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}/${today.getFullYear()}`;
    
    // Credit report number and tracking number
    const creditReportNumber = localStorage.getItem('creditReportNumber') || 'CR' + Math.floor(Math.random() * 10000000);
    const trackingNumber = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
    
    // Bureau addresses
    const bureauAddresses = {
      'Experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
      'Equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
      'TransUnion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
    };
    
    const bureauAddress = bureauAddresses[bureau as keyof typeof bureauAddresses] || `${bureau}\n[BUREAU ADDRESS]`;
    
    // Replace all placeholders with actual user information
    letterContent = letterContent
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
      .replace(/\[CURRENT_DATE\]|\[DATE\]|\[TODAY'S DATE\]/g, currentDate)
      .replace(/Your credit report/gi, `My credit report from ${bureau}`)
      .replace(/your credit report/gi, `my credit report from ${bureau}`);
    
    // If this is short or doesn't look like a dispute letter, use simple format
    if (letterContent.length < 300 || (!letterContent.includes("DISPUTED ITEM") && !letterContent.includes("To Whom It May Concern"))) {
      letterContent = `${currentDate}\n\n`;
      letterContent += `${bureau}\n${bureauAddress}\n\n`;
      letterContent += `Re: Dispute of Inaccurate Credit Information - Account: ${accountName}\n\n`;
      letterContent += `To Whom It May Concern,\n\n`;
      letterContent += `I am writing to dispute the following information in my credit report with ${bureau}:\n\n`;
      letterContent += `CREDITOR NAME: ${accountName.toUpperCase()}\n`;
      
      if (accountNumber) {
        letterContent += `ACCOUNT NUMBER: ${'xxxx'.padEnd(accountNumber.length - 4, 'x')}${accountNumber.slice(-4)}\n`;
      }
      
      letterContent += `\nThis information is inaccurate and requires correction. Under the Fair Credit Reporting Act, you are required to investigate this dispute and correct or remove the disputed information.\n\n`;
      letterContent += `Please investigate this matter and correct the inaccurate information in my credit report.\n\n`;
      letterContent += `Sincerely,\n\n`;
      letterContent += `${consumerName}\n${consumerAddress}\n${consumerCity}, ${consumerState} ${consumerZip}`;
    }
    
    // Remove the technical KEY explanation section if present
    letterContent = letterContent.replace(
      /Please utilize the following KEY to explain markings[\s\S]*?Do Not Attack/g,
      ''
    );
    
    // Remove any "KEY" section explaining acronyms
    letterContent = letterContent.replace(
      /\*\s*means\s*REQUIRED\s*ALWAYS[\s\S]*?(?=\n\n)/g,
      ''
    );
    
    // Add credit report #, tracking # if not present
    if (!letterContent.includes("Credit Report #")) {
      letterContent = letterContent.replace(bureau, `Credit Report #: ${creditReportNumber}\n\n${bureau}`);
    }
    
    // Update enclosures section to match the requested format
    if (letterContent.includes("Enclosures:")) {
      const enclosurePattern = /Enclosures:[\s\S]*?(?=\n\n|\Z)/;
      letterContent = letterContent.replace(enclosurePattern, 
        `Enclosures:
- Copy of Driver's License
- Copy of Social Security Card`
      );
    } else {
      letterContent += `\n\nEnclosures:
- Copy of Driver's License
- Copy of Social Security Card`;
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
