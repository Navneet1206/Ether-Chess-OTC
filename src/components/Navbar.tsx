import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { WalletConnect } from './WalletConnect';
import { Sword } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Sword size={32} className="text-blue-600" />
              <span className="text-xl font-bold">Web3 Chess</span>
            </Link>
          </div>
          <div className="sm:hidden">
            <button onClick={toggleNavbar} className="text-gray-900 focus:outline-none">
              {/* Hamburger Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
          <div className="hidden sm:flex sm:ml-6 sm:space-x-8">
            <Link to="/play/free" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">Free Mode</Link>
            <Link to="/play/bot" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">Bot Mode</Link>
            <Link to="/play/online" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">Online Mode</Link>
            <Link to="/leaderboard" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">Leaderboard</Link>
            {/* Wallet Connect Button on Large Screens */}
            <div className="ml-auto">
              <WalletConnect />
            </div>
          </div>
        </div>
      </div>

      {/* Side Navbar for Medium and Small Screens */}
      {isOpen && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="flex flex-col p-4">
            <button onClick={toggleNavbar} className="self-end mb-4 text-gray-900 focus:outline-none">
              {/* Close Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Link to="/play/free" className="text-gray-900 hover:text-blue-600 py-2">Free Mode</Link>
            <Link to="/play/bot" className="text-gray-900 hover:text-blue-600 py-2">Bot Mode</Link>
            <Link to="/play/online" className="text-gray-900 hover:text-blue-600 py-2">Online Mode</Link>
            <Link to="/leaderboard" className="text-gray-900 hover:text-blue-600 py-2">Leaderboard</Link>
            {/* Wallet Connect Button in Side Navbar */}
            <div className="mt-auto">
              <WalletConnect />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
