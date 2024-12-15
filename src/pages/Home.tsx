import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Users, Dices } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
          Play Chess, Earn Crypto
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Join the future of chess where every move counts, literally.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/play/free"
          className="relative group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <Dices className="h-8 w-8 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Free Mode</h3>
          </div>
          <p className="mt-4 text-gray-600">
            Practice your skills without any stakes. Perfect for warming up or casual games.
          </p>
        </Link>

        <Link
          to="/play/bot"
          className="relative group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <Bot className="h-8 w-8 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Bot Mode</h3>
          </div>
          <p className="mt-4 text-gray-600">
            Challenge our AI and improve your game with detailed analytics.
          </p>
        </Link>

        <Link
          to="/play/online"
          className="relative group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <Users className="h-8 w-8 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Online Mode</h3>
          </div>
          <p className="mt-4 text-gray-600">
            Stake ETH and compete against other players to win the prize pool.
          </p>
        </Link>
      </div>

      <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
        <div className="mt-6 grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                1
              </div>
              <h3 className="text-lg font-medium text-gray-900">Connect Wallet</h3>
            </div>
            <p className="mt-2 text-gray-600">
              Link your MetaMask wallet to get started with online matches.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                2
              </div>
              <h3 className="text-lg font-medium text-gray-900">Choose Mode</h3>
            </div>
            <p className="mt-2 text-gray-600">
              Select your preferred game mode: Free, Bot, or Online with stakes.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                3
              </div>
              <h3 className="text-lg font-medium text-gray-900">Play & Earn</h3>
            </div>
            <p className="mt-2 text-gray-600">
              Win matches and earn ETH in online mode, or practice risk-free.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};