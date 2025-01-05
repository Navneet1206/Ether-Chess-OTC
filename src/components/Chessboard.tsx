import React, { useState, useRef } from 'react';
import { Chessboard as ReactChessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useGameStore } from '../store/useGameStore';

interface ChessboardProps {
  position?: string;
  onMove?: (move: { from: string; to: string }) => void;
  orientation?: 'white' | 'black';
  disabled?: boolean;
}

export function Chessboard({
  position = 'start',
  onMove,
  orientation = 'white',
  disabled = false,
}: ChessboardProps) {
  const [chess] = useState(() => new Chess(position));
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const { gameState } = useGameStore();
  
  // Keep track of the current position
  const currentPositionRef = useRef(position);
  if (position !== currentPositionRef.current) {
    chess.load(position);
    currentPositionRef.current = position;
  }

  const onSquareClick = (square: string) => {
    if (disabled) return;

    const piece = chess.get(square);
    
    // If clicking on a new piece of the player's color
    if (piece && piece.color === chess.turn()) {
      setSelectedSquare(square);
      return;
    }

    // If a piece is selected and clicking on a different square (either empty or opponent's piece)
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
        customSquareStyles={{
          ...(selectedSquare && {
            [selectedSquare]: {
              backgroundColor: 'rgba(255, 255, 0, 0.4)',
            },
          }),
        }}
      />
    </div>
  );
}