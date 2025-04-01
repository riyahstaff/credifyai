
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem, 
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface BureauSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const BureauSelector: React.FC<BureauSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select credit bureau" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Experian">Experian</SelectItem>
        <SelectItem value="TransUnion">TransUnion</SelectItem>
        <SelectItem value="Equifax">Equifax</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default BureauSelector;
