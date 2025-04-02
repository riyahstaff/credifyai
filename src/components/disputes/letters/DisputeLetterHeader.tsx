
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface DisputeLetterHeaderProps {
  testMode?: boolean;
}

const DisputeLetterHeader: React.FC<DisputeLetterHeaderProps> = ({ testMode = false }) => {
  const { profile } = useAuth();
  const userName = profile?.full_name?.split(' ')[0] || 'User';

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-credify-navy dark:text-white">
            Your Dispute Letters
          </h1>
          <p className="text-credify-navy-light dark:text-white/70">
            Hello {userName}, manage your credit dispute correspondence
          </p>
        </div>
        
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-credify-teal/10 text-credify-teal dark:bg-credify-teal/20 border-credify-teal/30"
          asChild
        >
          <Link to={`/upload-report${testMode ? '?testMode=true' : ''}`}>
            <Plus size={16} />
            <span>Generate New Letter</span>
          </Link>
        </Button>
      </div>
      
      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 p-3 rounded-lg border border-amber-200 dark:border-amber-800/50 mt-4">
        <FileText className="h-5 w-5 flex-shrink-0" />
        <p className="text-sm">
          Dispute letters are generated based on your credit report and can be customized before sending to credit bureaus.
        </p>
      </div>
    </div>
  );
};

export default DisputeLetterHeader;
