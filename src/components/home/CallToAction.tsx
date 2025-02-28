
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="py-20 bg-credify-navy text-white relative overflow-hidden">
      {/* Abstract background shapes */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-credify-teal/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-credify-teal/5 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 animate-fade-in">
            Ready to Improve Your Credit Score?
          </h2>
          
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto animate-fade-in delay-100">
            Start your free 7-day trial today. No credit card required. See how our AI-powered platform can help you dispute errors and improve your score.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 animate-fade-in delay-200">
            <Link 
              to="/signup" 
              className="bg-credify-teal hover:bg-credify-teal-light text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-lg"
            >
              <span>Start Free Trial</span>
              <ChevronRight size={18} />
            </Link>
            
            <Link 
              to="/pricing" 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-lg"
            >
              <span>View Pricing</span>
            </Link>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 animate-fade-in delay-300">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-credify-teal"></div>
              </div>
              <span className="text-white/80">7-Day Free Trial</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-credify-teal"></div>
              </div>
              <span className="text-white/80">Cancel Anytime</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-credify-teal"></div>
              </div>
              <span className="text-white/80">No Credit Card Required</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-credify-teal"></div>
              </div>
              <span className="text-white/80">Unlimited Dispute Letters</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
