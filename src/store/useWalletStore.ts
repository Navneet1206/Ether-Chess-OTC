import { create } from 'zustand';
import { ethers } from 'ethers';

interface WalletState {
  address: string | null;
  balance: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  balance: null,
  provider: null,
  signer: null,
  isConnecting: false,
  error: null,

  connectWallet: async () => {
    try {
      set({ isConnecting: true, error: null });

      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const balance = ethers.formatEther(await provider.getBalance(address));

      set({ provider, signer, address, balance, isConnecting: false });
    } catch (error) {
      set({ error: (error as Error).message, isConnecting: false });
    }
  },

  disconnectWallet: () => {
    set({
      address: null,
      balance: null,
      provider: null,
      signer: null,
      error: null,
    });
  },
}));