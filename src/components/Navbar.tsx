import React, { useState } from 'react';
import { Sword } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WalletConnect } from './WalletConnect';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path); // Navigate to the specified path
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation('/')}
              className="flex items-center gap-2 group"
            >
              <div className="relative">
                <Sword size={32} className="text-blue-400 group-hover:text-blue-300 transition-colors" />
                <span className="absolute -top-1 -right-1 text-lg">♔</span>
              </div>
              <span className="text-xl font-bold text-white">Web3 Chess</span>
            </button>
          </div>

          <div className="sm:hidden">
            <button
              onClick={toggleNavbar}
              className="text-white focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>

          <div className="hidden sm:flex sm:ml-6 sm:items-center sm:space-x-8">
            <button
              onClick={() => handleNavigation('/play/free')}
              className="text-blue-200/70 hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors"
            >
              Practice Mode
            </button>
            <button
              onClick={() => handleNavigation('/play/bot')}
              className="text-blue-200/70 hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors"
            >
              Bot Challenge
            </button>
            <button
              onClick={() => handleNavigation('/play/online')}
              className="text-blue-200/70 hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors"
            >
              Tournament Mode
            </button>
            <button
              onClick={() => handleNavigation('/leaderboard')}
              className="text-blue-200/70 hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors"
            >
              Leaderboard
            </button>
            <div className="ml-4">
              <div
                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 px-4 py-2 rounded-lg border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300"
              >
                <WalletConnect />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900 z-50 overflow-y-auto">
          <div className="flex flex-col p-4">
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={() => handleNavigation('/')}
                className="flex items-center gap-2"
              >
                <div className="relative">
                  <Sword size={32} className="text-blue-400" />
                  <span className="absolute -top-1 -right-1 text-lg">♔</span>
                </div>
                <span className="text-xl font-bold text-white">Web3 Chess</span>
              </button>
              <button
                onClick={toggleNavbar}
                className="text-white focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => handleNavigation('/play/free')}
                className="text-white hover:text-blue-400 py-2 text-lg font-medium transition-colors"
              >
                Practice Mode
              </button>
              <button
                onClick={() => handleNavigation('/play/bot')}
                className="text-white hover:text-blue-400 py-2 text-lg font-medium transition-colors"
              >
                AI Challenge
              </button>
              <button
                onClick={() => handleNavigation('/play/online')}
                className="text-white hover:text-blue-400 py-2 text-lg font-medium transition-colors"
              >
                Tournament Mode
              </button>
              <button
                onClick={() => handleNavigation('/leaderboard')}
                className="text-white hover:text-blue-400 py-2 text-lg font-medium transition-colors"
              >
                Leaderboard
              </button>
              <div
                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 px-4 py-2 rounded-lg border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 mt-4 flex justify-center"
              >
                <WalletConnect />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
