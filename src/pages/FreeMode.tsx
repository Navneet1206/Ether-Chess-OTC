import React, { useState } from 'react';
import { Chessboard } from '../components/Chessboard';
import { GameStatus } from '../components/GameStatus';
import { Chess } from 'chess.js';

export const FreeMode: React.FC = () => {
  const [game] = useState(new Chess());
  const [position, setPosition] = useState(game.fen());

  const handleMove = (move: { from: string; to: string }) => {
    try {
      game.move(move);
      setPosition(game.fen());
    } catch (error) {
      console.error('Invalid move:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Free Mode</h2>
            <Chessboard position={position} onMove={handleMove} />
          </div>
        </div>
        <div>
          <GameStatus status="active" currentPlayer={game.turn() === 'w' ? 'white' : 'black'} />
          <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium mb-2">Game Info</h3>
            <p className="text-sm text-gray-600">
              Practice mode - no stakes, no time limit. Perfect for learning and experimenting with different strategies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};