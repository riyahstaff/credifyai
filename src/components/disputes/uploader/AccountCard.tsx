
import React from 'react';
import { Building, Calendar, Clock, AlertCircle } from 'lucide-react';
import { CreditReportAccount } from '@/utils/creditReport/types';

interface AccountCardProps {
  account: CreditReportAccount;
  onSelect: () => void;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, onSelect }) => {
  return (
    <div
      onClick={onSelect}
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
            {(account.openDate || account.dateOpened) && (
              <span className="text-xs text-credify-navy-light dark:text-white/70 flex items-center">
                <Calendar size={12} className="mr-1" />
                Opened: {account.openDate || account.dateOpened}
              </span>
            )}
            {(account.lastReportedDate || account.dateReported) && (
              <span className="text-xs text-credify-navy-light dark:text-white/70 flex items-center">
                <Clock size={12} className="mr-1" />
                Last reported: {account.lastReportedDate || account.dateReported}
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          {(account.currentBalance || account.balance) && (
            <div className="font-medium text-credify-navy dark:text-white">
              {account.currentBalance || account.balance}
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
  );
};

export default AccountCard;
