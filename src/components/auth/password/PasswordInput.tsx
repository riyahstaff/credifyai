
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';

interface PasswordInputProps {
  password: string;
  setPassword: (password: string) => void;
  showForgotPassword?: boolean;
}

const PasswordInput = ({ 
  password, 
  setPassword, 
  showForgotPassword = true 
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div>
      <Label htmlFor="password" className="block text-sm font-medium text-credify-navy-light dark:text-white/70 mb-1">
        Password
      </Label>
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-credify-navy/40 border border-gray-200 dark:border-gray-700/50 rounded-lg focus:ring-2 focus:ring-credify-teal focus:border-transparent transition-colors"
          placeholder="Enter your password"
          required
        />
        <button 
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {showForgotPassword && (
        <div className="flex justify-end mt-2">
          <Link to="/forgot-password" className="text-sm text-credify-teal hover:text-credify-teal-light transition-colors">
            Forgot password?
          </Link>
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
