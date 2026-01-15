import { useVaultBalances } from '../../hooks/useVaultBalances';
import { formatAmount } from '../../utils/formatters';

export function VaultStatusCard() {
  const { data: vaultBalances, isLoading } = useVaultBalances();

  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <h2 className="text-lg font-semibold text-white mb-4">Vault Status</h2>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-700 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const yesBalance = vaultBalances?.yesBalance ?? 0n;
  const noBalance = vaultBalances?.noBalance ?? 0n;
  const usdcBalance = vaultBalances?.usdcBalance ?? 0n;
  const completeSets = vaultBalances?.completeSets ?? 0n;
  const totalShares = vaultBalances?.totalShares ?? 0n;

  // Calculate orphaned tokens
  const orphanedYes = yesBalance > noBalance ? yesBalance - noBalance : 0n;
  const orphanedNo = noBalance > yesBalance ? noBalance - yesBalance : 0n;

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-white mb-4">Vault Status</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-slate-400">YES Tokens</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatAmount(yesBalance)}</p>
          {orphanedYes > 0n && (
            <p className="text-xs text-yellow-500 mt-1">
              {formatAmount(orphanedYes)} orphaned
            </p>
          )}
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm text-slate-400">NO Tokens</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatAmount(noBalance)}</p>
          {orphanedNo > 0n && (
            <p className="text-xs text-yellow-500 mt-1">
              {formatAmount(orphanedNo)} orphaned
            </p>
          )}
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm text-slate-400">USDC</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatAmount(usdcBalance)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
        <div>
          <span className="text-sm text-slate-400">Complete Sets</span>
          <p className="text-lg font-semibold text-white">{formatAmount(completeSets)}</p>
        </div>
        <div>
          <span className="text-sm text-slate-400">Total Shares</span>
          <p className="text-lg font-semibold text-purple-400">{formatAmount(totalShares)}</p>
        </div>
      </div>
    </div>
  );
}
