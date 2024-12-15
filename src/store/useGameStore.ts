import { create } from 'zustand';
import { GameState } from '../types';

interface GameStore {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  resetGame: () => void;
}

const initialGameState: GameState = {
  position: 'start',
  players: {
    white: null,
    black: null
  },
  status: 'waiting',
  moves: [],
  stake: 0,
  gameId: null
};

export const useGameStore = create<GameStore>((set) => ({
  gameState: initialGameState,
  setGameState: (state) => set({ gameState: { ...initialGameState, ...state } }),
  resetGame: () => set({ gameState: initialGameState }),
}));
