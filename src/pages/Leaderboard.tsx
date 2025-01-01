import React from 'react';
import { Trophy, Crown, Award, Medal } from 'lucide-react';

interface LeaderboardEntry {
  address: string;
  username: string;
  earnings: number;
  gamesPlayed: number;
  winRate: number;
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    address: '0x1234...5678',
    username: 'GrandMaster1',
    earnings: 3.5,
    gamesPlayed: 145,
    winRate: 0.82,
  },
  {
    address: '0x8765...4321',
    username: 'CryptoKing',
    earnings: 2.8,
    gamesPlayed: 98,
    winRate: 0.75,
  },
  {
    address: '0x9876...1234',
    username: 'ChessWhiz',
    earnings: 2.1,
    gamesPlayed: 112,
    winRate: 0.71,
  },
  {
    address: '0x4567...8901',
    username: 'BlockchainKnight',
    earnings: 1.9,
    gamesPlayed: 87,
    winRate: 0.68,
  },
  {
    address: '0x3456...7890',
    username: 'Web3Bishop',
    earnings: 1.5,
    gamesPlayed: 76,
    winRate: 0.65,
  },
];

export const Leaderboard: React.FC = () => {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="text-yellow-400 h-6 w-6" />;
  case 1:
    return <Medal className="text-gray-400 h-6 w-6" />;
      case 2:
        return <Award className="text-amber-600 h-6 w-6" />;
      default:
        return <div className="h-6 w-6 flex items-center justify-center font-bold text-blue-400">{index + 1}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-indigo-950 px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900/90 to-indigo-900/90 rounded-xl border border-white/10 backdrop-blur-lg overflow-hidden">
          <div className="p-8 border-b border-white/10">
            <div className="flex items-center gap-4">
              <Trophy className="text-yellow-400" size={40} />
              <div>
                <h2 className="text-3xl font-bold text-white font-serif">Masters of the Board</h2>
                <p className="text-blue-200/70 mt-1">Top players by earnings and performance</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-6 py-4 text-left text-xs font-medium text-blue-200/70 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-blue-200/70 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-blue-200/70 uppercase tracking-wider">
                    Earnings (ETH)
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-blue-200/70 uppercase tracking-wider">
                    Games
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-blue-200/70 uppercase tracking-wider">
                    Win Rate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mockLeaderboard.map((entry, index) => (
                  <tr 
                    key={entry.address}
                    className="bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        {getRankIcon(index)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{entry.username}</div>
                      <div className="text-sm text-blue-200/50 font-mono">{entry.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-blue-400 font-medium">
                        {entry.earnings.toFixed(2)} ETH
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-blue-200/70">
                        {entry.gamesPlayed}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {(entry.winRate * 100).toFixed(1)}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
