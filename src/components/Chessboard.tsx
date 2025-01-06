import React, { useState, useRef } from 'react';
import { Chessboard as ReactChessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

interface ChessboardProps {
  position?: string;
  onMove?: (move: { from: string; to: string; promotion?: string }) => void;
  orientation?: 'white' | 'black';
  disabled?: boolean;
  gameState: { checkedKing: 'white' | 'black' | null };
}

export function Chessboard({
  position = 'start',
  onMove,
  orientation = 'white',
  disabled = false,
  gameState,
}: ChessboardProps) {
  const [chess] = useState(() => new Chess(position));
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [promotionMove, setPromotionMove] = useState<{ from: string; to: string } | null>(null);
  const [isPromotionInProgress, setIsPromotionInProgress] = useState(false); // New flag

  const currentPositionRef = useRef(position);
  if (position !== currentPositionRef.current) {
    chess.load(position);
    currentPositionRef.current = position;
  }

  const getLegalMovesForSquare = (square: string) => {
    const moves = chess.moves({ square, verbose: true });
    return moves.map(move => move.to);
  };

  const onSquareClick = (square: string) => {
    if (disabled || isPromotionInProgress) return; // Check flag

    const piece = chess.get(square);

    if (piece && piece.color === chess.turn()) {
      setSelectedSquare(square);
      return;
    }

    if (selectedSquare) {
      const move = { from: selectedSquare, to: square };

      const promotionPiece = chess.get(selectedSquare);
      if (promotionPiece?.type === 'p' && (square[1] === '1' || square[1] === '8')) {
        setPromotionMove(move);
        setIsPromotionInProgress(true); // Set flag
        return;
      }

      try {
        const moveAttempt = chess.move({ ...move, promotion: 'q' });

        if (moveAttempt !== null && onMove) {
          onMove(move);
        }
      } catch {
        // Invalid move
      }
      setSelectedSquare(null);
    }
  };

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (disabled || isPromotionInProgress) return false; // Check flag

    const move = { from: sourceSquare, to: targetSquare };

    const promotionPiece = chess.get(sourceSquare);
    if (promotionPiece?.type === 'p' && (targetSquare[1] === '1' || targetSquare[1] === '8')) {
      setPromotionMove(move);
      setIsPromotionInProgress(true); // Set flag
      return false;
    }

    try {
      const moveAttempt = chess.move({ ...move, promotion: 'q' });

      if (moveAttempt === null) return false;

      if (onMove) {
        onMove(move);
      }

      return true;
    } catch {
      return false;
    }
  };

  const handlePromotion = (promotion: 'q' | 'r' | 'b' | 'n') => {
    if (!promotionMove) return;

    try {
      const moveAttempt = chess.move({
        ...promotionMove,
        promotion,
      });

      if (moveAttempt !== null && onMove) {
        onMove({ ...promotionMove, promotion });
      }
    } catch {
      // Invalid move
    }

    setPromotionMove(null);
    setSelectedSquare(null);
    setIsPromotionInProgress(false); // Reset flag
  };

  const getCustomSquareStyles = () => {
    const styles: Record<string, React.CSSProperties> = {};

    if (selectedSquare) {
      styles[selectedSquare] = { backgroundColor: 'rgba(255, 255, 0, 0.4)' };
      const legalMoves = getLegalMovesForSquare(selectedSquare);
      legalMoves.forEach(square => {
        styles[square] = {
          backgroundColor: 'rgba(0, 255, 0, 0.2)',
          borderRadius: '50%',
        };
      });
    }

    if (gameState.checkedKing) {
      const kingSquare = chess.board().flat().find(
        piece =>
          piece &&
          piece.type === 'k' &&
          ((gameState.checkedKing === 'white' && piece.color === 'w') ||
            (gameState.checkedKing === 'black' && piece.color === 'b'))
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

  return (
    <div className="w-full max-w-2xl mx-auto">
      <ReactChessboard
        position={position}
        onPieceDrop={onDrop}
        onSquareClick={onSquareClick}
        boardOrientation={orientation}
        customBoardStyle={{
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        }}
        customSquareStyles={getCustomSquareStyles()}
      />
      {promotionMove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Promote Pawn</h2>
            <div className="flex gap-4">
              <button
                onClick={() => handlePromotion('q')}
                className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg transition duration-200"
              >
                <img src="/src/assets/Queen.png" alt="Queen" className="w-12 h-12" />
              </button>
              <button
                onClick={() => handlePromotion('r')}
                className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg transition duration-200"
              >
                <img src="/src/assets/Rook.png" alt="Rook" className="w-12 h-12" />
              </button>
              <button
                onClick={() => handlePromotion('b')}
                className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg transition duration-200"
              >
                <img src="/src/assets/Bishop.png" alt="Bishop" className="w-12 h-12" />
              </button>
              <button
                onClick={() => handlePromotion('n')}
                className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg transition duration-200"
              >
                <img src="/src/assets/pngegg.png" alt="Knight" className="w-12 h-12" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
