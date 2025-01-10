const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');
const { Chess } = require('chess.js');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins (update in production)
  },
});

app.use(cors());
app.use(express.json());

// Ethereum contract setup
const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'); // Replace with your Infura or Alchemy URL
const contractAddress = '0xA12E9052EDbffCA633eBe3Fc9B3F477E516d4D43'; // Replace with your contract address
const contractABI = [
  // Paste your contract ABI here
];

const contract = new ethers.Contract(contractAddress, contractABI, provider);

// In-memory game state storage
const games = new Map(); // gameId -> { position: 'start', players: { white: address, black: address } }

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle game creation
  socket.on('createGame', async ({ gameId, stake, address }) => {
    try {
      const game = new Chess();
      games.set(gameId, { position: game.fen(), players: { white: address, black: null } });
      socket.join(gameId);
      io.to(gameId).emit('gameState', { position: game.fen(), players: { white: address, black: null } });
    } catch (error) {
      console.error('Error creating game:', error);
      socket.emit('error', 'Failed to create game');
    }
  });

  // Handle game joining
  socket.on('joinGame', async ({ gameId, address }) => {
    try {
      const gameState = games.get(gameId);
      if (!gameState) {
        throw new Error('Game does not exist');
      }
      if (gameState.players.black) {
        throw new Error('Game is already full');
      }

      gameState.players.black = address;
      games.set(gameId, gameState);
      socket.join(gameId);
      io.to(gameId).emit('gameState', gameState);
    } catch (error) {
      console.error('Error joining game:', error);
      socket.emit('error', error.message);
    }
  });

  // Handle moves
  socket.on('makeMove', ({ gameId, move }) => {
    try {
      const gameState = games.get(gameId);
      if (!gameState) {
        throw new Error('Game does not exist');
      }

      const game = new Chess(gameState.position);
      const result = game.move(move);
      if (!result) {
        throw new Error('Invalid move');
      }

      gameState.position = game.fen();
      games.set(gameId, gameState);
      io.to(gameId).emit('gameState', gameState);

      // Check for game over
      if (game.isGameOver()) {
        io.to(gameId).emit('gameOver', { winner: game.turn() === 'w' ? gameState.players.black : gameState.players.white });
      }
    } catch (error) {
      console.error('Error making move:', error);
      socket.emit('error', error.message);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});