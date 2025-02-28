
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  Search, 
  ChevronDown, 
  ChevronUp,
  CreditCard
} from 'lucide-react';
import { processCreditReport, CreditReportData, CreditReportAccount } from '@/utils/creditReportParser';
import FileUploader from './uploader/FileUploader';
import FilePreview from './uploader/FilePreview';
import AccountCard from './uploader/AccountCard';
import { formatFileSize } from '@/utils/fileUtils';

interface CreditReportUploaderProps {
  onReportProcessed: (reportData: CreditReportData) => void;
  onAccountSelected: (account: CreditReportAccount) => void;
}

const CreditReportUploader: React.FC<CreditReportUploaderProps> = ({ 
  onReportProcessed,
  onAccountSelected
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
      const data = await processCreditReport(file);
      setReportData(data);
      onReportProcessed(data);
      
      toast({
        title: "Credit report processed",
        description: `Successfully analyzed credit report with ${data.accounts.length} accounts.`,
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
      title: "Account selected",
      description: `Selected ${account.accountName} for dispute.`,
    });
  };
  
  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  
  const filteredAccounts = reportData?.accounts.filter(account => 
    account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (account.accountType && account.accountType.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];
  
  return (
    <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/30 p-5">
      <h3 className="text-lg font-semibold text-credify-navy dark:text-white mb-4">
        Upload Credit Report
      </h3>
      
      {!reportData ? (
        <div className="border-2 border-dashed border-gray-200 dark:border-gray-700/50 rounded-lg p-6 text-center">
          <div className="w-16 h-16 mx-auto bg-credify-teal/10 rounded-full flex items-center justify-center mb-4">
            <Upload className="text-credify-teal" size={24} />
          </div>
          
          <h4 className="text-lg font-medium text-credify-navy dark:text-white mb-2">
            Upload Your Credit Report
          </h4>
          
          <p className="text-credify-navy-light dark:text-white/70 text-sm mb-6 max-w-md mx-auto">
            Upload a credit report PDF or text file to analyze and generate personalized dispute letters.
          </p>
          
          <div className="relative inline-block">
            <input
              type="file"
              accept=".pdf,.txt,.text"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileSelected(e.target.files[0]);
                }
              }}
              className="absolute inset-0 opacity-0 w-full cursor-pointer"
              disabled={isUploading}
            />
            <button
              disabled={isUploading}
              className="px-6 py-3 bg-credify-teal hover:bg-credify-teal-dark text-white rounded-lg transition-colors flex items-center gap-2 justify-center"
            >
              {isUploading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/70 border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Upload size={18} />
                  <span>Select Report File</span>
                </>
              )}
            </button>
          </div>
          
          <p className="mt-4 text-xs text-credify-navy-light dark:text-white/60">
            Supports PDF and text files from Experian, Equifax, and TransUnion
          </p>
        </div>
      ) : (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                <ChevronUp size={16} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-medium text-credify-navy dark:text-white">
                  Credit Report Analyzed
                </h4>
                <p className="text-xs text-credify-navy-light dark:text-white/70">
                  {reportData.accounts.length} accounts found
                </p>
              </div>
            </div>
            
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search accounts..."
                className="pl-9 pr-3 py-2 bg-white dark:bg-credify-navy/40 border border-gray-200 dark:border-gray-700/50 rounded-lg w-full text-sm"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => toggleSection('accounts')}
              >
                <h3 className="font-medium text-credify-navy dark:text-white flex items-center">
                  <CreditCard size={16} className="mr-1.5" />
                  <span>Accounts to Dispute</span>
                </h3>
                <button className="ml-2 p-1 rounded-full">
                  {expandedSections.accounts ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
              <span className="text-xs text-credify-navy-light dark:text-white/70 bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 rounded-full">
                {reportData.accounts.length} Accounts
              </span>
            </div>
            
            {expandedSections.accounts && (
              <div className="space-y-2 mt-2">
                {filteredAccounts.length === 0 ? (
                  <div className="text-center py-4 text-credify-navy-light dark:text-white/70 text-sm">
                    No accounts match your search.
                  </div>
                ) : (
                  filteredAccounts.map((account, index) => (
                    <AccountCard 
                      key={index}
                      account={account}
                      onClick={() => handleSelectAccount(account)}
                    />
                  ))
                )}
              </div>
            )}
          </div>
          
          <div>
            <button
              onClick={() => {
                setReportData(null);
                setSearchTerm('');
              }}
              className="text-sm flex items-center gap-1.5 text-credify-navy-light dark:text-white/70 hover:text-credify-teal transition-colors"
            >
              <Upload size={14} />
              <span>Upload a different report</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditReportUploader;
