
import React from 'react';
import { CreditReportAccount } from '@/utils/creditReport';
import { CreditCard, ChevronUp, ChevronDown } from 'lucide-react';
import AccountCard from './AccountCard';

interface AccountsSectionProps {
  accounts: CreditReportAccount[];
  isExpanded: boolean;
  filteredAccounts: CreditReportAccount[];
  onToggleSection: () => void;
  onSelectAccount: (account: CreditReportAccount) => void;
}

const AccountsSection: React.FC<AccountsSectionProps> = ({
  accounts,
  isExpanded,
  filteredAccounts,
  onToggleSection,
  onSelectAccount
}) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div 
          className="flex items-center cursor-pointer"
          onClick={onToggleSection}
        >
          <h3 className="font-medium text-credify-navy dark:text-white flex items-center">
            <CreditCard size={16} className="mr-1.5" />
            <span>Accounts to Dispute</span>
          </h3>
          <button className="ml-2 p-1 rounded-full">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
        <span className="text-xs text-credify-navy-light dark:text-white/70 bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 rounded-full">
          {accounts.length} Accounts
        </span>
      </div>
      
      {isExpanded && (
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
                onClick={() => onSelectAccount(account)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AccountsSection;
