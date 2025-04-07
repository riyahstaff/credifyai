
import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import TemplateManager from '../components/templates/TemplateManager';

const TemplateManagerPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-credify-navy-dark">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 md:px-6 pt-24 pb-16">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-credify-navy dark:text-white">
            Dispute Letter Templates
          </h1>
          <p className="text-credify-navy-light dark:text-gray-300 mt-2">
            Manage your dispute letter templates for different credit bureau issues.
          </p>
        </div>
        
        <TemplateManager />
      </main>
      
      <Footer />
    </div>
  );
};

export default TemplateManagerPage;
