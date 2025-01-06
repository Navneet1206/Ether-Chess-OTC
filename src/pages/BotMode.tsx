import React, { useState, useEffect, useCallback } from 'react';
import { Chessboard as ReactChessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { Bot, Trophy } from 'lucide-react';

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface PieceValues {
  p: number;
  n: number;
  b: number;
  r: number;
  q: number;
  k: number;
}

const PIECE_VALUES: PieceValues = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0
};

export const BotMode: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState(game.fen());
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'white' | 'black' | 'draw' | null>(null);
  const [thinking, setThinking] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [promotionSquare, setPromotionSquare] = useState<string | null>(null);
  const [checkedKing, setCheckedKing] = useState<'white' | 'black' | null>(null);
  const [showWinnerPopup, setShowWinnerPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Evaluate board position for bot
  const evaluatePosition = (chess: Chess): number => {
    let score = 0;
    
    chess.board().forEach(row => {
      row.forEach(piece => {
        if (piece) {
          const value = PIECE_VALUES[piece.type as keyof PieceValues];
          score += piece.color === 'w' ? value : -value;
        }
      });
    });

    const moves = chess.moves({ verbose: true });
    score += (moves.length * 0.1) * (chess.turn() === 'w' ? 1 : -1);

    const centerSquares = ['d4', 'd5', 'e4', 'e5'];
    centerSquares.forEach(square => {
      const piece = chess.get(square);
      if (piece) {
        score += piece.color === 'w' ? 0.5 : -0.5;
      }
    });

    return score;
  };

  const minimax = (
    chess: Chess,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
  ): { score: number; move?: string } => {
    if (depth === 0 || chess.isGameOver()) {
      return { score: evaluatePosition(chess) };
    }

    const moves = chess.moves({ verbose: true });
    let bestMove: string | undefined;

    if (isMaximizing) {
      let maxScore = -Infinity;
      for (const move of moves) {
        chess.move(move);
        const evaluation = minimax(chess, depth - 1, alpha, beta, false).score;
        chess.undo();

        if (evaluation > maxScore) {
          maxScore = evaluation;
          bestMove = move.san;
        }
        alpha = Math.max(alpha, maxScore);
        if (beta <= alpha) break;
      }
      return { score: maxScore, move: bestMove };
    } else {
      let minScore = Infinity;
      for (const move of moves) {
        chess.move(move);
        const evaluation = minimax(chess, depth - 1, alpha, beta, true).score;
        chess.undo();

        if (evaluation < minScore) {
          minScore = evaluation;
          bestMove = move.san;
        }
        beta = Math.min(beta, minScore);
        if (beta <= alpha) break;
      }
      return { score: minScore, move: bestMove };
    }
  };

  const makeBotMove = useCallback(() => {
    if (game.isGameOver()) {
      determineGameOutcome();
      return;
    }

    setThinking(true);
    const gameCopy = new Chess(game.fen());
    let moveToMake;

    switch (difficulty) {
      case 'EASY':
        const moves = gameCopy.moves({ verbose: true });
        moveToMake = moves[Math.floor(Math.random() * moves.length)];
        break;

      case 'MEDIUM':
        const { move } = minimax(gameCopy, 2, -Infinity, Infinity, false);
        moveToMake = move ? gameCopy.moves({ verbose: true }).find(m => m.san === move) : null;
        break;

      case 'HARD':
        const result = minimax(gameCopy, 3, -Infinity, Infinity, false);
        moveToMake = result.move ? gameCopy.moves({ verbose: true }).find(m => m.san === result.move) : null;
        break;
    }

    if (moveToMake) {
      gameCopy.move(moveToMake);
      setGame(gameCopy);
      setPosition(gameCopy.fen());
      updateCheckedKing(gameCopy);
    }
    
    setThinking(false);
  }, [game, difficulty]);

  const updateCheckedKing = (currentGame: Chess) => {
    if (currentGame.inCheck()) {
      setCheckedKing(currentGame.turn() === 'w' ? 'white' : 'black');
    } else {
      setCheckedKing(null);
    }
  };

  const determineGameOutcome = () => {
    let gameWinner: 'white' | 'black' | 'draw' | null = null;

    if (game.isCheckmate()) {
      gameWinner = game.turn() === 'w' ? 'black' : 'white';
    } else if (game.isDraw()) {
      gameWinner = 'draw';
    }

    setGameOver(true);
    setWinner(gameWinner);
    setShowWinnerPopup(true);
    setTimeLeft(5);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (showWinnerPopup && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setShowWinnerPopup(false);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [showWinnerPopup, timeLeft]);

  const getLegalMovesForSquare = (square: string) => {
    return game.moves({ square, verbose: true }).map(move => move.to);
  };

  const handleSquareClick = (square: string) => {
    if (thinking || gameOver || game.turn() === 'b') return;

    const piece = game.get(square);

    if (promotionSquare) {
      const promotionMove = {
        from: selectedSquare!,
        to: promotionSquare,
        promotion: square[0] as 'q' | 'r' | 'b' | 'n'
      };

      try {
        game.move(promotionMove);
        setPosition(game.fen());
        setSelectedSquare(null);
        setPromotionSquare(null);
        updateCheckedKing(game);
        setTimeout(makeBotMove, 500);
      } catch (error) {
        console.error('Invalid promotion move:', error);
      }
      return;
    }

    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      return;
    }

    if (selectedSquare) {
      const moveAttempt = {
        from: selectedSquare,
        to: square,
      };

      const piece = game.get(selectedSquare);
      if (
        piece &&
        piece.type === 'p' &&
        ((piece.color === 'w' && square[1] === '8') ||
         (piece.color === 'b' && square[1] === '1'))
      ) {
        setPromotionSquare(square);
        return;
      }

      try {
        game.move(moveAttempt);
        setPosition(game.fen());
        setSelectedSquare(null);
        updateCheckedKing(game);
        setTimeout(makeBotMove, 500);
      } catch (error) {
        console.error('Invalid move:', error);
      }
    }
  };

  const customSquareStyles = () => {
    const styles: Record<string, React.CSSProperties> = {};

    if (selectedSquare) {
      styles[selectedSquare] = {
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
      };

      const legalMoves = getLegalMovesForSquare(selectedSquare);
      legalMoves.forEach(square => {
        styles[square] = {
          backgroundColor: 'rgba(0, 255, 0, 0.2)',
          borderRadius: '50%',
        };
      });
    }

    if (checkedKing) {
      const kingSquare = game.board().flat().find(
        piece => piece && piece.type === 'k' && 
        ((checkedKing === 'white' && piece.color === 'w') ||
         (checkedKing === 'black' && piece.color === 'b'))
      )?.square;

      if (kingSquare) {
        styles[kingSquare] = {
          backgroundColor: 'rgba(255, 0, 0, 0.4)',
          border: '2px solid red',
        };
      }
    }

    return styles;
  };

  const promotionPieces = promotionSquare && (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    bg-white p-2 rounded shadow-lg z-50 flex gap-2">
      {['q', 'r', 'b', 'n'].map((piece) => (
        <button
          key={piece}
          className="w-12 h-12 flex items-center justify-center hover:bg-gray-200"
          onClick={() => handleSquareClick(piece)}
        >
          {piece.toUpperCase()}
        </button>
      ))}
    </div>
  );

  const winnerAnnouncement = showWinnerPopup && (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-xl shadow-2xl text-white text-center transform scale-110 transition-all duration-300">
        <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
        <h2 className="text-3xl font-bold mb-2">
          {winner === 'draw'
            ? 'Game is a Draw!'
            : `${winner?.charAt(0).toUpperCase()}${winner?.slice(1)} Wins!`}
        </h2>
        <p className="text-lg opacity-90">Announcement closes in {timeLeft} seconds</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-indigo-950 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-900/90 to-indigo-900/90 p-8 rounded-xl border border-white/10 shadow-xl relative">
            <h2 className="text-2xl font-bold text-white flex items-center gap-4 mb-4">
              Bot Mode <Bot className="text-blue-400" size={24} />
            </h2>
            
            <div className="relative">
              <ReactChessboard
                position={position}
                onSquareClick={handleSquareClick}
                boardOrientation="white"
                customSquareStyles={customSquareStyles()}
              />
              {promotionPieces}
              {winnerAnnouncement}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-gray-900/90 to-indigo-900/90 p-4 rounded-xl border border-white/10 shadow-lg">
              <h3 className="font-medium text-white mb-2">Game Status</h3>
              <div className="text-white">
                <p>Current Turn: {game.turn() === 'w' ? 'White' : 'Black'}</p>
                <p>Status: {gameOver ? 'Game Over' : 'Active'}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900/90 to-indigo-900/90 p-4 rounded-xl border border-white/10 shadow-lg">
              <h3 className="font-medium text-white mb-2">Bot Settings</h3>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="mt-1 block w-full rounded-md bg-gray-800 text-white shadow-sm p-2"
                disabled={gameOver}
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};