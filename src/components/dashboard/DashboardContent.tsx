
import React from 'react';
import { useLocation } from 'react-router-dom';
import ActiveDisputes from './ActiveDisputes';
import AiInsights from './AiInsights';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb } from 'lucide-react';

const DashboardContent = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const testMode = searchParams.get('testMode') === 'true';
  
  console.log("DashboardContent rendered with testMode:", testMode);
  
  return (
    <div className="lg:col-span-2 space-y-8">
      {testMode && (
        <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-700/50">
          <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-800 dark:text-amber-300">Test Mode Active</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-400">
            You're viewing the dashboard in test mode. Premium features are unlocked.
            <div className="mt-2 text-xs">
              Current path: {location.pathname + location.search}
            </div>
          </AlertDescription>
        </Alert>
      )}
      <ActiveDisputes />
      <AiInsights />
    </div>
  );
};

export default DashboardContent;
