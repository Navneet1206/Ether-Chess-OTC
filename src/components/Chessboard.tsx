import React from 'react';
import { Chessboard as ReactChessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

interface ChessboardProps {
  position?: string;
  onMove?: (move: { from: string; to: string }) => void;
  orientation?: 'white' | 'black';
  disabled?: boolean;
  gameState: { checkedKing: 'white' | 'black' | null };
}

export const Chessboard: React.FC<ChessboardProps> = ({
  position = 'start',
  onMove,
  orientation = 'white',
  disabled = false,
  gameState,
}) => {
  const chess = new Chess(position);

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
    if (!gameState.checkedKing) return {};
  
    const kingSquare = chess.board().flat().find(
      (piece) =>
        piece &&
        piece.type === 'k' &&
        ((gameState.checkedKing === 'white' && piece.color === 'w') ||
          (gameState.checkedKing === 'black' && piece.color === 'b'))
    )?.square;
  
    return kingSquare
      ? {
          [kingSquare]: {
            backgroundColor: 'rgba(255, 0, 0, 0.4)',
            border: '2px solid red',
          },
        }
      : {};
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
        customSquareStyles={getCustomSquareStyles()}
      />
    </div>
  );
};