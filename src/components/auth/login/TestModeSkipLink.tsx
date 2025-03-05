
import React from 'react';
import { Link } from 'react-router-dom';

interface TestModeSkipLinkProps {
  getTestModeUrl: (path: string) => string;
}

const TestModeSkipLink = ({ getTestModeUrl }: TestModeSkipLinkProps) => {
  return (
    <div className="text-center mt-4">
      <Link
        to={getTestModeUrl('/dashboard')}
        className="text-credify-teal hover:text-credify-teal-dark font-medium"
      >
        Skip login and go to Dashboard (Test Mode)
      </Link>
    </div>
  );
};

export default TestModeSkipLink;
