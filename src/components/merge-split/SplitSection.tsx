import { useState, useEffect } from 'react';
import { TokenInput } from '../common/TokenInput';
import { TransactionButton } from '../common/TransactionButton';
import { EventTimeline } from '../events/EventTimeline';
import { EventAnimation } from '../events/EventAnimation';
import { useVaultBalances } from '../../hooks/useVaultBalances';
import { useSplit } from '../../hooks/useSplit';
import { parseAmount, formatAmount } from '../../utils/formatters';

export function SplitSection() {
  const { data: vaultBalances, refetch: refetchVaultBalances } = useVaultBalances();
  const { split, isPending, isSuccess, isError, error, parsedEvents, reset } = useSplit();

  const [amount, setAmount] = useState('');

  const usdcBalance = vaultBalances?.usdcBalance ?? 0n;
  const parsedAmount = parseAmount(amount);
  const isValidAmount = parsedAmount > 0n && parsedAmount <= usdcBalance;

  // Handle successful split
  useEffect(() => {
    if (isSuccess) {
      refetchVaultBalances();
    }
  }, [isSuccess, refetchVaultBalances]);

  const handleSplit = () => {
    if (isValidAmount) {
      split(parsedAmount);
    }
  };

  const handleReset = () => {
    setAmount('');
    reset();
  };

  return (
    <div className="space-y-6">
      {/* Split Preview */}
      <div className="bg-slate-700/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Split Preview</h3>

        <EventAnimation
          operation="split"
          amount={parsedAmount}
          isAnimating={isPending || isSuccess}
        />

        <div className="mt-4 text-center">
          <p className="text-sm text-slate-400">
            {parsedAmount > 0n
              ? `${formatAmount(parsedAmount)} USDC will be split into YES + NO tokens`
              : 'Enter an amount to split'}
          </p>
        </div>
      </div>

      {/* Amount Input */}
      <TokenInput
        label="USDC Amount to Split"
        value={amount}
        onChange={setAmount}
        max={usdcBalance}
        placeholder="0.00"
        disabled={isSuccess}
      />

      {/* Output Preview */}
      {parsedAmount > 0n && !isSuccess && (
        <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
          <p className="text-sm text-slate-400 mb-2">You will receive:</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-white">YES Tokens</span>
            </div>
            <span className="text-lg font-semibold text-white">
              {formatAmount(parsedAmount)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-white">NO Tokens</span>
            </div>
            <span className="text-lg font-semibold text-white">
              {formatAmount(parsedAmount)}
            </span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {isError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-sm">
            {error?.message || 'Split transaction failed'}
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
          Split More
        </TransactionButton>
      ) : (
        <TransactionButton
          onClick={handleSplit}
          disabled={!isValidAmount}
          loading={isPending}
          variant="primary"
        >
          {usdcBalance === 0n
            ? 'No USDC Available'
            : isValidAmount
            ? `Split ${formatAmount(parsedAmount)} USDC`
            : 'Enter Amount'}
        </TransactionButton>
      )}

      <p className="text-xs text-slate-500 text-center">
        Split converts USDC into equal amounts of YES and NO tokens (1:1:1 ratio).
        Your shares remain unchanged.
      </p>
    </div>
  );
}
