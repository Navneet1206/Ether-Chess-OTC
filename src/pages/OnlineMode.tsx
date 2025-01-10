import React, { useState, useEffect } from 'react';
import { useWalletStore } from '../store/useWalletStore';
import { socketService } from '../services/socketService';
import { Chessboard } from '../components/Chessboard';
import { ethers } from 'ethers';
import { useGameStore } from '../store/useGameStore';
import { AlertCircle, Check, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import { Chess } from 'chess.js';
import { Button } from '../components/Button'; // Import extracted components
import { Input } from '../components/Input'; // Import extracted components
import { Dialog } from '../components/Dialog'; // Import extracted components

const MIN_STAKE = 0.0001;
const MAX_STAKE = 0.1;
const STAKE_INCREMENT = 0.0001;

const chessGameABI = [
  "function createGame(string calldata gameId) external payable",
  "function joinGame(string calldata gameId) external payable",
  "function games(string calldata) external view returns (address white, address black, uint256 stake, bool isActive, address winner, uint256 startTime)"
];

export const OnlineMode = () => {
  const { address, signer, provider } = useWalletStore();
  const { gameState, setGameState } = useGameStore();
  const [gameId, setGameId] = useState(null);
  const [stake, setStake] = useState(MIN_STAKE);
  const [error, setError] = useState(null);
  const [contractAddress] = useState('0xA12E9052EDbffCA633eBe3Fc9B3F477E516d4D43');
  const [isJoinGameDialogOpen, setIsJoinGameDialogOpen] = useState(false);
  const [joinGameId, setJoinGameId] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [isJoiningGame, setIsJoiningGame] = useState(false);
  const [isVerifyingGame, setIsVerifyingGame] = useState(false);
  const [game] = useState(new Chess());

  useEffect(() => {
    if (gameState?.gameId) {
      setGameId(gameState.gameId);
    }
  }, [gameState]);

  useEffect(() => {
    socketService.onGameState((state) => {
      setGameState(state);
      game.load(state.position);
    });
    return () => {
      socketService.disconnect();
    };
  }, [setGameState, game]);

  const handleStakeChange = (increment) => {
    setStake(prevStake => {
      const newStake = parseFloat((prevStake + increment).toFixed(4));
      return newStake >= MIN_STAKE && newStake <= MAX_STAKE ? newStake : prevStake;
    });
  };

  const handleStakeInput = (event) => {
    const value = event.target.value;
    if (value === '') {
      setStake(MIN_STAKE);
      return;
    }

    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const roundedValue = parseFloat(numValue.toFixed(4));
      if (roundedValue >= MIN_STAKE && roundedValue <= MAX_STAKE) {
        setStake(roundedValue);
      } else if (roundedValue < MIN_STAKE) {
        setStake(MIN_STAKE);
      } else if (roundedValue > MAX_STAKE) {
        setStake(MAX_STAKE);
      }
    }
  };

  const showToast = (message) => {
    setSuccessMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  const verifyGameExists = async (gameId) => {
    if (!provider) return false;
    setIsVerifyingGame(true);
    try {
      const contract = new ethers.Contract(contractAddress, chessGameABI, provider);
      const gameDetails = await contract.games(gameId);
      return gameDetails.white !== ethers.ZeroAddress;
    } catch (error) {
      console.error('Error verifying game:', error);
      return false;
    } finally {
      setIsVerifyingGame(false);
    }
  };

  const handleCreateGame = async () => {
    if (!address || !signer || !provider) {
      setError('Please connect your wallet first');
      return;
    }

    if (stake < MIN_STAKE || stake > MAX_STAKE) {
      setError(`Stake must be between ${MIN_STAKE} and ${MAX_STAKE} ETH`);
      return;
    }

    setIsCreatingGame(true);
    setError(null);

    try {
      const stakeInWei = ethers.parseEther(stake.toString());
      const contract = new ethers.Contract(contractAddress, chessGameABI, signer);
      const generatedGameId = Math.random().toString(36).substring(7);

      const tx = await contract.createGame(generatedGameId, { value: stakeInWei });
      showToast('Transaction submitted. Waiting for confirmation...');
      await tx.wait();

      const gameExists = await verifyGameExists(generatedGameId);
      if (!gameExists) {
        throw new Error('Game creation failed on blockchain');
      }

      await socketService.connect(address, 'Player');
      await socketService.createGame(stake);

      setGameId(generatedGameId);
      showToast(`Game created successfully! Game ID: ${generatedGameId}`);
    } catch (error) {
      console.error('Error creating game:', error);
      setError(error.reason || error.message || 'Failed to create game');
    } finally {
      setIsCreatingGame(false);
    }
  };

  const handleJoinGame = async () => {
    if (!address || !signer || !provider) {
      setError('Please connect your wallet first');
      return;
    }

    if (!joinGameId.trim()) {
      setError('Please enter a valid Game ID');
      return;
    }

    setIsJoiningGame(true);
    setError(null);

    try {
      const contract = new ethers.Contract(contractAddress, chessGameABI, provider);
      const gameDetails = await contract.games(joinGameId);

      if (gameDetails.white === ethers.ZeroAddress) {
        throw new Error('Game does not exist');
      }

      if (gameDetails.black !== ethers.ZeroAddress) {
        throw new Error('Game is already full');
      }

      const contractWithSigner = new ethers.Contract(contractAddress, chessGameABI, signer);
      const tx = await contractWithSigner.joinGame(joinGameId, { value: gameDetails.stake });
      showToast('Transaction submitted. Waiting for confirmation...');
      await tx.wait();

      await socketService.connect(address, 'Player');
      await socketService.joinGame(joinGameId);

      setGameId(joinGameId);
      setIsJoinGameDialogOpen(false);
      showToast('Successfully joined the game!');
    } catch (error) {
      console.error('Error joining game:', error);
      setError(error.reason || error.message || 'Failed to join game');
    } finally {
      setIsJoiningGame(false);
    }
  };

  const handleMove = (move) => {
    if (gameId) {
      socketService.makeMove(gameId, move);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-indigo-950 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="bg-gradient-to-br from-gray-900/80 to-indigo-900/80 p-10 rounded-xl border border-white/10 shadow-xl max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-white text-center mb-8">Online Chess Game</h1>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-500/10 bg-red-500/10 p-4 text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {showSuccessToast && (
          <div className="fixed bottom-4 right-4 flex items-center gap-2 rounded-lg border border-green-500/10 bg-green-500/10 p-4 text-green-400 shadow-lg">
            <Check className="h-5 w-5" />
            <span>{successMessage}</span>
          </div>
        )}

        {!gameId ? (
          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-3">Select Stake (ETH)</label>
              <div className="flex items-center gap-4">
                <button onClick={() => handleStakeChange(-STAKE_INCREMENT)} className="p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50" disabled={stake <= MIN_STAKE}>
                  <ArrowDown size={18} />
                </button>
                <div className="relative flex-1">
                  <input type="number" value={stake} onChange={handleStakeInput} step={STAKE_INCREMENT} min={MIN_STAKE} max={MAX_STAKE} className="w-full bg-gray-800 text-white text-center py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors" />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">ETH</span>
                </div>
                <button onClick={() => handleStakeChange(STAKE_INCREMENT)} className="p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50" disabled={stake >= MAX_STAKE}>
                  <ArrowUp size={18} />
                </button>
              </div>
              <p className="text-gray-400 text-sm mt-2">Min: {MIN_STAKE} ETH - Max: {MAX_STAKE} ETH</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleCreateGame} disabled={!address || isCreatingGame || stake < MIN_STAKE || stake > MAX_STAKE} loading={isCreatingGame} className="flex-1 py-4 text-lg">
                {isCreatingGame ? 'Creating Game...' : 'Create Game'}
              </Button>
              <Button onClick={() => setIsJoinGameDialogOpen(true)} disabled={!address} variant="secondary" className="flex-1 py-4 text-lg">
                Join Game
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-sm font-medium text-white">
                Game ID: <span className="text-indigo-400 font-mono">{gameId}</span>
              </p>
            </div>
            <div className="aspect-square w-full max-w-2xl mx-auto">
              <Chessboard position={gameState?.position || 'start'} onMove={handleMove} orientation={gameState?.players?.white?.address === address ? 'white' : 'black'} />
            </div>
          </div>
        )}

        <Dialog open={isJoinGameDialogOpen} onClose={() => setIsJoinGameDialogOpen(false)} title="Join Game" description="Enter the Game ID to join an existing game">
          <div className="space-y-4">
            <Input placeholder="Enter Game ID" value={joinGameId} onChange={(e) => setJoinGameId(e.target.value)} />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsJoinGameDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleJoinGame} disabled={!joinGameId.trim() || isJoiningGame} loading={isJoiningGame}>
                {isJoiningGame ? 'Joining...' : 'Join Game'}
              </Button>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default OnlineMode;