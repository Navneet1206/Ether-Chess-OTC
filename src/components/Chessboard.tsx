import React, { useState, useRef } from 'react';
import { Chessboard as ReactChessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

interface ChessboardProps {
  position?: string;
  onMove?: (move: { from: string; to: string }) => void;
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
  
  // Keep track of the current position
  const currentPositionRef = useRef(position);
  if (position !== currentPositionRef.current) {
    chess.load(position);
    currentPositionRef.current = position;
  }

  // Get all legal moves for the selected piece
  const getLegalMovesForSquare = (square: string) => {
    const moves = chess.moves({ square, verbose: true });
    return moves.map(move => move.to);
  };

  const onSquareClick = (square: string) => {
    if (disabled) return;

    const piece = chess.get(square);
    
    // If clicking on a new piece of the player's color
    if (piece && piece.color === chess.turn()) {
      setSelectedSquare(square);
      return;
    }

    // If a piece is selected and clicking on a different square
    if (selectedSquare) {
      try {
        const moveAttempt = chess.move({
          from: selectedSquare,
          to: square,
          promotion: 'q',
        });

        if (moveAttempt !== null && onMove) {
          onMove({ from: selectedSquare, to: square });
        }
      } catch (error) {
        // Invalid move - do nothing
      }
      setSelectedSquare(null);
    }
  };

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (disabled) return false;

    try {
      const move = chess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      });

      if (move === null) return false;

      if (onMove) {
        onMove({ from: sourceSquare, to: targetSquare });
      }

      return true;
    } catch {
      return false;
    }
  };

  const getCustomSquareStyles = () => {
    const styles: Record<string, React.CSSProperties> = {};
    
    // Add highlighting for selected square
    if (selectedSquare) {
      styles[selectedSquare] = {
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
      };

      // Add highlighting for legal moves
      const legalMoves = getLegalMovesForSquare(selectedSquare);
      legalMoves.forEach(square => {
        styles[square] = {
          backgroundColor: 'rgba(0, 255, 0, 0.2)',
          borderRadius: '50%',
          // Add a dot in the center for empty squares
          '::before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '20%',
            height: '20%',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 255, 0, 0.5)',
          }
        };
      });
    }
    
    // Add highlighting for checked king
    if (gameState.checkedKing) {
      const kingSquare = chess.board().flat().find(
        (piece) =>
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

      if(selectedSquare === kingSquare) {
        styles[selectedSquare] = {
          backgroundColor: 'rgba(255, 255, 0, 0.4)',
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
    </div>
  );
}