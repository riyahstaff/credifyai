
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import SignupForm from './SignupForm';
import VerificationDialog from './VerificationDialog';

const SignupFormContainer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-credify-navy/60 rounded-xl shadow-soft p-6 md:p-8 border border-gray-100 dark:border-gray-700/30">
      <h3 className="text-xl font-semibold text-credify-navy dark:text-white mb-6 text-center">
        Create Your Free Account
      </h3>
      
      {errorMessage && (
        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {errorMessage}
        </div>
      )}
      
      <SignupForm 
        email={email}
        setEmail={setEmail}
        setShowDialog={setShowDialog}
        setErrorMessage={setErrorMessage}
      />

      <VerificationDialog
        email={email}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
      />
    </div>
  );
};

export default SignupFormContainer;
