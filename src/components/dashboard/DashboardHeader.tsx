
import React from 'react';
import { Link } from 'react-router-dom';
import { FileUp, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  userName: string;
}

const DashboardHeader = ({ userName }: DashboardHeaderProps) => {
  return (
    <div className="mb-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-credify-navy dark:text-white mb-1">Welcome Back, {userName}</h1>
          <p className="text-credify-navy-light dark:text-white/70">Your credit repair journey is in progress</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="credify"
            asChild
            className="flex items-center justify-center gap-2"
          >
            <Link to="/upload-report">
              <FileUp size={18} />
              <span>Upload New Report</span>
            </Link>
          </Button>
          
          <Button
            variant="credifyOutline"
            asChild
            className="flex items-center justify-center gap-2"
          >
            <Link to="/dispute-letters">
              <FileText size={18} />
              <span>View Letters</span>
            </Link>
          </Button>
        </div>
      </div>
      
      <CreditScoreCard />
    </div>
  );
};

const CreditScoreCard = () => {
  return (
    <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Credit Score - Show placeholder if no real data yet */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-medium text-credify-navy-light dark:text-white/70 mb-4">Current Credit Score</h3>
          <div className="flex items-end gap-3 mb-2">
            <div className="text-5xl font-bold text-credify-navy dark:text-white">--</div>
            <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
              <span className="font-semibold ml-1">No data yet</span>
            </div>
          </div>
          <p className="text-credify-navy-light dark:text-white/70 text-sm">Upload a report to see your score</p>
        </div>
        
        {/* Score Chart - Empty state */}
        <div className="md:col-span-2">
          <div className="h-40 bg-gray-100 dark:bg-gray-800/50 rounded-lg flex items-center justify-center">
            <p className="text-credify-navy-light dark:text-white/70">
              Upload a credit report to see your score history
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
