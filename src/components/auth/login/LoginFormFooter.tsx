
import React from 'react';
import { Link } from 'react-router-dom';

interface LoginFormFooterProps {
  testMode: boolean;
  getTestModeUrl: (path: string) => string;
}

const LoginFormFooter = ({ testMode, getTestModeUrl }: LoginFormFooterProps) => {
  return (
    <div className="text-center">
      <p className="text-sm text-credify-navy-light dark:text-white/70">
        Don't have an account?{' '}
        <Link to={getTestModeUrl('/signup')} className="text-credify-teal hover:text-credify-teal-light transition-colors font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginFormFooter;
