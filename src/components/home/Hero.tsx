
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle, AlertCircle, FileCheck } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-12 -right-12 w-72 h-72 bg-credify-teal/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-credify-navy/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <div className="inline-block bg-credify-teal/10 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
              <span className="text-credify-teal font-medium text-sm">AI-Powered Credit Repair</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-credify-navy dark:text-white leading-tight mb-6 animate-fade-in delay-100">
              Fix Your Credit with <span className="text-credify-teal">AI Precision</span>
            </h1>
            
            <p className="text-xl text-credify-navy-light dark:text-white/70 mb-8 animate-fade-in delay-200">
              Upload your credit report and our AI will find errors, generate dispute letters, and help improve your score in minutes, not months.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-6 animate-fade-in delay-300">
              <a href="#signup" className="btn-primary py-3 px-6 text-base w-full sm:w-auto">
                Start Free Trial
              </a>
              <a 
                href="https://www.annualcreditreport.com/index.action" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-outline py-3 px-6 text-base w-full sm:w-auto"
              >
                Free Credit Reports
              </a>
              <a 
                href="https://myfreescorenow.com/enroll/?AID=CredBloom&PID=75931" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-outline py-3 px-6 text-base w-full sm:w-auto bg-credify-teal/10 hover:bg-credify-teal/20 border-credify-teal/30"
              >
                Scores & Monitoring $29/mo
              </a>
            </div>
            
            <Link to="/how-it-works" className="inline-flex items-center text-credify-navy-light dark:text-white/70 hover:text-credify-teal dark:hover:text-credify-teal transition-colors mb-6 animate-fade-in delay-300">
              Learn how it works →
            </Link>
            
            <div className="grid grid-cols-2 gap-4 animate-fade-in delay-500">
              <div className="flex items-center gap-2 text-credify-navy-light dark:text-white/70">
                <CheckCircle size={18} className="text-credify-teal" />
                <span>FCRA Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-credify-navy-light dark:text-white/70">
                <CheckCircle size={18} className="text-credify-teal" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center gap-2 text-credify-navy-light dark:text-white/70">
                <CheckCircle size={18} className="text-credify-teal" />
                <span>No Credit Card</span>
              </div>
              <div className="flex items-center gap-2 text-credify-navy-light dark:text-white/70">
                <CheckCircle size={18} className="text-credify-teal" />
                <span>7-Day Free Trial</span>
              </div>
            </div>
          </div>
          
          {/* Image/illustration */}
          <div className="relative mx-auto max-w-lg lg:max-w-none animate-fade-in delay-300">
            <div className="relative">
              {/* Main card */}
              <div className="glass-panel rounded-2xl shadow-glass p-6 border-white/20 dark:border-white/10">
                <div className="bg-white dark:bg-credify-navy/80 rounded-xl shadow-soft p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <FileText className="text-credify-teal" size={24} />
                      <h3 className="font-semibold text-lg text-credify-navy dark:text-white">Credit Report Analysis</h3>
                    </div>
                    <div className="rounded-full bg-credify-teal/10 px-3 py-1">
                      <span className="text-credify-teal text-sm font-medium">98% Complete</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-credify-teal rounded-full" style={{ width: '98%' }}></div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="text-orange-500" size={18} />
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-credify-navy dark:text-white">Duplicate Account (Bank of America)</span>
                            <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full">High Impact</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full">
                            <div className="h-full bg-orange-500 rounded-full animate-pulse-slow" style={{ width: '75%' }}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <AlertCircle className="text-red-500" size={18} />
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-credify-navy dark:text-white">Incorrect Balance (Chase Card)</span>
                            <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full">Critical</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full">
                            <div className="h-full bg-red-500 rounded-full animate-pulse-slow" style={{ width: '90%' }}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <AlertCircle className="text-yellow-500" size={18} />
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-credify-navy dark:text-white">Outdated Address Info</span>
                            <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded-full">Medium Impact</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full">
                            <div className="h-full bg-yellow-500 rounded-full animate-pulse-slow" style={{ width: '55%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-credify-navy-light dark:text-white/70">Found 3 potential errors</p>
                    </div>
                    <button className="btn-primary flex items-center gap-1 text-sm py-2">
                      <FileCheck size={16} />
                      <span>Generate Letters</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-8 -right-8 p-3 glass-panel backdrop-blur-md rounded-lg border border-white/10 shadow-sm transform rotate-3 animate-float">
                <div className="flex items-center gap-2 text-credify-navy dark:text-white">
                  <CheckCircle className="text-green-500" size={18} />
                  <span className="font-medium">FCRA Violation Found</span>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 p-3 glass-panel backdrop-blur-md rounded-lg border border-white/10 shadow-sm transform -rotate-2 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2 text-credify-navy dark:text-white">
                  <div className="h-2 w-2 bg-credify-teal rounded-full animate-pulse"></div>
                  <span className="font-medium">AI Analyzing Report...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
