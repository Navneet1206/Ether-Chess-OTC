import { io, Socket } from 'socket.io-client';
import { GameState } from '../types';

class SocketService {
  private socket: Socket | null = null;
  private gameStateCallback: ((state: GameState) => void) | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private currentGameId: string | null = null;

  connect(address: string, username: string) {
    this.disconnect();

    if (!address || !username) {
      console.error('Invalid connection parameters');
      return;
    }

    this.attemptConnection(address, username);
  }

  private attemptConnection(address: string, username: string) {
    this.reconnectAttempts = 0;
    this.createSocketConnection(address, username);
  }

  private createSocketConnection(address: string, username: string) {
    try {
      this.socket = io('http://localhost:3001', {
        query: { 
          address: address.toLowerCase(), 
          username: username.trim()
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000
      });

      this.setupSocketListeners(address, username);
    } catch (error) {
      console.error('Socket connection initialization error:', error);
      this.handleConnectionError(address, username);
    }
  }

  private setupSocketListeners(address: string, username: string) {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected successfully');
      this.reconnectAttempts = 0;

      // Request initial game state if a game is in progress
      if (this.currentGameId) {
        this.socket.emit('requestInitialGameState', { gameId: this.currentGameId });
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.handleConnectionError(address, username);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        this.createSocketConnection(address, username);
      }
    });

    this.socket.on('gameCreated', ({ gameId }) => {
      console.log('Game created with ID:', gameId);
      this.currentGameId = gameId;
    });

    this.socket.on('gameState', (state: GameState) => {
      console.log('Received game state:', state);
      if (this.gameStateCallback) {
        this.gameStateCallback(state);
      }
    });

    this.socket.on('initialGameState', (state: GameState) => {
      console.log('Received initial game state:', state);
      if (this.gameStateCallback) {
        this.gameStateCallback(state);
      }
    });

    this.socket.on('gameOver', ({ winner }) => {
      console.log('Game over, winner:', winner);
    });
  }

  private handleConnectionError(address: string, username: string) {
    this.reconnectAttempts++;

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      console.log(`Reconnection attempt ${this.reconnectAttempts}`);
      
      setTimeout(() => {
        this.createSocketConnection(address, username);
      }, 1000 * this.reconnectAttempts);
    } else {
      console.error('Maximum reconnection attempts reached');
    }
  }

  createGame(stake: string) {
    if (!this.socket) return;
    this.socket.emit('createGame', { stake });
  }

  joinGame(gameId: string) {
    if (!this.socket) return;
    this.currentGameId = gameId;
    this.socket.emit('joinGame', { gameId });
  }

  makeMove(gameId: string, move: { from: string; to: string }) {
    if (!this.socket) return;
    this.socket.emit('makeMove', { gameId, move });
  }

  onGameState(callback: (state: GameState) => void) {
    this.gameStateCallback = callback;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentGameId = null;
    }
  }
}

export const socketService = new SocketService();
