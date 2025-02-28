
import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Jennifer T.',
      location: 'Chicago, IL',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      quote: 'After struggling with incorrect accounts for years, Credify A.I. helped me remove 3 errors from my report in just weeks. My score jumped by 87 points!',
      improvement: '+87 points',
    },
    {
      name: 'Marcus L.',
      location: 'Atlanta, GA',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      quote: 'The AI found duplicate accounts I didn\'t even know existed. Their dispute letters were professional and effective. Best investment I\'ve made this year.',
      improvement: '+105 points',
    },
    {
      name: 'Sarah W.',
      location: 'Denver, CO',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      quote: 'As someone with limited time, I appreciated how quick and easy the process was. The AI did all the hard work and my credit is in better shape than ever.',
      improvement: '+65 points',
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-credify-dark/70">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-credify-teal/10 rounded-full px-4 py-1.5 mb-5">
            <span className="text-credify-teal font-medium text-sm">Success Stories</span>
          </div>
          
          <h2 className="section-title">
            Real Results from Real Customers
          </h2>
          
          <p className="section-subtitle">
            See how Credify A.I. has helped thousands of customers improve their credit scores and achieve their financial goals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gray-50 dark:bg-credify-navy/20 rounded-xl p-8 border border-gray-100 dark:border-gray-700/30 relative hover:shadow-md transition-all duration-300 group animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-full bg-credify-teal/10 group-hover:bg-credify-teal/20 transition-all duration-300">
                <Quote className="text-credify-teal" size={20} />
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white dark:border-gray-700">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-credify-navy dark:text-white">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-credify-navy-light dark:text-white/70">
                    {testimonial.location}
                  </p>
                  <div className="flex items-center mt-1">
                    {Array(testimonial.rating).fill(0).map((_, i) => (
                      <Star key={i} className="text-yellow-400 fill-yellow-400" size={14} />
                    ))}
                  </div>
                </div>
              </div>
              
              <p className="text-credify-navy-light dark:text-white/80 mb-6">
                "{testimonial.quote}"
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700/30">
                <p className="text-sm text-credify-navy-light dark:text-white/70">
                  Score Improvement
                </p>
                <div className="font-bold text-green-600 dark:text-green-400 text-lg">
                  {testimonial.improvement}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
