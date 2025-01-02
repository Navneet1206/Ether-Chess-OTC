import React from 'react';
import { Chessboard as ReactChessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
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

  const playSound = (type: 'move' | 'capture') => {
    const sound =
      type === 'move'
        ? new Audio('http://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-self.mp3') // Move sound
        : new Audio('http://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/capture.mp3S'); // Capture sound
    sound.play();
  };

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (disabled) return false;

    try {
      // Use type assertion to ensure valid Square type
      const targetPiece = chess.get(targetSquare as Square);
      const move = chess.move({
        from: sourceSquare as Square,
        to: targetSquare as Square,
        promotion: 'q',
      });

      if (move === null) return false;

      // Play capture sound if there's a piece on the target square, otherwise play move sound
      playSound(targetPiece ? 'capture' : 'move');

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
        boardOrientation={orientation}
        customBoardStyle={{
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        }}
      />
    </div>
  );
};
