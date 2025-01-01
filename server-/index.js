import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { Chess } from 'chess.js';
import cors from 'cors';  // Make sure to install with: npm install cors

const app = express();
app.use(cors({
  origin: 'http://localhost:5173/',  // Your Vite dev server
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173/',
    methods: ['GET', 'POST'],
  }
});

// Enhanced game management
const games = new Map();

// Utility function to generate unique game ID
function generateGameId() {
  return Math.random().toString(36).substring(2, 10);
}

io.use((socket, next) => {
  const address = socket.handshake.query.address;
  const username = socket.handshake.query.username;

  // Validate connection parameters
  if (!address || !username) {
    return next(new Error('Invalid connection parameters'));
  }
  next();
});

io.on('connection', (socket) => {
  console.log('New socket connection:', socket.handshake.query);

  const clientAddress = socket.handshake.query.address;
  const clientUsername = socket.handshake.query.username;

  socket.on('createGame', ({ stake }) => {
    try {
      const gameId = generateGameId();
      const chess = new Chess();
      
      const game = {
        gameId,
        players: {
          white: {
            address: clientAddress,
            username: clientUsername,
            rating: 0,
            earnings: 0
          },
          black: null
        },
        stake: parseFloat(stake),
        status: 'waiting',
        winner: null,
        moves: [],
        position: chess.fen()
      };
      
      games.set(gameId, { ...game, chess });
      socket.join(gameId);
      socket.emit('gameCreated', { gameId });
      
      console.log(`Game created: ${gameId} by ${clientUsername}`);
    } catch (error) {
      console.error('Game creation error:', error);
      socket.emit('error', { message: 'Failed to create game' });
    }
  });

  socket.on('joinGame', ({ gameId }) => {
    try {
      const gameData = games.get(gameId);
      if (gameData && !gameData.players.black) {
        gameData.players.black = {
          address: clientAddress,
          username: clientUsername,
          rating: 0,
          earnings: 0
        };
        gameData.status = 'active';
        
        socket.join(gameId);
        io.to(gameId).emit('gameState', {
          ...gameData,
          chess: undefined  // Remove chess instance before sending
        });

        console.log(`Game ${gameId} joined by ${clientUsername}`);
      } else {
        socket.emit('error', { message: 'Game not available' });
      }
    } catch (error) {
      console.error('Join game error:', error);
      socket.emit('error', { message: 'Failed to join game' });
    }
  });

  socket.on('requestInitialGameState', ({ gameId }) => {
    try {
      const gameData = games.get(gameId);
      if (gameData) {
        const gameState = {
          ...gameData,
          chess: undefined  // Remove chess instance before sending
        };
        socket.emit('initialGameState', gameState);
      } else {
        socket.emit('error', { message: 'Game not found' });
      }
    } catch (error) {
      console.error('Initial game state request error:', error);
      socket.emit('error', { message: 'Failed to retrieve game state' });
    }
  });

  socket.on('makeMove', ({ gameId, move }) => {
    try {
      const gameData = games.get(gameId);
      if (gameData && gameData.status === 'active') {
        const chess = gameData.chess;
        
        // Validate move
        const validMove = chess.move(move);
        if (!validMove) {
          throw new Error('Invalid move');
        }

        gameData.moves.push(move);
        gameData.position = chess.fen();

        const gameState = {
          ...gameData,
          chess: undefined  // Remove chess instance before sending
        };

        io.to(gameId).emit('gameState', gameState);

        // Check game end conditions
        if (chess.isGameOver()) {
          gameData.status = 'completed';
          gameData.winner = chess.isCheckmate() 
            ? (chess.turn() === 'w' ? gameData.players.black.address : gameData.players.white.address)
            : 'draw';

          io.to(gameId).emit('gameOver', {
            winner: gameData.winner
          });

          console.log(`Game ${gameId} ended. Winner: ${gameData.winner}`);
        }
      }
    } catch (error) {
      console.error('Move error:', error);
      socket.emit('error', { message: error.message || 'Invalid move' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${clientUsername}`);
    
    games.forEach((game, gameId) => {
      if (
        (game.players.white && game.players.white.address === clientAddress) || 
        (game.players.black && game.players.black.address === clientAddress)
      ) {
        io.to(gameId).emit('playerDisconnected', { address: clientAddress });
        games.delete(gameId);
        console.log(`Game ${gameId} deleted due to player disconnect`);
      }
    });
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
