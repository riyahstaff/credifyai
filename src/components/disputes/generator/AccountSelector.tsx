
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem, 
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { CreditReportAccount } from '@/utils/creditReport/types';

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
  testMode
}) => {
  const noAccounts = accounts.length === 0;
  
  return (
    <div className="space-y-2">
      {noAccounts ? (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-gray-500 dark:text-gray-400 text-sm">
          No accounts found in uploaded report
          {testMode && <span className="text-amber-500 ml-1">(Test Mode)</span>}
        </div>
      ) : (
        <Select 
          value={selectedAccount?.accountNumber || ''} 
          onValueChange={(value) => {
            const account = accounts.find(a => a.accountNumber === value);
            if (account) {
              onAccountSelect(account);
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select account to dispute" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) => (
              <SelectItem 
                key={account.accountNumber || account.accountName} 
                value={account.accountNumber || account.accountName}
              >
                {account.accountName} {account.accountNumber ? `(${account.accountNumber})` : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default AccountSelector;
