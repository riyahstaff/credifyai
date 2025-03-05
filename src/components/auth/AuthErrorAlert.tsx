
import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface AuthErrorAlertProps {
  testMode: boolean;
}

const AuthErrorAlert = ({ testMode }: AuthErrorAlertProps) => {
  return (
    <div className="max-w-3xl mx-auto">
      <Alert variant="destructive" className="mb-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>
          <p className="mb-2">Unable to connect to authentication services. This could be due to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Missing Supabase API credentials</li>
            <li>Network connectivity issues</li>
            <li>Authentication server downtime</li>
          </ul>
          <p className="mt-3 font-medium">
            For a quick demo, you can explore the app interface without signing in. Contact support if this issue persists.
          </p>
          
          {testMode && (
            <div className="mt-4 py-2 px-3 bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700/50 rounded-md">
              <p className="font-medium text-orange-800 dark:text-orange-400">Test Mode Active</p>
              <p className="text-sm text-orange-700 dark:text-orange-500">
                You can access premium features by using <code>?testMode=true</code> in the URL.
              </p>
              <div className="mt-2">
                <Link 
                  to="/dashboard?testMode=true" 
                  className="text-white bg-credify-teal hover:bg-credify-teal-dark px-3 py-1.5 rounded-md text-sm inline-block"
                >
                  Go to Dashboard (Test Mode)
                </Link>
              </div>
            </div>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AuthErrorAlert;
