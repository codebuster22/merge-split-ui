import { useWalletMode } from '../../contexts/WalletModeContext';

function formatAddress(address: string | undefined): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletModeSelector() {
  const {
    mode,
    setMode,
    eoaAddress,
    safeAddress,
    isSafeDeployed,
    isSafeLoading,
  } = useWalletMode();

  return (
    <div className="flex items-center gap-1 bg-slate-700/50 rounded-lg p-1">
      <button
        onClick={() => setMode('eoa')}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
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
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
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
  );
}
