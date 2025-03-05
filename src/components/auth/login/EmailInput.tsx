
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmailInputProps {
  email: string;
  setEmail: (email: string) => void;
}

const EmailInput = ({ email, setEmail }: EmailInputProps) => {
  return (
    <div>
      <Label htmlFor="email" className="block text-sm font-medium text-credify-navy-light dark:text-white/70 mb-1">
        Email Address
      </Label>
      <Input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 bg-white dark:bg-credify-navy/40 border border-gray-200 dark:border-gray-700/50 rounded-lg focus:ring-2 focus:ring-credify-teal focus:border-transparent transition-colors"
        placeholder="Enter your email"
        required
      />
    </div>
  );
};

export default EmailInput;
