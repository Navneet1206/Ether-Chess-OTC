export interface Player {
  address: string;
  username: string;
  rating: number;
  earnings: number;
}

export interface GameState {
  gameId?: string | null;
  players?: {
    white: Player | null;
    black: Player | null;
  };
  stake?: string | number;
  status?: 'waiting' | 'active' | 'completed';
  winner?: string | null;
  moves?: string[];
  position?: string;
  checkedKing?: 'white' | 'black' | null;   //Check if the king is in checked
}