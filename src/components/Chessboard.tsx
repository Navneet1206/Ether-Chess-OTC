import React from 'react';
import { Chessboard as ReactChessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useGameStore } from '../store/useGameStore';

interface ChessboardProps {
  position?: string;
  onMove?: (move: { from: string; to: string }) => void;
  orientation?: 'white' | 'black';
  disabled?: boolean;
}

export const Chessboard: React.FC<ChessboardProps> = ({
  position = 'start',
  onMove,
  orientation = 'white',
  disabled = false,
}) => {
  const chess = new Chess(position);
  const { gameState } = useGameStore();

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
    <div aria-hidden="true" className="w-full max-w-2xl mx-auto">         {/*Accessibility Improvement*/}
      <ReactChessboard
        position={position}
        onPieceDrop={onDrop}
        boardOrientation={orientation}
        customBoardStyle={{
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        }}
      />
    </div>
  );
};