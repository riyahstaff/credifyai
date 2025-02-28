
import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SignupForm from '../components/home/SignupForm';

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16 pb-20">
        <SignupForm />
      </main>
      <Footer />
    </div>
  );
};

export default Signup;
