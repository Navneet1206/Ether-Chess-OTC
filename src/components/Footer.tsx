import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 border-t border-white/10 relative overflow-hidden">
      {/* Subtle animated chess pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-8 h-full">
          {[...Array(16)].map((_, i) => (
            <div 
              key={i} 
              className={`aspect-square ${
                (Math.floor(i / 8) + i % 8) % 2 === 0 ? 'bg-white' : 'bg-transparent'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl text-blue-400">♔</span>
              <h3 className="text-lg font-bold text-white">Web3 Chess</h3>
            </div>
            <p className="text-sm text-blue-200/70">
              The future of chess meets blockchain technology. Play, compete, and earn in the most innovative chess platform.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Play</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => console.log('Navigate to practice')} className="text-blue-200/70 hover:text-blue-400 text-sm transition-colors">
                  Practice Mode
                </button>
              </li>
              <li>
                <button onClick={() => console.log('Navigate to tournaments')} className="text-blue-200/70 hover:text-blue-400 text-sm transition-colors">
                  Tournaments
                </button>
              </li>
              <li>
                <button onClick={() => console.log('Navigate to AI')} className="text-blue-200/70 hover:text-blue-400 text-sm transition-colors">
                  AI Challenge
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => console.log('Navigate to learn')} className="text-blue-200/70 hover:text-blue-400 text-sm transition-colors">
                  Learn Chess
                </button>
              </li>
              <li>
                <button onClick={() => console.log('Navigate to rules')} className="text-blue-200/70 hover:text-blue-400 text-sm transition-colors">
                  Game Rules
                </button>
              </li>
              <li>
                <button onClick={() => console.log('Navigate to FAQ')} className="text-blue-200/70 hover:text-blue-400 text-sm transition-colors">
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => console.log('Navigate to privacy')} className="text-blue-200/70 hover:text-blue-400 text-sm transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => console.log('Navigate to terms')} className="text-blue-200/70 hover:text-blue-400 text-sm transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => console.log('Navigate to contact')} className="text-blue-200/70 hover:text-blue-400 text-sm transition-colors">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-blue-200/70">
            &copy; {new Date().getFullYear()} Web3 Chess. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <button onClick={() => console.log('Navigate to twitter')} className="text-blue-200/70 hover:text-blue-400 transition-colors">
              𝕏
            </button>
            <button onClick={() => console.log('Navigate to discord')} className="text-blue-200/70 hover:text-blue-400 transition-colors">
              Discord
            </button>
            <button onClick={() => console.log('Navigate to telegram')} className="text-blue-200/70 hover:text-blue-400 transition-colors">
              Telegram
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};