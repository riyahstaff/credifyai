
import React, { useState } from 'react';
import { CreditReportData } from '@/utils/creditReport/types';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import HtmlReportViewer from './HtmlReportViewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, FileCode } from 'lucide-react';

interface ReportPreviewProps {
  reportData: CreditReportData | null;
  className?: string;
  uploadedFile?: File | null;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({ 
  reportData,
  className = '',
  uploadedFile
}) => {
  const [viewType, setViewType] = useState<'html' | 'structured'>('html');
  const isPdf = uploadedFile?.type === 'application/pdf';
  
  if (!reportData) {
    return (
      <div className={`p-4 text-center ${className}`}>
        No report data available to preview.
      </div>
    );
  }
  
  return (
    <div className={`report-preview ${className}`}>
      <Tabs defaultValue="html" onValueChange={(value) => setViewType(value as 'html' | 'structured')}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Report Preview 
            {isPdf && <span className="ml-2 text-sm text-blue-500">(PDF Source)</span>}
          </h3>
          <TabsList>
            <TabsTrigger value="html" className="flex items-center gap-1">
              <FileCode size={16} />
              HTML View
            </TabsTrigger>
            <TabsTrigger value="structured" className="flex items-center gap-1">
              <FileText size={16} />
              Structured Data
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="html" className="border rounded-md p-4 bg-white">
          {reportData.rawText ? (
            <HtmlReportViewer reportText={reportData.rawText} isPdf={isPdf} />
          ) : (
            <div className="p-4 text-center text-gray-500">
              No report text available for preview.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="structured">
          <div className="space-y-6">
            {reportData.bureaus && (
              <div>
                <h4 className="font-medium mb-2">Bureaus</h4>
                <div className="flex space-x-4">
                  {Object.entries(reportData.bureaus).map(([bureau, included]) => (
                    <div key={bureau} className={`px-3 py-1 rounded-full ${included ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                      {bureau.charAt(0).toUpperCase() + bureau.slice(1)}: {included ? 'Yes' : 'No'}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {reportData.accounts && reportData.accounts.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Accounts ({reportData.accounts.length})</h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Bureau</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.accounts.slice(0, 5).map((account, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{account.accountName}</TableCell>
                          <TableCell>{account.accountType || 'N/A'}</TableCell>
                          <TableCell>{account.currentBalance || account.balance || 'N/A'}</TableCell>
                          <TableCell>{account.paymentStatus || account.status || 'N/A'}</TableCell>
                          <TableCell>{account.bureau || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {reportData.accounts.length > 5 && (
                    <div className="text-center text-sm text-gray-500 mt-2">
                      Showing 5 of {reportData.accounts.length} accounts
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {reportData.inquiries && reportData.inquiries.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Inquiries ({reportData.inquiries.length})</h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Creditor</TableHead>
                        <TableHead>Bureau</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.inquiries.slice(0, 5).map((inquiry, index) => (
                        <TableRow key={index}>
                          <TableCell>{inquiry.inquiryDate}</TableCell>
                          <TableCell>{inquiry.creditor}</TableCell>
                          <TableCell>{inquiry.bureau}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {reportData.inquiries.length > 5 && (
                    <div className="text-center text-sm text-gray-500 mt-2">
                      Showing 5 of {reportData.inquiries.length} inquiries
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportPreview;

