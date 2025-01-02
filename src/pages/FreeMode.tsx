import React, { useState,useEffect } from 'react';
import { Chessboard } from '../components/Chessboard';
import { GameStatus } from '../components/GameStatus';
import { Chess } from 'chess.js';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const FreeMode: React.FC = () => {
  const [game,setGame] = useState(() => new Chess());
  const [fen, setFen] = useState(game.fen());  // Keep track of the FEN string for rendering
  const [position, setPosition] = useState(game.fen());
  useEffect(() => {
    setFen(game.fen());
  }, [game]);

  const handleMove = (move: { from: string; to: string }) => {
    try {
      const result = game.move(move);
      if (result === null) {
        toast.error("Invalid move!");          //For Error Toasts
      }
      else
      {
        setGame(new Chess(game.fen()));     //Update Game State
      }
    } catch (error) {
      console.error('Invalid move:', error);
    }
  };
  const renderBoard = () => {
    return (
      <div className="board" role="grid" aria-label="Chessboard">
        {Array.from({ length: 8 }, (_, rowIndex) => (
          <div key={rowIndex} className="row" role="row">
            {Array.from({ length: 8 }, (_, colIndex) => {
              const square = game.board()[rowIndex][colIndex];
              const isLightSquare = (rowIndex + colIndex) % 2 === 0;
              const squareId = `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`; // e.g., "a1"

              return (
                <div
                  key={colIndex}
                  className={`square ${isLightSquare ? 'light' : 'dark'}`}
                  role="gridcell"
                  aria-hidden="true"
                  id={squareId}
                  tabIndex={0} // Allow focus on squares for keyboard navigation
                  aria-label={
                    square
                      ? `${square.color === 'w' ? 'White' : 'Black'} ${square.type}`
                      : `Empty square ${squareId}`
                  }
                >
                  {square ? square.type.toUpperCase() : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-indigo-950 px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Background Chessboard Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-8 h-full">
          {Array.from({ length: 64 }).map((_, i) => (
            <div
              key={i}
              className={`aspect-square ${
                (Math.floor(i / 8) + i % 8) % 2 === 0 ? 'bg-white' : 'bg-transparent'
              }`}
            />
          ))}
        </div>
      </div>
      {/* Render the board */}
      {renderBoard()}
      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-900/90 to-indigo-900/90 p-8 rounded-xl border border-white/10 shadow-xl relative">
            <h2 className="text-2xl font-bold text-white">Free Mode</h2>
            <Chessboard position={position} onMove={handleMove} />
            <ToastContainer />          {/* Toast Container for displaying Toasts */}
          </div>
          {/* Announce current game state for screen readers */}
        <div aria-live="assertive" role="status" className="sr-only">
          {game.isGameOver() ? 'Game Over' : `Current FEN: ${fen}`}
        </div>
          <div>
            <GameStatus
              status="active"
              currentPlayer={game.turn() === 'w' ? 'white' : 'black'}
            />
            <div className="mt-4 bg-gradient-to-br from-gray-900/90 to-indigo-900/90 p-4 rounded-xl border border-white/10 shadow-lg">
              <h3 className="font-medium text-white mb-2">Game Info</h3>
              <p className="text-sm text-gray-400">
                Practice mode - no stakes, no time limit. Perfect for learning and experimenting with different strategies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
