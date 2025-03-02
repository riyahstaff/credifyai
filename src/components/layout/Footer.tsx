
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-gray-50 dark:bg-credify-dark border-t border-gray-200/50 dark:border-gray-700/30 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          <div className="space-y-4">
            <Logo />
            <p className="text-credify-navy-light dark:text-white/70 mt-4">
              Advanced AI-powered credit repair technology that helps you achieve your financial goals faster and easier.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-credify-navy-light dark:text-white/70 hover:text-credify-teal dark:hover:text-credify-teal transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-credify-navy-light dark:text-white/70 hover:text-credify-teal dark:hover:text-credify-teal transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-credify-navy-light dark:text-white/70 hover:text-credify-teal dark:hover:text-credify-teal transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-credify-navy-light dark:text-white/70 hover:text-credify-teal dark:hover:text-credify-teal transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-credify-navy dark:text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => handleNavigation('/')}
                  className="text-credify-navy-light dark:text-white/70 hover:text-credify-teal dark:hover:text-credify-teal transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/dashboard')}
                  className="text-credify-navy-light dark:text-white/70 hover:text-credify-teal dark:hover:text-credify-teal transition-colors"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/upload-report')}
                  className="text-credify-navy-light dark:text-white/70 hover:text-credify-teal dark:hover:text-credify-teal transition-colors"
                >
                  Upload Report
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/dispute-letters')}
                  className="text-credify-navy-light dark:text-white/70 hover:text-credify-teal dark:hover:text-credify-teal transition-colors"
                >
                  Dispute Letters
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/education')}
                  className="text-credify-navy-light dark:text-white/70 hover:text-credify-teal dark:hover:text-credify-teal transition-colors"
                >
                  Education
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-credify-navy dark:text-white mb-6">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => handleNavigation('/terms')}
                  className="text-credify-navy-light dark:text-white/70 hover:text-credify-teal dark:hover:text-credify-teal transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/privacy')}
                  className="text-credify-navy-light dark:text-white/70 hover:text-credify-teal dark:hover:text-credify-teal transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/disclaimer')}
                  className="text-credify-navy-light dark:text-white/70 hover:text-credify-teal dark:hover:text-credify-teal transition-colors"
                >
                  Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/compliance')}
                  className="text-credify-navy-light dark:text-white/70 hover:text-credify-teal dark:hover:text-credify-teal transition-colors"
                >
                  FCRA Compliance
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-credify-navy dark:text-white mb-6">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-credify-navy-light dark:text-white/70">
                <Mail size={18} className="text-credify-teal" />
                <span>support@credifyai.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-700/30 text-center text-credify-navy-light dark:text-white/60 text-sm">
          <p>© {currentYear} Credify A.I. All rights reserved.</p>
          <p className="mt-2 text-xs">
            Disclaimer: Credify A.I. is not a law firm and does not provide legal advice. Results may vary.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
