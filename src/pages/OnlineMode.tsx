import React, { useState } from 'react'; 
import { useWalletStore } from '../store/useWalletStore';
import { ethers } from 'ethers';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const OnlineMode = () => {
  const { signer } = useWalletStore();
  const [gameId, setGameId] = useState(null);
  const [stake, setStake] = useState(0.01);
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [isJoiningGame, setIsJoiningGame] = useState(false);
  const [joinGameId, setJoinGameId] = useState('');
  const [error, setError] = useState(null);

  const handleCreateGame = async () => {
    setIsCreatingGame(true);
    setError(null);
    try {
      const stakeInWei = ethers.parseEther(stake.toString());
      const gameContract = new ethers.Contract(
        '0xA12E9052EDbffCA633eBe3Fc9B3F477E516d4D43',
        ["function createGame(string calldata gameId) external payable"],
        signer
      );
      const generatedGameId = Math.random().toString(36).substring(7);
      const tx = await gameContract.createGame(generatedGameId, { value: stakeInWei });
      await tx.wait();
      setGameId(generatedGameId);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCreatingGame(false);
    }
  };

  const handleStakeChange = (increment) => {
    const newStake = parseFloat((stake + increment).toFixed(2));
    console.log('Current stake:', stake);
    console.log('New stake:', newStake);
    if (newStake >= 0.01 && newStake <= 1.0) {
      setStake(newStake);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-indigo-950 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Chessboard Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-8 h-full">
          {[...Array(64)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square ${
                (Math.floor(i / 8) + i % 8) % 2 === 0 ? 'bg-white' : 'bg-transparent'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900/80 to-indigo-900/80 p-10 rounded-xl border border-white/10 shadow-xl max-w-xl w-full">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Online Mode</h2>

        {gameId ? (
          <div>
            <p className="text-white text-center">Game ID: {gameId}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stake Selection with Buttons */}
            <div>
              <label className="block text-white font-medium mb-3">Select Stake (ETH)</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleStakeChange(-0.01)}
                  className="p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                  <ArrowDown size={18} />
                </button>
                <div className="text-white text-lg">{stake.toFixed(2)} ETH</div>
                <button
                  onClick={() => handleStakeChange(0.01)}
                  className="p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                  <ArrowUp size={18} />
                </button>
              </div>
            </div>

            {/* Create and Join Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleCreateGame}
                disabled={isCreatingGame}
                className="flex-1 bg-indigo-600 text-white py-4 rounded-lg text-lg shadow-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingGame ? 'Creating Game...' : 'Create Game'}
              </button>
              <button
                onClick={() => setIsJoiningGame(true)}
                className="flex-1 bg-gray-700 text-white py-4 rounded-lg text-lg shadow-lg hover:bg-gray-600"
              >
                Join Game
              </button>
            </div>

            {/* Join Game ID Input */}
            {isJoiningGame && (
              <div>
                <label className="block text-white font-medium mt-6">Enter Game ID</label>
                <input
                  type="text"
                  value={joinGameId}
                  onChange={(e) => setJoinGameId(e.target.value)}
                  className="block w-full rounded-lg bg-gray-800 text-white py-3 px-4 mt-2"
                  placeholder="Game ID"
                />
                <button
                  onClick={() => console.log('Joining game:', joinGameId)}
                  className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg text-lg shadow-lg hover:bg-indigo-500"
                >
                  Join Game
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="text-red-400 text-sm text-center mt-4">
                <p>{error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineMode;
