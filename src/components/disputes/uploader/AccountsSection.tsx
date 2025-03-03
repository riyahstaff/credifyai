
import React from 'react';
import { CreditReportAccount } from '@/utils/creditReportParser';
import AccountCard from './AccountCard';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
  // If no accounts found, display a message
  if (!accounts || accounts.length === 0) {
    return (
      <div className="border border-gray-200 dark:border-gray-700/30 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={onToggleSection}>
          <h4 className="font-medium text-credify-navy dark:text-white">Accounts (0)</h4>
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        
        {isExpanded && (
          <div className="mt-3 text-center py-4 text-credify-navy-light dark:text-white/70">
            No accounts found in the credit report.
            <div className="mt-2 text-sm">
              Try uploading a different report or use the manual dispute generator.
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="border border-gray-200 dark:border-gray-700/30 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center cursor-pointer" onClick={onToggleSection}>
        <h4 className="font-medium text-credify-navy dark:text-white">
          Accounts ({filteredAccounts.length}/{accounts.length})
        </h4>
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      
      {isExpanded && (
        <div className="mt-3 space-y-3">
          {filteredAccounts.length === 0 ? (
            <div className="text-center py-4 text-credify-navy-light dark:text-white/70">
              No accounts matching your search.
            </div>
          ) : (
            filteredAccounts.map((account, index) => (
              <AccountCard
                key={index}
                account={account}
                onSelect={() => onSelectAccount(account)}
              />
            ))
          )}
          
          {filteredAccounts.length > 0 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  // Generate disputes for all filtered accounts
                  filteredAccounts.forEach(account => onSelectAccount(account));
                }}
                className="px-4 py-2 bg-credify-teal text-white rounded-lg hover:bg-credify-teal/90 transition-colors"
              >
                Generate Disputes for All {filteredAccounts.length} Accounts
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountsSection;
