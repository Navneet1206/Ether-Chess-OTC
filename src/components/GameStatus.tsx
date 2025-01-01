import React from 'react';
import { Clock } from 'lucide-react';

interface GameStatusProps {
  status: 'waiting' | 'active' | 'completed';
  timeLeft?: number;
  currentPlayer?: 'white' | 'black';
}

export const GameStatus: React.FC<GameStatusProps> = ({ status, timeLeft, currentPlayer }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              status === 'active' ? 'bg-green-500' : status === 'waiting' ? 'bg-yellow-500' : 'bg-red-500'
            }`}
          />
          <span className="font-medium capitalize text-white">{status}</span>
        </div>
        {timeLeft && (
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-white" />
            <span className="text-white">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          </div>
        )}
      </div>
      {currentPlayer && status === 'active' && (
        <p className="mt-2 text-sm text-gray-300">
          Current turn: <span className="font-medium capitalize text-green-500">{currentPlayer}</span>
        </p>
      )}
    </div>
  );
};
