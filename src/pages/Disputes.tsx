
import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import DisputeGenerator from '../components/disputes/DisputeGenerator';

const Disputes: React.FC = () => {
  const handleGenerateDispute = (disputeData: any) => {
    console.log('Dispute generated:', disputeData);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-credify-navy-dark">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 md:px-6 pt-24 pb-16">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-credify-navy dark:text-white">
            Generate Credit Dispute Letters
          </h1>
          <p className="text-credify-navy-light dark:text-gray-300 mt-2">
            Create customized dispute letters for inaccurate credit report items.
          </p>
        </div>
        
        <DisputeGenerator onGenerateDispute={handleGenerateDispute} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Disputes;
