
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem, 
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface DisputeTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const DisputeTypeSelector: React.FC<DisputeTypeSelectorProps> = ({
  value,
  onChange
}) => {
  // Common dispute types
  const disputeTypes = [
    { value: 'Late Payment Dispute', label: 'Late Payment Dispute' },
    { value: 'Account Not Mine', label: 'Account Not Mine' },
    { value: 'Account Closed', label: 'Account Incorrectly Shown as Open' },
    { value: 'Balance Dispute', label: 'Incorrect Balance' },
    { value: 'Incorrect Information', label: 'Other Incorrect Information' },
    { value: 'Fraud Alert', label: 'Fraudulent Account' },
    { value: 'Inquiry Dispute', label: 'Unauthorized Inquiry' },
    { value: 'Paid Collection', label: 'Collection Already Paid' },
    { value: 'Mixed Credit File', label: 'Mixed Credit File' }
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select dispute type" />
      </SelectTrigger>
      <SelectContent>
        {disputeTypes.map(type => (
          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DisputeTypeSelector;
