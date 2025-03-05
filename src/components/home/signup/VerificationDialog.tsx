
import React from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArrowUpRight, Check } from 'lucide-react';

interface VerificationDialogProps {
  email: string;
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
}

const VerificationDialog = ({ email, showDialog, setShowDialog }: VerificationDialogProps) => {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            Check Your Email
          </DialogTitle>
          <DialogDescription className="text-center">
            We've sent a verification link to {email}
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 flex flex-col items-center">
          <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          
          <h3 className="text-lg font-medium text-center mb-2">
            Verify Your Account
          </h3>
          <p className="text-sm text-center text-credify-navy-light dark:text-white/70 mb-6">
            Click the link in the email to verify your account and start improving your credit.
          </p>
          
          <Link 
            to="/login"
            className="bg-credify-teal hover:bg-credify-teal-light text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center mb-4 w-full"
          >
            Go to Login Page
          </Link>
          
          <div className="w-full border-t border-gray-200 dark:border-gray-700 my-4 pt-4">
            <h4 className="text-center font-medium mb-3">Before you start:</h4>
            <a 
              href="https://www.annualcreditreport.com/index.action" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-credify-navy dark:text-white border border-gray-200 dark:border-gray-700 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center w-full"
            >
              Get Your Free Credit Reports
              <ArrowUpRight size={16} className="ml-2" />
            </a>
            <p className="text-xs text-center text-credify-navy-light dark:text-white/70 mt-2">
              This will take you to the official Annual Credit Report website.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationDialog;
