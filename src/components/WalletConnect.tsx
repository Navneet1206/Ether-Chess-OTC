import React from 'react';
import { useWalletStore } from '../store/useWalletStore';
import { Wallet } from 'lucide-react';

export const WalletConnect: React.FC = () => {
  const { address, balance, connectWallet, disconnectWallet, isConnecting, error } = useWalletStore();

  return (
    <div className="flex items-center gap-4">
      {address ? (
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-gray-100 rounded-lg">
            <p className="text-sm font-medium">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
            <p className="text-xs text-gray-600">{balance?.slice(0, 8)} ETH</p>
          </div>
          <button
            onClick={disconnectWallet}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Wallet size={20} />
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};