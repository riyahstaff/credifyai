
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  AlertCircle, 
  Check, 
  Building, 
  CreditCard, 
  Calendar, 
  Clock, 
  BarChart, 
  Search, 
  X, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { processCreditReport, CreditReportData, CreditReportAccount } from '@/utils/creditReportParser';

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
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
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
              onChange={handleFileUpload}
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
                <Check size={16} className="text-green-600 dark:text-green-400" />
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
                    <div
                      key={index}
                      onClick={() => handleSelectAccount(account)}
                      className="border border-gray-200 dark:border-gray-700/30 rounded-lg p-3 hover:border-credify-teal dark:hover:border-credify-teal/70 cursor-pointer transition-all"
                    >
                      <div className="flex justify-between">
                        <div>
                          <h5 className="font-medium text-credify-navy dark:text-white">
                            {account.accountName}
                          </h5>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {account.accountNumber && (
                              <span className="text-xs text-credify-navy-light dark:text-white/70">
                                #{account.accountNumber}
                              </span>
                            )}
                            {account.accountType && (
                              <span className="text-xs text-credify-navy-light dark:text-white/70 flex items-center">
                                <Building size={12} className="mr-1" />
                                {account.accountType}
                              </span>
                            )}
                            {account.dateOpened && (
                              <span className="text-xs text-credify-navy-light dark:text-white/70 flex items-center">
                                <Calendar size={12} className="mr-1" />
                                Opened: {account.dateOpened}
                              </span>
                            )}
                            {account.dateReported && (
                              <span className="text-xs text-credify-navy-light dark:text-white/70 flex items-center">
                                <Clock size={12} className="mr-1" />
                                Last reported: {account.dateReported}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {account.currentBalance && (
                            <div className="font-medium text-credify-navy dark:text-white">
                              {account.currentBalance}
                            </div>
                          )}
                          {account.paymentStatus && (
                            <div className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${
                              account.paymentStatus.includes('Late') || account.paymentStatus.includes('Delinquent')
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                : account.paymentStatus === 'Current'
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                  : 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                            }`}>
                              {account.paymentStatus}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {account.remarks && account.remarks.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700/30">
                          <div className="flex items-start gap-1 text-xs text-orange-700 dark:text-orange-400">
                            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                            <div>
                              {account.remarks.map((remark, i) => (
                                <div key={i}>{remark}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
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
