
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CreditReportData, CreditReportAccount } from '@/utils/creditReport/types';
import { parseReportContent } from '@/utils/creditReport/parser/parseReportContent';
import { extractTextFromPDF } from '@/utils/creditReport/extractors/pdfExtractor';
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
    setUploadedFile(file);
    await processFile(file);
  };
  
  const processFile = async (file: File) => {
    setIsUploading(true);
    
    try {
      // Extract text from the file
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      let textContent = '';
      
      if (isPdf) {
        textContent = await extractTextFromPDF(file);
      } else {
        textContent = await file.text();
      }
      
      // Parse the text content
      const data = await parseReportContent(textContent, isPdf);
      
      setReportData(data);
      onReportProcessed(data);
      
      toast({
        title: testMode ? "Test Credit Report Processed" : "Credit Report Processed",
        description: `Successfully analyzed credit report with ${data.accounts.length} accounts${testMode ? ' in test mode' : ''}.`,
      });
    } catch (error) {
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
    onAccountSelected(account);
    
    toast({
      title: testMode ? "Test Account Selected" : "Account Selected",
      description: `Selected ${account.accountName} for dispute${testMode ? ' in test mode' : ''}.`,
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
    account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (account.accountType && account.accountType.toLowerCase().includes(searchTerm.toLowerCase()))
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
            accounts={reportData.accounts}
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
