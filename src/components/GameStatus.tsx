import React from 'react';
import { Clock } from 'lucide-react';

interface GameStatusProps {
  status: 'waiting' | 'active' | 'completed';
  timeLeft?: number;
  currentPlayer?: 'white' | 'black';
}

export const GameStatus: React.FC<GameStatusProps> = ({ status, timeLeft, currentPlayer }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              status === 'active' ? 'bg-green-500' : status === 'waiting' ? 'bg-yellow-500' : 'bg-red-500'
            }`}
          />
          <span className="font-medium capitalize">{status}</span>
        </div>
        {timeLeft && (
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          </div>
        )}
      </div>
      {currentPlayer && status === 'active' && (
        <p className="mt-2 text-sm text-gray-600">
          Current turn: <span className="font-medium capitalize">{currentPlayer}</span>
        </p>
      )}
    </div>
  );
};