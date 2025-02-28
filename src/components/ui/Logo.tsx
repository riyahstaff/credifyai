
import React from 'react';
import { Link } from 'react-router-dom';

type LogoProps = {
  variant?: 'default' | 'white';
  size?: 'sm' | 'md' | 'lg';
};

const Logo = ({ variant = 'default', size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const colorClasses = {
    default: 'text-credify-navy dark:text-white',
    white: 'text-white',
  };

  return (
    <Link 
      to="/" 
      className={`font-bold flex items-center gap-1.5 ${sizeClasses[size]} ${colorClasses[variant]}`}
    >
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-credify-teal flex items-center justify-center relative overflow-hidden">
          <span className="text-white font-bold">C</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-t-2 border-r-2 border-white/60 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
          </div>
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-credify-teal-light rounded-full"></div>
      </div>
      <span>Credify <span className="text-credify-teal">A.I.</span></span>
    </Link>
  );
};

export default Logo;
