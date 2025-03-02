
import React from 'react';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

const LoadingIndicator = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-center">
          <div className="h-12 w-12 border-4 border-credify-teal/30 border-t-credify-teal rounded-full animate-spin"></div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoadingIndicator;
