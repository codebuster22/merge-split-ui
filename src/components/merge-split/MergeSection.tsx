import { useEffect } from 'react';
import { TransactionButton } from '../common/TransactionButton';
import { EventTimeline } from '../events/EventTimeline';
import { EventAnimation } from '../events/EventAnimation';
import { useVaultBalances } from '../../hooks/useVaultBalances';
import { useMerge } from '../../hooks/useMerge';
import { formatAmount } from '../../utils/formatters';

export function MergeSection() {
  const { data: vaultBalances, refetch: refetchVaultBalances } = useVaultBalances();
  const { merge, isPending, isSuccess, isError, error, parsedEvents, reset } = useMerge();

  const completeSets = vaultBalances?.completeSets ?? 0n;
  const yesBalance = vaultBalances?.yesBalance ?? 0n;
  const noBalance = vaultBalances?.noBalance ?? 0n;

  // Calculate orphaned tokens
  const orphanedYes = yesBalance > noBalance ? yesBalance - noBalance : 0n;
  const orphanedNo = noBalance > yesBalance ? noBalance - yesBalance : 0n;

  const canMerge = completeSets > 0n;

  // Handle successful merge
  useEffect(() => {
    if (isSuccess) {
      refetchVaultBalances();
    }
  }, [isSuccess, refetchVaultBalances]);

  const handleReset = () => {
    reset();
  };

  return (
    <div className="space-y-6">
      {/* Merge Preview */}
      <div className="bg-slate-700/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Merge Preview</h3>

        <EventAnimation
          operation="merge"
          amount={completeSets}
          isAnimating={isPending || isSuccess}
        />

        <div className="mt-4 text-center">
          <p className="text-sm text-slate-400">
            {canMerge
              ? `${formatAmount(completeSets)} complete sets will be merged`
              : 'No complete sets available to merge'}
          </p>
        </div>
      </div>

      {/* Orphaned Tokens Warning */}
      {(orphanedYes > 0n || orphanedNo > 0n) && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <p className="text-yellow-400 text-sm">
            {orphanedYes > 0n && (
              <span>
                {formatAmount(orphanedYes)} YES tokens cannot be merged without matching NO tokens.
              </span>
            )}
            {orphanedNo > 0n && (
              <span>
                {formatAmount(orphanedNo)} NO tokens cannot be merged without matching YES tokens.
              </span>
            )}
          </p>
        </div>
      )}

      {/* Error Display */}
      {isError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-sm">
            {error?.message || 'Merge transaction failed'}
          </p>
        </div>
      )}

      {/* Event Timeline */}
      {parsedEvents.length > 0 && (
        <EventTimeline events={parsedEvents} isAnimating={isSuccess} />
      )}

      {/* Action Button */}
      {isSuccess ? (
        <TransactionButton onClick={handleReset} variant="secondary">
          Merge More
        </TransactionButton>
      ) : (
        <TransactionButton
          onClick={merge}
          disabled={!canMerge}
          loading={isPending}
          variant="primary"
        >
          {canMerge
            ? `Merge ${formatAmount(completeSets)} Complete Sets`
            : 'No Complete Sets to Merge'}
        </TransactionButton>
      )}

      <p className="text-xs text-slate-500 text-center">
        Merge converts YES + NO token pairs into USDC (1:1:1 ratio).
        Your shares remain unchanged.
      </p>
    </div>
  );
}
