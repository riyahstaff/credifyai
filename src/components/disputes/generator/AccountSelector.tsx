
import React from 'react';
import { CreditReportAccount } from '@/utils/creditReport/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface AccountSelectorProps {
  accounts: CreditReportAccount[];
  selectedAccount: CreditReportAccount | null;
  onAccountSelect: (account: CreditReportAccount) => void;
  testMode?: boolean;
}

const AccountSelector: React.FC<AccountSelectorProps> = ({
  accounts,
  selectedAccount,
  onAccountSelect,
  testMode = false
}) => {
  const hasAccounts = accounts && accounts.length > 0;

  if (!hasAccounts) {
    return (
      <Card className="border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800/30">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium text-amber-800 dark:text-amber-300">
            <AlertCircle className="mr-2 h-4 w-4" />
            No Accounts Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-xs text-amber-700 dark:text-amber-400">
            {testMode 
              ? "No accounts found in test data. Upload a report or enable test mode with sample data."
              : "No accounts were found in your credit report. Please upload a valid credit report."}
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="border rounded-md">
      <ScrollArea className="h-[200px] rounded-md border">
        <div className="p-4 grid gap-2">
          {accounts.map((account, index) => (
            <div
              key={`${account.accountName}-${index}`}
              className={`
                p-3 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800
                ${selectedAccount?.accountNumber === account.accountNumber ? 'bg-credify-teal/10 border border-credify-teal/30' : 'border border-gray-200 dark:border-gray-700'}
              `}
              onClick={() => onAccountSelect(account)}
            >
              <div className="font-medium text-sm">{account.accountName || 'Unknown Account'}</div>
              
              <div className="flex items-center justify-between mt-1">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {account.accountNumber ? `#${account.accountNumber}` : 'No account number'}
                </div>
                
                <div className="text-xs">
                  {account.currentBalance || account.balance ? 
                    `$${account.currentBalance || account.balance}` : 
                    'No balance'
                  }
                </div>
              </div>
              
              {account.paymentStatus && (
                <div className={`text-xs mt-1 ${account.isNegative ? 'text-red-500' : 'text-green-600'}`}>
                  {account.paymentStatus}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AccountSelector;
