import React, { useState, useEffect } from 'react';
import { useWalletStore } from '../store/useWalletStore';
import { socketService } from '../services/socketService';
import { Chessboard } from '../components/Chessboard';
import { ethers } from 'ethers';
import { useGameStore } from '../store/useGameStore';

// ABI for the ChessGame contract
const chessGameABI = [
  "function createGame(string calldata gameId) external payable",
  "function joinGame(string calldata gameId) external payable",
  "function games(string calldata) external view returns (address white, address black, uint256 stake, bool isActive, address winner, uint256 startTime)"
];

export const OnlineMode: React.FC = () => {
  const { address, signer, provider } = useWalletStore();
  const { gameState, setGameState } = useGameStore();
  const [gameId, setGameId] = useState<string | null>(null);
  const [stake, setStake] = useState<string>('0.01');
  const [error, setError] = useState<string | null>(null);
  const [contractAddress] = useState<string>('0xA12E9052EDbffCA633eBe3Fc9B3F477E516d4D43'); // Replace with actual contract address

  useEffect(() => {
    console.log('Current Game State:', gameState);
  }, [gameState]);

  useEffect(() => {
    // Set up game state listener when component mounts
    socketService.onGameState((state) => {
      console.log('Received Game State:', state);
      setGameState(state);
    });

    // Clean up socket connection on component unmount
    return () => {
      socketService.disconnect();
    };
  }, [setGameState]);

  const verifyGameExists = async (gameId: string) => {
    if (!provider) return false;

    try {
      const contract = new ethers.Contract(contractAddress, chessGameABI, provider);
      const gameDetails = await contract.games(gameId);
      return gameDetails.white !== ethers.ZeroAddress;
    } catch (error) {
      console.error('Error verifying game:', error);
      return false;
    }
  };

  const handleCreateGame = async () => {
    if (!address || !signer || !provider) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      // Convert stake to Wei
      const stakeInWei = ethers.parseEther(stake);

      // Create contract instance
      const contract = new ethers.Contract(contractAddress, chessGameABI, signer);

      // Generate a unique game ID
      const generatedGameId = Math.random().toString(36).substring(7);

      // Create game on blockchain
      const tx = await contract.createGame(generatedGameId, { value: stakeInWei });
      const receipt = await tx.wait();

      // Verify game was created on blockchain
      const gameExists = await verifyGameExists(generatedGameId);
      if (!gameExists) {
        throw new Error('Game creation failed on blockchain');
      }

      // Create game on socket server
      socketService.connect(address, 'Player');
      socketService.createGame(stake);

      setGameId(generatedGameId);
      setError(null);

      // Show game ID to the user
      alert(`Game created! Game ID: ${generatedGameId}`);
    } catch (error) {
      console.error('Error creating game:', error);
      setError(`Failed to create game: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleJoinGame = async () => {
    const inputGameId = prompt('Enter Game ID:');
    if (!inputGameId) return;

    if (!address || !signer || !provider) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      // Verify game exists on blockchain
      const contract = new ethers.Contract(contractAddress, chessGameABI, provider);
      const gameDetails = await contract.games(inputGameId);

      // Check if game is valid and not already full
      if (gameDetails.white === ethers.ZeroAddress || gameDetails.black !== ethers.ZeroAddress) {
        throw new Error('Game does not exist or is already full');
      }

      // Join game on blockchain
      const contractWithSigner = new ethers.Contract(contractAddress, chessGameABI, signer);
      const tx = await contractWithSigner.joinGame(inputGameId, { 
        value: gameDetails.stake 
      });
      await tx.wait();

      // Join game on socket server
      socketService.connect(address, 'Player');
      socketService.joinGame(inputGameId);

      setGameId(inputGameId);
      setError(null);
    } catch (error) {
      console.error('Error joining game:', error);
      setError(`Failed to join game: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleMove = (move: { from: string; to: string }) => {
    if (gameId) {
      socketService.makeMove(gameId, move);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Online Chess Game</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            {error}
          </div>
        )}

        {!gameId ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="mb-4">
              <label htmlFor="stake" className="block text-gray-700 font-bold mb-2">
                Game Stake (ETH)
              </label>
              <input
                id="stake"
                type="number"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.01"
                min="0.01"
              />
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={handleCreateGame} 
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                disabled={!address}
              >
                Create Game
              </button>
              <button 
                onClick={handleJoinGame} 
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                disabled={!address}
              >
                Join Game
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4 bg-white shadow-md rounded-lg p-4">
              <p className="text-gray-700 font-medium">
                Game ID: <span className="text-blue-600">{gameId}</span>
              </p>
            </div>
            {gameId && (
              <div className="bg-white shadow-md rounded-lg p-4">
                <Chessboard 
                  position={gameState?.position || 'start'} 
                  onMove={handleMove}
                  orientation={gameState?.players?.white?.address === address ? 'white' : 'black'}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
