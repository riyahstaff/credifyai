
import React from 'react';
import { Brain, FileSearch, FileEdit, FileCheck, ChartBar, BookOpen } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Brain className="text-credify-teal" size={32} />,
      title: 'AI-Powered Analysis',
      description: 'Our advanced AI analyzes your credit reports to identify errors, inaccuracies, and potential FCRA violations.',
    },
    {
      icon: <FileSearch className="text-credify-teal" size={32} />,
      title: 'Error Detection',
      description: 'Automatically detect duplicate accounts, incorrect balances, outdated information, and other common errors.',
    },
    {
      icon: <FileEdit className="text-credify-teal" size={32} />,
      title: 'Custom Dispute Letters',
      description: 'Generate legally-sound dispute letters tailored to each specific error and credit bureau, citing relevant laws.',
    },
    {
      icon: <FileCheck className="text-credify-teal" size={32} />,
      title: 'Legal Compliance',
      description: 'All dispute letters are FCRA-compliant and reference specific legal codes applicable to your situation.',
    },
    {
      icon: <ChartBar className="text-credify-teal" size={32} />,
      title: 'Progress Tracking',
      description: 'Track your dispute progress, bureau responses, and credit score improvements in a clear dashboard.',
    },
    {
      icon: <BookOpen className="text-credify-teal" size={32} />,
      title: 'Educational Resources',
      description: 'Access our comprehensive library of articles, videos, and guides to understand credit repair fundamentals.',
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-credify-dark/70">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-credify-teal/10 rounded-full px-4 py-1.5 mb-5">
            <span className="text-credify-teal font-medium text-sm">Powerful Features</span>
          </div>
          
          <h2 className="section-title">
            AI Technology At Your Service
          </h2>
          
          <p className="section-subtitle">
            Our platform combines advanced AI with deep legal expertise to help you navigate the complex credit repair process with ease and precision.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-50 dark:bg-credify-navy/20 border border-gray-100 dark:border-gray-700/30 rounded-xl p-8 hover:shadow-md transition-all duration-300 hover:bg-white dark:hover:bg-credify-navy/40 group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 rounded-2xl bg-credify-teal/10 flex items-center justify-center mb-6 group-hover:bg-credify-teal/20 transition-all duration-300">
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-semibold text-credify-navy dark:text-white mb-4">
                {feature.title}
              </h3>
              
              <p className="text-credify-navy-light dark:text-white/70">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
