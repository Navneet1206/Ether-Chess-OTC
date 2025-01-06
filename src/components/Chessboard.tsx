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
                <img src="data:image/png;base64,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" alt="Queen" className="w-12 h-12" />
              </button>
              <button
                onClick={() => handlePromotion('r')}
                className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg transition duration-200"
              >
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0hD8O0MUc4-O1Y-CNBzH7RZVH4HUlhFfbKQ&s" alt="Rook" className="w-12 h-12" />
              </button>
              <button
                onClick={() => handlePromotion('b')}
                className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg transition duration-200"
              >
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAk1BMVEX///8AAAAcGhskJCQqKCmCgoIgHh+UlJSLiYrm5uYLAwbh4OCsqqv8/Pyzs7NWVVYaFhdzcnJnZ2ciIiLu7u4YGBgoJCUmJibLy8sdHR3x8fGcnJzT09MrKyv39/e+vr4OCwwxMTFXV1c/Pz+mpqYTERJpZ2h7e3tJSUk6ODlhX2C7u7vGxsZXVleFhIVvb29GREWrbh3KAAALKUlEQVR4nO2dD1uqPBTAOWPOAKfoYIgCDXWiZtb3/3TvsG715jK80XXj8XdvdUXy2e62s/N3OM6NGzdu3Lhx48aNZtBrN+BfUQSr3ri3CoprN+R3oM5wAy9shp0cVa8ClhAUojRxofKu3ZxfYARJCstev7cElMDo2s1pG+r0IBGL6fHF9FFw6HVtok4hl6Po9UU0CjFMr9qetqHOU5xuI/o6bDTaovipW4MYJQzeBKjq6NBnSXT+VyxjKvPSc17HUP3wylx2a5oOge+K91lJix1XY9olBoA/9RB3rIf3It/M3l/S2QaL++s15xcIUh7uP7yehhwFV2vNL0BpiWT14UIVo5J2ardwVoLB4O3VALg/OHO3jXjPjMu6U/XADWJGNt3aDhUBIgweH4IoeHgExqBTq9A5jtyIMEyAvHx1sYcZ8BBCXBMCcLTulpyh1Fsm6WJfLRmw5TgbAoN+pzTvwqlEIvfKqAiyIFI9W8SEZdduVYtQZw4JVB807yzFBHdpKQ4hSUf/2x72wMJNd5w1AWHpZ+FZgSt312lOy6gpGQE61bPpuJ64XdDcKD16ZVYnb8wWIffnXfCHFwvB/b7mjWgTdsIMpmOR+AfndDpSpchxd2f/PFViFJR5T09iFdTpSwbza7SpVTKGw1I3TPUeyeRCDaHlg7hBJNcrL0OhTCj7d8QVcNCbukOJEagOzuZDmwfRK3k40cqSvTIvXDW4s0eAh3/ervZQS01kuoWWxYyDUgLoRKq5au1SpFFM5J3mujIWSe3ld6KRzxgXtnq/qdopsNZGmi3VXt8vnKAUOJREaP4X7IDuiBxrViGtBK/VuIcYKdV0BXhra2A/ELk2SjiViTw43pNQa7GiHmCw1Ri+BwI6GXKQZBPNS8E5zNX7W/TFhmI+FbCx7vqaoBLATWB7tBn7RFhqKBajL9TOOWDCkzjuv1j9SnP9GLWxCG+Z6/eB2RoAyrs/GluW4tJO7U0p3aXe2VRM91lRbyfHVeptcWynqNlD8qydfZ82kNkmATtjiQNgoyYbXTEilgrTuY8WjRTOHRKnbhwb6Idy0ujGtZA6P4759JH/1OjGMcS29hC0G/4J1vZwjho6tXcyttMhpWTpppEs3biWytKp4Nsmuoq3TSy1gZWu0mgnvwdbtTZnEaPq+7ucCsXN9k3zGCrb1vvGy1RHpuxNcYsYk9/FzyitJGeW5tbUfnsuvnOGDiW3N2mBzraEsHNikjrTJCXbmaUddGoDCjN2LiEhcBmG/ZkbDKf2mKq1+LUcGUpifZD0AJyIQ+TUCcL/m4u0cKKDUB082LoI/7ACxEU+r6Xlhyxo9RXNc4GJJsBvCfTt53SDGPHzwzT60MNo2st9ztFm+uFO2yi8F6JsFxJOJDw/zfdZ4AXBfv60BLUCSbjLote7bPPrUxqt4Q1JatSIvV1B/HiJhO83rb/TfgxjthH8DfIG/nyB4z83Ccu8wpVSNv0acfxW44P6+Xbp9drrS/DV/ZVNYxiUWIxnUXNmY5F84T42kyE0M37fibaJVfH8fhxfGk7ahaFN7qh+3NDN9s4YrOrhXLDRZXKDjoiwyeE2lZhcZjHsCbaqIHG2dMNyeAllyJdWbYhKmHK4BNcuUapMowqQW8MS9ff4zf0/CVN/k/TP5RSqwqYdX3FfTf6wTNN88pn1uiTpdr2erI8vq3u71NIj9BVnAOmooJ95CYy+3WQvdfkI5OWpFJmVdaaQ1X17IwIOpzqcp65a6ic9gaq+nCZbZOpqJwawhhNNiOYeCLtCW36HjS7ZYghkc4W2/A47nUttBcTSdDYNYwKndkMfyKX2h7lUBE7TgO+ANIku2sEBQe/0IqDTi7ZyF/qnw9UDdLhCW36Hu1Cc9rDyQ2sz2E+4Q5oxrETXe9jzOzRLezpJ0+uSpKlSOB2uuy7th+Mv9sPu9HCHNEn78y5pbaMv9NLuHJ64RJp0hCGg7RXa8jtInX24B+JfoS2/Qm3jn/qzp4A7Y+PXuXmnscFAXe2Knyb40hNlU0z0HBlwdupNLFzd3LWTB+CahG+6sT7h6405sImmVnbShTMjXhiHRKdjHwjqiNpGJ/rTW/rAJ7alQumZbfSJ3EPAlmUJfYXHcKiroMxizCytQviEUl5cXU+8xOr04A8MRVrq4ru0JKIb28WdkAvtGztp73kR/2Mkvyi+66OwExbiLCdf6C5DIHkXhGngHqPZmncyJYK6oHurbW+pt5Kipb0VTx+5E3inV12KHe6EqJlwjSvxhTtgO/vN/Ah9va/vIZH2m/nZGWdFBIm1h++8MwdSfpHQRZ0y1YS/LYPu5JlS2SqOrV+Idbnzmdo1wBdmvJuHEiZnTkQOcu7beXDLO/343LEDdMOQ7Ttizs7Kkjkw/M/a8it4aj845xTNjgXtNjMAV5Na+k5RMntrLJ3jA3PS+HywvofIxLYE748E36bgPwA+W+xtOislSM7buLOc+SsLk9iPUOosQvnd49WepM2ujABxNUnP9/AeeGzvNO0LvP3OOlKGvrBW+y4WXJPt9ZmeTy6sczOHqTa6/Zk62n1UCizsZk8o0/B7SiIsTXDzSt7otMCVSCw9J2oueKPybK9MrCoffQcz8W2M97j2KnCT329Oy9BaH3MbZpPU9UFWlVceUUp33NQZSnck3Nmnfu8hafyUynuBfftipbs4XTa9ly5RaJ3PLYvdC6IuA6Wc2uYaXhM2mjVWU2YjnlqWMFyLx2HjDtZngumKMA2G7iTjx380/Q3OpFUr8QGwP7xIl64fmmTTnogJer4soat4RsRsxYb++VbX1s+PBtFJBf45jp7TufOhMt/EOVs4s4feSEEYIaPFqBkv9z2OCGJsoV70HgrH1IQ+ut8CIELqDjJELqM+4IypPynAdm/i+NWzahCnnAgAEOBfdLDJCz4cf5dwFA6MnKOOB8SF3Wrwyts/LmO1A0bMjGXQHTp/HGtTpmrKGvnQwIBhv50gy0qY6em/B563YuTRIudGPtJjKMPnlj7qOTxzbu31GALZtrN46JYYqcFlx+dSt8FeYmGioVEs3Pi5jRyu6BnxhYFaDT1mqW0H3k8ZbGX9xAEDdwvH6UkXgftT6pOVD2Yq3g7tCcbxD0iSPM85Ez0ju+fU5T+CyBT9PWmNJGJtag/vRS7mXvAzvLk4fUy5GVBnk8oWHsVBHyUy9ACpAFgrRaFTY8tn74S7aWMBFRvuG5nOFz0fHS0//hzqrCDXP3TvykwFR+1MriBNjNTaVgItW9mnqbOMpYnpfGPZWsLBQUgTK4SXoWgeqTgHdYYibhyZ+2fQKOGtVYTuwU3MqzSJkvYezZxBYmAPPReTtnyAHsu1lcPXJXD19cx/g5fkBhYmqh625gIMmIk9jPK8xXWIcWScBTXDrEVZSr5Jnr4Kz2Fr1fVD0ZrrtU0qqTng8i8/SkgTD28diNZOJ9siYeKjVzOJUTuiJkNYGmdbUEqjDQ53h97POexCvInMO2s/mCDCxV+Efk8RjKC1cfuhEn+chCGJf+BMfHEnxgSFhLcnmFsiqx/VmFd37VDlwJlhqXw5Y3Gb4m8lmZu3+Hk/hNbx30Zp+Q0/zjkm8JsUB6ZPJJy0GkuhziRmT+ZI09kGt16S/QCJQSeBeTlO25YLQZrn5ljBqoek7f3LrB4qdaZ1sXBv1CylE47aljTrWHec5NV4AK55zspPGJiWM0zIuYdTX85AMmZWyvBecA7LQ78dDktgXBhWRTMAxJmUCIU/BSEpOQ5bnvU/hjrZorZ7/DYQPsBCf8Tb9VCtKbJ5b9wOVT8rDM2oaZXu9/DGjRs3bty4caMx/wHKveZMvO2R5QAAAABJRU5ErkJggg==" alt="Bishop" className="w-12 h-12" />
              </button>
              <button
                onClick={() => handlePromotion('n')}
                className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg transition duration-200"
              >
                <img src="data:image/jpeg;base64,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" alt="Knight" className="w-12 h-12" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
