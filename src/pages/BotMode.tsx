import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chess, Move } from 'chess.js';
import { Chessboard } from '../components/Chessboard';
import { GameStatus } from '../components/GameStatus';
import { BOT_DIFFICULTY_LEVELS } from '../config/constants';
import { Bot } from 'lucide-react';

type Difficulty = keyof typeof BOT_DIFFICULTY_LEVELS;

export const BotMode: React.FC = () => {
  // Game state management
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState(game.fen());
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'white' | 'black' | 'draw' | null>(null);
  const [thinking, setThinking] = useState(false);

  // Ref to track if initial setup is done
  const isInitialSetupRef = useRef(false);

  // Determine game outcome
  const determineGameOutcome = useCallback((currentGame: Chess) => {
    let gameWinner: 'white' | 'black' | 'draw' | null = null;

    if (currentGame.isCheckmate()) {
      gameWinner = currentGame.turn() === 'w' ? 'black' : 'white';
    } else if (currentGame.isDraw()) {
      gameWinner = 'draw';
    }

    setGameOver(true);
    setWinner(gameWinner);
    
    return gameWinner;
  }, []);

  // Bot move logic with advanced strategy
  const makeBotMove = useCallback(() => {
    // Prevent moves if game is over
    if (game.isGameOver()) {
      determineGameOutcome(game);
      return;
    }

    // Ensure it's the bot's turn (black)
    if (game.turn() === 'b') {
      setThinking(true);

      // Create a copy of the game to prevent mutation
      const gameCopy = new Chess(game.fen());
      const possibleMoves = gameCopy.moves({ verbose: true });

      if (possibleMoves.length === 0) {
        determineGameOutcome(gameCopy);
        return;
      }

      let selectedMove: Move | undefined;

      // Difficulty-based move selection
      switch (difficulty) {
        case 'EASY':
          // Completely random move
          selectedMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
          break;
        
        case 'MEDIUM':
          // Prioritize capturing moves and checks
          selectedMove = 
            possibleMoves.find(move => move.captured) ||
            possibleMoves.find(move => move.san.includes('+')) ||
            possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
          break;
        
        case 'HARD':
          // Most strategic move selection
          selectedMove = possibleMoves
            .sort((a, b) => {
              const scoreMove = (move: Move) => {
                let score = 0;
                if (move.captured) score += 10; // Capture pieces
                if (move.san.includes('+')) score += 5; // Check moves
                if (['n', 'b'].includes(move.piece)) score += 2; // Develop pieces
                if (move.promotion) score += 8; // Promotion moves
                return score;
              };
              return scoreMove(b) - scoreMove(a);
            })[0];
          break;
      }

      // Simulate move
      if (selectedMove) {
        gameCopy.move(selectedMove);
        
        // Update game state
        setGame(gameCopy);
        setPosition(gameCopy.fen());
        setThinking(false);

        // Check for game over
        if (gameCopy.isGameOver()) {
          determineGameOutcome(gameCopy);
        }
      }
    }
  }, [game, difficulty, determineGameOutcome]);

  // Handle player move
  const handlePlayerMove = useCallback((move: { from: string; to: string }) => {
    // Prevent moves if game is over
    if (gameOver) return;

    try {
      const gameCopy = new Chess(game.fen());
      const moveResult = gameCopy.move({ 
        from: move.from, 
        to: move.to 
      });

      if (moveResult) {
        setGame(gameCopy);
        setPosition(gameCopy.fen());

        // Check for game over after player move
        if (gameCopy.isGameOver()) {
          determineGameOutcome(gameCopy);
          return;
        }

        // Trigger bot move after a short delay
        setTimeout(makeBotMove, 500);
      }
    } catch (error) {
      console.error('Invalid move:', error);
    }
  }, [game, makeBotMove, gameOver, determineGameOutcome]);

  // Automatic game initialization and bot first move
  useEffect(() => {
    // Ensure this runs only once
    if (!isInitialSetupRef.current) {
      isInitialSetupRef.current = true;

      // Start bot move if it's black's turn
      if (game.turn() === 'b') {
        makeBotMove();
      }
    }
  }, [makeBotMove, game]);

  // Automatic bot move when it's bot's turn
  useEffect(() => {
    // If it's bot's turn and game is not over, make a move
    if (game.turn() === 'b' && !gameOver) {
      const moveTimer = setTimeout(makeBotMove, 500);
      return () => clearTimeout(moveTimer);
    }
  }, [game, makeBotMove, gameOver]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-2xl font-bold">Bot Mode</h2>
              <Bot className="text-blue-600" size={24} />
            </div>
            <Chessboard 
              position={position} 
              onMove={handlePlayerMove}
              disabled={thinking || gameOver} 
            />
            {gameOver && (
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold">
                  {winner === 'draw' 
                    ? 'Game is a Draw!' 
                    : winner 
                      ? `${winner.charAt(0).toUpperCase() + winner.slice(1)} Wins!` 
                      : 'Game Over!'}
                </h3>
              </div>
            )}
          </div>
        </div>
        <div>
          <GameStatus 
            status={gameOver ? 'finished' : 'active'} 
            currentPlayer={game.turn() === 'w' ? 'white' : 'black'} 
          />
          <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium mb-2">Bot Settings</h3>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              disabled={gameOver}
            >
              {Object.keys(BOT_DIFFICULTY_LEVELS).map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0) + level.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};