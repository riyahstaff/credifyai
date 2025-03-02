
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { FileUp, FileText, Brain, AlertCircle, Clock, CheckCircle, User, RefreshCw, ChartLine, FileCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Dashboard Header */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-credify-navy dark:text-white mb-1">Welcome Back, {profile?.full_name || 'User'}</h1>
                <p className="text-credify-navy-light dark:text-white/70">Your credit repair journey is in progress</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/upload-report"
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  <FileUp size={18} />
                  <span>Upload New Report</span>
                </Link>
                
                <Link
                  to="/dispute-letters"
                  className="btn-outline flex items-center justify-center gap-2"
                >
                  <FileText size={18} />
                  <span>View Letters</span>
                </Link>
              </div>
            </div>
            
            {/* Credit Score Card */}
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
          </div>
          
          {/* Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Active Disputes - Empty state */}
              <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-credify-navy dark:text-white">Active Disputes</h2>
                </div>
                
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center mb-4">
                    <FileText className="text-gray-400" size={24} />
                  </div>
                  <h3 className="text-lg font-medium text-credify-navy dark:text-white mb-2">No active disputes</h3>
                  <p className="text-credify-navy-light dark:text-white/70 max-w-md mb-6">
                    Upload your credit report to identify potential errors and generate dispute letters.
                  </p>
                  <Link to="/upload-report" className="btn-primary">
                    Upload Credit Report
                  </Link>
                </div>
              </div>
              
              {/* AI Insights - Basic insights for new users */}
              <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Brain className="text-credify-teal" size={24} />
                  <h2 className="text-xl font-semibold text-credify-navy dark:text-white">AI Insights</h2>
                </div>
                
                <div className="p-4 bg-credify-teal/5 rounded-lg border border-credify-teal/20 mb-4">
                  <h3 className="font-medium text-credify-navy dark:text-white mb-2">
                    Getting Started
                  </h3>
                  <p className="text-credify-navy-light dark:text-white/70 text-sm mb-3">
                    Upload your credit report to receive personalized AI insights about potential errors and improvement opportunities.
                  </p>
                  <div className="flex justify-end">
                    <Link to="/education/basics" className="text-credify-teal hover:text-credify-teal-dark dark:hover:text-credify-teal-light text-sm font-medium transition-colors">
                      Learn More →
                    </Link>
                  </div>
                </div>
                
                <div className="p-4 bg-credify-teal/5 rounded-lg border border-credify-teal/20">
                  <h3 className="font-medium text-credify-navy dark:text-white mb-2">
                    Credit Score Basics
                  </h3>
                  <p className="text-credify-navy-light dark:text-white/70 text-sm mb-3">
                    Learn about the factors that affect your credit score and how to improve them over time.
                  </p>
                  <div className="flex justify-end">
                    <Link to="/education" className="text-credify-teal hover:text-credify-teal-dark dark:hover:text-credify-teal-light text-sm font-medium transition-colors">
                      View Education Center →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-8">
              {/* Account Summary */}
              <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <User className="text-credify-teal" size={20} />
                  <h2 className="text-lg font-semibold text-credify-navy dark:text-white">Account Summary</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-credify-navy-light dark:text-white/70">Plan</span>
                    <span className="font-medium text-credify-navy dark:text-white">
                      {profile?.has_subscription ? 'Premium' : 'Free'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-credify-navy-light dark:text-white/70">Reports Analyzed</span>
                    <span className="font-medium text-credify-navy dark:text-white">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-credify-navy-light dark:text-white/70">Letters Generated</span>
                    <span className="font-medium text-credify-navy dark:text-white">0</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700/30">
                  <Link to="/account" className="text-credify-teal hover:text-credify-teal-dark dark:hover:text-credify-teal-light font-medium text-sm transition-colors">
                    Manage Account →
                  </Link>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6">
                <h2 className="text-lg font-semibold text-credify-navy dark:text-white mb-6">Quick Actions</h2>
                
                <div className="space-y-3">
                  <Link to="/upload-report" className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 rounded-lg transition-colors">
                    <div className="w-10 h-10 rounded-full bg-credify-teal/10 flex items-center justify-center">
                      <FileUp className="text-credify-teal" size={18} />
                    </div>
                    <span className="font-medium text-credify-navy dark:text-white">Upload New Report</span>
                  </Link>
                  
                  <Link to="/dispute-letters/new" className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 rounded-lg transition-colors">
                    <div className="w-10 h-10 rounded-full bg-credify-teal/10 flex items-center justify-center">
                      <FileCheck className="text-credify-teal" size={18} />
                    </div>
                    <span className="font-medium text-credify-navy dark:text-white">Create New Letter</span>
                  </Link>
                  
                  <Link to="/education" className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 rounded-lg transition-colors">
                    <div className="w-10 h-10 rounded-full bg-credify-teal/10 flex items-center justify-center">
                      <Brain className="text-credify-teal" size={18} />
                    </div>
                    <span className="font-medium text-credify-navy dark:text-white">Credit Education</span>
                  </Link>
                </div>
              </div>
              
              {/* Recent Activity - Empty state */}
              <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6">
                <h2 className="text-lg font-semibold text-credify-navy dark:text-white mb-6">Recent Activity</h2>
                
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <p className="text-credify-navy-light dark:text-white/70">
                    No recent activity yet. Upload a credit report to get started.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
