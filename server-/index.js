const WebSocket = require('ws');
const { Chess } = require('chess.js');

const wss = new WebSocket.Server({ port: 8080 });

const games = new Map();

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    const { type, gameId, move, stake, address } = data;

    if (type === 'createGame') {
      const game = new Chess();
      games.set(gameId, { game, players: { white: address }, stake });
      ws.gameId = gameId;
      broadcastGameState(gameId);
    } else if (type === 'joinGame') {
      const gameData = games.get(gameId);
      if (gameData && !gameData.players.black) {
        gameData.players.black = address;
        ws.gameId = gameId;
        broadcastGameState(gameId);
      }
    } else if (type === 'makeMove') {
      const gameData = games.get(gameId);
      if (gameData) {
        const { game, players } = gameData;
        if (game.turn() === 'w' && players.white === address || game.turn() === 'b' && players.black === address) {
          game.move(move);
          broadcastGameState(gameId);

          // Check if the king is in check
          if (game.inCheck()) {
            const kingColor = game.turn() === 'w' ? 'black' : 'white';
            wss.clients.forEach((client) => {
              if (client.gameId === gameId && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'kingInCheck', kingColor }));
              }
            });
          }

          // Check if the game is over
          if (game.isGameOver()) {
            const winner = game.turn() === 'w' ? players.black : players.white;
            wss.clients.forEach((client) => {
              if (client.gameId === gameId && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'gameOver', winner }));
              }
            });
          }
        }
      }
    }
  });

  ws.on('close', () => {
    const gameId = ws.gameId;
    if (gameId) {
      games.delete(gameId);
    }
  });
});

function broadcastGameState(gameId) {
  const gameData = games.get(gameId);
  if (gameData) {
    const { game, players } = gameData;
    const state = {
      gameId,
      position: game.fen(),
      players,
      isCheck: game.inCheck(),
      isCheckmate: game.isCheckmate(),
      isDraw: game.isDraw(),
    };
    wss.clients.forEach((client) => {
      if (client.gameId === gameId && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(state));
      }
    });
  }
}