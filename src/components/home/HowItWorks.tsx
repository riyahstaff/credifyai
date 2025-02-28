
import React from 'react';
import { Upload, Search, FileText, Send, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Upload className="text-white" size={28} />,
      iconBg: 'bg-credify-teal',
      title: 'Upload Your Credit Report',
      description: 'Simply upload your credit reports from Experian, Equifax, or TransUnion. We support PDF, CSV, and direct import options.',
    },
    {
      icon: <Search className="text-white" size={28} />,
      iconBg: 'bg-credify-teal',
      title: 'AI Scans for Errors',
      description: 'Our advanced AI analyzes your reports, identifying errors, inaccuracies, and FCRA violations within minutes.',
    },
    {
      icon: <FileText className="text-white" size={28} />,
      iconBg: 'bg-credify-teal',
      title: 'Review Findings',
      description: 'Review the AI-detected errors, each categorized by type, impact on your score, and applicable legal regulations.',
    },
    {
      icon: <Send className="text-white" size={28} />,
      iconBg: 'bg-credify-teal',
      title: 'Generate & Send Letters',
      description: 'Generate custom dispute letters citing specific violations. Send electronically or download to mail yourself.',
    },
    {
      icon: <CheckCircle className="text-white" size={28} />,
      iconBg: 'bg-credify-teal',
      title: 'Track Results',
      description: 'Monitor the status of your disputes, bureau responses, and credit score improvements through your dashboard.',
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-credify-navy/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-credify-teal/10 rounded-full px-4 py-1.5 mb-5">
            <span className="text-credify-teal font-medium text-sm">Simple Process</span>
          </div>
          
          <h2 className="section-title">
            How Credify A.I. Works
          </h2>
          
          <p className="section-subtitle">
            Our streamlined process makes credit repair faster, easier, and more effective than traditional methods - all powered by cutting-edge artificial intelligence.
          </p>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700/50 transform -translate-x-1/2"></div>
          
          <div className="space-y-12 relative">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="relative flex flex-col md:flex-row items-center animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Timeline dot */}
                <div className="order-1 md:w-1/2 md:pr-8 md:text-right mb-8 md:mb-0">
                  {index % 2 === 0 ? (
                    <div className="bg-white dark:bg-credify-navy/40 p-6 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30">
                      <h3 className="text-xl font-semibold text-credify-navy dark:text-white mb-2">{step.title}</h3>
                      <p className="text-credify-navy-light dark:text-white/70">{step.description}</p>
                    </div>
                  ) : (
                    <div className="hidden md:block" />
                  )}
                </div>
                
                <div className="z-10 flex items-center justify-center order-0 md:order-2 w-12 h-12 rounded-full border-4 border-white dark:border-credify-dark bg-white dark:bg-credify-dark shadow-md">
                  <div className={`w-10 h-10 rounded-full ${step.iconBg} flex items-center justify-center`}>
                    {step.icon}
                  </div>
                </div>
                
                <div className="order-2 md:order-1 md:w-1/2 md:pl-8 mt-8 md:mt-0">
                  {index % 2 === 1 ? (
                    <div className="bg-white dark:bg-credify-navy/40 p-6 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30">
                      <h3 className="text-xl font-semibold text-credify-navy dark:text-white mb-2">{step.title}</h3>
                      <p className="text-credify-navy-light dark:text-white/70">{step.description}</p>
                    </div>
                  ) : (
                    <div className="md:hidden bg-white dark:bg-credify-navy/40 p-6 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30">
                      <h3 className="text-xl font-semibold text-credify-navy dark:text-white mb-2">{step.title}</h3>
                      <p className="text-credify-navy-light dark:text-white/70">{step.description}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
