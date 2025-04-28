
import React from 'react';
import { useLocation } from 'react-router-dom';
import { CreditReportAccount } from '@/utils/creditReport/types';
import CreditReportUploader from './CreditReportUploader';
import DisputeForm from './generator/DisputeForm';
import DisputeResult from './generator/DisputeResult';
import DisputeGeneratorLayout from './generator/DisputeGeneratorLayout';
import { useDisputeGeneratorState } from './generator/useDisputeGeneratorState';
import { useLetterDownload } from './generator/useLetterDownload';

interface DisputeGeneratorProps {
  onGenerateDispute: (disputeData: any) => void;
}

const DisputeGenerator: React.FC<DisputeGeneratorProps> = ({ onGenerateDispute }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const testMode = searchParams.get('testMode') === 'true';
  
  const {
    reportData,
    selectedAccount,
    selectedTemplate,
    selectedBureau,
    generatedLetter,
    handleReportProcessed,
    handleAccountSelected,
    handleTemplateSelected,
    handleDisputeGenerated,
    handleLetterReset
  } = useDisputeGeneratorState();
  
  const { downloadLetter } = useLetterDownload();
  
  const handleDownload = () => {
    if (selectedAccount && selectedBureau) {
      downloadLetter(
        generatedLetter, 
        selectedBureau, 
        selectedAccount.accountName,
        selectedAccount.accountNumber
      );
    } else {
      console.error("Cannot download letter - missing account or bureau information");
      alert("Cannot download letter - missing account or bureau information from credit report");
    }
  };
  
  const handleFormSubmit = (disputeData: any) => {
    // Do not proceed if we're missing critical information
    if (!selectedBureau) {
      console.error("Cannot generate letter - bureau information missing");
      alert("Cannot generate letter - bureau information missing from credit report");
      return;
    }
    
    // Ensure the letter contains the actual account information
    if (selectedAccount) {
      disputeData.accountName = selectedAccount.accountName;
      disputeData.accountNumber = selectedAccount.accountNumber || "";
      
      // Add actual account details to ensure they're included in the letter
      disputeData.actualAccountInfo = {
        name: selectedAccount.accountName,
        number: selectedAccount.accountNumber,
        balance: selectedAccount.currentBalance || selectedAccount.balance,
        openDate: selectedAccount.dateOpened || selectedAccount.openDate,
        reportedDate: selectedAccount.dateReported || selectedAccount.lastReportedDate,
        status: selectedAccount.paymentStatus
      };
    }
    
    // Add all accounts from the credit report
    if (reportData && reportData.accounts && reportData.accounts.length > 0) {
      disputeData.allAccounts = reportData.accounts;
    }
    
    // Add inquiries from the credit report
    if (reportData && reportData.inquiries && reportData.inquiries.length > 0) {
      disputeData.inquiries = reportData.inquiries;
    }
    
    // Add personal info from report
    if (reportData && reportData.personalInfo) {
      disputeData.personalInfo = reportData.personalInfo;
    }
    
    handleDisputeGenerated(disputeData);
    onGenerateDispute(disputeData);
  };
  
  const mainContent = !generatedLetter ? (
    <DisputeForm 
      reportData={reportData}
      selectedAccount={selectedAccount}
      selectedTemplate={selectedTemplate}
      onGenerate={handleFormSubmit}
      testMode={testMode}
    />
  ) : (
    <DisputeResult
      letterContent={generatedLetter}
      selectedAccount={selectedAccount}
      selectedBureau={selectedBureau || ""}
      onReset={handleLetterReset}
      onDownload={handleDownload}
      testMode={testMode}
    />
  );
  
  const sidebarContent = (
    <>
      <CreditReportUploader 
        onReportProcessed={handleReportProcessed}
        onAccountSelected={handleAccountSelected}
        testMode={testMode}
      />
    </>
  );
  
  return (
    <DisputeGeneratorLayout
      leftContent={mainContent}
      rightContent={sidebarContent}
      testMode={testMode}
    />
  );
};

export default DisputeGenerator;
