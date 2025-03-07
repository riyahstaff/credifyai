
/**
 * Credit Report Dispute Letter Generator
 * Generates properly formatted dispute letters based on credit report issues
 */
import { CreditReportAccount } from '../types';
import { determineBureau, getBureauAddress } from '@/components/disputes/uploader/utils/bureauUtils';

/**
 * Generate a properly formatted dispute letter based on identified issues
 * @param dispute The dispute information
 * @param userInfo The user's personal information
 */
export const generateDisputeLetterForDiscrepancy = async (
  dispute: any,
  userInfo: {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  }
): Promise<string> => {
  try {
    // Get bureau info
    const bureau = dispute.bureau || 'TransUnion';
    const bureauAddress = getBureauAddress(bureau);
    
    // Get account info
    const accountName = dispute.accountName || 'Multiple Accounts';
    const accountNumber = dispute.accountNumber || 'Unknown';
    
    // Format date using standard convention
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Generate a credit report number
    const creditReportNumber = 'CR' + Math.floor(Math.random() * 10000000);
    
    // Ensure we have the user's information or placeholders
    const name = userInfo.name || '[YOUR NAME]';
    const address = userInfo.address || '[YOUR ADDRESS]';
    const city = userInfo.city || '[CITY]';
    const state = userInfo.state || '[STATE]';
    const zip = userInfo.zip || '[ZIP]';
    
    // Create the properly formatted letter header
    let letterContent = `Credit Report #: ${creditReportNumber}\nToday's Date is: ${currentDate}\n\n`;
    letterContent += `${bureau}\n${bureauAddress}\n\n`;
    letterContent += `Re: Dispute of Inaccurate Credit Information - Account: ${accountName}\n\n`;
    letterContent += `To Whom It May Concern:\n\n`;
    
    // Add dispute details
    letterContent += `I am writing to dispute the following information in my credit report. The item I wish to dispute is:\n\n`;
    letterContent += `Account: ${accountName}\n`;
    
    if (accountNumber && accountNumber !== 'Unknown') {
      letterContent += `Account Number: ${'xxxx'.padEnd(accountNumber.length - 4, 'x')}${accountNumber.slice(-4)}\n`;
    }
    
    letterContent += `\nReason for Dispute: ${dispute.reason || dispute.errorType || 'Inaccurate Information'}\n\n`;
    letterContent += `${dispute.description || dispute.explanation || 'This information is inaccurate or incomplete and should be investigated or removed.'}\n\n`;
    
    // Add FCRA language
    letterContent += `Under the Fair Credit Reporting Act (FCRA), Section 611, you are required to conduct a reasonable investigation into this matter within 30 days of receiving this dispute. You must verify the accuracy of the information with the original source or remove the disputed item. Additionally, Section 605 limits how long negative information can be reported.\n\n`;
    
    // Add specific language for different types of disputes
    if (dispute.reason && dispute.reason.toLowerCase().includes('inquiry')) {
      letterContent += `I did not authorize this inquiry on my credit report. According to FCRA Section 604, inquiries can only be made with permissible purpose and consumer authorization. Please provide proof of my authorization or remove this inquiry immediately.\n\n`;
    } else if (dispute.reason && dispute.reason.toLowerCase().includes('payment')) {
      letterContent += `The payment information for this account is inaccurate. Per FCRA Section 623(a)(3), furnishers must investigate and correct any inaccurate payment information. The reported late payment information does not match my records and is damaging to my credit profile.\n\n`;
    } else if (dispute.reason && dispute.reason.toLowerCase().includes('balance')) {
      letterContent += `The balance information for this account is incorrect. Per FCRA Section 623(a)(2), credit reporting agencies and furnishers must ensure the completeness and accuracy of reported account balances. My records indicate a different balance.\n\n`;
    }
    
    // Add Metro 2 compliance language
    letterContent += `Additionally, I request verification that all information is being reported in accordance with Metro 2 reporting standards. The CDIA (Consumer Data Industry Association) requires all credit reporting to follow these standards, and "any deviations from these standards jeopardizes data integrity" (CRRG 3-4).\n\n`;
    
    // Request verification documentation
    letterContent += `Please provide me with copies of any documentation associated with this disputed account, including written verification and validation of:\n`;
    letterContent += `- The complete account history and payment records\n`;
    letterContent += `- Verification of all account details including opening date, balance, and payment history\n`;
    letterContent += `- Confirmation that the reporting meets all Metro 2 compliance standards\n\n`;
    
    // Legal requirements
    letterContent += `Upon completion of your investigation, please send me an updated copy of my credit report showing that the disputed item has been corrected or removed. According to FCRA Section 611(a)(6) and 612, there should be no charge for this report.\n\n`;
    letterContent += `I also request that you send notices of corrections to anyone who received my credit report in the past six months.\n\n`;
    
    // Closing statement
    letterContent += `Sincerely,\n\n`;
    letterContent += `${name}\n${address}\n${city}, ${state} ${zip}\n\n`;
    
    // Add enclosures section
    letterContent += `Enclosures:\n`;
    letterContent += `- Copy of identification\n`;
    letterContent += `- Copy of credit report with disputed items highlighted\n`;
    letterContent += `- Supporting documentation\n`;
    
    return letterContent;
  } catch (error) {
    console.error("Error generating dispute letter:", error);
    throw error;
  }
};

/**
 * Generate a more advanced dispute letter with specific legal language
 * based on the sample letters provided
 */
export const generateAdvancedDisputeLetter = async (
  dispute: any,
  userInfo: {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  }
): Promise<string> => {
  try {
    // Get bureau info
    const bureau = dispute.bureau || 'TransUnion';
    const bureauAddress = getBureauAddress(bureau);
    
    // Get account info
    const accountName = dispute.accountName || 'Multiple Accounts';
    const accountNumber = dispute.accountNumber || 'Unknown';
    
    // Format date using more specific format to match sample letters
    const today = new Date();
    const formattedDate = `${today.toLocaleDateString('en-US', {
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    })}`;
    const numericDate = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}/${today.getFullYear()}`;
    
    // Generate a unique credit report/tracking number
    const creditReportNumber = 'CR' + Math.floor(Math.random() * 10000000);
    const trackingNumber = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
    
    // Personal info with proper formatting
    const name = userInfo.name || '[YOUR NAME]';
    const address = userInfo.address || '[YOUR ADDRESS]';
    const city = userInfo.city || '[CITY]';
    const state = userInfo.state || '[STATE]';
    const zip = userInfo.zip || '[ZIP]';
    
    // Create the properly formatted letter header matching sample format
    let letterContent = `Today's Date is: ${formattedDate} ${numericDate}\n\n`;
    letterContent += `${bureau}\n${bureauAddress}\n\n`;
    letterContent += `My First and Last Name is and ONLY is ${name}\n`;
    letterContent += `My Address Street Number, Street Name, City, and State is and only is ${address} ${city} ${state} ${zip}\n\n`;
    letterContent += `My Personal Tracking Number is ${trackingNumber}\n\n`;
    
    // Advanced letter format with detailed legal language
    letterContent += `RE: declaration of currently described injurious claim(s) unproven yet to be veritably and physically validated unfeigned, correct, unabbreviated, timely, and certifiably metro 2 format compliant! These claims are requested check for requisites and immediately removed from reporting so to ensure lawful compliant reporting of ONLY descriptively and correctly accurate correct integral timely validated and certified allegations!\n\n`;
    letterContent += `To Whom it Concerns,\n\n`;
    letterContent += `I have no evidence of your claim, of its factual report-ability, nor of its physically documented and else wise demonstrated verifiable proof of validity and certifiable compliance especially in accordance to the mandatory perfect and unabridged Metro 2 format reporting standard(s). Since I am uncertain as to WHY I would have this ${dispute.reason || 'report'} from you, therefore I am requesting an ITEMIZED verification for the services.\n\n`;
    
    // Add specific disputed items section
    letterContent += `Please Remove from reporting all unfavorable claims of and within this item here now officially challenged for documented confirmation of its certified compliance==>\n\n`;
    letterContent += `CREDITOR NAME ${accountName}\n`;
    
    if (accountNumber && accountNumber !== 'Unknown') {
      letterContent += `ACCOUNT NUMBER ${'xxxx'.padEnd(accountNumber.length - 4, 'x')}${accountNumber.slice(-4)}\n`;
    }
    
    letterContent += `\nDelete this unconfirmed item lacking certifiable evidence of accuracy and compliance\n`;
    letterContent += `*****************************************************************************************************\n\n`;
    
    // Add Metro 2 compliance section from sample
    letterContent += `Please utilize the following KEY to explain markings on the images of below-shown items being contested:\n`;
    letterContent += `* means REQUIRED ALWAYS ^ Required If Applies ~Industry-Specific Required\n`;
    letterContent += `BSCF Base Segment Character Format HRCF Header Record... J1S J1 Segment J2S J2 Segment\n`;
    letterContent += `K1S K1 Segment K2S K2 Segment K3S K3 Segment K4S K4 Segment L1S L1 Segment N1S N1 Segment\n`;
    letterContent += `TRCF Trailer Record... HRPF Header Record Packed Format BSPF Base Segment Packed Format\n`;
    letterContent += `TRPF Trailer Record Packed Format D1 Data Furnisher #1 DF2 Data Furnisher #2\n`;
    letterContent += `T TransUnion ^NTCU^ essentially stands for Not Metro2/ Translated within Cra/and or is Unknown\n`;
    letterContent += `F Equifax X Experian M Missing but Required Reported E Potential Error I Inconsistent\n`;
    letterContent += `N Not Available or Deceptive Q Questionable-conditioned ? Questionable Mathematically\n`;
    letterContent += `D Deviant from standards U Unconfirmed or Uncertified Compliant – Attack + Do Not Attack\n`;
    letterContent += `mx Mixed mr Merged CRRG Credit Reporting Resource Guide FCRA Fair Credit Reporting Act\n`;
    letterContent += `*****************************************************************************************************\n\n`;
    
    // Detailed account dispute section
    letterContent += `The following allegation appears as a potential deviation of compliant reporting and or is questionable in its factual reporting, so please certify the confirmed compliant reporting of each aspect of this following claim that is proven to be undeniably true, physically verified as fully accurate, is adequately complete and timely as reported, and is else wise confirmed to comply with all requirements of regulatory reporting to include the mandatory adherence to the perfect and complete Metro 2 formatted compliant reporting or DELETE IMMEDIATELY:\n\n`;
    letterContent += `${accountName} ${accountNumber ? 'xxxx' + accountNumber.slice(-4) : 'xxxxx****'} ${accountNumber ? 'xxxx' + accountNumber.slice(-4) : 'xxxxx****'} ${accountNumber ? 'xxxx' + accountNumber.slice(-4) : 'xxxxx****'}\n`;
    letterContent += `*HRCF12 ${accountName} ${accountNumber ? 'xxxx' + accountNumber.slice(-4) : 'xxxxx****'} is an unconfirmed reported alleged ${dispute.reason || 'item'}\n\n`;
    letterContent += `The above imaged item claimed, as reported, as displayed, appears to have at least one or more deviations from the requisite adhered to standard(s) for ethical and compliant reporting of such a claim. Per CDIA, any alteration of the standard makes potential questioning of the data claimed itself as its believability is suspect. Below noted is(are) indications suspected to be evidence of potential reporting deviations from the required certifiably compliant Metro 2 format Standard(s):\n\n`;
    letterContent += `undefined appears potentially deviant of the requisite lawful and ethical reporting standards and therefore the claim's integrity is jeopardized per CRRG 3-4\n\n`;
    letterContent += `Note: Per 15 UCS 1681 all claims must meet the minimal criterion of being with a maximum possible accuracy and completion. The CDIA influenced 2011-2020 CRRG states on DNP 3-4 that "Any deviation from these standards jeopardizes the Integrity of the data". Omittance from and or inconsistencies of reporting are clues of likely divergence from at least the minimal necessity for establishing the mandatory adherence to the certifiably compliant Metro 2 formatted reporting standards so remove now or PROVE to ethically retain reportability!\n`;
    letterContent += `*****************************************************************************************************\n\n`;
    
    // Legal requirements and closing
    letterContent += `In clarity, per federal and my state's regulatory reporting and collection guidelines your FIRM is compelled by TORT law precedent to provide this facts or face a lawsuit: Haddad v. Alexander, Zelmanski, Danner & Fioritto, PLLC, --- F. 3d --- (6th Cir. 2014), 2014 WL 3440174 (6th Cir. Mich. 2014). Please supply the following data in intact detail:\n\n`;
    letterContent += `>Why you think I owe the debt, and to whom I owe it, including:\n`;
    letterContent += `--------------->The name and address of the creditor to whom the debt is currently owed, the account number used by that creditor, and the amount owed.\n`;
    letterContent += `>Provide verification and documentation that there is a valid basis for claiming that I am required to pay the debt to the current creditor.\n\n`;
    
    // Final signature section
    letterContent += `Sincerely:\n\n`;
    letterContent += `My First and Last Name is and ONLY is ${name}\n`;
    letterContent += `My Address Street Number, Street Name, City, and State is and only is ${address} ${city} ${state} ${zip}`;
    
    return letterContent;
  } catch (error) {
    console.error("Error generating advanced dispute letter:", error);
    throw error;
  }
};

// Export both letter generators
export default {
  generateDisputeLetterForDiscrepancy,
  generateAdvancedDisputeLetter
};
