import React, { useState, useEffect } from 'react';
import { Chessboard } from '../components/Chessboard';
import { GameStatus } from '../components/GameStatus';
import { Chess } from 'chess.js';
import { useGameStore } from '../store/useGameStore';
import { Trophy } from 'lucide-react';

// Toast component for error feedback (example implementation)
const Toast = ({ message }: { message: string }) => (
  <div className="fixed bottom-4 right-4 bg-red-600 text-white py-2 px-4 rounded-md shadow-lg">
    {message}
  </div>
);

export const FreeMode: React.FC = () => {
  const [game] = useState(() => new Chess());  // Optimized initialization
  const [position, setPosition] = useState(game.fen());
  const [error, setError] = useState<string | null>(null);  // State for error feedback
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'white' | 'black' | 'draw' | null>(null);
  const [showWinnerPopup, setShowWinnerPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const setCheckedKing = useGameStore((state) => state.setCheckedKing);
  let checkedKing = useGameStore((state) => state.checkedKing); // Retrieve checkedKing from store

  const handleMove = (move: { from: string; to: string; promotion?: string }) => {
    try {
      const moveResult = game.move(move);
      if (!moveResult) throw new Error('Invalid move');
      setPosition(game.fen());
      setError(null);  // Clear error on successful move

      // Determine if the king is in check
      checkedKing = game.inCheck()
        ? game.turn() === 'w' ? 'white' : 'black'
        : null;
      setCheckedKing(checkedKing);

      // Check for game over conditions
      if (game.isGameOver()) {
        determineGameOutcome();
      }
    } catch (error) {
      console.error('Invalid move:', error);
      setError('Invalid move! Please try again.');  // User feedback
    }
  };

  const determineGameOutcome = () => {
    let gameWinner: 'white' | 'black' | 'draw' | null = null;

    if (game.isCheckmate()) {
      // If it's checkmate, the winner is the opposite of the current player
      gameWinner = game.turn() === 'w' ? 'black' : 'white';
    } else if (game.isDraw()) {
      // If it's a draw, set the winner to 'draw'
      gameWinner = 'draw';
    }

    // Update the state with the game outcome
    setGameOver(true);
    setWinner(gameWinner);
    setShowWinnerPopup(true);
    setTimeLeft(20);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (showWinnerPopup && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setShowWinnerPopup(false);
      restartGame();
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [showWinnerPopup, timeLeft]);

  const restartGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setPosition(newGame.fen());
    setGameOver(false);
    setWinner(null);
    setCheckedKing(null);
    setError(null);
  };

  const winnerAnnouncement = showWinnerPopup && (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-xl shadow-2xl text-white text-center transform scale-110 transition-all duration-300">
        <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
        <h2 className="text-3xl font-bold mb-2">
          {winner === 'draw'
            ? 'Game is a Draw!'
            : `${winner === 'white' ? 'White' : 'Black'} Wins!`}
        </h2>
        <p className="text-lg opacity-90">Restarting in {timeLeft} seconds</p>
        {/* <button
          onClick={restartGame}
          className="mt-4 bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          OK
        </button> */}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-indigo-950 px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Background Chessboard Pattern */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">  {/* Accessibility improvement */}
        <div className="grid grid-cols-8 h-full">
          {Array.from({ length: 64 }).map((_, i) => (  // Optimized background grid
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-900/90 to-indigo-900/90 p-8 rounded-xl border border-white/10 shadow-xl relative">
            <h2 className="text-2xl font-bold text-white">Free Mode</h2>
            <Chessboard position={position} onMove={handleMove} gameState={{ checkedKing }} />
            {winnerAnnouncement}
          </div>
          <div>
            <GameStatus
              status={gameOver ? 'Game Over' : 'Active'}
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

      {/* Render error message if move is invalid */}
      {error && <Toast message={error} />}
    </div>
  );
};