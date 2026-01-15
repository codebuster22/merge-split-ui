import { useState, useRef, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { polygon } from 'wagmi/chains';
import { useWalletMode } from '../../contexts/WalletModeContext';

function formatAddress(address: string | undefined): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const {
    mode,
    setMode,
    activeAddress,
    eoaAddress,
    safeAddress,
    isSafeDeployed,
    isSafeLoading,
  } = useWalletMode();

  const isWrongNetwork = isConnected && chain?.id !== polygon.id;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Not connected - show connect button
  if (!isConnected) {
    return (
      <button
        onClick={() => connect({ connector: connectors[0] })}
        disabled={isPending}
        className="btn-primary"
      >
        {isPending ? 'Connecting...' : 'Connect Wallet'}
      </button>
    );
  }

  // Wrong network - show switch button
  if (isWrongNetwork) {
    return (
      <button
        onClick={() => switchChain({ chainId: polygon.id })}
        className="btn-danger"
      >
        Switch to Polygon
      </button>
    );
  }

  // Connected - show dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
      >
        <div className={`w-2 h-2 rounded-full ${mode === 'safe' ? 'bg-purple-500' : 'bg-green-500'}`} />
        <span className="text-sm text-white font-mono">
          {formatAddress(activeAddress)}
        </span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
          {/* Wallet Mode Selector */}
          <div className="p-3 border-b border-slate-700">
            <p className="text-xs text-slate-400 mb-2">Wallet Mode</p>
            <div className="flex gap-1 bg-slate-700/50 rounded-lg p-1">
              <button
                onClick={() => setMode('eoa')}
                className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  mode === 'eoa'
                    ? 'bg-slate-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="block">EOA</span>
                <span className="text-xs font-mono opacity-70">
                  {formatAddress(eoaAddress)}
                </span>
              </button>

              <button
                onClick={() => setMode('safe')}
                disabled={!isSafeDeployed}
                className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  mode === 'safe'
                    ? 'bg-purple-600 text-white'
                    : isSafeDeployed
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 cursor-not-allowed'
                }`}
                title={!isSafeDeployed ? 'Safe not deployed' : 'Polymarket Safe'}
              >
                <span className="block flex items-center justify-center gap-1">
                  Safe
                  {isSafeLoading && (
                    <span className="inline-block w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  )}
                </span>
                <span className="text-xs font-mono opacity-70">
                  {safeAddress ? formatAddress(safeAddress) : '...'}
                </span>
                {!isSafeDeployed && !isSafeLoading && (
                  <span className="text-xs text-red-400 block">(Not deployed)</span>
                )}
              </button>
            </div>
          </div>

          {/* Disconnect button */}
          <div className="p-3">
            <button
              onClick={() => {
                disconnect();
                setIsOpen(false);
              }}
              className="w-full btn-secondary text-sm"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
