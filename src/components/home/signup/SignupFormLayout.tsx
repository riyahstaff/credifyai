
import React from 'react';
import SignupFormHeader from './SignupFormHeader';
import SignupFormContainer from './SignupFormContainer';

const SignupFormLayout = () => {
  return (
    <section id="signup" className="py-16 md:py-24 bg-credify-navy/5 dark:bg-credify-navy/40 relative">
      <div className="container mx-auto px-4 md:px-6">
        <SignupFormHeader />
        <SignupFormContainer />
      </div>
    </section>
  );
};

export default SignupFormLayout;
