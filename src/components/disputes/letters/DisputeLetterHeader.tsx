
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { FileText, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { clearAllLetterData, forceClearAndReload } from '@/utils/creditReport/clearLetterData';
import { useToast } from '@/hooks/use-toast';

interface DisputeLetterHeaderProps {
  testMode?: boolean;
}

const DisputeLetterHeader: React.FC<DisputeLetterHeaderProps> = () => {
  const { profile, user } = useAuth();
  const [userName, setUserName] = useState('User');
  const { toast } = useToast();
  
  // Improved name extraction logic with fallback mechanisms
  useEffect(() => {
    const getUserName = () => {
      // First priority: profile full name from auth context
      if (profile?.full_name) {
        console.log("Using full name from profile:", profile.full_name);
        return profile.full_name;
      }
      
      // Second priority: user email from auth context
      if (user?.email) {
        // Extract username from email but don't include domain part
        const username = user.email.split('@')[0];
        console.log("Using username from email:", username);
        return username;
      }
      
      // Default fallback
      return 'User';
    };
    
    const name = getUserName();
    console.log("Setting user name in DisputeLetterHeader:", name);
    setUserName(name);
  }, [profile, user]);

  const handleCompleteReset = () => {
    toast({
      title: "Completely Resetting",
      description: "Clearing all data and reloading the page...",
    });
    
    // Use the nuclear option to clear everything and reload
    forceClearAndReload();
  };

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
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-red-50 text-red-600 dark:bg-red-900/20 hover:bg-red-100 border-red-200 dark:border-red-800/30 dark:text-red-400"
            onClick={handleCompleteReset}
          >
            <RefreshCw size={16} />
            <span>Reset All</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-credify-teal/10 text-credify-teal dark:bg-credify-teal/20 border-credify-teal/30"
            asChild
          >
            <Link to="/upload-report">
              <Plus size={16} />
              <span>Generate New Letter</span>
            </Link>
          </Button>
        </div>
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
