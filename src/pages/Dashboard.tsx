
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { FileUp, FileText, Brain, AlertCircle, Clock, CheckCircle, User, RefreshCw, ChartLine, FileCheck } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Dashboard Header */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-credify-navy dark:text-white mb-1">Welcome Back, John</h1>
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
                {/* Credit Score */}
                <div className="flex flex-col items-center md:items-start">
                  <h3 className="text-lg font-medium text-credify-navy-light dark:text-white/70 mb-4">Current Credit Score</h3>
                  <div className="flex items-end gap-3 mb-2">
                    <div className="text-5xl font-bold text-credify-navy dark:text-white">658</div>
                    <div className="flex items-center text-green-600 dark:text-green-400 mb-1">
                      <ChartLine size={18} />
                      <span className="font-semibold ml-1">+42</span>
                    </div>
                  </div>
                  <p className="text-credify-navy-light dark:text-white/70 text-sm">Last updated: May 15, 2023</p>
                </div>
                
                {/* Score Chart - Placeholder */}
                <div className="md:col-span-2">
                  <div className="h-40 bg-gray-100 dark:bg-gray-800/50 rounded-lg flex items-center justify-center">
                    <p className="text-credify-navy-light dark:text-white/70">
                      Credit Score History Chart
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
              {/* Active Disputes */}
              <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-credify-navy dark:text-white">Active Disputes</h2>
                  <button className="text-credify-teal hover:text-credify-teal-dark dark:hover:text-credify-teal-light transition-colors">
                    <RefreshCw size={18} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Dispute Item */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-100 dark:border-gray-700/30">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="mt-1">
                          <AlertCircle className="text-orange-500" size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium text-credify-navy dark:text-white">Duplicate Account (Bank of America)</h3>
                          <p className="text-sm text-credify-navy-light dark:text-white/70 mt-1">Reported to Experian, TransUnion</p>
                        </div>
                      </div>
                      <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-full text-xs font-medium">
                        <Clock size={14} className="mr-1" />
                        In Progress
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <div className="text-xs bg-gray-100 dark:bg-gray-700/50 text-credify-navy-light dark:text-white/70 px-2 py-1 rounded-full">
                        FCRA § 611
                      </div>
                      <div className="text-xs bg-gray-100 dark:bg-gray-700/50 text-credify-navy-light dark:text-white/70 px-2 py-1 rounded-full">
                        Sent: May 10, 2023
                      </div>
                      <div className="text-xs bg-gray-100 dark:bg-gray-700/50 text-credify-navy-light dark:text-white/70 px-2 py-1 rounded-full">
                        Response Due: Jun 10, 2023
                      </div>
                    </div>
                  </div>
                  
                  {/* Dispute Item */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-100 dark:border-gray-700/30">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="mt-1">
                          <AlertCircle className="text-red-500" size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium text-credify-navy dark:text-white">Incorrect Balance (Chase Card)</h3>
                          <p className="text-sm text-credify-navy-light dark:text-white/70 mt-1">Reported to All Bureaus</p>
                        </div>
                      </div>
                      <div className="flex items-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-medium">
                        <CheckCircle size={14} className="mr-1" />
                        Resolved
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <div className="text-xs bg-gray-100 dark:bg-gray-700/50 text-credify-navy-light dark:text-white/70 px-2 py-1 rounded-full">
                        FCRA § 623
                      </div>
                      <div className="text-xs bg-gray-100 dark:bg-gray-700/50 text-credify-navy-light dark:text-white/70 px-2 py-1 rounded-full">
                        Sent: Apr 22, 2023
                      </div>
                      <div className="text-xs bg-gray-100 dark:bg-gray-700/50 text-credify-navy-light dark:text-white/70 px-2 py-1 rounded-full">
                        Resolved: May 12, 2023
                      </div>
                    </div>
                  </div>
                  
                  {/* Dispute Item */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-100 dark:border-gray-700/30">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="mt-1">
                          <AlertCircle className="text-yellow-500" size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium text-credify-navy dark:text-white">Outdated Address Information</h3>
                          <p className="text-sm text-credify-navy-light dark:text-white/70 mt-1">Reported to Equifax</p>
                        </div>
                      </div>
                      <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-full text-xs font-medium">
                        <Clock size={14} className="mr-1" />
                        In Progress
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <div className="text-xs bg-gray-100 dark:bg-gray-700/50 text-credify-navy-light dark:text-white/70 px-2 py-1 rounded-full">
                        FCRA § 605
                      </div>
                      <div className="text-xs bg-gray-100 dark:bg-gray-700/50 text-credify-navy-light dark:text-white/70 px-2 py-1 rounded-full">
                        Sent: May 5, 2023
                      </div>
                      <div className="text-xs bg-gray-100 dark:bg-gray-700/50 text-credify-navy-light dark:text-white/70 px-2 py-1 rounded-full">
                        Response Due: Jun 5, 2023
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <Link to="/dispute-letters" className="text-credify-teal hover:text-credify-teal-dark dark:hover:text-credify-teal-light font-medium transition-colors">
                    View All Disputes →
                  </Link>
                </div>
              </div>
              
              {/* AI Insights */}
              <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Brain className="text-credify-teal" size={24} />
                  <h2 className="text-xl font-semibold text-credify-navy dark:text-white">AI Insights</h2>
                </div>
                
                <div className="p-4 bg-credify-teal/5 rounded-lg border border-credify-teal/20 mb-4">
                  <h3 className="font-medium text-credify-navy dark:text-white mb-2">
                    Your credit utilization is too high
                  </h3>
                  <p className="text-credify-navy-light dark:text-white/70 text-sm mb-3">
                    Your current credit utilization is 72%, which is negatively impacting your score. Consider paying down your balances to below 30% for an estimated 25-point improvement.
                  </p>
                  <div className="flex justify-end">
                    <Link to="/education/utilization" className="text-credify-teal hover:text-credify-teal-dark dark:hover:text-credify-teal-light text-sm font-medium transition-colors">
                      Learn More →
                    </Link>
                  </div>
                </div>
                
                <div className="p-4 bg-credify-teal/5 rounded-lg border border-credify-teal/20">
                  <h3 className="font-medium text-credify-navy dark:text-white mb-2">
                    Potential additional errors detected
                  </h3>
                  <p className="text-credify-navy-light dark:text-white/70 text-sm mb-3">
                    Our AI has identified 2 additional potential errors in your latest credit report that could be disputed. Upload your latest report to verify and generate dispute letters.
                  </p>
                  <div className="flex justify-end">
                    <Link to="/upload-report" className="text-credify-teal hover:text-credify-teal-dark dark:hover:text-credify-teal-light text-sm font-medium transition-colors">
                      Upload Report →
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
                    <span className="font-medium text-credify-navy dark:text-white">Premium</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-credify-navy-light dark:text-white/70">Next Billing</span>
                    <span className="font-medium text-credify-navy dark:text-white">June 15, 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-credify-navy-light dark:text-white/70">Reports Analyzed</span>
                    <span className="font-medium text-credify-navy dark:text-white">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-credify-navy-light dark:text-white/70">Letters Generated</span>
                    <span className="font-medium text-credify-navy dark:text-white">5</span>
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
              
              {/* Recent Activity */}
              <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6">
                <h2 className="text-lg font-semibold text-credify-navy dark:text-white mb-6">Recent Activity</h2>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <CheckCircle className="text-green-600 dark:text-green-400" size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-credify-navy dark:text-white">Dispute Resolved</p>
                      <p className="text-xs text-credify-navy-light dark:text-white/70">Chase Card balance corrected</p>
                      <p className="text-xs text-credify-navy-light dark:text-white/70 mt-1">May 12, 2023</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-credify-teal/10 flex items-center justify-center">
                      <FileUp className="text-credify-teal" size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-credify-navy dark:text-white">Report Uploaded</p>
                      <p className="text-xs text-credify-navy-light dark:text-white/70">Experian credit report</p>
                      <p className="text-xs text-credify-navy-light dark:text-white/70 mt-1">May 10, 2023</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-credify-teal/10 flex items-center justify-center">
                      <FileCheck className="text-credify-teal" size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-credify-navy dark:text-white">Letter Generated</p>
                      <p className="text-xs text-credify-navy-light dark:text-white/70">Address correction dispute</p>
                      <p className="text-xs text-credify-navy-light dark:text-white/70 mt-1">May 5, 2023</p>
                    </div>
                  </div>
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
