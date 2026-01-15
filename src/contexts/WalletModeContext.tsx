import { createContext, useContext, useState, useMemo, useEffect, type ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { useSafeStatus } from '../hooks/useSafeStatus';
import type { Address } from 'viem';

export type WalletMode = 'eoa' | 'safe';

interface WalletModeContextType {
  mode: WalletMode;
  setMode: (mode: WalletMode) => void;
  activeAddress: Address | undefined;
  eoaAddress: Address | undefined;
  safeAddress: Address | undefined;
  isSafeDeployed: boolean;
  isSafeLoading: boolean;
  canUseSafeMode: boolean;
}

const WalletModeContext = createContext<WalletModeContextType | null>(null);

interface WalletModeProviderProps {
  children: ReactNode;
}

export function WalletModeProvider({ children }: WalletModeProviderProps) {
  const { address: eoaAddress, isConnected } = useAccount();
  const { safeAddress, isDeployed, isLoading } = useSafeStatus();

  const [mode, setModeInternal] = useState<WalletMode>('eoa');

  // Reset to EOA mode when disconnected or Safe becomes unavailable
  useEffect(() => {
    if (!isConnected || (mode === 'safe' && !isDeployed)) {
      setModeInternal('eoa');
    }
  }, [isConnected, isDeployed, mode]);

  const value = useMemo<WalletModeContextType>(() => ({
    mode,
    setMode: (newMode: WalletMode) => {
      // Only allow Safe mode if deployed
      if (newMode === 'safe' && !isDeployed) {
        console.warn('Cannot switch to Safe mode: Safe not deployed');
        return;
      }
      setModeInternal(newMode);
    },
    activeAddress: mode === 'safe' ? safeAddress : eoaAddress,
    eoaAddress,
    safeAddress,
    isSafeDeployed: isDeployed,
    isSafeLoading: isLoading,
    canUseSafeMode: isDeployed,
  }), [mode, eoaAddress, safeAddress, isDeployed, isLoading]);

  return (
    <WalletModeContext.Provider value={value}>
      {children}
    </WalletModeContext.Provider>
  );
}

export function useWalletMode(): WalletModeContextType {
  const context = useContext(WalletModeContext);
  if (!context) {
    throw new Error('useWalletMode must be used within a WalletModeProvider');
  }
  return context;
}
