
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
    
    // If this is short or doesn't look like a sample letter format, use the advanced format
    if (letterContent.length < 300 || (!letterContent.includes("DISPUTED ITEM") && !letterContent.includes("My Personal Tracking Number"))) {
      letterContent = `Today's Date is: ${currentDate} ${numericDate}\n\n`;
      letterContent += `Credit Report #: ${creditReportNumber}\n\n`;
      letterContent += `${bureau}\n${bureauAddress}\n\n`;
      letterContent += `My First and Last Name is and ONLY is ${consumerName}\n`;
      letterContent += `My Address Street Number, Street Name, City, and State is and only is ${consumerAddress} ${consumerCity} ${consumerState} ${consumerZip}\n\n`;
      letterContent += `My Personal Tracking Number is ${trackingNumber}\n\n`;
      
      letterContent += `RE: declaration of currently described injurious claim(s) unproven yet to be veritably and physically validated! These claims are requested check for requisites and immediately removed from reporting so to ensure lawful compliant reporting!\n\n`;
      
      letterContent += `To Whom it Concerns,\n\n`;
      letterContent += `I have no evidence of your claim, of its factual report-ability, nor of its physically documented and else wise demonstrated verifiable proof of validity and certifiable compliance especially in accordance to the mandatory perfect and unabridged Metro 2 format reporting standard(s).\n\n`;
      
      letterContent += `Please Remove from reporting all unfavorable claims of and within this item here now officially challenged for documented confirmation of its certified compliance==>\n\n`;
      letterContent += `CREDITOR NAME ${accountName.toUpperCase()}\n`;
      
      if (accountNumber) {
        letterContent += `ACCOUNT- ${'xxxx'.padEnd(accountNumber.length - 4, 'x')}${accountNumber.slice(-4)}\n`;
      }
      
      letterContent += `\nDelete this unconfirmed item lacking certifiable evidence of accuracy and compliance\n`;
      letterContent += `*****************************************************************************************************\n\n`;
      
      letterContent += `The above imaged item claimed, as reported, as displayed, appears to have at least one or more deviations from the requisite adhered to standard(s) for ethical and compliant reporting of such a claim. Per CDIA, any alteration of the standard makes potential questioning of the data claimed itself as its believability is suspect.\n\n`;
      
      letterContent += `Note: Per 15 UCS 1681 all claims must meet the minimal criterion of being with a maximum possible accuracy and completion. The CDIA influenced 2011-2020 CRRG states on DNP 3-4 that "Any deviation from these standards jeopardizes the Integrity of the data". Omittance from and or inconsistencies of reporting are clues of likely divergence from at least the minimal necessity for establishing the mandatory adherence to the certifiably compliant Metro 2 formatted reporting standards so remove now or PROVE to ethically retain reportability!\n\n`;
      
      letterContent += `Sincerely,\n\n`;
      letterContent += `${consumerName}\n${consumerAddress}\n${consumerCity}, ${consumerState} ${consumerZip}`;
    } else {
      // Just replace placeholders in existing letter
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
    }
    
    // Add credit report #, tracking # if not present
    if (!letterContent.includes("Credit Report #")) {
      letterContent = letterContent.replace(bureau, `Credit Report #: ${creditReportNumber}\n\n${bureau}`);
    }
    
    if (!letterContent.includes("Personal Tracking Number") && !letterContent.includes("Tracking")) {
      letterContent = letterContent.replace("To Whom", `My Personal Tracking Number is ${trackingNumber}\n\nTo Whom`);
    }
    
    // Update enclosures section to match the requested format
    if (letterContent.includes("Enclosures:")) {
      const enclosurePattern = /Enclosures:[\s\S]*?(?=\n\n|\Z)/;
      letterContent = letterContent.replace(enclosurePattern, 
        `Enclosures:
- Proof of identification
- Proof of residence or mailing address
- Proof of social security number`
      );
    } else {
      letterContent += `\n\nEnclosures:
- Proof of identification
- Proof of residence or mailing address
- Proof of social security number`;
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
