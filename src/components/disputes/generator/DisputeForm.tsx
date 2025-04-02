import React, { useState, useEffect } from 'react';
import { 
  CreditReportData, 
  CreditReportAccount 
} from '@/utils/creditReport/types';
import { Button } from '@/components/ui/button';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { 
  Textarea
} from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ChevronRight, FileText, AlertCircle } from 'lucide-react';
import AccountSelector from './AccountSelector';
import BureauSelector from './BureauSelector';
import DisputeTypeSelector from './DisputeTypeSelector';

interface DisputeFormProps {
  reportData: CreditReportData | null;
  selectedAccount: CreditReportAccount | null;
  selectedTemplate: any;
  onGenerate: (disputeData: any) => void;
  testMode?: boolean;
}

const formSchema = z.object({
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  bureau: z.string().min(1, 'Please select a credit bureau'),
  errorType: z.string().min(1, 'Please select an error type'),
  explanation: z.string().min(5, 'Please provide a brief explanation').max(500, 'Explanation too long')
});

const DisputeForm: React.FC<DisputeFormProps> = ({
  reportData,
  selectedAccount,
  selectedTemplate,
  onGenerate,
  testMode = false
}) => {
  const [accounts, setAccounts] = useState<CreditReportAccount[]>([]);
  
  useEffect(() => {
    if (reportData && reportData.accounts && reportData.accounts.length > 0) {
      setAccounts(reportData.accounts);
      console.log("Loaded accounts from report data:", reportData.accounts);
      
      // Store report data in session storage for letter generation
      try {
        sessionStorage.setItem('creditReportData', JSON.stringify(reportData));
        console.log("Stored credit report data in session storage for letter generation");
      } catch (error) {
        console.error("Error storing credit report data:", error);
      }
    }
  }, [reportData]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountName: selectedAccount?.accountName || '',
      accountNumber: selectedAccount?.accountNumber || '',
      bureau: selectedAccount?.bureau || 'Experian',
      errorType: 'Late Payment Dispute',
      explanation: 'This information appears inaccurate on my credit report and should be removed or corrected.'
    }
  });
  
  useEffect(() => {
    if (selectedAccount) {
      console.log("Selected account changed, updating form:", selectedAccount);
      form.setValue('accountName', selectedAccount.accountName || '');
      form.setValue('accountNumber', selectedAccount.accountNumber || '');
      form.setValue('bureau', selectedAccount.bureau || 'Experian');
    }
  }, [selectedAccount, form]);
  
  useEffect(() => {
    if (selectedTemplate) {
      form.setValue('errorType', selectedTemplate.name || 'Late Payment Dispute');
    }
  }, [selectedTemplate, form]);
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Submitting form with values:", values);
    console.log("Selected account data:", selectedAccount);
    
    let formattedAccountNumber = selectedAccount?.accountNumber || values.accountNumber || '';
    if (formattedAccountNumber) {
      if (!formattedAccountNumber.includes('xx-xxxx-')) {
        formattedAccountNumber = formattedAccountNumber.length > 4
          ? `xx-xxxx-${formattedAccountNumber.slice(-4)}`
          : `xx-xxxx-${formattedAccountNumber}`;
      }
    }
    
    const formattedAccountName = (selectedAccount?.accountName || values.accountName || 'Unknown Account').toUpperCase();
    
    const disputeData = {
      ...values,
      accountName: formattedAccountName,
      accountNumber: formattedAccountNumber || "xx-xxxx-1000",
      
      actualAccountInfo: selectedAccount ? {
        ...selectedAccount,
        name: formattedAccountName,
        number: formattedAccountNumber,
        balance: selectedAccount.currentBalance || selectedAccount.balance,
        openDate: selectedAccount.dateOpened || selectedAccount.openDate,
        reportedDate: selectedAccount.dateReported || selectedAccount.lastReportedDate,
        status: selectedAccount.paymentStatus
      } : null,
      
      allAccounts: reportData?.accounts || [],
      
      reportDataId: reportData?.id || null,
      
      personalInfo: reportData?.personalInfo || null
    };
    
    console.log("Generating dispute with data:", disputeData);
    
    onGenerate(disputeData);
  };
  
  const accountCount = accounts.length;
  const noAccounts = accountCount === 0;
  const hasPersonalInfo = reportData?.personalInfo && Object.keys(reportData.personalInfo).length > 0;
  
  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="text-credify-teal" size={20} />
          <h3 className="text-lg font-semibold text-credify-navy dark:text-white">
            Generate Dispute Letter
            {testMode && <span className="ml-2 text-xs text-amber-500">(Test Mode)</span>}
          </h3>
        </div>
        
        {!reportData && (
          <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 p-4 rounded-lg mb-6 flex items-start gap-3">
            <AlertCircle className="text-amber-500 mt-0.5" size={18} />
            <div>
              <p className="font-medium">No credit report uploaded</p>
              <p className="text-sm">Upload a credit report first to automatically extract account information.</p>
            </div>
          </div>
        )}
        
        {reportData && noAccounts && (
          <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 p-4 rounded-lg mb-6 flex items-start gap-3">
            <AlertCircle className="text-amber-500 mt-0.5" size={18} />
            <div>
              <p className="font-medium">No accounts found in your report</p>
              <p className="text-sm">Your credit report was processed but no accounts were detected.</p>
            </div>
          </div>
        )}
        
        {reportData && !hasPersonalInfo && (
          <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 p-4 rounded-lg mb-6 flex items-start gap-3">
            <AlertCircle className="text-amber-500 mt-0.5" size={18} />
            <div>
              <p className="font-medium">Personal information missing</p>
              <p className="text-sm">Your personal information could not be extracted from the report.</p>
            </div>
          </div>
        )}
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6">
            <div>
              <FormLabel className="text-credify-navy dark:text-white text-sm font-semibold">
                Account Information
              </FormLabel>
              <FormDescription className="text-credify-navy-light dark:text-white/60 text-xs">
                Select the account you want to dispute
              </FormDescription>
            </div>
            
            <AccountSelector
              accounts={accounts}
              selectedAccount={selectedAccount}
              onAccountSelect={(account) => {
                console.log("Account selected:", account);
                form.setValue('accountName', account.accountName || '');
                form.setValue('accountNumber', account.accountNumber || '');
                form.setValue('bureau', account.bureau || 'Experian');
              }}
              testMode={testMode}
            />
          </div>
          
          <FormField
            control={form.control}
            name="bureau"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-credify-navy dark:text-white text-sm font-semibold">
                  Credit Bureau
                </FormLabel>
                <FormDescription className="text-credify-navy-light dark:text-white/60 text-xs">
                  Select which credit bureau you want to send this dispute to
                </FormDescription>
                
                <BureauSelector value={field.value} onChange={field.onChange} />
                
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="errorType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-credify-navy dark:text-white text-sm font-semibold">
                  Dispute Type
                </FormLabel>
                <FormDescription className="text-credify-navy-light dark:text-white/60 text-xs">
                  Select the type of error you want to dispute
                </FormDescription>
                
                <DisputeTypeSelector value={field.value} onChange={field.onChange} />
                
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="explanation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-credify-navy dark:text-white text-sm font-semibold">
                  Explanation
                </FormLabel>
                <FormDescription className="text-credify-navy-light dark:text-white/60 text-xs">
                  Provide a brief explanation of why this information is incorrect
                </FormDescription>
                
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Briefly explain why this information should be corrected..." 
                    rows={4} 
                    className="resize-none" 
                  />
                </FormControl>
                
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit"
            className="w-full bg-credify-teal hover:bg-credify-teal-dark text-white"
          >
            <span>Generate Dispute Letter</span>
            <ChevronRight size={16} className="ml-2" />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default DisputeForm;
