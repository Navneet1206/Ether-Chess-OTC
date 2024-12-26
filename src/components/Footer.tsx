import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-600 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-center sm:text-left mb-2 sm:mb-0">
            <p className="text-sm">&copy; {new Date().getFullYear()} Web3 Chess. All rights reserved.</p>
          </div>
          {/* Uncomment if you want to add links */}
          {/* <div className="flex space-x-4">
            <Link to="/about" className="hover:text-blue-300">About Us</Link>
            <Link to="/contact" className="hover:text-blue-300">Contact</Link>
            <Link to="/privacy" className="hover:text-blue-300">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-blue-300">Terms of Service</Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
};
