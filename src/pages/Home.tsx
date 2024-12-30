import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate(); // React Router's navigate function

  const handleNavigation = (path: string) => {
    navigate(path); // Navigate to the specified path
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-indigo-950 px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Animated chess board pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-8 h-full">
          {[...Array(64)].map((_, i) => (
            <div 
              key={i} 
              className={`aspect-square ${
                (Math.floor(i / 8) + i % 8) % 2 === 0 ? 'bg-white' : 'bg-transparent'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center space-y-6">
          <div className="flex justify-center space-x-4 text-4xl mb-4">
            <span className="text-white">♔</span>
            <span className="text-blue-400">♕</span>
            <span className="text-white">♗</span>
            <span className="text-blue-400">♘</span>
            <span className="text-white">♖</span>
          </div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-400 to-indigo-400 sm:text-7xl font-serif">
            Crypto Chess Arena
          </h1>
          <p className="text-xl text-blue-200/80 font-light">
            Where Grandmasters Meet the Blockchain
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={() => handleNavigation('/play/free')}
            className="group bg-gradient-to-br from-gray-900/90 to-indigo-900/90 p-8 rounded-xl border border-white/10 hover:border-blue-400/40 transition-all duration-300 w-full text-left relative overflow-hidden backdrop-blur-lg hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex items-center gap-4">
              <span className="text-2xl">♟</span>
              <h3 className="text-xl font-semibold text-white">Practice Mode</h3>
            </div>
            <p className="mt-4 text-blue-200/70">
              Master your openings and tactics in a risk-free environment.
            </p>
            <ChevronRight className="absolute bottom-4 right-4 h-6 w-6 text-blue-400/50 group-hover:text-blue-400 transform transition-all group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => handleNavigation('/play/bot')}
            className="group bg-gradient-to-br from-gray-900/90 to-indigo-900/90 p-8 rounded-xl border border-white/10 hover:border-blue-400/40 transition-all duration-300 w-full text-left relative overflow-hidden backdrop-blur-lg hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex items-center gap-4">
              <span className="text-2xl">♝</span>
              <h3 className="text-xl font-semibold text-white">Bot Challenge</h3>
            </div>
            <p className="mt-4 text-blue-200/70">
              Test your skills against our neural network chess engine.
            </p>
            <ChevronRight className="absolute bottom-4 right-4 h-6 w-6 text-blue-400/50 group-hover:text-blue-400 transform transition-all group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => handleNavigation('/play/online')}
            className="group bg-gradient-to-br from-gray-900/90 to-indigo-900/90 p-8 rounded-xl border border-white/10 hover:border-blue-400/40 transition-all duration-300 w-full text-left relative overflow-hidden backdrop-blur-lg hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex items-center gap-4">
              <span className="text-2xl">♚</span>
              <h3 className="text-xl font-semibold text-white">Tournament Mode</h3>
            </div>
            <p className="mt-4 text-blue-200/70">
              Compete in ETH-staked tournaments against global players.
            </p>
            <ChevronRight className="absolute bottom-4 right-4 h-6 w-6 text-blue-400/50 group-hover:text-blue-400 transform transition-all group-hover:translate-x-1" />
          </button>
        </div>

        <div className="mt-16 bg-gradient-to-br from-gray-900/90 to-indigo-900/90 rounded-xl border border-white/10 p-8 backdrop-blur-lg">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-400 font-serif flex items-center gap-4">
            <span className="text-3xl">♕</span> Your Path to Mastery
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <div className="group">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 font-bold text-xl border border-white/10 group-hover:border-blue-400/40 transition-colors">
                  ♟
                </div>
                <h3 className="text-lg font-medium text-white">Connect Wallet</h3>
              </div>
              <p className="mt-2 text-blue-200/70">
                Link your MetaMask to enter tournaments and earn rewards.
              </p>
            </div>
            <div className="group">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 font-bold text-xl border border-white/10 group-hover:border-blue-400/40 transition-colors">
                  ♞
                </div>
                <h3 className="text-lg font-medium text-white">Select Format</h3>
              </div>
              <p className="mt-2 text-blue-200/70">
                Choose from Blitz, Rapid, or Classical time controls.
              </p>
            </div>
            <div className="group">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 font-bold text-xl border border-white/10 group-hover:border-blue-400/40 transition-colors">
                  ♔
                </div>
                <h3 className="text-lg font-medium text-white">Compete & Earn</h3>
              </div>
              <p className="mt-2 text-blue-200/70">
                Win matches to climb the leaderboard and earn ETH rewards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};