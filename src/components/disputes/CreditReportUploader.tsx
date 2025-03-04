
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { processCreditReport, CreditReportData, CreditReportAccount } from '@/utils/creditReportParser';
import { formatFileSize } from '@/utils/fileUtils';

// Import new component files
import ReportUploadSection from './uploader/ReportUploadSection';
import ReportHeader from './uploader/ReportHeader';
import AccountsSection from './uploader/AccountsSection';
import UploadAgainButton from './uploader/UploadAgainButton';

interface CreditReportUploaderProps {
  onReportProcessed: (reportData: CreditReportData) => void;
  onAccountSelected: (account: CreditReportAccount) => void;
  testMode?: boolean;
}

const CreditReportUploader: React.FC<CreditReportUploaderProps> = ({ 
  onReportProcessed,
  onAccountSelected,
  testMode
}) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [reportData, setReportData] = useState<CreditReportData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    accounts: true,
    inquiries: false,
    publicRecords: false
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const handleFileSelected = async (file: File) => {
    if (!file) {
      console.error("No file selected");
      return;
    }
    
    setUploadedFile(file);
    console.log("File selected:", file.name, file.size);
    await processFile(file);
  };
  
  const processFile = async (file: File) => {
    setIsUploading(true);
    
    try {
      console.log("Processing file:", file.name);
      // Pass the file directly to processCreditReport which now accepts File objects
      const data = await processCreditReport(file);
      console.log("Credit report processed successfully:", data);
      
      if (!data || !data.accounts || !Array.isArray(data.accounts)) {
        throw new Error("Invalid report data structure");
      }
      
      setReportData(data);
      onReportProcessed(data);
      
      toast({
        title: testMode ? "Test Credit Report Processed" : "Credit Report Processed",
        description: `Successfully analyzed credit report with ${data.accounts.length} accounts${testMode ? ' in test mode' : ''}.`,
      });
    } catch (error) {
      console.error("Error processing credit report:", error);
      toast({
        title: "Error processing report",
        description: error instanceof Error ? error.message : "Failed to process credit report.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleSelectAccount = (account: CreditReportAccount) => {
    if (!account) {
      console.error("Attempting to select undefined account");
      return;
    }
    
    console.log("Account selected for dispute:", account);
    onAccountSelected(account);
    
    toast({
      title: testMode ? "Test Account Selected" : "Account Selected",
      description: `Selected ${account.accountName || 'Unknown Account'} for dispute${testMode ? ' in test mode' : ''}.`,
    });
  };
  
  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };
  
  const filteredAccounts = reportData?.accounts.filter(account => 
    (account.accountName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    ((account.accountType || "").toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];
  
  const resetReport = () => {
    setReportData(null);
    setSearchTerm('');
  };
  
  return (
    <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/30 p-5">
      <h3 className="text-lg font-semibold text-credify-navy dark:text-white mb-4">
        Upload Credit Report
        {testMode && <span className="text-amber-500 text-sm ml-2">(Test Mode)</span>}
      </h3>
      
      {!reportData ? (
        <ReportUploadSection 
          isUploading={isUploading}
          onFileSelected={handleFileSelected}
        />
      ) : (
        <div>
          <ReportHeader 
            accountCount={reportData.accounts.length}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
          
          <AccountsSection 
            accounts={filteredAccounts}
            isExpanded={expandedSections.accounts}
            filteredAccounts={filteredAccounts}
            onToggleSection={() => toggleSection('accounts')}
            onSelectAccount={handleSelectAccount}
          />
          
          <UploadAgainButton onClick={resetReport} />
        </div>
      )}
    </div>
  );
};

export default CreditReportUploader;
