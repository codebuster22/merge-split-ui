import { createContext, useContext, useState, useMemo, useEffect, useRef, type ReactNode } from 'react';
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

  const [mode, setModeInternal] = useState<WalletMode>('safe');
  const hasInitialized = useRef(false);

  // Auto-switch to Safe on initial connection if available, fall back to EOA if not
  useEffect(() => {
    if (!isConnected) {
      // Reset for next connection
      hasInitialized.current = false;
      setModeInternal('safe');
    } else if (!isLoading && !hasInitialized.current) {
      // Initial setup after Safe status is loaded
      hasInitialized.current = true;
      if (isDeployed) {
        setModeInternal('safe');
      } else {
        setModeInternal('eoa');
      }
    } else if (!isDeployed && mode === 'safe') {
      // Fall back to EOA if Safe becomes unavailable
      setModeInternal('eoa');
    }
  }, [isConnected, isDeployed, isLoading, mode]);

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
