
import React from 'react';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

const AiInsights = () => {
  return (
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
  );
};

export default AiInsights;
