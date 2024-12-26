import React, { useState, useEffect } from 'react';
import { useWalletStore } from '../store/useWalletStore';
import { socketService } from '../services/socketService';
import { Chessboard } from '../components/Chessboard';
import { ethers } from 'ethers';
import { useGameStore } from '../store/useGameStore';
import { AlertCircle, Check, Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  onClick, 
  disabled, 
  variant = 'primary', 
  className = '',
  loading = false 
}) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white disabled:hover:bg-blue-500",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:hover:bg-gray-200",
    outline: "border border-gray-300 hover:bg-gray-100"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled || loading} 
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

const Input = ({ label, ...props }) => (
  <div className="space-y-2">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <input
      {...props}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const Dialog = ({ open, onClose, title, description, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4 space-y-4">
        {title && <h2 className="text-xl font-semibold">{title}</h2>}
        {description && <p className="text-gray-600">{description}</p>}
        {children}
      </div>
    </div>
  );
};

const chessGameABI = [
  "function createGame(string calldata gameId) external payable",
  "function joinGame(string calldata gameId) external payable",
  "function games(string calldata) external view returns (address white, address black, uint256 stake, bool isActive, address winner, uint256 startTime)"
];

export const OnlineMode = () => {
  const { address, signer, provider } = useWalletStore();
  const { gameState, setGameState } = useGameStore();
  const [gameId, setGameId] = useState(null);
  const [stake, setStake] = useState('0.01');
  const [error, setError] = useState(null);
  const [contractAddress] = useState('0xA12E9052EDbffCA633eBe3Fc9B3F477E516d4D43');

  const [isJoinGameDialogOpen, setIsJoinGameDialogOpen] = useState(false);
  const [joinGameId, setJoinGameId] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [isJoiningGame, setIsJoiningGame] = useState(false);
  const [isVerifyingGame, setIsVerifyingGame] = useState(false);

  useEffect(() => {
    if (gameState?.gameId) {
      setGameId(gameState.gameId); // Ensures gameId updates from the state.
    }
  }, [gameState]);

  useEffect(() => {
    socketService.onGameState((state) => {
      setGameState(state);
    });
    return () => {
      socketService.disconnect();
    };
  }, [setGameState]);

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

    setIsCreatingGame(true);
    setError(null);

    try {
      const stakeInWei = ethers.parseEther(stake);
      const contract = new ethers.Contract(contractAddress, chessGameABI, signer);
      const generatedGameId = Math.random().toString(36).substring(7);

      const tx = await contract.createGame(generatedGameId, { value: stakeInWei });
      showToast('Transaction submitted. Waiting for confirmation...');
      await tx.wait();

      const gameExists = await verifyGameExists(generatedGameId);
      if (!gameExists) {
        throw new Error('Game creation failed on blockchain');
      }

      socketService.connect(address, 'Player');
      socketService.createGame(stake);

      setGameId(generatedGameId);
      showToast(`Game created successfully! Game ID: ${generatedGameId}`);
      alert(`Game created successfully! Game ID: ${generatedGameId}`);
    } catch (error) {
      console.error('Error creating game:', error);
      setError(`Failed to create game: ${error.message}`);
    } finally {
      setIsCreatingGame(false);
    }
  };

  const handleJoinGame = async () => {
    if (!address || !signer || !provider) {
      setError('Please connect your wallet first');
      return;
    }

    setIsJoiningGame(true);
    setError(null);

    try {
      const contract = new ethers.Contract(contractAddress, chessGameABI, provider);
      const gameDetails = await contract.games(joinGameId);

      if (gameDetails.white === ethers.ZeroAddress || gameDetails.black !== ethers.ZeroAddress) {
        throw new Error('Game does not exist or is already full');
      }

      const contractWithSigner = new ethers.Contract(contractAddress, chessGameABI, signer);
      const tx = await contractWithSigner.joinGame(joinGameId, { value: gameDetails.stake });
      showToast('Transaction submitted. Waiting for confirmation...');
      await tx.wait();

      socketService.connect(address, 'Player');
      socketService.joinGame(joinGameId);

      setGameId(joinGameId);
      setIsJoinGameDialogOpen(false);
      showToast('Successfully joined the game!');
    } catch (error) {
      console.error('Error joining game:', error);
      setError(`Failed to join game: ${error.message}`);
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-2">Online Chess Game</h1>
            <p className="text-gray-600 text-center mb-6">Play chess and stake ETH</p>

            {error && (
              <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-100 p-4 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            {showSuccessToast && (
              <div className="fixed bottom-4 right-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-100 p-4 text-green-700 shadow-lg">
                <Check className="h-5 w-5" />
                <span>{successMessage}</span>
              </div>
            )}

            {!gameId ? (
              <div className="space-y-6">
                <Input
                  label="Game Stake (ETH)"
                  type="number"
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  step="0.01"
                  min="0.01"
                />
                <div className="flex gap-4">
                  <Button
                    onClick={handleCreateGame}
                    disabled={!address}
                    loading={isCreatingGame}
                    className="flex-1"
                  >
                    {isCreatingGame ? 'Creating Game...' : 'Create Game'}
                  </Button>
                  <Button
                    onClick={() => setIsJoinGameDialogOpen(true)}
                    disabled={!address}
                    variant="secondary"
                    className="flex-1"
                  >
                    Join Game
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium">
                    Game ID: <span className="text-blue-600 font-mono">{gameId}</span>
                  </p>
                </div>
                <div className="aspect-square w-full max-w-2xl mx-auto">
                  <Chessboard 
                    position={gameState?.position || 'start'} 
                    onMove={handleMove}
                    orientation={gameState?.players?.white?.address === address ? 'white' : 'black'}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <Dialog
          open={isJoinGameDialogOpen}
          onClose={() => setIsJoinGameDialogOpen(false)}
          title="Join Game"
          description="Enter the Game ID to join an existing game"
        >
          <div className="space-y-4">
            <Input
              placeholder="Enter Game ID"
              value={joinGameId}
              onChange={(e) => setJoinGameId(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsJoinGameDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleJoinGame}
                loading={isJoiningGame}
              >
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
