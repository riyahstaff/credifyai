
import React from 'react';
import { useLocation } from 'react-router-dom';
import { CreditReportAccount } from '@/utils/creditReport/types';
import CreditReportUploader from './CreditReportUploader';
import LetterTemplateManager from './LetterTemplateManager';
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
  } = useDisputeGeneratorState(testMode);
  
  const { downloadLetter } = useLetterDownload();
  
  const handleDownload = () => {
    if (selectedAccount && selectedBureau) {
      downloadLetter(
        generatedLetter, 
        selectedBureau, 
        selectedAccount.accountName,
        selectedAccount.accountNumber
      );
    }
  };
  
  const handleFormSubmit = (disputeData: any) => {
    // Ensure the letter contains the actual account information
    if (selectedAccount) {
      disputeData.accountName = selectedAccount.accountName;
      disputeData.accountNumber = selectedAccount.accountNumber || "Unknown";
      
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
    
    handleDisputeGenerated(disputeData);
    onGenerateDispute(disputeData);
  };
  
  // Render form or result based on whether a letter has been generated
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
  
  // Sidebar components
  const sidebarContent = (
    <>
      <CreditReportUploader 
        onReportProcessed={handleReportProcessed}
        onAccountSelected={handleAccountSelected}
        testMode={testMode}
      />
      
      <LetterTemplateManager 
        onSelectTemplate={handleTemplateSelected}
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
