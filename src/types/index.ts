export interface Player {
  address: string;
  username: string;
  rating: number;
  earnings: number;
}

export interface GameState {
  gameId: string;
  players: {
    white: Player;
    black: Player | null;
  };
  stake: string;
  status: 'waiting' | 'active' | 'completed';
  winner?: string | null;
  moves: string[];
  position: string;
}