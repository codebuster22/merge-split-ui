import { useUserState } from '../../hooks/useUserState';
import { formatAmount } from '../../utils/formatters';

export function UserPositionCard() {
  const { data: userState, isLoading, isConnected } = useUserState();

  if (!isConnected) {
    return (
      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-4">Your Position</h2>
        <p className="text-slate-400">Connect your wallet to view your position</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <h2 className="text-lg font-semibold text-white mb-4">Your Position</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-slate-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  const shares = userState?.shares ?? 0n;
  const yesDeposits = userState?.yesDeposits ?? 0n;
  const noDeposits = userState?.noDeposits ?? 0n;
  const yesTokenBalance = userState?.yesTokenBalance ?? 0n;
  const noTokenBalance = userState?.noTokenBalance ?? 0n;

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-white mb-4">Your Position</h2>

      <div className="space-y-4">
        {/* Vault Shares */}
        <div className="flex items-center justify-between py-2 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-slate-300">Vault Shares</span>
          </div>
          <span className="text-lg font-semibold text-white">{formatAmount(shares)}</span>
        </div>

        {/* Deposits in Vault */}
        <div className="space-y-2">
          <p className="text-sm text-slate-400">Deposits in Vault</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs text-slate-400">YES</span>
              </div>
              <p className="text-lg font-semibold text-white">{formatAmount(yesDeposits)}</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs text-slate-400">NO</span>
              </div>
              <p className="text-lg font-semibold text-white">{formatAmount(noDeposits)}</p>
            </div>
          </div>
        </div>

        {/* Wallet Balances */}
        <div className="space-y-2 pt-2 border-t border-slate-700">
          <p className="text-sm text-slate-400">Wallet Balances (Available to Deposit)</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs text-slate-400">YES</span>
              </div>
              <p className="text-lg font-semibold text-white">{formatAmount(yesTokenBalance)}</p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs text-slate-400">NO</span>
              </div>
              <p className="text-lg font-semibold text-white">{formatAmount(noTokenBalance)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
